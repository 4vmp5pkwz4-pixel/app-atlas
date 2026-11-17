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
 await expect(page.locator('[data-i18n="physicalLine"]')).toContainText('YOUR macOS LAYOUT · type here');
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
   await expect(page.locator('.key[data-code="KeyY"] .latin')).toHaveText('z');
   await expect(page.locator('.key[data-code="KeyZ"] .latin')).toHaveText('y');
   await expect(page.locator('.key[data-code="Semicolon"] .latin')).toHaveText('ö');
   await expect(page.locator('.key[data-code="Quote"] .latin')).toHaveText('ä');
   await expect(page.locator('.key[data-code="BracketLeft"] .latin')).toHaveText('ü');
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
 await page.locator('#germanMirror').dispatchEvent('keydown',{code:'KeyG',key:'G',shiftKey:true,bubbles:true,cancelable:true});
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
 expect(layers.base.Space).toBe(' ');
 expect(layers.option.Space).toBe('');
 expect(layers.shiftOption.Space).toBe('');
 expect(await page.evaluate(()=>window.BrahmiAtelierTest.charMap('Space',false,true))).toBe('');
 expect(await page.evaluate(()=>window.BrahmiAtelierTest.charMap('Space',true,true))).toBe('');
 expect(await page.evaluate(()=>window.BrahmiAtelierTest.charMap('Space',false,false))).toBe(' ');

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
   ['ru','ф','ф','𑀸'],['en','a','a','𑀸'],['de','a','a','𑀸']
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
 await expect(page.locator('.key[data-code="KeyQ"] .latin')).toHaveText('й');
 await expect(page.locator('.key[data-code="KeyY"] .latin')).toHaveText('н');
 await page.locator('#sourceLayout').selectOption('de');
 await expect(page.locator('.key[data-code="KeyY"] .latin')).toHaveText('z');
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
 await expect(page.locator('#sourceLayout option')).toHaveCount(8);
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

test('permanent full keyboard stays entirely inside 12 viewport geometries',async({page},testInfo)=>{
 await page.locator('#continueButton').click();
 await expect(page.locator('body')).toHaveClass(/training-mode/);
 for(const [width,height] of [
   [320,568],[360,640],[375,667],[390,844],[430,932],
   [667,375],[844,390],[768,1024],[1024,768],[1312,1172],[1440,900],[1920,1080]
 ]){
   await page.setViewportSize({width,height});
   const v=await page.evaluate(()=>{
    const box=x=>x.getBoundingClientRect().toJSON();
    const rows=[...document.querySelectorAll('#keyboard .key-row')].map(box);
    const keys=[...document.querySelectorAll('#keyboard .key')].map(box);
    const scroll=document.querySelector('.keyboard-scroll');
    return {w:innerWidth,h:innerHeight,kb:box(document.getElementById('keyboard')),
      dock:box(document.getElementById('keyboardDock')),
      workspace:box(document.getElementById('trainerWorkspace')),rows,keys,
      scrollWidth:scroll.scrollWidth,clientWidth:scroll.clientWidth};
   });
   const name=width+'x'+height;
   expect(v.rows.length,name+': complete number of keyboard rows').toBe(5);
   expect(v.keys.length,name+': all Mac keys exist').toBeGreaterThanOrEqual(60);
   expect(v.dock.top,name+': dock begins inside viewport').toBeGreaterThanOrEqual(-1);
   expect(v.dock.bottom,name+': dock ends inside viewport').toBeLessThanOrEqual(v.h+1);
   expect(v.kb.top,name+': keyboard starts inside viewport').toBeGreaterThanOrEqual(-1);
   expect(v.kb.bottom,name+': last keyboard row visible').toBeLessThanOrEqual(v.h+1);
   expect(v.kb.left,name+': keyboard left edge visible').toBeGreaterThanOrEqual(-1);
   expect(v.kb.right,name+': keyboard right edge visible').toBeLessThanOrEqual(v.w+1);
   expect(v.workspace.height,name+': remaining lesson area usable').toBeGreaterThan(40);
   expect(v.scrollWidth,name+': no sideways scrolling').toBeLessThanOrEqual(v.clientWidth+2);
   for(const r of [...v.rows,...v.keys]){
      expect(r.left,name+': left clipping').toBeGreaterThanOrEqual(-1);
      expect(r.right,name+': right clipping').toBeLessThanOrEqual(v.w+1);
      expect(r.top,name+': top clipping').toBeGreaterThanOrEqual(-1);
      expect(r.bottom,name+': bottom clipping').toBeLessThanOrEqual(v.h+1);
   }
   if([[320,568],[667,375],[1312,1172],[1440,900]].some(a=>a[0]===width&&a[1]===height))
      await page.screenshot({path:'test-results/brahmi-viewport-'+testInfo.project.name+'-'+name+'.png',fullPage:false});
 }
});
test('scrolling the exercise cannot scroll the permanent keyboard off-screen',async({page})=>{
 await page.setViewportSize({width:375,height:667});
 await page.locator('#continueButton').click();
 const before=await page.locator('#keyboardDock').boundingBox();
 await page.locator('#trainerWorkspace').evaluate(el=>{el.scrollTop=el.scrollHeight});
 const after=await page.locator('#keyboardDock').boundingBox();
 expect(before).toBeTruthy();
 expect(after).toBeTruthy();
 expect(Math.abs(before.y-after.y)).toBeLessThan(1.5);
 expect(after.y+after.height).toBeLessThanOrEqual(668);
 await expect(page.locator('#keyboard .key[data-code="KeyM"]')).toBeVisible();
 await page.locator('#keyboard .key[data-code="KeyM"]').click();
 await expect(page.locator('#germanMirror')).not.toHaveValue('');
});

