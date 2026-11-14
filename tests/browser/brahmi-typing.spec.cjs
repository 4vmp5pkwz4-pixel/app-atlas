const {test,expect}=require('@playwright/test');

test.beforeEach(async({page})=>{
 const pageErrors=[];
 page.on('pageerror',err=>pageErrors.push(err.message));
 await page.goto('/apps/brahmi/index.html',{waitUntil:'domcontentloaded'});
 await expect.poll(async()=>{
  const ready=await page.evaluate(()=>Boolean(window.BrahmiAtelierTest));
  return ready?'ready':pageErrors.join(' | ')||'not ready';
 },{timeout:6000,message:'Brahmi runtime initialization failed; inspect page error'}).toBe('ready');
});

test('complete English interface and translated lessons',async({page})=>{
 await page.locator('#langSelect').selectOption('en');
 await expect(page.locator('html')).toHaveAttribute('lang','en');
 await expect(page.locator('[data-i18n="navHome"]')).toHaveText('Overview');
 await expect(page.locator('[data-i18n="navSettings"]')).toHaveText('Settings');
 await expect(page.locator('#lessonGrid .lesson')).toHaveCount(24);
 await expect(page.locator('[data-lesson="home1"] .lesson-title')).toHaveText('Home-row consonants');
 await page.locator('#continueButton').click();
 await expect(page.locator('#lessonName')).toHaveText('Home-row consonants');
 await expect(page.locator('[data-i18n="brahmiLine"]')).toHaveText('BRAHMI · converted automatically');
 await expect(page.locator('[data-i18n="physicalLine"]')).toHaveText('YOUR macOS LAYOUT · type here');
 await page.locator('#langSelect').selectOption('de');
 await expect(page.locator('[data-i18n="navHome"]')).toHaveText('Übersicht');
 await page.locator('#langSelect').selectOption('ru');
 await expect(page.locator('[data-i18n="navHome"]')).toHaveText('Обзор');
});

test('full German Mac QWERTZ keyboard is visible, including at phone width',async({page})=>{
 await page.locator('#continueButton').click();
 for (const width of [320,360,390,768,1280]){
   await page.setViewportSize({width,height:740});
   const b=await page.locator('#keyboard').boundingBox();
   expect(b).toBeTruthy();
   expect(b.x).toBeGreaterThanOrEqual(-2);
   expect(b.x+b.width).toBeLessThanOrEqual(width+2);
   const info=await page.locator('.keyboard-scroll').evaluate(el=>({client:el.clientWidth,scroll:el.scrollWidth}));
   expect(info.scroll).toBeLessThanOrEqual(info.client+2);
   await expect(page.locator('.key[data-code="KeyY"] .latin')).toHaveText('Z');
   await expect(page.locator('.key[data-code="KeyZ"] .latin')).toHaveText('Y');
   await expect(page.locator('.key[data-code="Semicolon"] .latin')).toHaveText('Ö');
   await expect(page.locator('.key[data-code="Quote"] .latin')).toHaveText('Ä');
   await expect(page.locator('.key[data-code="BracketLeft"] .latin')).toHaveText('Ü');
   expect(await page.locator('#keyboard .key').count()).toBeGreaterThan(40);
   await expect(page.locator('.key[data-code="IntlBackslash"]')).toHaveCount(1);
   await expect(page.locator('.key[data-code="Backslash"]')).toHaveCount(1);
 }
});

test('simulator mirrors German keys and respects Backspace and modifiers',async({page})=>{
 await page.locator('.nav [data-page="train"]').click();
 await page.locator('#germanMirror').focus();
 await page.keyboard.press('k');
 await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 await expect(page.locator('#germanMirror')).toHaveValue('k');
 await page.keyboard.press('Backspace');
 await expect(page.locator('#typingInput')).toHaveValue('');
 await expect(page.locator('#germanMirror')).toHaveValue('');
 await page.keyboard.press('Shift+g');
 await expect(page.locator('#typingInput')).toHaveValue('𑀖');
 await expect(page.locator('#germanMirror')).toHaveValue('G');
 await page.locator('#resetInput').click();
 await expect(page.locator('#germanMirror')).toHaveValue('');
 await page.locator('.key[data-code="KeyK"]').click();
 await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 await expect(page.locator('#germanMirror')).toHaveValue('k');
});

test('Edict XII d–i is provided in all three languages with source attribution',async({page})=>{
 const content=await page.evaluate(()=>{
 const t=window.BrahmiAtelierTest.TEXTS;
 return {lessons:window.BrahmiAtelierTest.LESSONS.length,
    sections:['d','e','f','g','h','i'].map(v=>t.find(x=>x.id==='edict12-'+v)?.roman),
    full:t.find(x=>x.id==='edict12di')?.roman,
    english:t.find(x=>x.id==='edict12di')?.en};
 });
 expect(content.lessons).toBe(24);
 expect(content.sections.every(Boolean)).toBe(true);
 expect(content.sections[0]).toContain('vaci-gutī');
 expect(content.sections[4]).toContain('upahanāti');
 expect(content.sections[5]).toContain('samavayo eva sādhu');
 expect(content.full.length).toBeGreaterThan(530);
 expect(content.english).toContain('Ashoka');
 await page.locator('[data-page="texts"]').first().click();
 await page.locator('#langSelect').selectOption('en');
 await expect(page.locator('#edictContextTitle')).toHaveText(/Guard speech/);
 await expect(page.locator('#edictGlossary')).toContainText('Concord');
 await expect(page.locator('#edictLink')).toHaveAttribute('href',/indike.org/);
 await expect(page.locator('[data-text="edict12di"]')).toHaveCount(1);
});

