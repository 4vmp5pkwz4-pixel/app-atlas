const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{
 await page.goto('/apps/brahmi/index.html',{waitUntil:'domcontentloaded'});
 await expect.poll(()=>page.evaluate(()=>Boolean(window.BrahmiAtelierTest)),{timeout:12000}).toBe(true);
});
test('native Russian macOS, Russian QWERTY, Devanagari InScript, and Devanagari QWERTY keys match source CLDR',async({page})=>{
 await page.locator('[data-page="train"]').first().click();
 for(const [layout,key,label] of [
 ['ruMac','KeyQ','й'],['ruMac','Backslash','ё'],
 ['ruPh','KeyA','а'],['ruPh','KeyH','ч'],['ruPh','KeyY','ы'],
 ['dev','KeyK','क'],['dev','KeyF','ि'],['devq','KeyF','्'],['devq','KeyK','क']
 ]){
  await page.locator('#sourceLayout').selectOption(layout);
  await expect(page.locator('.key[data-code="'+key+'"] .latin')).toHaveText(label);
  await expect(page.locator('#sourceLayout')).toHaveValue(layout);
 }
 await page.locator('#sourceLayout').selectOption('dev');
 await page.locator('[data-layer="shift"]').click();
 await expect(page.locator('.key[data-code="KeyK"] .latin')).toHaveText('ख');
 await expect(page.locator('.key[data-code="KeyK"] .glyph')).toHaveText('𑀔');
 await page.locator('[data-layer="base"]').click();
 await page.locator('#sourceLayout').selectOption('devq');
 await page.locator('[data-layer="shift"]').click();
 await expect(page.locator('.key[data-code="KeyX"] .latin')).toHaveText('क्ष');
});
test('Hindi Devanagari UI covers every source string and 24 lessons, 10 texts and 25 source quotations',async({page})=>{
 await page.locator('#langSelect').selectOption('hi');
 await expect(page.locator('html')).toHaveAttribute('lang','hi');
 await expect(page.locator('[data-i18n="navTrain"]')).toHaveText('टाइपिंग अभ्यास');
 await expect(page.locator('[data-i18n="navSettings"]')).toHaveText('सेटिंग्स');
 await expect(page.locator('#lessonGrid .lesson')).toHaveCount(24);
 await expect(page.locator('[data-lesson="home1"] .lesson-title')).toHaveText('मूल पंक्ति के व्यंजन');
 const coverage=await page.evaluate(()=>{
  const T=window.BrahmiAtelierTest;
  return {ui:Object.keys(T.HINDI_UI.ui).length,lessons:Object.keys(T.HINDI_CONTENT.lessons).length,
    texts:Object.keys(T.HINDI_CONTENT.texts).length,quotes:T.WISDOM_CORPUS.filter(x=>x.meaning.hi).length,
    missing:T.WISDOM_CORPUS.filter(x=>!x.meaning.hi).map(x=>x.id)};
 });
 expect(coverage).toEqual({ui:211,lessons:24,texts:10,quotes:25,missing:[]});
 await page.locator('[data-page="convert"]').first().click();
 await expect(page.locator('[data-i18n="convTitle"]')).toContainText('ब्राह्मी');
});
test('Devanagari source input preserves OS composition while Brahmi derives from physical keys',async({page})=>{
 await page.locator('[data-page="train"]').first().click();
 await page.locator('#sourceLayout').selectOption('dev');
 await page.locator('#germanMirror').focus();
 await page.locator('#germanMirror').dispatchEvent('keydown',{code:'KeyK',key:'क',bubbles:true,cancelable:true});
 await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 await page.locator('#germanMirror').fill('क्ष');
 await expect(page.locator('#germanMirror')).toHaveValue('क्ष');
 await expect(page.locator('#typingInput')).toHaveValue('𑀓');
});
test('converter shows new physical Russian phonetic and both Devanagari layouts',async({page})=>{
 await page.locator('[data-page="convert"]').first().click();
 await page.locator('#convSource').fill('𑀓');
 for(const [layout,expected] of [['ruPh','К'],['ruMac','Л'],['dev','क'],['devq','क']]){
  await page.locator('#convLayout').selectOption(layout);
  await expect(page.locator('#convPhysical')).toHaveValue(expected);
 }
});
test('Hindi atlas inherits chosen script interface and displays Russian phonetic/Devanagari physical legends',async({page})=>{
 await page.locator('#langSelect').selectOption('hi');
 await page.locator('[data-page="convert"]').first().click();
 await page.locator('#atlasLaunch').click();
 await expect(page).toHaveURL(/index\.html#atlas$/);
 await expect(page.locator('#page-atlas')).toHaveClass(/active/);
 const atlas=page.frameLocator('#atelier-frame-atlas');
 await expect(atlas.locator('#lang')).toHaveValue('hi');
 await expect(atlas.locator('#title')).toContainText('ब्राह्मी');
 await atlas.locator('#query').fill('U+11013');
 await atlas.locator('#layout').selectOption('ruPh');
 await expect(atlas.locator('#table')).toContainText('к');
 await atlas.locator('#layout').selectOption('dev');
 await expect(atlas.locator('#table')).toContainText('क');
});
