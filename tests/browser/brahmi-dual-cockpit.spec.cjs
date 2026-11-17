const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{
 await page.goto('/apps/brahmi/index.html',{waitUntil:'domcontentloaded'});
 await expect.poll(()=>page.evaluate(()=>Boolean(window.BrahmiAtelierTest)),{timeout:12000}).toBe(true);
 await page.locator('#langSelect').selectOption('en');
 await page.locator('.nav [data-page="train"]').first().click();
 await page.locator('#sourceLayout').selectOption('de');
});
test('two original live inputs precede expanded Phrase Atlas in DOM and desktop viewport',async({page},testInfo)=>{
 await page.setViewportSize({width:1440,height:900});
 await expect(page.locator('#trainerPhraseLab')).toHaveAttribute('open','');
 const data=await page.evaluate(()=>{
  const exercise=document.querySelector('.trainer-workspace>.exercise');
  const atlas=document.querySelector('#trainerPhraseLab');
  const mac=document.querySelector('#germanMirror'),brahmi=document.querySelector('#typingInput');
  const box=x=>{const r=x.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};
  return {order:!!(exercise.compareDocumentPosition(atlas)&Node.DOCUMENT_POSITION_FOLLOWING),
          exercise:box(exercise),atlas:box(atlas),mac:box(mac),brahmi:box(brahmi),keyboard:box(document.querySelector('#keyboardDock'))};
 });
 expect(data.order).toBe(true);
 expect(data.exercise.right).toBeLessThan(data.atlas.x+3);
 expect(data.exercise.width/data.atlas.width).toBeCloseTo(1.3/.85,1);
 expect(Math.abs(data.exercise.y-data.atlas.y)).toBeLessThan(12);
 expect(data.mac.bottom).toBeLessThan(data.keyboard.y+3);
 expect(data.brahmi.bottom).toBeLessThan(data.keyboard.y+3);
 await expect(page.locator('#germanMirror')).toBeInViewport({ratio:.65});
 await expect(page.locator('#typingInput')).toBeInViewport({ratio:.65});
 await page.screenshot({path:testInfo.outputPath('dual-tracks-desktop-1440.png'),fullPage:false});
});
test('on mobile both large tracks appear before expanded atlas, with small hints in same headers',async({page},testInfo)=>{
 await page.setViewportSize({width:390,height:844});
 const mac=page.locator('#germanMirror'),brahmi=page.locator('#typingInput'),phrase=page.locator('#trainerPhraseLab');
 await expect(mac).toBeVisible();
 await expect(brahmi).toBeVisible();
 const p=await page.evaluate(()=>({
  mac:document.querySelector('#germanMirror').getBoundingClientRect().top,
  brahmi:document.querySelector('#typingInput').getBoundingClientRect().top,
  atlas:document.querySelector('#trainerPhraseLab').getBoundingClientRect().top,
  scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,
  key:document.querySelector('#keyboardDock').getBoundingClientRect().bottom
 }));
 expect(p.mac).toBeLessThan(p.brahmi);
 expect(p.brahmi).toBeLessThan(p.atlas);
 expect(p.scrollWidth).toBeLessThanOrEqual(p.viewport+2);
 await expect(page.locator('#liveMacRail')).toBeVisible();
 await expect(page.locator('#liveRomanRail')).toBeVisible();
 await page.screenshot({path:testInfo.outputPath('dual-tracks-mobile-390.png'),fullPage:false});
});
test('current exercise micro chords derive exactly from the same Brahmi-to-physical source as converter',async({page})=>{
 const d=await page.evaluate(()=>{
  const T=window.BrahmiAtelierTest;
  const source=document.querySelector('#phraseBrahmi').textContent;
  const chips=[...document.querySelectorAll('#liveMacRail .cue-token')].map(x=>x.textContent);
  const expected=[...source].slice(0,12).map(c=>c===' '?'␣':T.brahmiKeyChord(c,'de','romaji'));
  return {source,actual:chips,expected,roman:document.querySelector('#liveRomanRail .cue-roman').textContent,
    trueRoman:T.brahmiToIAST(source).text,cur:document.querySelector('#liveMacRail [aria-current="step"]')?.dataset.position};
 });
 expect(d.actual).toEqual(d.expected);
 expect(d.roman).toBe(d.trueRoman);
 expect(d.cur).toBe('0');
 await expect(page.locator('.input-line-head')).toHaveCount(2);
 await expect(page.locator('.phrase-lines')).toHaveAttribute('data-comparing','false');
});
test('live cue next key follows actual typing progress without overwriting either original input',async({page})=>{
 await page.locator('#germanMirror').focus();
 await page.keyboard.press('k');
 await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 await expect(page.locator('#liveMacRail [aria-current="step"]')).toHaveAttribute('data-position','1');
 await expect(page.locator('#liveMacRail .cue-token.is-past')).toHaveCount(1);
 const original=await page.locator('#typingInput').inputValue();
 await page.locator('#phraseCompare').selectOption('ruPh');
 await expect(page.locator('.phrase-lines')).toHaveAttribute('data-comparing','true');
 await expect(page.locator('#typingInput')).toHaveValue(original);
 await page.locator('#phraseChoice').selectOption({index:1});
 await expect(page.locator('#typingInput')).toHaveValue(original);
 await expect(page.locator('#liveRomanRail .cue-roman')).not.toBeEmpty();
});
test('source layout and blind / roman visibility states propagate to compact cues without fake input',async({page})=>{
 const from=await page.locator('#typingInput').inputValue();
 await page.locator('#phraseLayout').selectOption('ruMac');
 await expect(page.locator('#sourceLayout')).toHaveValue('ruMac');
 await expect(page.locator('#liveMacRail')).toHaveAttribute('aria-label',/клавиши|keys|Key|Mac/i);
 await expect(page.locator('#typingInput')).toHaveValue(from);
 await page.locator('#visibilityToggle').click();
 await expect(page.locator('#liveMacRail')).toBeHidden();
 await expect(page.locator('#liveRomanRail')).toBeHidden();
 await page.locator('#visibilityToggle').click();
 await expect(page.locator('#liveMacRail')).toBeVisible();
 await page.locator('#toggleRoman').click();
 await expect(page.locator('#liveRomanRail')).toBeHidden();
 await expect(page.locator('#liveMacRail')).toBeVisible();
});
test('all six interface variants retain original two fields and same-sourced preview',async({page})=>{
 for(const lang of ['ru','de','en','ja','hi','br']){
  await page.locator('#langSelect').selectOption(lang);
  await expect(page.locator('#germanMirror')).toBeVisible();
  await expect(page.locator('#typingInput')).toBeVisible();
  await expect(page.locator('#liveMacRail .cue-token').first()).not.toBeEmpty();
  await expect(page.locator('#phraseBrahmi')).not.toBeEmpty();
 }
});
