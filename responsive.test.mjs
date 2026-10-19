import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:4173';
test('phone, tablet and landscape content fit; driving controls stay on screen',async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{for(const [width,height] of [[320,568],[390,844],[768,1024],[844,390]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true});
  await page.goto(origin);await page.waitForFunction(()=>window.joynoDiagnostics?.ready);
  const fits=()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
  assert.ok(await fits(),`welcome ${width}`);
  const intro=await page.locator('.intro').boundingBox(),stops=await page.locator('.destination-picker').boundingBox();
  if(width<=700||height<=600)assert.ok(stops.y>=intro.y+intro.height,`flow ${width}`);
  if(width===390)await page.screenshot({path:'ux-responsive-welcome.png',fullPage:true});
  await page.locator('.stop-link[data-stop=contact]').click();await page.locator('#panel-name').fill('Mobile visitor');
  assert.equal(await page.locator('#panel-email').evaluate(e=>getComputedStyle(e).fontSize),'16px');
  assert.ok(await fits());await page.keyboard.press('Escape');
  await page.locator('#explore-button').click();
  for(const selector of ['[data-drive=forward]','[data-drive=brake]','#map-button','.stop-link[data-stop=contact]']){const b=await page.locator(selector).boundingBox();assert.ok(b&&b.x>=0&&b.y>=0&&b.x+b.width<=width+1&&b.y+b.height<=height+1,`${selector} visible at ${width}x${height}`);assert.ok(await page.locator(selector).evaluate(e=>{const b=e.getBoundingClientRect();return e.contains(document.elementFromPoint(b.x+b.width/2,b.y+b.height/2))}),`${selector} unobstructed`)}assert.ok(await page.locator('#experience').evaluate(e=>Math.abs(e.getBoundingClientRect().height-innerHeight)<2));
  if(width===390||height===390)await page.screenshot({path:`ux-responsive-driving-${width}.png`});
  await page.goto(origin+'/#standard');await page.waitForSelector('#portfolio:visible');assert.ok(await fits(),`portfolio ${width}`);await page.close();
 }}finally{await browser.close()}
});