test('Japanese locale and JIS hardware include all Mac-only keys',async({page})=>{
 await page.locator('#langSelect').selectOption('ja');
 await expect(page.locator('html')).toHaveAttribute('lang','ja');
 await expect(page.locator('[data-i18n="navTrain"]')).toHaveText('タイピング練習');
 await expect(page.locator('[data-i18n="navSettings"]')).toHaveText('設定');
 await expect(page.locator('#lessonGrid .lesson')).toHaveCount(24);
 await page.locator('#continueButton').click();
 await page.locator('#sourceLayout').selectOption('ja');
 await expect(page.locator('#japaneseMode')).toBeVisible();
 const rows=page.locator('#keyboard .key-row');
 await expect(rows).toHaveCount(5);
 for(const code of ['IntlYen','IntlRo','Lang1','Lang2','Fn','Backslash','Escape']){
   await expect(page.locator('.key[data-code="'+code+'"]')).toHaveCount(1);
 }
 await expect(page.locator('.key[data-code="Lang1"] .latin')).toHaveText('かな');
 await expect(page.locator('.key[data-code="Lang2"] .latin')).toHaveText('英数');
 await expect(page.locator('.key[data-code="IntlYen"] .latin')).toHaveText('¥');
 await expect(page.locator('.key[data-code="IntlRo"] .latin')).toHaveText('_');
 await expect(page.locator('#japaneseMode')).toHaveValue('romaji');
 await expect(page.locator('.key[data-code="IntlRo"] .glyph')).toHaveText('—');
 await expect(page.locator('.key[data-code="IntlYen"] .glyph')).toHaveText('—');
 await page.locator('#japaneseMode').selectOption('kana');
 await expect(page.locator('.key[data-code="KeyA"] .latin')).toHaveText('ち');
 await expect(page.locator('.key[data-code="KeyQ"] .latin')).toHaveText('た');
 await expect(page.locator('.key[data-code="KeyY"] .latin')).toHaveText('ん');
 await page.locator('#japaneseMode').selectOption('romaji');
 await expect(page.locator('.key[data-code="KeyA"] .latin')).toHaveText('a');
 await expect(page.locator('#typingInput')).toHaveAttribute('readonly','');
});
test('Japanese OS input composition is preserved while Brahmi counts physical keystrokes',async({page})=>{
 await page.locator('#continueButton').click();
 await page.locator('#sourceLayout').selectOption('ja');
 const input=page.locator('#germanMirror');
 await input.focus();
 await input.dispatchEvent('compositionstart',{data:''});
 await input.dispatchEvent('keydown',{code:'KeyK',key:'Process',isComposing:true,bubbles:true,cancelable:true});
 await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 // A candidate selection must not produce extra Brahmi characters during composition.
 await input.dispatchEvent('keydown',{code:'Space',key:'Process',isComposing:true,bubbles:true,cancelable:true});
 await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 await input.fill('き');
 await input.dispatchEvent('compositionend',{data:'き'});
 await expect(input).toHaveValue('き');
 await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 await input.dispatchEvent('keydown',{code:'KeyQ',key:'q',bubbles:true,cancelable:true});
 await expect(page.locator('#typingInput')).toHaveValue('𑀓𑀅');
 await input.fill('漢字');
 await expect(input).toHaveValue('漢字');
 await expect(page.locator('#typingInput')).toHaveValue('𑀓𑀅');
});
test('JIS keyboard, modifier control and input fields fit narrow portrait and short landscape screens',async({page})=>{
 await page.locator('#continueButton').click();
 await page.locator('#sourceLayout').selectOption('ja');
 for(const [w,h] of [[320,568],[360,640],[390,844],[667,375],[844,390],[1312,1172]]){
   await page.setViewportSize({width:w,height:h});
   const geometry=await page.evaluate(()=>{
     const box=el=>el.getBoundingClientRect();
     const keys=[...document.querySelectorAll('#keyboard .key')].map(box);
     const dock=box(document.getElementById('keyboardDock'));
     const rows=[...document.querySelectorAll('#keyboard .key-row')].map(box);
     return {dock:{top:dock.top,bottom:dock.bottom,right:dock.right},rows:rows.length,
       keys:keys.length,violations:keys.filter(r=>r.left < -1||r.right>innerWidth+1||r.top < -1||r.bottom>innerHeight+1).length};
   });
   const context=w+'x'+h;
   expect(geometry.rows,context+' rows').toBe(5);
   expect(geometry.keys,context+' JIS keys').toBeGreaterThanOrEqual(60);
   expect(geometry.violations,context+' clipped keys').toBe(0);
   expect(geometry.dock.bottom,context+' clipped dock').toBeLessThanOrEqual(h+1);
   expect(geometry.dock.top,context+' dock hidden').toBeGreaterThanOrEqual(-1);
 }
});
test('Brahmi-only interface uses Brahmi characters, modern editorial titles and digit forms',async({page})=>{
 await page.locator('#langSelect').selectOption('br');
 await expect(page.locator('html')).toHaveAttribute('lang','br');
 await expect(page.locator('body')).toHaveClass(/brahmi-interface/);
 await expect(page.locator('#lessonGrid .lesson')).toHaveCount(24);
 const captions=await page.locator('[data-i18n]').allTextContents();
 for(const c of captions.filter(Boolean)){
   expect(/[A-Za-z]/.test(c),'visible translation should not contain Latin alphabet: '+c.slice(0,80)).toBe(false);
 }
 await expect(page.locator('[data-i18n="navHome"]')).toContainText('𑀧');
 const top=await page.locator('#lessonGrid .lesson-title').first().textContent();
 expect(/[\u{11000}-\u{1107F}]/u.test(top)).toBe(true);
 await page.locator('#continueButton').click();
 await expect(page.locator('#lessonName')).toContainText('𑀫');
 const metric=await page.locator('#metricAcc').textContent();
 expect(metric).toMatch(/[\u{11066}-\u{1106F}]/u);
 await page.locator('#backLessons').click();
 await page.locator('.nav [data-page="texts"]').click();
 await expect(page.locator('#edictGlossary')).toContainText('𑀯');
 const label=await page.locator('[data-text="edict12di"]').locator('..').textContent();
 expect(/[\u{11000}-\u{1107F}]/u.test(label)).toBe(true);
});
test('Japanese source layout is independent of Japanese interface selection',async({page})=>{
 await page.locator('#langSelect').selectOption('ja');
 await page.locator('#continueButton').click();
 await page.locator('#sourceLayout').selectOption('de');
 await expect(page.locator('#sourceLayout')).toHaveValue('de');
 await expect(page.locator('[data-i18n="navTrain"]')).toHaveText('タイピング練習');
 await page.locator('#langSelect').selectOption('en');
 await page.locator('#sourceLayout').selectOption('ja');
 await expect(page.locator('#langSelect')).toHaveValue('en');
 await expect(page.locator('.key[data-code="Lang1"]')).toHaveCount(1);
});

