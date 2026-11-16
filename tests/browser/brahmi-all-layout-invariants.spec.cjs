const {test,expect}=require('@playwright/test');

test.beforeEach(async({page})=>{
 await page.goto('/apps/brahmi/index.html',{waitUntil:'domcontentloaded'});
 await expect.poll(()=>page.evaluate(()=>Boolean(window.BrahmiAtelierTest)),{timeout:12000}).toBe(true);
 await page.locator('#langSelect').selectOption('en');
 await page.locator('.nav [data-page="train"]').first().click();
});

test('eight Normal/Shift views match their canonical map and retain independent Brahmi & IAST',async({page})=>{
 const all=['de','en','ru','ruMac','ruPh','dev','devq','ja'];
 for(const layout of all){
  await page.locator('#sourceLayout').selectOption(layout);
  const audit=await page.evaluate((l)=>{
   const T=window.BrahmiAtelierTest,base=T.PHYSICAL_BASE_PRESETS[l],shift=T.PHYSICAL_SHIFT_PRESETS[l];
   const rows=T.activeRows().flat();
   const errors=[];
   for(const code of rows){
    const el=document.querySelector('#keyboard .key[data-code="'+code+'"]');
    if(!el){errors.push('no key '+code);continue}
    if(Object.prototype.hasOwnProperty.call(base,code)&&el.querySelector('.latin')?.textContent!==base[code])
      errors.push('Normal '+code+': '+el.querySelector('.latin')?.textContent+' != '+base[code]);
    const glyph=el.querySelector('.glyph')?.textContent;
    if(code==='KeyK'&&glyph!=='𑀓')errors.push('changed Brahmi '+glyph);
   }
   return {count:rows.length,validated:rows.filter(c=>Object.hasOwn(base,c)).length,errors,hasShift:!!shift,brahmi:T.charMap('KeyK',false,false)};
  },layout);
  expect(audit.errors,layout).toEqual([]);
  expect(audit.validated).toBeGreaterThanOrEqual(30);
  expect(audit.hasShift).toBe(true);
  expect(audit.brahmi).toBe('𑀓');
  await page.locator('[data-layer="shift"]').click();
  const shifted=await page.evaluate((l)=>{
   const T=window.BrahmiAtelierTest,source=T.PHYSICAL_SHIFT_PRESETS[l];
   return Object.entries(source).filter(([c])=>document.querySelector('#keyboard .key[data-code="'+c+'"]'))
     .filter(([c,v])=>document.querySelector('#keyboard .key[data-code="'+c+'"] .latin')?.textContent!==v)
     .map(([c,v])=>({code:c,expected:v,actual:document.querySelector('#keyboard .key[data-code="'+c+'"] .latin')?.textContent}));
  },layout);
  expect(shifted,layout).toEqual([]);
  await page.locator('[data-layer="base"]').click();
 }
});

test('native Russian sources stay lower case in Normal, independent of printed hardware uppercase',async({page})=>{
 for(const [layout,cases] of [
  ['ruMac',[['KeyQ','й','Й'],['KeyA','ф','Ф'],['Backslash','ё','Ё']]],
  ['ruPh',[['KeyA','а','А'],['KeyH','ч','Ч'],['KeyY','ы','Ы']]]
 ]){
  await page.locator('#sourceLayout').selectOption(layout);
  for(const [code,normal,upper] of cases){
   const key=page.locator('#keyboard .key[data-code="'+code+'"]');
   await expect(key.locator('.latin')).toHaveText(normal);
   await expect(key.locator('.shift-peek')).toHaveText('⇧'+upper);
  }
  await page.locator('[data-layer="shift"]').click();
  for(const [code,normal,upper] of cases){
   await expect(page.locator('#keyboard .key[data-code="'+code+'"] .latin')).toHaveText(upper);
  }
  await page.locator('[data-layer="base"]').click();
 }
});

