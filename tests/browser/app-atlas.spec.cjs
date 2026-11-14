const { test, expect } = require('@playwright/test');
const projects=['brahmi','norma','buddhabrot','hcc','hopf','uprs'];

test('catalog loads all verified public entries',async({page})=>{
 await page.goto('/');
 await expect(page.locator('#cards .tile')).toHaveCount(6);
 await expect(page.locator('#heroCount')).toHaveText('6');
 await expect(page.locator('.tile-actions .primary')).toHaveCount(6);
 const bad=await page.locator('a[href*="/Lean"]').count();
 expect(bad).toBe(0);
});
test('switches all three languages and keeps accessible search',async({page})=>{
 await page.goto('/');
 for(const lang of ['en','de','ru']){
   await page.locator('[data-lang="'+lang+'"]').click();
   await expect(page.locator('html')).toHaveAttribute('lang',lang);
   await expect(page.locator('#cards .tile')).toHaveCount(6);
   await expect(page.locator('[data-lang="'+lang+'"]')).toHaveAttribute('aria-pressed','true');
 }
});
test('search, filters and empty state are interactive',async({page})=>{
 await page.goto('/');
 await page.locator('#search').fill('Brahmi');
 await expect(page.locator('#cards .tile')).toHaveCount(1);
 await expect(page.locator('#cards h3')).toContainText('Brahmi Atelier');
 await page.locator('#search').fill('no_such_project_123');
 await expect(page.locator('#cards .tile')).toHaveCount(0);
 await expect(page.locator('#empty')).toBeVisible();
 await page.locator('#search').fill('');
 await page.locator('#filters button').nth(2).click();
 await expect(page.locator('#cards .tile')).toHaveCount(1);
 await expect(page.locator('#cards h3')).toContainText('Buddhabrot');
});
test('theme switch and search shortcut',async({page})=>{
 await page.goto('/');
 const before=await page.locator('html').getAttribute('data-theme');
 await page.locator('#theme').click();
 const after=await page.locator('html').getAttribute('data-theme');
 expect(after).not.toBe(before);
 await page.keyboard.press('/');
 await expect(page.locator('#search')).toBeFocused();
});
test('all six multilingual detail pages are available',async({page})=>{
 for(const id of projects){
   await page.goto('/projects/'+id+'/');
   await expect(page.locator('h1')).not.toBeEmpty();
   await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',new RegExp('/projects/'+id+'/$'));
   await page.locator('[data-lang="de"]').click();
   await expect(page.locator('html')).toHaveAttribute('lang','de');
   await expect(page.locator('[data-story="de"]')).toBeVisible();
   await expect(page.locator('[data-story="ru"]')).toBeHidden();
   await expect(page.locator('.actions a')).toHaveCount(id==='brahmi'||id==='buddhabrot'?4:3);
 }
});
test('both bundled apps serve complete HTML without starting GPU render loops',async({request})=>{
 for(const id of ['brahmi','buddhabrot']){
   const response=await request.get('/apps/'+id+'/index.html');
   expect(response.status()).toBe(200);
   const html=await response.text();
   expect(html.toLowerCase()).toContain('<html');
   expect(html.toLowerCase()).toContain('</html>');
   expect(html.toLowerCase()).toContain('<title');
 }
});
test('Brahmi lessons and keyboard are visible in a real browser',async({page})=>{
 await page.goto('/apps/brahmi/index.html',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#continueButton')).toBeVisible();
 await expect(page.locator('#keyboard')).toBeAttached();
});
test('mobile layout has no horizontal document overflow',async({page,isMobile})=>{
 if(!isMobile)return;
 for(const path of ['/','/projects/brahmi/','/projects/buddhabrot/']){
   await page.goto(path);
   const {body,viewport}=await page.evaluate(()=>({body:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
   expect(body).toBeLessThanOrEqual(viewport+2);
 }
});
