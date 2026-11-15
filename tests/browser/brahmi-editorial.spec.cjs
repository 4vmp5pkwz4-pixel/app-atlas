const {test,expect}=require('@playwright/test');

test.beforeEach(async({page})=>{
 await page.goto('/apps/brahmi/index.html',{waitUntil:'domcontentloaded'});
 await expect.poll(()=>page.evaluate(()=>Boolean(window.BrahmiAtelierTest)),{timeout:10000}).toBe(true);
 await page.locator('#langSelect').selectOption('en');
});
test('vowel lesson distinguishes A from Shift+A correctly and preserves actual Mac mapping',async({page})=>{
 await page.locator('[data-lesson="vowel2"]').click();
 await expect(page.locator('#lessonName')).toHaveText('Long vowels and diphthongs');
 await expect(page.locator('#lessonExplanation')).toContainText('Shift+A gives the same 𑀸');
 await expect(page.locator('#lessonSummary')).toContainText('A alone gives ā');
 const map=await page.evaluate(()=>{
  const T=window.BrahmiAtelierTest;
  return [T.charMap('KeyA'),T.charMap('KeyA',true),T.charMap('KeyI'),T.charMap('KeyI',true)];
 });
 expect(map).toEqual(['𑀸','𑀸','𑀺','𑀻']);
 await page.locator('[data-layer="shift"]').click();
 await expect(page.locator('#keyboard .key[data-code="KeyA"] .glyph')).toHaveText('𑀸');
 await expect(page.locator('#keyboard .key[data-code="KeyI"] .glyph')).toHaveText('𑀻');
});
test('editorial note is localized across five languages, without German-only claims',async({page})=>{
 const expected=[
  ['ru','Три строки клавиши','физические позиции'],
  ['de','Drei Angaben pro Taste','physische'],
  ['en','Three distinct labels per key','physical'],
  ['ja','各キーの3段表示','物理'],
  ['hi','हर कुंजी पर तीन अलग संकेत','भौतिक']
 ];
 for(const [lang,note,map] of expected){
  await page.locator('#langSelect').selectOption(lang);
  await expect(page.locator('[data-i18n="keyboardNote"]')).toContainText(note);
  await expect(page.locator('[data-i18n="guideMapCaveat"]')).toContainText(map);
 }
});
test('source-edited inscription descriptions and numerical distinctions remain visible in lessons',async({page})=>{
 await page.locator('[data-lesson="numbers"]').click();
 await expect(page.locator('#lessonSummary')).toContainText('positional digits');
 await page.locator('#resetInput').click();
 await page.locator('#langSelect').selectOption('ru');
 const reviewed=await page.evaluate(()=>({
  transcription:window.BrahmiAtelierTest.T('transcriptionNotice'),
  roman:window.BrahmiAtelierTest.T('convRomanCaveat')
 }));
 expect(reviewed.transcription).toContain('не фотография');
 expect(reviewed.roman).toContain('не устанавливает');
 const lessons=await page.evaluate(()=>{
   const list=window.BrahmiAtelierTest.LESSONS;
   return {shift:list.find(x=>x.id==='shift').ru,peace:list.find(x=>x.id==='peace').ruDesc,
     lumbini:list.find(x=>x.id==='lumbini').ruDesc};
 });
 expect(lessons.shift).toBe('Shift: варианты согласных');
 expect(lessons.peace).toContain('согласие');
 expect(lessons.lumbini).toContain('не факсимиле');
});
test('public metadata, searchable catalog and project SEO match reviewed release',async({page})=>{
 const c=await page.evaluate(async()=>await (await fetch('/catalog.json')).json());
 const p=c.projects.find(x=>x.id==='brahmi');
 expect(p.tags).toContain('v0.8.2 β');
 for(const locale of ['ru','de','en'])expect(p.desc[locale]).toContain('0.8.2');
 expect(p.desc.en).toContain('48 character keys');
 await page.goto('/projects/brahmi/');
 await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',/Brahmi.*IAST/);
 await expect(page.locator('.tags')).toContainText('v0.8.2 β');
 await expect(page.locator('.story[data-story="en"]')).not.toContainText('with QWERTZ lessons');
 await expect(page.locator('a').filter({hasText:'Offline app ZIP / release'})).toHaveAttribute('href',/v0\.8\.2-beta/);
});
