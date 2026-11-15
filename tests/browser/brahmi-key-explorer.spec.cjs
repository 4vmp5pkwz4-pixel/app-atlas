const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{
  await page.goto('/apps/brahmi/index.html',{waitUntil:'domcontentloaded'});
  await expect.poll(()=>page.evaluate(()=>Boolean(window.BrahmiAtelierTest)),{timeout:10000}).toBe(true);
  await page.locator('#langSelect').selectOption('en');
  await page.locator('.nav [data-page="train"]').click();
});
test('all ordinary keycaps expose original Mac legend, authentic Brahmi glyph and scholarly IAST',async({page})=>{
  await expect(page.locator('#keyViewMode')).toHaveValue('compare');
  const ka=page.locator('#keyboard .key[data-code="KeyK"]');
  await expect(ka.locator('.latin')).toHaveText('K');
  await expect(ka.locator('.glyph')).toHaveText('𑀓');
  await expect(ka.locator('.iast')).toHaveText('ka');
  await expect(ka).toHaveAttribute('data-mnemonic','yes');
  const matra=page.locator('#keyboard .key[data-code="KeyA"]');
  await expect(matra.locator('.glyph')).toHaveText('𑀸');
  await expect(matra.locator('.iast')).toHaveText('◌ā');
  await ka.hover();
  await expect(page.locator('#keyInspectorText')).toContainText('𑀓');
  await expect(page.locator('#keyInspectorText')).toContainText('ka');
  await page.locator('#sourceLayout').selectOption('ruMac');
  await expect(ka.locator('.latin')).toHaveText('Л');
  await expect(ka.locator('.iast')).toHaveText('ka');
  await expect(ka).toHaveAttribute('data-mnemonic','na');
  await page.locator('#sourceLayout').selectOption('dev');
  await expect(ka.locator('.latin')).toHaveText('क');
  await expect(ka.locator('.glyph')).toHaveText('𑀓');
});
test('real held Shift and Option update both Brahmi and native physical key legends live',async({page})=>{
  await page.locator('#sourceLayout').selectOption('dev');
  await page.locator('#germanMirror').focus();
  await page.keyboard.down('Shift');
  await expect(page.locator('#keyboard .key[data-code="KeyK"] .glyph')).toHaveText('𑀔');
  await expect(page.locator('#keyboard .key[data-code="KeyK"] .latin')).toHaveText('ख');
  await expect(page.locator('#keyboard .key[data-code="KeyK"] .iast')).toHaveText('kha');
  await expect(page.locator('#keyboard .key[data-code="ShiftLeft"]')).toHaveClass(/is-layer-active/);
  await page.keyboard.up('Shift');
  await expect(page.locator('#keyboard .key[data-code="KeyK"] .glyph')).toHaveText('𑀓');
  await page.keyboard.down('Alt');
  await expect(page.locator('#keyboard .key[data-code="KeyA"] .glyph')).toHaveText('𑀹');
  await expect(page.locator('#keyLayerStatus')).toContainText('⌥');
  await page.keyboard.up('Alt');
  await expect(page.locator('#keyboard .key[data-code="KeyA"] .glyph')).toHaveText('𑀸');
});
test('real Control and Command are shortcuts, never fictional Brahmi Unicode layers',async({page})=>{
  await page.locator('#germanMirror').focus();
  await page.locator('#germanMirror').dispatchEvent('keydown',{key:'Meta',code:'MetaLeft',metaKey:true,bubbles:true,cancelable:true});
  const c=page.locator('#keyboard .key[data-code="KeyC"]');
  await expect(c).toHaveClass(/is-shortcut/);
  await expect(c.locator('.shortcut')).toHaveText('⌘C');
  await expect(c.locator('.shortcut-action')).toHaveText('Copy');
  await expect(page.locator('#keyboard .key[data-code="MetaLeft"]')).toHaveClass(/is-layer-active/);
  await page.locator('#germanMirror').dispatchEvent('keyup',{key:'Meta',code:'MetaLeft',metaKey:false,bubbles:true,cancelable:true});
  await expect(c.locator('.glyph')).toHaveText('𑀘');
  await page.locator('#germanMirror').dispatchEvent('keydown',{key:'Control',code:'ControlLeft',ctrlKey:true,bubbles:true,cancelable:true});
  await expect(page.locator('#keyboard .key[data-code="KeyK"] .shortcut')).toHaveText('⌃K');
  await expect(page.locator('#keyboard .key[data-code="KeyK"] .shortcut-action')).toHaveText('Delete to end');
  await page.locator('#germanMirror').dispatchEvent('keyup',{key:'Control',code:'ControlLeft',ctrlKey:false,bubbles:true,cancelable:true});
  await expect(page.locator('#keyboard .key[data-code="KeyK"] .glyph')).toHaveText('𑀓');
});
test('screen Command and Control keys toggle their own non-printing shortcut previews',async({page})=>{
  await page.locator('#keyboard .key[data-code="MetaLeft"]').click();
  await expect(page.locator('#keyboard .key[data-code="KeyC"] .shortcut')).toHaveText('⌘C');
  const old=await page.locator('#typingInput').inputValue();
  await page.locator('#keyboard .key[data-code="KeyC"]').click();
  await expect(page.locator('#typingInput')).toHaveValue(old);
  await page.locator('#keyboard .key[data-code="MetaLeft"]').click();
  await expect(page.locator('#keyboard .key[data-code="KeyC"] .glyph')).toHaveText('𑀘');
  await page.locator('#keyboard .key[data-code="ControlLeft"]').click();
  await expect(page.locator('#keyboard .key[data-code="KeyA"] .shortcut')).toHaveText('⌃A');
  await page.locator('#keyboard .key[data-code="ControlLeft"]').click();
  await page.locator('#keyboard .key[data-code="ShiftLeft"]').click();
  await expect(page.locator('#keyboard .key[data-code="KeyK"] .glyph')).toHaveText('𑀔');
  await page.locator('#keyboard .key[data-code="ShiftLeft"]').click();
});
test('the IAST / Brahmi / triple view is configurable and persists without any OS layout changes',async({page})=>{
  const selector=page.locator('#keyViewMode');
  await selector.selectOption('iast');
  await expect(page.locator('#keyboard')).toHaveAttribute('data-view','iast');
  await expect(page.locator('#keyboard .key[data-code="KeyK"] .iast')).toHaveText('ka');
  await page.reload();
  await page.locator('.nav [data-page="train"]').click();
  await expect(page.locator('#keyViewMode')).toHaveValue('iast');
  await selector.selectOption('brahmi');
  await expect(page.locator('#keyboard')).toHaveAttribute('data-view','brahmi');
  await selector.selectOption('compare');
  await expect(page.locator('#keyboard')).toHaveAttribute('data-view','compare');
});
test('all six interface languages localize controls and keyboard model stays unchanged',async({page})=>{
  for(const [lang,label] of [['ru','Подписи клавиш'],['de','Tastenanzeige'],['en','Key legends'],['ja','キー表示'],['hi','कुंजी पर लेखन']]){
    await page.locator('#langSelect').selectOption(lang);
    await expect(page.locator('[data-i18n="keyViewLabel"]')).toHaveText(label);
    await expect(page.locator('#keyboard .key[data-code="KeyK"] .glyph')).toHaveText('𑀓');
  }
  await page.locator('#langSelect').selectOption('br');
  await expect(page.locator('[data-i18n="keyViewLabel"]')).not.toBeEmpty();
  const state=await page.evaluate(()=>window.BrahmiAtelierTest);
  expect(state).toBeTruthy();
});
test('small screen keeps three labels in the DOM without horizontal app overflow',async({page})=>{
  await page.setViewportSize({width:375,height:812});
  await expect(page.locator('#keyboard .key[data-code="KeyK"] .iast')).toHaveText('ka');
  await expect(page.locator('#keyInspector')).toBeVisible();
  await expect(page.locator('#keyViewMode')).toBeVisible();
  const m=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:window.innerWidth,keys:document.querySelectorAll('#keyboard .key-row').length}));
  expect(m.keys).toBe(5);
  expect(m.width).toBeLessThanOrEqual(m.viewport+2);
});

test('from converter, open selected Mac layout and train the exact pasted Brahmi passage',async({page})=>{
 // The sidebar is intentionally hidden on compact mobile training screens.
 await page.locator('#openConvertFromTrain').click();
 await page.locator('#convLayout').selectOption('ruPh');
 await page.locator('#convSource').fill('𑀳𑀺𑀤');
 await expect(page.locator('#openKeyExplorer')).toHaveText('Explore these keys in the trainer');
 await page.locator('#openKeyExplorer').click();
 await expect(page.locator('#page-train')).toHaveClass(/active/);
 await expect(page.locator('#sourceLayout')).toHaveValue('ruPh');
 await expect(page.locator('#keyViewMode')).toHaveValue('compare');
 await expect(page.locator('#prompt')).toContainText('𑀳');
 await expect(page.locator('#keyboard .key[data-code="KeyK"] .iast')).toHaveText('ka');
});
