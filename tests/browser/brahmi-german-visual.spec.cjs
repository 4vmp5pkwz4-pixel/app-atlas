const {test,expect}=require('@playwright/test');

test.beforeEach(async({page})=>{
 await page.goto('/apps/brahmi/index.html',{waitUntil:'domcontentloaded'});
 await expect.poll(()=>page.evaluate(()=>Boolean(window.BrahmiAtelierTest)),{timeout:10000}).toBe(true);
 await page.locator('#langSelect').selectOption('de');
 await page.locator('.nav [data-page="train"]').first().click();
 await page.locator('#sourceLayout').selectOption('de');
});
test('all German ISO Mac Normal/Shift legends invariant with the 48-key CLDR map',async({page})=>{
 const pair=await page.evaluate(()=>window.BrahmiAtelierTest.MAC_GERMAN_ISO);
 expect(Object.keys(pair.layers.base).length).toBe(48);
 for(const [code,base] of Object.entries(pair.layers.base)){
  const key=page.locator('#keyboard .key[data-code="'+code+'"]');
  await expect(key.locator('.physical-cap .latin')).toHaveText(base);
  const alternate=pair.layers.shift[code];
  if(alternate!==base)await expect(key.locator('.shift-peek')).toHaveText('⇧'+alternate);
  const accessible=await key.getAttribute('aria-label');
  expect(accessible).toContain(base);
  expect(accessible).toContain('Shift: '+alternate);
 }
 expect(pair.layers.base.KeyA).toBe('a');
 expect(pair.layers.base.BracketLeft).toBe('ü');
 expect(pair.layers.base.Semicolon).toBe('ö');
 expect(pair.layers.base.Quote).toBe('ä');
 expect(pair.layers.shift.Digit3).toBe('§');
 expect(pair.layers.shift.Backquote).toBe('°');
 expect(pair.layers.shift.Minus).toBe('?');
});
test('Shift reverses visible German keycap priority while maintaining Brahmi source invariance',async({page})=>{
 const k=page.locator('#keyboard .key[data-code="KeyK"]');
 const q=page.locator('#keyboard .key[data-code="Digit3"]');
 await expect(k.locator('.latin')).toHaveText('k');
 await expect(k.locator('.glyph')).toHaveText('𑀓');
 await expect(k.locator('.iast')).toHaveText('ka');
 await expect(q.locator('.latin')).toHaveText('3');
 await expect(q.locator('.shift-peek')).toHaveText('⇧§');
 await page.locator('#germanMirror').focus();
 await page.keyboard.down('Shift');
 await expect(k.locator('.latin')).toHaveText('K');
 await expect(k.locator('.glyph')).toHaveText('𑀔');
 await expect(k.locator('.iast')).toHaveText('kha');
 await expect(q.locator('.latin')).toHaveText('§');
 await expect(q.locator('.shift-peek')).toHaveText('3');
 await page.keyboard.up('Shift');
 await expect(q.locator('.latin')).toHaveText('3');
 await expect(k.locator('.glyph')).toHaveText('𑀓');
});
test('accurate German labels remain legible at desktop and do not horizontally clip on mobile',async({page},testInfo)=>{
 for(const [w,h] of [[1440,900],[1280,720],[800,620],[390,844],[320,568]]){
  await page.setViewportSize({width:w,height:h});
  const q=page.locator('#keyboard .key[data-code="Digit3"]');
  await expect(q.locator('.latin')).toHaveText('3');
  const metrics=await page.evaluate(()=>{
    const el=document.querySelector('#keyboard .key[data-code="Digit3"] .latin');
    const box=document.querySelector('#keyboard .key[data-code="Digit3"]');
    const font=parseFloat(getComputedStyle(el).fontSize);
    return {font,scrollWidth:document.documentElement.scrollWidth,viewport:window.innerWidth,
     keyWidth:box.getBoundingClientRect().width,
     hiddenSource:getComputedStyle(el).display==='none'};
  });
  expect(metrics.hiddenSource).toBe(false);
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewport+2);
  if(w>=1000)expect(metrics.font).toBeGreaterThanOrEqual(12);
  expect(metrics.keyWidth).toBeGreaterThan(10);
  if(w===1440||w===390){
   await page.screenshot({path:testInfo.outputPath('german-keycaps-'+w+'.png'),fullPage:false});
  }
 }
});
test('project detail uses the same gold/jade brand and accurately sourced glyph specimens',async({page},testInfo)=>{
 await page.goto('/projects/brahmi/');
 await expect(page.locator('body')).toHaveClass(/brahmi-detail/);
 await expect(page.locator('.proof-key')).toHaveCount(3);
 await expect(page.locator('.proof-key').nth(0)).toContainText('𑀓');
 await expect(page.locator('.proof-key').nth(1)).toContainText('𑀸');
 await expect(page.locator('.proof-key').nth(2)).toContainText('𑁩');
 await expect(page.locator('.proof-key').nth(2)).toContainText('⇧§');
 await page.locator('[data-lang="de"]').click();
 await expect(page.locator('[data-proof-lang="de"]')).toBeVisible();
 await expect(page.locator('[data-proof-lang="ru"]')).toBeHidden();
 await page.locator('[data-lang="ru"]').click();
 await expect(page.locator('[data-proof-lang="ru"]')).toBeVisible();
 for(const [w,h] of [[1440,900],[375,812]]){
  await page.setViewportSize({width:w,height:h});
  const metrics=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
  expect(metrics.scroll).toBeLessThanOrEqual(metrics.viewport+2);
  if(w===1440)await page.screenshot({path:testInfo.outputPath('brahmi-premium-project.png'),fullPage:true});
 }
});

test('essential German shifted punctuation remains truly visible at desktop, narrow phone and short landscape',async({page})=>{
 for(const [width,height] of [[1440,900],[390,844],[320,568],[667,375]]){
  await page.setViewportSize({width,height});
  for(const [code,normal,shifted] of [['Digit3','3','⇧§'],['Backquote','^','⇧°'],['Minus','ß','⇧?']]){
   const key=page.locator('#keyboard .key[data-code="'+code+'"]');
   const base=key.locator('.latin'),alt=key.locator('.shift-peek');
   await expect(key).toHaveAttribute('data-alt-kind','symbol');
   await expect(base).toHaveText(normal);
   await expect(alt).toHaveText(shifted);
   await expect(alt).toBeVisible();
   const measure=await alt.evaluate((el)=>{
    const r=el.getBoundingClientRect(),k=el.closest('button').getBoundingClientRect(),css=getComputedStyle(el);
    return {display:css.display,width:r.width,height:r.height,left:r.left,top:r.top,right:r.right,bottom:r.bottom,keyLeft:k.left,keyRight:k.right,keyTop:k.top,keyBottom:k.bottom};
   });
   expect(measure.display).not.toBe('none');
   expect(measure.width).toBeGreaterThan(3);
   expect(measure.height).toBeGreaterThan(3);
   expect(measure.left).toBeGreaterThanOrEqual(measure.keyLeft-2);
   expect(measure.right).toBeLessThanOrEqual(measure.keyRight+2);
  }
 }
 await page.locator('#keyboard .key[data-code="Digit3"]').hover();
 await expect(page.locator('#keyInspectorText')).toContainText('Shift §');
});
