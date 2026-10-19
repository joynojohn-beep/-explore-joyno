import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,channel:'chrome'});const page=await browser.newPage({viewport:{width:1200,height:630}});await page.goto('http://127.0.0.1:4173/preview.svg');await page.screenshot({path:'public/preview.png'});await browser.close();
