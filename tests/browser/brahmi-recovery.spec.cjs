const {test,expect}=require('@playwright/test');
const url='/apps/brahmi/index.html';
async function start(page){await page.goto(url);await page.locator('#langSelect').selectOption('en');await page.locator('.nav [data-page="train"]').click();}
test('typing continues without manually refocusing after Studio and research',async({page})=>{
 await start(page);await expect(page.locator('#germanMirror')).toBeFocused();await page.keyboard.press('k');await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 await page.locator('#studioOpen').click();await page.locator('[data-theme-choice="sapphire"]').click();await page.locator('#studioClose').click();await expect(page.locator('#germanMirror')).toBeFocused();
 await page.keyboard.press('l');await expect(page.locator('#typingInput')).toHaveValue('𑀓𑀮');
 await page.locator('#phraseResearch').click();await expect(page.locator('#page-research')).toHaveClass(/active/);await page.locator('#page-research [data-module-back]').click();
 await expect(page.locator('#germanMirror')).toBeFocused();await expect(page.locator('#typingInput')).toHaveValue('𑀓𑀮');
 await page.keyboard.press('s');await expect(page.locator('#typingInput')).toHaveValue('𑀓𑀮𑀲');await page.keyboard.press('Backspace');await expect(page.locator('#typingInput')).toHaveValue('𑀓𑀮');
 await page.locator('#resetInput').click();await expect(page.locator('#germanMirror')).toBeFocused();await expect(page.locator('#typingInput')).toHaveValue('');await page.keyboard.press('k');await expect(page.locator('#typingInput')).toHaveValue('𑀓');
});
test('classic recovery resets display without deleting exercise or progress',async({page},info)=>{
 await start(page);await page.keyboard.press('k');await expect(page.locator('#typingInput')).toHaveValue('𑀓');const before=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('brahmi-atelier-2026-v1'));return JSON.stringify([s.completed,s.sessions,s.errors,s.cal])});
 await page.locator('#studioOpen').click();await page.locator('[data-theme-choice="ruby"]').click();await page.locator('[data-studio-preset="typing"]').click();await page.locator('#studioHandles').check();await page.locator('#studioRestoreOriginal').click();
 await expect(page.locator('#atelierStudio')).toBeHidden();await expect(page.locator('html')).not.toHaveAttribute('data-atelier-theme','ruby');await expect(page.locator('body')).not.toHaveAttribute('data-studio-row','');await expect(page.locator('#germanMirror')).toBeFocused();await expect(page.locator('#typingInput')).toHaveValue('𑀓');await expect(page.locator('#keyboard .key-row')).toHaveCount(5);
 const after=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('brahmi-atelier-2026-v1'));return JSON.stringify([s.completed,s.sessions,s.errors,s.cal])});expect(after).toBe(before);
 await page.screenshot({path:info.outputPath('restored-classic.png')});
});
test('practice clock excludes time in other workspaces',async({page})=>{
 await start(page);await page.keyboard.press('k');await expect(page.locator('#typingInput')).toHaveValue('𑀓');
 await page.locator('#phraseResearch').click();const before=await page.locator('#metricTime').textContent();await page.waitForTimeout(2300);await page.locator('#page-research [data-module-back]').click();const after=await page.locator('#metricTime').textContent();
 const seconds=s=>{const [m,x]=s.split(':').map(Number);return 60*m+x};expect(seconds(after)-seconds(before)).toBeLessThanOrEqual(1);await expect(page.locator('#typingInput')).toHaveValue('𑀓');
});