test('Indic source signs are not overwritten by ASCII fallback on either Normal or Shift',async({page})=>{
 for(const layout of ['dev','devq']){
  await page.locator('#sourceLayout').selectOption(layout);
  for(const code of ['KeyK','KeyF','KeyX','Digit3']){
   const t=await page.evaluate(({layout,code})=>{
    const T=window.BrahmiAtelierTest;return {
     reference:T.PHYSICAL_BASE_PRESETS[layout][code],
     drawn:document.querySelector('#keyboard .key[data-code="'+code+'"] .latin')?.textContent,
     brahmi:T.charMap(code,false,false)
    };
   },{layout,code});
   if(t.reference!==undefined)expect(t.drawn).toBe(t.reference);
   expect(t.brahmi).toBeTruthy();
  }
 }
 await page.locator('#sourceLayout').selectOption('devq');
 await page.locator('[data-layer="shift"]').click();
 await expect(page.locator('#keyboard .key[data-code="KeyX"] .latin')).toHaveText('क्ष');
});

test('all principal scripts preserve the five rows and usable magnified legends in portrait/landscape',async({page},testInfo)=>{
 for(const [width,height,layout] of [
  [1440,900,'de'],[1280,720,'en'],[768,1024,'ruMac'],
  [390,844,'ruPh'],[375,812,'dev'],[320,568,'devq'],
  [667,375,'ja'],[844,390,'devq']
 ]){
  await page.setViewportSize({width,height});
  await page.locator('#sourceLayout').selectOption(layout);
  await expect(page.locator('#keyboard .key-row')).toHaveCount(5);
  await expect(page.locator('#germanMirror')).toBeVisible();
  await expect(page.locator('#typingInput')).toBeVisible();
  await page.locator('#keyboardZoomToggle').click();
  const m=await page.evaluate(()=>{
   const sc=document.querySelector('#keyboardScroll');
   const first=document.querySelector('#keyboard .key[data-code="KeyK"]');
   const latin=first.querySelector('.latin'),glyph=first.querySelector('.glyph'),iast=first.querySelector('.iast');
   const rect=n=>{const r=n.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height}};
   return {width:document.documentElement.scrollWidth,viewport:innerWidth,scrollX:getComputedStyle(sc).overflowX,
    scrollY:getComputedStyle(sc).overflowY,scrollHeight:sc.scrollHeight,clientHeight:sc.clientHeight,
    key:rect(first),latin:rect(latin),glyph:rect(glyph),iast:rect(iast),
    fontSize:parseFloat(getComputedStyle(latin).fontSize)};
  });
  expect(m.width).toBeLessThanOrEqual(m.viewport+3);
  expect(m.scrollX).toBe('auto');expect(m.scrollY).toBe('auto');
  expect(m.key.height).toBeGreaterThanOrEqual(56);
  expect(m.latin.top).toBeGreaterThanOrEqual(m.key.top-2);
  expect(m.iast.bottom).toBeLessThanOrEqual(m.key.bottom+2);
  expect(m.glyph.top).toBeGreaterThanOrEqual(m.latin.top);
  expect(m.fontSize).toBeGreaterThanOrEqual(11);
  if(width===320||width===667){
   await page.screenshot({path:testInfo.outputPath('eight-layout-'+layout+'-'+width+'x'+height+'.png'),fullPage:false});
  }
  await page.locator('#keyboardScroll').evaluate(el=>{
   el.scrollTop=el.scrollHeight;el.scrollLeft=el.scrollWidth;
  });
  const reach=await page.evaluate(()=>{
   const e=document.querySelector('#keyboardScroll'),last=document.querySelector('#keyboard .key-row:last-child');
   const r=e.getBoundingClientRect(),k=last.getBoundingClientRect();return {last:k.bottom,region:r.bottom,top:k.top,regionTop:r.top};
  });
  expect(reach.last).toBeLessThanOrEqual(reach.region+3);
  expect(reach.top).toBeGreaterThanOrEqual(reach.regionTop-3);
  await page.locator('#keyboardZoomToggle').click();
 }
});

test('general catalog description uses multilingual terminology, but language selectors remain explicit',async({page})=>{
 await page.goto('/');
 const hero=page.locator('.hero-meta');
 await expect(hero).toContainText(/multilingual|многоязыч|mehrsprachig/i);
 await expect(hero).not.toContainText('RU · EN · DE');
 await page.goto('/apps/brahmi/index.html');
 await expect(page.locator('#langSelect option')).toHaveCount(6);
 await expect(page.locator('#sourceLayout option')).toHaveCount(8);
});