test('physical keyboard glows for modifiers, Space, Enter, Tab, Backspace and JIS-only keys',async({page})=>{
 await page.locator('#continueButton').click();
 const field=page.locator('#germanMirror');await field.focus();
 const keys=[['Space',' '],['Enter','Enter'],['Backspace','Backspace'],['Tab','Tab'],['CapsLock','CapsLock'],['ShiftLeft','Shift'],['ShiftRight','Shift'],['AltLeft','Alt'],['AltRight','Alt'],['MetaLeft','Meta'],['MetaRight','Meta'],['ControlLeft','Control'],['ControlRight','Control'],['KeyA','a']];
 for(const [code,key] of keys){
  await field.dispatchEvent('keydown',{code,key,bubbles:true,cancelable:true});
  await expect(page.locator('#keyboard .key[data-code="'+code+'"]'),code+' is held').toHaveClass(/is-held/);
  await field.dispatchEvent('keyup',{code,key,bubbles:true,cancelable:true});
  await expect(page.locator('#keyboard .key[data-code="'+code+'"]'),code+' release glows').toHaveClass(/is-flash/);
 }
 await page.locator('#sourceLayout').selectOption('ja');
 for(const code of ['IntlYen','IntlRo','Lang1','Lang2','Fn','Escape']){
  await field.dispatchEvent('keydown',{code,key:'Unidentified',bubbles:true,cancelable:true});
  await expect(page.locator('#keyboard .key[data-code="'+code+'"]'),code+' JIS held').toHaveClass(/is-held/);
  await field.dispatchEvent('keyup',{code,key:'Unidentified',bubbles:true,cancelable:true});
 }
 await page.locator('#backLessons').click();
 expect(await page.locator('#keyboard .is-held').count()).toBe(0);
});

