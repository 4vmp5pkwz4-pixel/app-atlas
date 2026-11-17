const {test,expect}=require('@playwright/test');
const url='/apps/brahmi/index.html';
const geometry=(page,id)=>page.locator(id).evaluate(e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height,y:r.y,b:r.bottom}});
async function size(page,id,val){await page.locator('#studio_'+id).evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}))},val)}
async function prepare(page){await page.goto(url);await page.locator('#langSelect').selectOption('en');await page.locator('.nav [data-page="train"]').first().click();await page.locator('#sourceLayout').selectOption('de');await page.locator('#studioOpen').click();await expect(page.locator('#atelierStudio')).toBeVisible()}
test('royal palettes use readable semantic colors, preserve keyboard and save preferences',async({page},info)=>{
 await page.setViewportSize({width:1440,height:900});await prepare(page);
 const contrast=await page.evaluate(()=>{
  const lum=h=>{const rgb=h.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};
  const c=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  return Object.values(window.AtelierStudioTest.palettes).flatMap(p=>[c(p.text,p.panel),c(p.muted,p.panel2),c(p.dim,p.panel),c(p.gold2,p["studio-key"]),c(p.bg,p.gold),c(p.text,p["studio-field"])]);
 });expect(Math.min(...contrast)).toBeGreaterThanOrEqual(4.5);
 const before=await page.evaluate(()=>JSON.stringify(window.BrahmiAtelierTest.BRAHMI_LAYERS));
 for(const theme of ['obsidian','sapphire','amethyst','ruby','emerald']){
  await page.locator('[data-theme-choice="'+theme+'"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-atelier-theme',theme);
  await page.locator('#studioClose').click();
  await expect(page.locator('#keyboard .key-row')).toHaveCount(5);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBe(true);
  await page.screenshot({path:info.outputPath('royal-'+theme+'.png')});
  await page.locator('#studioOpen').click();
 }
 expect(await page.evaluate(()=>JSON.stringify(window.BrahmiAtelierTest.BRAHMI_LAYERS))).toBe(before);
 await page.reload();await expect(page.locator('html')).toHaveAttribute('data-atelier-theme','emerald');
});
test('independent geometry, linked tracks, independent reset and preservation of typed characters',async({page},info)=>{
 await page.setViewportSize({width:1440,height:900});await prepare(page);
 await page.locator('#studioClose').click();await page.locator('#germanMirror').focus();await page.keyboard.press('k');
 await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 await page.locator('#studioOpen').click();await size(page,'mac',90);
 expect(Math.abs((await geometry(page,'#germanMirror')).h-90)).toBeLessThan(2);
 expect(Math.abs((await geometry(page,'#typingInput')).h-90)).toBeLessThan(2);
 await page.locator('#studioLink').uncheck();await size(page,'brahmi',132);
 expect(Math.abs((await geometry(page,'#typingInput')).h-132)).toBeLessThan(2);
 expect(Math.abs((await geometry(page,'#germanMirror')).h-90)).toBeLessThan(2);
 await size(page,'split',55);const a=await geometry(page,'.trainer-workspace>.exercise'),b=await geometry(page,'#trainerPhraseLab');
 expect(a.w/(a.w+b.w)).toBeCloseTo(.55,1);
 await size(page,'prompt',85);expect(Math.abs((await geometry(page,'#prompt')).h-85)).toBeLessThan(2);
 await page.locator('[data-studio-reset="prompt"]').click();await expect(page.locator('body')).not.toHaveAttribute('data-studio-prompt','');
 await size(page,'row',68);expect(Math.abs((await geometry(page,'#keyboard .key[data-code="KeyK"]')).h-68)).toBeLessThan(2);
 await page.locator('#studioClose').click();await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 await page.screenshot({path:info.outputPath('custom-geometry.png')});
 await page.reload();await page.locator('.nav [data-page="train"]').first().click();
 expect(Math.abs((await geometry(page,'#typingInput')).h-132)).toBeLessThan(2);
 await page.locator('#studioOpen').click();await page.locator('#studioReset').click();
 await expect(page.locator('body')).not.toHaveAttribute('data-studio-row','');
 await expect(page.locator('body')).not.toHaveAttribute('data-studio-brahmi','');
 await page.locator('#studioClose').click();
 expect((await geometry(page,'.trainer-workspace>.exercise')).w/(await geometry(page,'#trainerPhraseLab')).w).toBeCloseTo((1+Math.sqrt(5))/2,1);
});
test('mobile and short-landscape oversized settings scroll within bounded workspace',async({page},info)=>{
 await page.setViewportSize({width:390,height:844});await prepare(page);
 await size(page,'mac',180);await size(page,'prompt',240);await size(page,'atlas',650);await size(page,'row',86);await size(page,'dock',70);
 await page.locator('#studioClose').click();
 for(const [w,h] of [[390,844],[320,568],[844,390],[1024,768]]){
  await page.setViewportSize({width:w,height:h});
  const x=await page.evaluate(()=>{const a=document.querySelector('#keyboardDock'),b=document.querySelector('#trainerWorkspace');return {w:document.documentElement.scrollWidth,h:a.getBoundingClientRect().bottom,work:b.getBoundingClientRect().height,dockScroll:a.scrollHeight>=a.clientHeight}});
  expect(x.w).toBeLessThanOrEqual(w+2);expect(x.h).toBeLessThanOrEqual(h+2);expect(x.work).toBeGreaterThan(0);expect(x.dockScroll).toBe(true);
  await page.screenshot({path:info.outputPath('bounded-'+w+'x'+h+'.png')});
 }
 await page.locator('#studioOpen').click();await page.locator('#studioImmerse').click();await page.locator('#studioClose').click();await expect(page.locator('body')).toHaveClass(/studio-immersive/);
 await page.locator('#studioExit').click();await expect(page.locator('body')).not.toHaveClass(/studio-immersive/);
});

test('opt-in drag grips resize both tracks and preserve safe inspect labels',async({page},info)=>{
 await page.setViewportSize({width:1440,height:900});await prepare(page);
 await page.locator('#studioHandles').check();await page.locator('#studioLink').uncheck();await page.locator('#studioClose').click();
 const before=(await geometry(page,'#germanMirror')).h;
 const grip=page.locator('#studioGripMac');await expect(grip).toBeVisible();const box=await grip.boundingBox();
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2,box.y+box.height/2+24,{steps:4});await page.mouse.up();
 expect((await geometry(page,'#germanMirror')).h).toBeGreaterThan(before+10);
 await page.locator('#studioOpen').click();await size(page,'row',34);await page.locator('#studioClose').click();await page.locator('#keyboardZoomToggle').click();
 expect((await geometry(page,'#keyboard .key[data-code="KeyK"]')).h).toBeGreaterThanOrEqual(58);
 await expect(page.locator('#keyboard .key-row')).toHaveCount(5);
 await page.screenshot({path:info.outputPath('direct-resize-inspect.png')});
});
