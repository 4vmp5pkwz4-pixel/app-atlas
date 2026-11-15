const {test,expect}=require('@playwright/test');

test.beforeEach(async({page})=>{
  await page.goto('/apps/brahmi/phonetic-atlas.html',{waitUntil:'domcontentloaded'});
  await expect.poll(()=>page.evaluate(()=>Boolean(window.BrahmiAtlasTest))).toBe(true);
});

test('full Unicode Brahmi registry and original keyboard coverage',async({page})=>{
  await expect(page.locator('#nAll')).toHaveText('115');
  await expect(page.locator('#nYes')).toHaveText('106');
  await expect(page.locator('#nNo')).toHaveText('9');
  await expect(page.locator('#table tr')).toHaveCount(115);
  const audit=await page.evaluate(()=>({
    total:window.BrahmiAtlasTest.ROWS.length,
    mapped:window.BrahmiAtlasTest.ROWS.filter(x=>x.chords.length).length,
    missing:window.BrahmiAtlasTest.ROWS.filter(x=>!x.chords.length).map(x=>x.hex),
    english:window.BrahmiAtlasTest.score('en'),
    german:window.BrahmiAtlasTest.score('de'),
    japaneseRomaji:window.BrahmiAtlasTest.score('ja')
  }));
  expect(audit).toEqual({
    total:115,mapped:106,
    missing:['11003','11004','11070','11071','11072','11073','11074','11075','1107F'],
    english:26,german:25,japaneseRomaji:26
  });
});

test('filter, source chords and Russian/Japanese physical labels',async({page})=>{
  await page.locator('#query').fill('U+11013');
  await expect(page.locator('#table tr')).toHaveCount(1);
  await expect(page.locator('#table tr')).toContainText('𑀓');
  await page.locator('#layout').selectOption('ru');
  await expect(page.locator('#table tr')).toContainText('Л');
  await page.locator('#layout').selectOption('kana');
  await expect(page.locator('#table tr')).toContainText('の');
  await page.locator('#query').fill('');
  await page.locator('#coverage').selectOption('no');
  await expect(page.locator('#table tr')).toHaveCount(9);
});

test('language and CSV export, no network required by atlas',async({page})=>{
  await page.locator('#lang').selectOption('ja');
  await expect(page.locator('html')).toHaveAttribute('lang','ja');
  await expect(page.locator('#title')).toContainText('ブラーフミー');
  await page.locator('#lang').selectOption('de');
  await expect(page.locator('#title')).toContainText('Brahmi');
  const [download]=await Promise.all([
    page.waitForEvent('download'),
    page.locator('#csv').click()
  ]);
  expect(download.suggestedFilename()).toBe('brahmi-phonetic-atlas.csv');
});

test('main converter links to new atlas in all five interface locales',async({page})=>{
  await page.goto('/apps/brahmi/index.html',{waitUntil:'domcontentloaded'});
  for(const lang of ['ru','en','de','ja','br']){
    await page.locator('#langSelect').selectOption(lang);
    const link=page.locator('#atlasLaunch');
    await expect(link).toHaveAttribute('href','./phonetic-atlas.html');
    await expect(link).toHaveText(/115/);
  }
});