test('virtual keyboard glows for unmapped JIS, modifiers, Space, Command and editing keys',async({page})=>{
 await page.locator('#continueButton').click();
 await page.locator('#sourceLayout').selectOption('ja');
 for(const code of ['Space','ShiftLeft','AltLeft','Lang1','Lang2','Fn','IntlRo','IntlYen','Backspace','ControlLeft','MetaRight','Enter']){
  await page.locator('#keyboard .key[data-code="'+code+'"]').click();
  await expect(page.locator('#keyboard .key[data-code="'+code+'"]'),code+' press illumination').toHaveClass(/is-flash/);
 }
 await expect(page.locator('#keyboard .key-row')).toHaveCount(5);
});

test('Brahmi conversion renders scholarly IAST: inherent vowels, matras, virama, digits and unassigned signs',async({page})=>{
 await page.locator('#langSelect').selectOption('en');
 await page.locator('.nav [data-page="convert"]').click();
 await expect(page.locator('#page-convert')).toBeVisible();
 await expect(page.locator('#convRoman')).toHaveValue('hida budhe jāte sakyamunī ti');
 await page.locator('#convSource').fill('𑀓𑁆𑀬 𑀓𑀸 𑀓𑀺 𑀓𑀼 𑀅 𑁧𑁨 𑁇');
 await expect(page.locator('#convRoman')).toHaveValue('kya kā ki ku a 12 .');
 await page.locator('#convSource').fill('𑀥𑀫𑁆𑀫');
 await expect(page.locator('#convRoman')).toHaveValue('dhamma');
 await page.locator('#convSource').fill('𑁆 𑀸 ☯');
 const roman=await page.locator('#convRoman').inputValue();
 expect(roman).toContain('⟦𑁆⟧');
 expect(roman).toContain('◌ā');
 expect(roman).toContain('⟦☯⟧');
 await expect(page.locator('#convRows')).toContainText('—');
});

