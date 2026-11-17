const {test,expect}=require('@playwright/test');
const url='/apps/brahmi/index.html';
const moduleFrame=(page,id)=>page.frameLocator('#atelier-frame-'+id);
async function nav(page,id){await page.locator('.nav [data-page="'+id+'"]').click();await expect(page.locator('#page-'+id)).toHaveClass(/active/)}
async function openStudio(page){await page.locator('#studioOpen').click();await expect(page.locator('#atelierStudio')).toBeVisible()}
async function size(page,id,value){await page.locator('#studio_'+id).evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}))},value)}
test('single shell, live royal theme, shared typography and persistent exact experiment',async({page},info)=>{
 await page.setViewportSize({width:1440,height:900});await page.goto(url);await page.locator('#langSelect').selectOption('en');await nav(page,'research');
 const lab=moduleFrame(page,'research');await expect(lab.locator('#result')).toBeVisible();await expect(lab.locator('header')).toBeHidden();await expect(page.locator('#studioOpen')).toBeVisible();
 await lab.locator('#source').fill('aba');await lab.locator('#run').click();await expect(lab.locator('#count')).toHaveText('3');
 await lab.locator('#empty').click();await lab.locator('#rows input').first().check();await expect(lab.locator('#mask')).toHaveText('101');
 await openStudio(page);await page.locator('[data-theme-choice="sapphire"]').click();await size(page,'text',40);await size(page,'inputfont',24);await size(page,'mac',110);await page.locator('#studioClose').click();
 await expect(lab.locator('html')).toHaveAttribute('data-atelier-theme','sapphire');
 await expect.poll(()=>lab.locator('#source').evaluate(e=>getComputedStyle(e).fontSize)).toBe('40px');
 await expect.poll(()=>lab.locator('#source').evaluate(e=>e.getBoundingClientRect().height)).toBe(110);
 await expect.poll(()=>lab.locator('#p').evaluate(e=>getComputedStyle(e).fontSize)).toBe('24px');
 await expect(lab.locator('#mask')).toHaveText('101');
 await page.locator('#langSelect').selectOption('de');await expect(lab.locator('#title')).toHaveText('Forschungslabor');
 await lab.locator('.nav a[href="#tunnel"]').click();await expect(lab.locator('#grammar')).toBeHidden();await expect(lab.locator('#tunnel')).toBeVisible();
 await lab.locator('#kind').selectOption('tree');await lab.locator('#w').fill('3');await lab.locator('#tunnelRun').click();await expect(lab.locator('#tunnelOut')).toContainText('T = 4');
 await nav(page,'dictionary');const dictionary=moduleFrame(page,'dictionary');await expect(dictionary.locator('html')).toHaveAttribute('data-atelier-theme','sapphire');await expect(dictionary.locator('h1')).toHaveText('Aussprachewörterbuch');await expect(dictionary.locator('header')).toBeHidden();
 await nav(page,'atlas');const atlas=moduleFrame(page,'atlas');await expect(atlas.locator('html')).toHaveAttribute('data-atelier-theme','sapphire');await expect(atlas.locator('header')).toBeHidden();
 await nav(page,'research');await expect(lab.locator('#tunnelOut')).toContainText('T = 4');
 await lab.locator('.nav a[href="#grammar"]').click();await expect(lab.locator('#mask')).toHaveText('101');
 await page.screenshot({path:info.outputPath('unified-research-sapphire.png')});
 await openStudio(page);await page.locator('#studioQuickAuto').count();await page.locator('#studioReset').click();await page.locator('[data-theme-choice="original"]').click();await page.locator('#studioClose').click();
 await expect(lab.locator('html')).toHaveAttribute('data-atelier-theme','original');await expect(lab.locator('html')).not.toHaveAttribute('data-atelier-reading-size','');
 await expect(lab.locator('#count')).toHaveText('3');
});
test('converter, dictionary and trainer work in one tab without losing draft or exercise',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto(url);await page.locator('#langSelect').selectOption('en');await nav(page,'train');await page.locator('#sourceLayout').selectOption('de');await page.locator('#germanMirror').focus();await page.keyboard.press('k');await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 await nav(page,'convert');await page.locator('#convSource').fill('𑀔𑀓');
 await page.locator('#dictConvert').click();const dict=moduleFrame(page,'dictionary');await expect(dict.locator('#ipa')).toHaveText('[kʰ]');
 await nav(page,'convert');await expect(page.locator('#convSource')).toHaveValue('𑀔𑀓');
 await page.locator('#bfgTransfer').click();const lab=moduleFrame(page,'research');await expect(lab.locator('#source')).toHaveValue('𑀔𑀓');await expect(lab.locator('#n')).toHaveText('2');
 await nav(page,'train');await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 await page.locator('#phraseResearch').click();await expect(page.locator('#page-research')).toHaveClass(/active/);await expect(lab.locator('#source')).not.toHaveValue('𑀔𑀓');
 await nav(page,'dictionary');await dict.locator('#base').selectOption(String(0x11013));await dict.locator('#vowel').selectOption(String(0x1103a));await dict.locator('#practiceSyllable').click();
 await expect(page.locator('#page-train')).toHaveClass(/active/);await expect(page.locator('#prompt')).toContainText('𑀓');await expect(page.locator('#typingInput')).toHaveValue('');
});
test('mobile shell uses a single page scroll with accessible research tabs and immersive exit',async({page},info)=>{
 await page.setViewportSize({width:390,height:844});await page.goto(url+'#research');const lab=moduleFrame(page,'research');
 await expect(lab.locator('#result')).toBeVisible();await expect(page.locator('#page-research')).toHaveClass(/active/);await page.locator('#langSelect').selectOption('en');
 await expect.poll(()=>page.locator('#atelier-frame-research').evaluate(e=>e.getBoundingClientRect().height)).toBeGreaterThan(500);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBe(true);
 await lab.locator('.nav a[href="#noise"]').click();await expect(lab.locator('#noise')).toBeVisible();await expect(lab.locator('#grammar')).toBeHidden();
 await openStudio(page);await page.locator('[data-theme-choice="amethyst"]').click();await page.locator('#studioImmerse').click();await page.locator('#studioClose').click();
 await expect(page.locator('body')).toHaveClass(/atelier-module-mode/);await expect(page.locator('body')).toHaveClass(/studio-immersive/);
 await expect(page.locator('#studioExit')).toBeVisible();await page.locator('#studioExit').click();await expect(page.locator('body')).not.toHaveClass(/studio-immersive/);
 await expect(lab.locator('#noise')).toBeVisible();await page.screenshot({path:info.outputPath('unified-research-mobile.png')});
});
