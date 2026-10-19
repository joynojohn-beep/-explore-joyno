import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:4173';
test('desktop reticle, native input, anchors, progress and storytelling work',async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/#standard');await page.waitForTimeout(900);
 assert.equal(await page.locator('.standard-hero .line-mask').count(),2);
 const cta=page.locator('.standard-hero .primary');await cta.hover();await page.waitForTimeout(100);
 assert.ok(await page.locator('.target-cursor').evaluate(e=>e.classList.contains('locked')&&e.classList.contains('visible')));
 assert.equal(await page.locator('.target-cursor').evaluate(e=>getComputedStyle(e).pointerEvents),'none');
 await page.screenshot({path:'ux-motion-hero.png'});await cta.click();await page.waitForFunction(()=>document.querySelector('#panel').open);
 await page.locator('#panel-name').hover();assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('reticle-active')),false);
 await page.locator('#panel-name').fill('Motion visitor');await page.locator('#panel-email').fill('hello@example.com');await page.keyboard.press('Escape');
 await page.evaluate(()=>location.hash='standard-services');await page.waitForTimeout(650);
 assert.equal(await page.locator('#panel').evaluate(e=>e.open),false);assert.equal(await page.locator('#portfolio').isVisible(),true);
 assert.ok(await page.locator('#standard-services').evaluate(e=>e.getBoundingClientRect().top>=100));
 await page.evaluate(()=>location.hash='standard-process');await page.waitForTimeout(700);
 assert.equal(await page.locator('.process-marker').evaluate(e=>getComputedStyle(e).position),'sticky');await page.screenshot({path:'ux-motion-process.png'});
 await page.locator('.process-track .process-step').last().scrollIntoViewIfNeeded();await page.waitForTimeout(100);
 assert.equal(await page.locator('.process-marker strong').innerText(),'04');
 assert.ok(await page.locator('.scroll-progress').evaluate(e=>getComputedStyle(e).transform!=='matrix(0, 0, 0, 1, 0, 0)'));
 await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('reticle-active')),false);
 await page.goBack();await page.waitForFunction(()=>location.hash==='#standard-services');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
 }finally{await browser.close()}
});
test('mobile and reduced motion keep native cursors and readable content',async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});try{for(const options of [{viewport:{width:390,height:844},isMobile:true,hasTouch:true},{viewport:{width:1440,height:1000},reducedMotion:'reduce'}]){
 const page=await browser.newPage(options);await page.goto(origin+'/#standard');await page.mouse.move(100,180);await page.waitForTimeout(150);
 assert.equal(await page.locator('.target-cursor').evaluate(e=>getComputedStyle(e).display),'none');assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('reticle-active')),false);
 await page.locator('#standard-services').scrollIntoViewIfNeeded();await page.waitForTimeout(650);assert.ok(await page.locator('.service-item').first().isVisible());
 assert.equal(await page.locator('.process-marker').evaluate(e=>getComputedStyle(e).display),'none');
 if(options.reducedMotion)assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:options.reducedMotion?'ux-motion-reduced.png':'ux-motion-mobile.png'});await page.close();
 }}finally{await browser.close()}
});
