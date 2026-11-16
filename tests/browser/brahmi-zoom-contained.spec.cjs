const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{
 await page.goto('/apps/brahmi/index.html',{waitUntil:'domcontentloaded'});
 await expect.poll(()=>page.evaluate(()=>Boolean(window.BrahmiAtelierTest)),{timeout:12000}).toBe(true);
 await page.locator('#langSelect').selectOption('en');
 await page.locator('.nav [data-page="train"]').first().click();
});
test('magnified five rows remain reachable within the same bounded keyboard viewport in every orientation',async({page},testInfo)=>{
 for(const [width,height] of [[320,568],[375,812],[390,844],[844,390],[667,375],[1280,720],[1440,900]]){
  await page.setViewportSize({width,height});
  await page.locator('#sourceLayout').selectOption(width%2===0?'ja':'dev');
  const zoom=page.locator('#keyboardZoomToggle');
  await zoom.click();
  await expect(zoom).toHaveAttribute('aria-pressed','true');
  const state=await page.evaluate(()=>{
   const region=document.querySelector('#keyboardScroll');
   const css=getComputedStyle(region);
   return {x:css.overflowX,y:css.overflowY,client:region.clientHeight,scroll:region.scrollHeight,
    scrollWidth:region.scrollWidth,clientWidth:region.clientWidth,pageWidth:document.documentElement.scrollWidth,viewport:innerWidth,
    rows:document.querySelectorAll('#keyboard .key-row').length};
  });
  expect(state.x).toBe('auto');
  expect(state.y).toBe('auto');
  expect(state.client).toBeGreaterThan(75);
  expect(state.client).toBeLessThanOrEqual(Math.min(height*0.5,315));
  expect(state.pageWidth).toBeLessThanOrEqual(state.viewport+3);
  expect(state.rows).toBe(5);
  if(width<900)expect(state.scrollWidth).toBeGreaterThan(state.clientWidth);
  const reach=await page.evaluate(()=>{
   const region=document.querySelector('#keyboardScroll');
   region.scrollTop=region.scrollHeight;
   region.scrollLeft=region.scrollWidth;
   const last=document.querySelector('#keyboard .key-row:last-child');
   const r=region.getBoundingClientRect(),k=last.getBoundingClientRect();
   return {regionBottom:r.bottom,lastBottom:k.bottom,lastTop:k.top,regionTop:r.top,top:region.scrollTop};
  });
  expect(reach.lastBottom).toBeLessThanOrEqual(reach.regionBottom+3);
  expect(reach.lastTop).toBeGreaterThanOrEqual(reach.regionTop-3);
  await expect(page.locator('#germanMirror')).toBeVisible();
  await expect(page.locator('#typingInput')).toBeVisible();
  if(width===320||width===844)await page.screenshot({path:testInfo.outputPath('contained-'+width+'x'+height+'.png'),fullPage:false});
  await zoom.click();
  await expect(zoom).toHaveAttribute('aria-pressed','false');
 }
});
test('scrolling the zoomed keyboard never types, changes progress, or replaces original two practice lines',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.locator('#sourceLayout').selectOption('ja');
 const before=await page.locator('#typingInput').inputValue();
 await page.locator('#keyboardZoomToggle').click();
 await page.locator('#keyboardScroll').evaluate(el=>{el.scrollTop=el.scrollHeight;el.scrollLeft=el.scrollWidth});
 await expect(page.locator('#typingInput')).toHaveValue(before);
 await expect(page.locator('#germanMirror')).toHaveValue('');
 await expect(page.locator('#keyboard .key-row')).toHaveCount(5);
 await page.locator('#keyboardZoomToggle').click();
 await page.locator('#germanMirror').focus();
 await page.keyboard.press('k');
 await expect(page.locator('#typingInput')).toHaveValue('𑀓');
});