test('same Brahmi text yields correct DE EN RU JP key chords and optional JIS kana labels',async({page})=>{
 await page.locator('#langSelect').selectOption('en');
 await page.locator('.nav [data-page="convert"]').click();
 await page.locator('#convSource').fill('𑀳𑀺𑀤');
 for(const [layout,value] of [['de','H I D'],['en','H I D'],['ru','Р Ш В'],['ja','H I D']]){
  await page.locator('#convLayout').selectOption(layout);
  await expect(page.locator('#convPhysical')).toHaveValue(value);
 }
 await expect(page.locator('#convJisMode')).toBeVisible();
 await page.locator('#convJisMode').selectOption('kana');
 await expect(page.locator('#convPhysical')).toHaveValue('く に し');
 await expect(page.locator('#convRows tr')).toHaveCount(3);
 await expect(page.locator('#convRows')).toContainText('Р');
 await page.locator('#convSource').fill('𑀺 𑀓 ☯');
 expect(await page.locator('#convPhysical').inputValue()).toContain('—');
 await expect(page.locator('#convSummary')).toContainText('without keys');
});

test('workshop uses all five UI localizations and example/clear controls without altering the trainer',async({page})=>{
 await page.locator('#langSelect').selectOption('ja');
 await page.locator('.nav [data-page="convert"]').click();
 await expect(page.locator('[data-i18n="navConvert"]')).toHaveText('変換工房');
 await page.locator('#convClear').click();
 await expect(page.locator('#convRoman')).toHaveValue('');
 await page.locator('#convExample').click();
 await expect(page.locator('#convRoman')).not.toHaveValue('');
 await expect(page.locator('#wisdomSpotlight')).toBeVisible();
 await expect(page.locator('#wisdomSourceLink')).toHaveAttribute('href',/^https:\/\//);
 await page.locator('#langSelect').selectOption('br');
 const captions=await page.locator('#page-convert [data-i18n]').allTextContents();
 for(const c of captions.filter(Boolean))expect(/[A-Za-z]/.test(c),'Brahmi UI Latin leak: '+c).toBe(false);
 await page.locator('#langSelect').selectOption('de');
 await expect(page.locator('[data-i18n="convTitle"]')).toContainText('Brahmi');
 await page.locator('#langSelect').selectOption('ru');
 await expect(page.locator('[data-i18n="navConvert"]')).toHaveText('Преобразование');
 await page.locator('.nav [data-page="train"]').click();
 await expect(page.locator('#keyboard .key-row')).toHaveCount(5);
});

test('converter responds to phone and landscape widths without changing permanent keyboard dock',async({page})=>{
 await page.locator('.nav [data-page="convert"]').click();
 for(const [width,height] of [[320,568],[375,667],[667,375],[768,1024],[1440,900]]){
  await page.setViewportSize({width,height});
  await expect(page.locator('#convSource')).toBeVisible();
  await expect(page.locator('#convRoman')).toBeVisible();
  const b=await page.locator('#page-convert').boundingBox();
  expect(b.x,width+'x'+height+' left').toBeGreaterThanOrEqual(-2);
  expect(b.x+b.width,width+'x'+height+' right').toBeLessThanOrEqual(width+3);
 }
 await page.locator('.nav [data-page="train"]').click();
 const k=await page.locator('#keyboard').boundingBox();
 expect(k.y+k.height).toBeLessThanOrEqual(901);
});

test('Tab releases key highlight even when focus moves to another control',async({page})=>{
 await page.locator('#continueButton').click();
 const source=page.locator('#germanMirror');
 await source.dispatchEvent('keydown',{code:'Tab',key:'Tab',bubbles:true,cancelable:true});
 await expect(page.locator('#keyboard .key[data-code="Tab"]')).toHaveClass(/is-held/);
 await page.locator('#resetInput').focus();
 await page.locator('#resetInput').dispatchEvent('keyup',{code:'Tab',key:'Tab',bubbles:true,cancelable:true});
 await expect(page.locator('#keyboard .key[data-code="Tab"]')).not.toHaveClass(/is-held/);
 await expect(page.locator('#keyboard .key[data-code="Tab"]')).toHaveClass(/is-flash/);
});

test('historical text can be sent directly into converter without retyping',async({page})=>{
 await page.locator('#langSelect').selectOption('ru');
 await page.locator('.nav [data-page="texts"]').click();
 const text=await page.evaluate(()=>window.BrahmiAtelierTest.TEXTS.find(t=>t.id==='lumbini').brahmi);
 await page.locator('[data-convert-text="lumbini"]').click();
 await expect(page.locator('#page-convert')).toBeVisible();
 await expect(page.locator('#convSource')).toHaveValue(text);
 await expect(page.locator('#convRoman')).not.toHaveValue('');
 await page.locator('#convAshoka').click();
 const source=await page.locator('#wisdomSourceLink').getAttribute('href');
 expect(source).toContain('indike.org');
 await expect(page.locator('#wisdomSpotlight')).toBeVisible();
 await expect(page.locator('#wisdomClass')).toContainText('Ашоки');
});

test('copy actions deliver IAST and selected physical key sequence without uploading',async({page})=>{
 await page.locator('#langSelect').selectOption('en');
 await page.locator('.nav [data-page="convert"]').click();
 await page.locator('#convSource').fill('𑀳𑀺𑀤');
 await page.evaluate(()=>{
   Object.defineProperty(navigator,'clipboard',{configurable:true,value:{
      writeText:async s=>{window.__copiedConverterValue=s}
   }});
 });
 await page.locator('#convCopyRoman').click();
 expect(await page.evaluate(()=>window.__copiedConverterValue)).toBe('hida');
 await page.locator('#convLayout').selectOption('ru');
 await page.locator('#convCopyKeys').click();
 expect(await page.evaluate(()=>window.__copiedConverterValue)).toBe('Р Ш В');
 await expect(page.locator('#toast')).toContainText('Copied');
});


test('version badge v0.6.0 beta is visible and agrees with the source metadata on all pages',async({page})=>{
 await page.locator('#langSelect').selectOption('en');
 const version=await page.evaluate(()=>window.BrahmiAtelierTest.APP_VERSION);
 expect(version).toBe('0.9.7-beta');
 const badge=page.locator('#versionBadge');
 await expect(badge).toHaveText('v0.9.7 β');
 for(const [width,height] of [[320,568],[375,667],[390,844],[667,375],[1024,768],[1312,1172],[1920,1080]]){
  await page.setViewportSize({width,height});
  for(const go of ['home','train','convert']){
   if(go==='train')await page.locator('#continueButton').click();
   else if(go==='home')await page.locator('.nav [data-page="home"]').click();
   else await page.locator('#openConvertFromTrain').click();
   await expect(badge).toBeVisible();
   const rect=await badge.boundingBox();
   expect(rect,go+' '+width+'x'+height+' badge rectangle').toBeTruthy();
   expect(rect.x,go+' '+width+'x'+height+' left edge').toBeGreaterThanOrEqual(-1);
   expect(rect.y,go+' '+width+'x'+height+' top edge').toBeGreaterThanOrEqual(-1);
   expect(rect.x+rect.width,go+' '+width+'x'+height+' right edge').toBeLessThanOrEqual(width+1);
   expect(rect.y+rect.height,go+' '+width+'x'+height+' bottom edge').toBeLessThanOrEqual(height+1);
  }
 }
});

test('the curated historical wisdom corpus is 25 unique, source-linked Ashoka and Dhammapada passages',async({page})=>{
 const items=await page.evaluate(()=>window.BrahmiAtelierTest.WISDOM_CORPUS);
 expect(items).toHaveLength(25);
 expect(new Set(items.map(x=>x.id)).size).toBe(25);
 expect(items.filter(x=>x.group==='ashoka')).toHaveLength(12);
 expect(items.filter(x=>x.group==='dhammapada')).toHaveLength(13);
 for(const item of items){
  expect(item.roman.trim().length,item.id).toBeGreaterThan(8);
  expect(item.source_url,item.id).toMatch(/^https:\/\/(indike\.org|suttacentral\.net)\//);
  for(const locale of ['ru','de','en','ja'])expect(item.meaning[locale].trim().length,item.id+' '+locale).toBeGreaterThan(3);
 }
});

test('next passage cycles through all 25 items without repeats, even after filter changes',async({page})=>{
 await page.locator('#langSelect').selectOption('en');
 await page.locator('.nav [data-page="convert"]').click();
 const seen=new Set();
 for(let i=0;i<25;i++){
  await page.locator('#convExample').click();
  const item=await page.locator('#wisdomSpotlight').evaluate(()=>window.BrahmiAtelierTest.WISDOM_LAST_ID||window.BrahmiAtelierTest.WISDOM_CORPUS.find(x=>x.roman===document.querySelector('#wisdomRomanOriginal').textContent)?.id);
  // Read the selected editorial primary source rather than assuming a fixed order.
  const roman=await page.locator('#wisdomRomanOriginal').textContent();
  expect(seen.has(roman),'non-repeating wisdom: iteration '+(i+1)).toBe(false);
  seen.add(roman);
  await expect(page.locator('#wisdomSourceLink')).toHaveAttribute('href',/^https:\/\//);
 }
 expect(seen.size).toBe(25);
 await expect(page.locator('#wisdomCount')).toContainText('25');
 await page.locator('#convExample').click();
 const current=await page.locator('#wisdomRomanOriginal').textContent();
 expect(current).not.toBe('');
});

test('Ashoka and Dhammapada buttons choose the correct primary sources without consecutive repeats',async({page})=>{
 await page.locator('#langSelect').selectOption('en');
 await page.locator('.nav [data-page="convert"]').click();
 const ashoka=new Set();
 for(let i=0;i<12;i++){
  await page.locator('#convAshoka').click();
  const item=await page.locator('#wisdomRomanOriginal').textContent();
  expect(ashoka.has(item),'Ashoka excerpt should be new').toBe(false);
  ashoka.add(item);
  await expect(page.locator('#wisdomSourceLink')).toHaveAttribute('href',/indike\.org/);
  await expect(page.locator('#wisdomCategory')).toHaveValue('ashoka');
 }
 const dhp=new Set();
 for(let i=0;i<13;i++){
  await page.locator('#convDhammapada').click();
  const item=await page.locator('#wisdomRomanOriginal').textContent();
  expect(dhp.has(item),'Dhammapada verse should be new').toBe(false);
  dhp.add(item);
  await expect(page.locator('#wisdomSourceLink')).toHaveAttribute('href',/suttacentral\.net/);
  await expect(page.locator('#wisdomCategory')).toHaveValue('dhammapada');
 }
 await page.locator('#convExample').click();
 const roman=await page.locator('#wisdomRomanOriginal').textContent();
 expect(roman).not.toBe('');
});

test('quote metadata distinguishes original Roman, Brahmi reconstruction and interpretive meaning',async({page})=>{
 await page.locator('#langSelect').selectOption('en');
 await page.locator('.nav [data-page="convert"]').click();
 await page.locator('#convDhammapada').click();
 await expect(page.locator('#wisdomSpotlight')).toBeVisible();
 const source=await page.locator('#wisdomRomanOriginal').textContent();
 const script=await page.locator('#convSource').inputValue();
 expect(/[a-z]/i.test(source)).toBe(true);
 expect(/[\u{11000}-\u{1107f}]/u.test(script)).toBe(true);
 await expect(page.locator('#wisdomMeaning')).not.toBeEmpty();
 await expect(page.locator('#wisdomEditorial')).toContainText('not an ancient');
 await page.locator('#convSource').fill('𑀓');
 await expect(page.locator('#wisdomSpotlight')).toBeHidden();
 await expect(page.locator('#convRoman')).toHaveValue('ka');
});

test('wisdom controls and primary source attribution translate in all five interface locales',async({page})=>{
 await page.locator('.nav [data-page="convert"]').click();
 for(const [language,label] of [['ru','Другое изречение'],['de','Weiterer Gedanke'],['en','Another passage'],['ja','次の言葉']]){
  await page.locator('#langSelect').selectOption(language);
  await expect(page.locator('#convExample')).toContainText(label);
  await page.locator('#convExample').click();
  await expect(page.locator('#wisdomMeaning')).not.toBeEmpty();
  await expect(page.locator('#wisdomSourceLink')).toHaveAttribute('href',/^https:\/\//);
 }
 await page.locator('#langSelect').selectOption('br');
 await expect(page.locator('#convExample')).toContainText('𑀅');
 await page.locator('#convDhammapada').click();
 await expect(page.locator('#wisdomMeaning')).toContainText('𑀅');
});