test('exact original Mac Brahmi mapping in all four layers',async({page})=>{
 await page.locator('.nav [data-page="train"]').click();
 const layers=await page.evaluate(()=>window.BrahmiAtelierTest.BRAHMI_LAYERS);
 expect(layers.base.KeyQ).toBe('𑀅');
 expect(layers.shift.KeyQ).toBe('𑀆');
 expect(layers.option.KeyA).toBe('𑀹');
 expect(layers.shiftOption.KeyI).toBe('𑀈');
 expect(layers.option.KeyS).toBe('');
 expect(layers.base.Equal).toBe('𑀉');
 for(const [layer,value] of [['base','𑀅'],['shift','𑀆'],['option','𑀅'],['shiftOption','𑀆']]){
   await page.locator('[data-layer="'+layer+'"]').click();
   await expect(page.locator('.key[data-code="KeyQ"] .glyph')).toHaveText(value);
   await expect(page.locator('[data-layer="'+layer+'"]')).toHaveAttribute('aria-pressed','true');
 }
 await page.locator('[data-layer="option"]').click();
 await expect(page.locator('.key[data-code="KeyS"] .glyph')).toHaveText('—');
 await expect(page.locator('.key[data-code="KeyA"] .glyph')).toHaveText('𑀹');
 await page.locator('#layoutMatrix summary').click();
 await expect(page.locator('#mapTable table')).toBeVisible();
 await expect(page.locator('#mapTable tbody tr').first()).toBeVisible();
});
test('RU/EN/DE independent keycaps, preserved OS symbol, same Brahmi physical key',async({page})=>{
 await page.locator('.nav [data-page="train"]').click();
 for(const [source,keyLabel,actualSymbol,brahmi] of [
   ['ru','Ф','ф','𑀸'],['en','A','a','𑀸'],['de','A','a','𑀸']
 ]){
    await page.locator('#sourceLayout').selectOption(source);
    await expect(page.locator('.key[data-code="KeyA"] .latin')).toHaveText(keyLabel);
    await page.locator('#resetInput').click();
    await page.locator('#germanMirror').focus();
    await page.locator('#germanMirror').dispatchEvent('keydown',{code:'KeyA',key:actualSymbol,bubbles:true,cancelable:true});
    await expect(page.locator('#germanMirror')).toHaveValue(actualSymbol);
    await expect(page.locator('#typingInput')).toHaveValue(brahmi);
 }
 await page.locator('#sourceLayout').selectOption('ru');
 await expect(page.locator('.key[data-code="KeyQ"] .latin')).toHaveText('Й');
 await expect(page.locator('.key[data-code="KeyY"] .latin')).toHaveText('Н');
 await page.locator('#sourceLayout').selectOption('de');
 await expect(page.locator('.key[data-code="KeyY"] .latin')).toHaveText('Z');
});
test('macOS Option, Shift and Shift+Option never fall back to wrong Brahmi output',async({page})=>{
 await page.locator('.nav [data-page="train"]').click();
 await page.locator('#germanMirror').focus();
 const press=async(code,key,shiftKey,altKey)=>page.locator('#germanMirror').dispatchEvent('keydown',{code,key,shiftKey,altKey,bubbles:true,cancelable:true});
 await press('KeyA','ä',false,true);
 await expect(page.locator('#typingInput')).toHaveValue('𑀹');
 await expect(page.locator('#germanMirror')).toHaveValue('ä');
 await press('KeyI','Î',true,true);
 await expect(page.locator('#typingInput')).toHaveValue('𑀹𑀈');
 await expect(page.locator('#germanMirror')).toHaveValue('äÎ');
 await press('KeyS','ß',false,true);
 await expect(page.locator('#typingInput')).toHaveValue('𑀹𑀈');
 await expect(page.locator('#germanMirror')).toHaveValue('äÎ');
 await press('Backspace','Backspace',false,false);
 await expect(page.locator('#typingInput')).toHaveValue('𑀹');
 await expect(page.locator('#germanMirror')).toHaveValue('ä');
});
test('default focus is ordinary input, Brahmi is read-only and source can switch without OS layout installation',async({page})=>{
 await page.locator('#continueButton').click();
 await expect(page.locator('#modeSelect')).toHaveValue('sim');
 await expect(page.locator('#typingInput')).toHaveAttribute('readonly','');
 await expect(page.locator('#germanMirror')).not.toHaveAttribute('readonly',/./);
 await expect(page.locator('#germanMirror')).toBeFocused();
 await expect(page.locator('#sourceLayout option')).toHaveCount(3);
});

test('new modifier lessons exist in all three languages and are selectable',async({page})=>{
 const ids=await page.evaluate(()=>window.BrahmiAtelierTest.LESSONS.filter(x=>['option-map','shift-option-map','four-layer-mix'].includes(x.id)).map(x=>({id:x.id,ru:x.ru,en:x.en,de:x.de,prompts:x.prompts})));
 expect(ids).toHaveLength(3);
 for(const lesson of ids){expect(lesson.ru.length).toBeGreaterThan(8);expect(lesson.de.length).toBeGreaterThan(8);expect(lesson.en.length).toBeGreaterThan(8);expect(lesson.prompts.length).toBeGreaterThanOrEqual(2)}
 await page.locator('#langSelect').selectOption('en');
 await page.locator('[data-lesson="option-map"]').click();
 await expect(page.locator('#lessonName')).toHaveText('Option: uncommon signs');
 await expect(page.locator('#prompt')).toContainText('𑀹');
 await page.locator('[data-layer="option"]').click();
 await expect(page.locator('.key[data-code="KeyA"] .glyph')).toHaveText('𑀹');
});
