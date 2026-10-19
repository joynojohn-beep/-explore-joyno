import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
test('music produces audio while parked and reading panels; mute and replay work',async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{for(const mobile of [false,true]){
  const page=await browser.newPage(mobile?{viewport:{width:390,height:844},isMobile:true,hasTouch:true}:{});
  await page.addInitScript(()=>{
   const Original=window.AudioContext;
   window.AudioContext=class extends Original{constructor(...args){super(...args);window.testAudioContext=this;const analyser=this.createAnalyser();analyser.fftSize=2048;const original=this.createGain.bind(this);this.createGain=()=>{const node=original(),connect=node.connect.bind(node);node.connect=(target,...rest)=>{if(target===this.destination){connect(analyser);analyser.connect(target);window.testAnalyser=analyser;return target}return connect(target,...rest)};return node}}};
   window.measureAudio=()=>{const samples=new Float32Array(2048);window.testAnalyser?.getFloatTimeDomainData(samples);return Math.sqrt(samples.reduce((n,v)=>n+v*v,0)/samples.length)};
  });
  await page.goto(process.env.TEST_ORIGIN||'http://127.0.0.1:4173');await page.waitForFunction(()=>window.joynoDiagnostics?.ready);
  assert.equal(await page.locator('#sound-button').getAttribute('aria-pressed'),'false');
  await page.locator('#sound-button').click();await page.waitForFunction(()=>window.measureAudio()>.008);
  assert.equal(await page.locator('#sound-button').getAttribute('aria-pressed'),'true');
  await page.locator('.stop-link[data-stop=work]').click();await page.waitForFunction(()=>document.querySelector('#panel').open);await page.waitForFunction(()=>window.measureAudio()>.008);
  await page.keyboard.press('Escape');await page.locator('#sound-button').click();await page.waitForTimeout(300);assert.ok(await page.evaluate(()=>window.measureAudio()<.001));
  await page.locator('#sound-button').click();await page.waitForFunction(()=>window.measureAudio()>.008);
  await page.evaluate(()=>window.testAudioContext.suspend());await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await page.waitForFunction(()=>window.testAudioContext.state==='running');
  await page.close();
 }}finally{await browser.close()}
});

