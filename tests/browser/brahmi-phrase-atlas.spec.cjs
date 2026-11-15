const {test,expect}=require('@playwright/test');

test.beforeEach(async({page})=>{
 await page.goto('/apps/brahmi/index.html',{waitUntil:'domcontentloaded'});
 await expect.poll(()=>page.evaluate(()=>Boolean(window.BrahmiAtelierTest)),{timeout:10000}).toBe(true);
 await page.locator('#langSelect').selectOption('en');
 await page.locator('.nav [data-page="train"]').click();
});
test('phrase panel starts expanded and derives the entire current text from the exact converter functions',async({page})=>{
 await expect(page.locator('#trainerPhraseLab')).toHaveAttribute('open','');
 await expect(page.locator('#phraseChoice')).toHaveValue('current');
 await expect(page.locator('#phraseLayout')).toHaveValue('de');
 await expect(page.locator('#phraseCompare')).toHaveValue('off');
 const values=await page.evaluate(()=>{
  const B=window.BrahmiAtelierTest,source=document.querySelector('#phraseBrahmi').textContent;
  const keys=B.brahmiKeySequence(source,'de','romaji');
  const ia=B.brahmiToIAST(source).text;
  const actual=[...document.querySelectorAll('#phraseKeys .phrase-chord')].map(x=>x.textContent).join(' ');
  return {source,keys,ia,actual,preview:document.querySelector('#phraseRoman').textContent,
   prompt:document.querySelector('#prompt').textContent};
 });
 expect(values.source).toBe(values.prompt);
 expect(values.preview).toBe(values.ia);
 expect(values.actual).toBe(values.keys);
 await expect(page.locator('#phraseCompareRow')).toBeHidden();
 expect(await page.locator('#keyboard .key').count()).toBeGreaterThan(55);
});
test('all Mac views use one converter source and main choice synchronizes with keyboard without losing typed input',async({page})=>{
 await page.locator('#germanMirror').focus();
 await page.keyboard.press('k');
 await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 const options=await page.locator('#sourceLayout option').evaluateAll(os=>os.map(x=>x.value));
 expect(options).toEqual(['de','en','ru','ruMac','ruPh','dev','devq','ja']);
 for(const layout of options){
  await page.locator('#phraseLayout').selectOption(layout);
  await expect(page.locator('#sourceLayout')).toHaveValue(layout);
  await expect(page.locator('#phraseLayout')).toHaveValue(layout);
  const info=await page.evaluate(()=>{
   const B=window.BrahmiAtelierTest,source=document.querySelector('#phraseBrahmi').textContent;
   const jis=document.querySelector('#japaneseMode').value;
   return {expected:B.brahmiKeySequence(source,document.querySelector('#phraseLayout').value,jis),
    rendered:[...document.querySelectorAll('#phraseKeys .phrase-chord')].map(x=>x.textContent).join(' ')};
  });
  expect(info.rendered).toBe(info.expected);
  await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 }
 await page.locator('#sourceLayout').selectOption('de');
 await expect(page.locator('#phraseLayout')).toHaveValue('de');
});
test('comparison shows the complete second layout without altering physical keyboard or lesson progress',async({page})=>{
 await page.locator('#phraseCompare').selectOption('ruPh');
 await expect(page.locator('#phraseCompareRow')).toBeVisible();
 await expect(page.locator('#phraseCompare')).toHaveValue('ruPh');
 const d=await page.evaluate(()=>{
  const B=window.BrahmiAtelierTest,source=document.querySelector('#phraseBrahmi').textContent;
  return {expected:B.brahmiKeySequence(source,'ruPh'),
   actual:[...document.querySelectorAll('#phraseKeysCompare .phrase-chord')].map(x=>x.textContent).join(' ')};
 });
 expect(d.actual).toBe(d.expected);
 await expect(page.locator('#sourceLayout')).toHaveValue('de');
 await page.reload();
 await page.locator('.nav [data-page="train"]').click();
 await expect(page.locator('#phraseCompare')).toHaveValue('ruPh');
 await expect(page.locator('#phraseCompareRow')).toBeVisible();
 await page.locator('#phraseCompare').selectOption('off');
 await expect(page.locator('#phraseCompareRow')).toBeHidden();
});
test('source-referenced texts and quotes preview without resetting the lesson; practice action explicitly changes target',async({page})=>{
 const intro=await page.locator('#prompt').textContent();
 const chosen=await page.evaluate(()=>{
  const B=window.BrahmiAtelierTest;
  const xs=B.TEXTS.map(x=>({id:x.id,text:x.brahmi})).filter(x=>B.phraseUnmapped(x.text).length===0);
  const ws=B.WISDOM_CORPUS.map(x=>({id:x.id,text:B.iastToBrahmi(x.roman)})).filter(x=>B.phraseUnmapped(x.text).length===0);
  return {historical:xs[0]||null,wisdom:ws[0]||null,sourceCount:B.TEXTS.length,quoteCount:B.WISDOM_CORPUS.length};
 });
 expect(chosen.sourceCount).toBeGreaterThanOrEqual(10);
 expect(chosen.quoteCount).toBeGreaterThanOrEqual(25);
 await expect(page.locator('#phraseChoice option')).toHaveCount(1+chosen.sourceCount+chosen.quoteCount);
 expect(chosen.historical).not.toBeNull();
 await page.locator('#phraseChoice').selectOption('text:'+chosen.historical.id);
 await expect(page.locator('#phraseBrahmi')).toHaveText(chosen.historical.text);
 await expect(page.locator('#prompt')).toHaveText(intro);
 await expect(page.locator('#phraseSourceLink')).toBeVisible();
 await page.locator('#phrasePractice').click();
 await expect(page.locator('#prompt')).toHaveText(chosen.historical.text);
 await expect(page.locator('#phraseChoice')).toHaveValue('current');
 if(chosen.wisdom){
  await page.locator('#phraseChoice').selectOption('wisdom:'+chosen.wisdom.id);
  await expect(page.locator('#phraseBrahmi')).toHaveText(chosen.wisdom.text);
  await expect(page.locator('#prompt')).toHaveText(chosen.historical.text);
 }
});
test('unmapped characters are displayed as unknown and cannot be started as an impossible exercise',async({page})=>{
 const unsupported=await page.evaluate(()=>{
  const B=window.BrahmiAtelierTest;
  const wisdom=B.WISDOM_CORPUS.find(x=>B.phraseUnmapped(B.iastToBrahmi(x.roman)).length>0);
  const historical=B.TEXTS.find(x=>B.phraseUnmapped(x.brahmi).length>0);
  return wisdom?{id:'wisdom:'+wisdom.id}:historical?{id:'text:'+historical.id}:null;
 });
 if(!unsupported){test.skip(true,'All historical signs are source-mapped in this revision');return}
 await page.locator('#phraseChoice').selectOption(unsupported.id);
 await expect(page.locator('#phrasePractice')).toBeDisabled();
 await expect(page.locator('#phraseStatus')).toContainText('no mapped key');
 await expect(page.locator('#phraseKeys .phrase-chord.unmapped').first()).toBeVisible();
});
test('one-click phrase transfer to converter preserves full source text and current Mac layout',async({page})=>{
 await page.locator('#phraseLayout').selectOption('ruPh');
 await page.locator('#phraseChoice').selectOption('text:lumbini');
 const source=await page.locator('#phraseBrahmi').textContent();
 await page.locator('#phraseToConvert').click();
 await expect(page.locator('#page-convert')).toHaveClass(/active/);
 await expect(page.locator('#convSource')).toHaveValue(source);
 await expect(page.locator('#convLayout')).toHaveValue('ruPh');
 await expect(page.locator('#convRoman')).toHaveValue(await page.evaluate((txt)=>window.BrahmiAtelierTest.brahmiToIAST(txt).text,source));
});
test('typing progress highlights next physical chord in both parallel layouts without re-rendering text',async({page})=>{
 await page.locator('#phraseCompare').selectOption('en');
 const source=await page.locator('#phraseBrahmi').textContent();
 const first=await page.locator('#phraseKeys .phrase-chord').first().getAttribute('data-position');
 expect(first).toBe('0');
 await page.locator('#germanMirror').focus();
 // Default opening lesson starts with 𑀓 on KeyK.
 await page.keyboard.press('k');
 await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 const prefix=await page.evaluate(()=>Array.from(document.querySelector('#typingInput').value).length);
 await expect(page.locator('#phraseKeys .phrase-next')).toHaveAttribute('data-position',String(prefix));
 await expect(page.locator('#phraseKeysCompare .phrase-next')).toHaveAttribute('data-position',String(prefix));
 await expect(page.locator('#phraseBrahmi')).toHaveText(source);
});
test('panel is accessible and never reduces fixed five-row keyboard height on desktop or mobile',async({page},testInfo)=>{
 for(const [width,height] of [[1440,900],[1100,750],[390,844],[320,568]]){
  await page.setViewportSize({width,height});
  const before=await page.locator('#keyboard').boundingBox();
  await page.locator('#trainerPhraseLab summary').click();
  await expect(page.locator('#trainerPhraseLab')).not.toHaveAttribute('open','');
  const after=await page.locator('#keyboard').boundingBox();
  expect(before&&after).toBeTruthy();
  expect(Math.abs(before.height-after.height)).toBeLessThan(2);
  await page.locator('#trainerPhraseLab summary').click();
  await expect(page.locator('#trainerPhraseLab')).toHaveAttribute('open','');
  const bounds=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth,
   fixed:document.querySelectorAll('#keyboard .key-row').length,
   sourceScrollable:document.querySelector('#phraseBrahmi').scrollHeight>=document.querySelector('#phraseBrahmi').clientHeight}));
  expect(bounds.scroll).toBeLessThanOrEqual(bounds.viewport+2);
  expect(bounds.fixed).toBe(5);
  expect(bounds.sourceScrollable).toBe(true);
  if(width===1440||width===390)await page.screenshot({path:testInfo.outputPath('phrase-atlas-'+width+'.png'),fullPage:false});
 }
});
test('phrase controls and labels update in all six interface variants',async({page})=>{
 const expected={ru:'Фраза',de:'Satz',en:'Phrase',ja:'全文',hi:'पूरा वाक्य',br:'𑀩𑁆𑀭𑀸𑀳𑁆𑀫𑀻'};
 for(const [lang,word] of Object.entries(expected)){
  await page.locator('#langSelect').selectOption(lang);
  await expect(page.locator('[data-i18n="phraseTitle"]')).toContainText(word);
  const menu=await page.locator('#phraseChoice option').count();
  expect(menu).toBeGreaterThan(30);
 }
});
