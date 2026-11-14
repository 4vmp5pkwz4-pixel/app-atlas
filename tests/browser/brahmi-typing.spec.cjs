const {test,expect}=require('@playwright/test');

test.beforeEach(async({page})=>{
 await page.goto('/apps/brahmi/index.html',{waitUntil:'domcontentloaded'});
});

test('complete English interface and translated lessons',async({page})=>{
 await page.locator('#langSelect').selectOption('en');
 await expect(page.locator('html')).toHaveAttribute('lang','en');
 await expect(page.locator('[data-i18n="navHome"]')).toHaveText('Overview');
 await expect(page.locator('[data-i18n="navSettings"]')).toHaveText('Settings');
 await expect(page.locator('#lessonGrid .lesson')).toHaveCount(21);
 await expect(page.locator('[data-lesson="home1"] .lesson-title')).toHaveText('Home-row consonants');
 await page.locator('#continueButton').click();
 await expect(page.locator('#lessonName')).toHaveText('Home-row consonants');
 await expect(page.locator('[data-i18n="brahmiLine"]')).toHaveText('BRAHMI · typed characters');
 await expect(page.locator('[data-i18n="germanLine"]')).toHaveText('DEUTSCH · physical QWERTZ keys');
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
 }
});

test('simulator mirrors German keys and respects Backspace and modifiers',async({page})=>{
 await page.locator('.nav [data-page="settings"]').click();
 await page.locator('#modeSelect').selectOption('sim');
 await page.locator('#continueButton').click();
 await page.locator('#typingInput').focus();
 await page.keyboard.press('k');
 await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 await expect(page.locator('#germanMirror')).toHaveText('k');
 await page.keyboard.press('Backspace');
 await expect(page.locator('#typingInput')).toHaveValue('');
 await expect(page.locator('#germanMirror')).toHaveText('—');
 await page.keyboard.press('Shift+g');
 await expect(page.locator('#typingInput')).toHaveValue('𑀖');
 await expect(page.locator('#germanMirror')).toHaveText('G');
 await page.locator('#resetInput').click();
 await expect(page.locator('#germanMirror')).toHaveText('—');
 await page.locator('.key[data-code="KeyK"]').click();
 await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 await expect(page.locator('#germanMirror')).toHaveText('k');
});

test('Edict XII d–i is provided in all three languages with source attribution',async({page})=>{
 const content=await page.evaluate(()=>{
 const t=window.BrahmiAtelierTest.TEXTS;
 return {lessons:window.BrahmiAtelierTest.LESSONS.length,
    sections:['d','e','f','g','h','i'].map(v=>t.find(x=>x.id==='edict12-'+v)?.roman),
    full:t.find(x=>x.id==='edict12di')?.roman,
    english:t.find(x=>x.id==='edict12di')?.en};
 });
 expect(content.lessons).toBe(21);
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
