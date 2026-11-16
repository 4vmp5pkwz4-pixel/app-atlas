const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{
 await page.goto('/apps/brahmi/index.html',{waitUntil:'domcontentloaded'});
 await expect.poll(()=>page.evaluate(()=>Boolean(window.BrahmiAtelierTest)),{timeout:12000}).toBe(true);
 await page.locator('#langSelect').selectOption('en');
 await page.locator('.nav [data-page="train"]').first().click();
});
test('US Mac ANSI shape and complete source-backed US Normal/Shift keys',async({page})=>{
 await page.locator('#sourceLayout').selectOption('en');
 const data=await page.evaluate(()=>{
  const T=window.BrahmiAtelierTest,ref=T.MAC_KEYCAP_EXTENDED.layouts.en;
  return {base:ref.base,shift:ref.shift,rows:T.activeRows(),normal:T.physicalLayerLabel('KeyA',false),upper:T.physicalLayerLabel('KeyA',true)};
 });
 expect(Object.keys(data.base)).toHaveLength(47);
 expect(data.rows.flat()).not.toContain('IntlBackslash');
 expect(data.rows[1]).toContain('Backslash');
 expect(data.rows[2]).not.toContain('Backslash');
 expect(data.normal).toBe('a');expect(data.upper).toBe('A');
 const q=page.locator('#keyboard .key[data-code="Digit3"]');
 await expect(q.locator('.latin')).toHaveText('3');
 await expect(q.locator('.shift-peek')).toHaveText('⇧#');
 for(const [code,value] of Object.entries(data.base)){
  await expect(page.locator('#keyboard .key[data-code="'+code+'"] .latin')).toHaveText(value);
 }
 await page.locator('[data-layer="shift"]').click();
 await expect(q.locator('.latin')).toHaveText('#');
 await expect(page.locator('#keyboard .key[data-code="KeyK"] .glyph')).toHaveText('𑀔');
});
test('JIS Roman Shift never falls back to German symbols, Kana remains legend not IME claim',async({page})=>{
 await page.locator('#sourceLayout').selectOption('ja');
 await page.locator('#japaneseMode').selectOption('romaji');
 const T=await page.evaluate(()=>{
  const api=window.BrahmiAtelierTest;
  return {count:Object.keys(api.MAC_KEYCAP_EXTENDED.layouts.ja.base).length,rows:api.activeRows(),shiftDigit:api.physicalLayerLabel('Digit3',true),shiftQuote:api.physicalLayerLabel('Quote',true),shiftYen:api.physicalLayerLabel('IntlYen',true)};
 });
 expect(T.count).toBe(48);
 expect(T.rows[0]).toContain('IntlYen');
 expect(T.rows.flat()).toContain('Lang1');
 expect(T.rows.flat()).toContain('Lang2');
 expect(T.shiftDigit).toBe('#');
 expect(T.shiftQuote).toBe('*');
 expect(T.shiftYen).toBe('|');
 await page.locator('[data-layer="shift"]').click();
 await expect(page.locator('#keyboard .key[data-code="Digit3"] .latin')).toHaveText('#');
 await expect(page.locator('#keyboard .key[data-code="Quote"] .latin')).toHaveText('*');
 await page.locator('#japaneseMode').selectOption('kana');
 await expect(page.locator('#keyboard .key[data-code="KeyQ"] .latin')).toHaveText('た');
 await expect(page.locator('#keyboard .key[data-code="KeyQ"] .shift-peek')).toHaveCount(0);
 await expect(page.locator('#keyboard .key[data-code="IntlYen"] .latin')).toHaveText('ー');
});
test('all eight layouts preserve sourced Brahmi independent of visual keycap preset',async({page})=>{
 for(const preset of ['de','en','ru','ruMac','ruPh','dev','devq','ja']){
  await page.locator('#sourceLayout').selectOption(preset);
  const key=page.locator('#keyboard .key[data-code="KeyK"]');
  await expect(key.locator('.glyph')).toHaveText('𑀓');
  await expect(key.locator('.iast')).toHaveText('ka');
  const state=await page.evaluate(()=>({
   physical:window.BrahmiAtelierTest.physicalLayerLabel('KeyK',false),
   glyph:window.BrahmiAtelierTest.charMap('KeyK',false,false),
   count:document.querySelectorAll('#keyboard .key-row').length,
   label:document.querySelector('#physicalKeyboardLabel').textContent
  }));
  expect(state.physical).toBeTruthy();
  expect(state.glyph).toBe('𑀓');
  expect(state.count).toBe(5);
  expect(state.label).toBeTruthy();
 }
});
test('mobile, tablet and landscape fit and zoom maintain usable five-row keyboard without page-width overflow',async({page},testInfo)=>{
 for(const [width,height] of [[320,568],[375,812],[390,844],[768,1024],[844,390],[1280,720],[1440,900]]){
  await page.setViewportSize({width,height});
  await page.locator('#sourceLayout').selectOption(width<=390?'ja':'dev');
  const toggle=page.locator('#keyboardZoomToggle');
  await expect(toggle).toBeVisible();
  await expect(page.locator('#keyboard .key-row')).toHaveCount(5);
  const base=await page.evaluate(()=>({
   scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,
   keyboardHeight:document.querySelector('#keyboardDock').getBoundingClientRect().height,
   contentWidth:document.querySelector('#keyboardScroll').clientWidth
  }));
  expect(base.scrollWidth).toBeLessThanOrEqual(base.viewport+3);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed','true');
  const zoom=await page.evaluate(()=>{
   const el=document.querySelector('#keyboardScroll');
   return {scroll:el.scrollWidth,client:el.clientWidth,overflow:getComputedStyle(el).overflowX,
    documentScroll:document.documentElement.scrollWidth,width:innerWidth,
    height:document.querySelector('#keyboardDock').getBoundingClientRect().height};
  });
  expect(zoom.overflow).toBe('auto');
  expect(zoom.documentScroll).toBeLessThanOrEqual(zoom.width+3);
  if(width<900)expect(zoom.scroll).toBeGreaterThan(zoom.client+100);
  expect(Math.abs(zoom.height-base.keyboardHeight)).toBeLessThan(60);
  if(width===390||width===844)await page.screenshot({path:testInfo.outputPath('layout-'+width+'x'+height+'.png'),fullPage:false});
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed','false');
 }
});
test('zoom preference persists while physical input and Brahmi output remain independent',async({page})=>{
 await page.locator('#keyboardZoomToggle').click();
 await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('.nav [data-page="train"]').first().click();
 await expect(page.locator('#keyboardZoomToggle')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#keyboardScroll')).toHaveAttribute('data-zoom','true');
 await expect(page.locator('#germanMirror')).toBeVisible();
 await expect(page.locator('#typingInput')).toBeVisible();
 await page.locator('#germanMirror').focus();
 await page.keyboard.press('k');
 await expect(page.locator('#typingInput')).toHaveValue('𑀓');
});
test('all natural-language home descriptions are multilingual, not lists of supported languages',async({page})=>{
 const expected={ru:'многоязыч',de:'mehrsprachig',en:'multilingual',ja:'多言語',hi:'बहुभाषी'};
 for(const [lang,term] of Object.entries(expected)){
  await page.locator('#langSelect').selectOption(lang);
  const lead=await page.evaluate(()=>window.BrahmiAtelierTest.T('heroLead'));
  expect(lead).toContain(term);
  await expect(page.locator('#keyboardZoomToggle')).not.toBeEmpty();
 }
});
