const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
 testDir:'./tests/browser',
 fullyParallel:true,
 retries:process.env.CI?1:0,
 timeout:45000,
 expect:{timeout:12000},
 reporter:[['list'],['html',{open:'never',outputFolder:'playwright-report'}]],
 use:{baseURL:'http://127.0.0.1:8765',trace:'on-first-retry',screenshot:'only-on-failure'},
 projects:[
  {name:'desktop-chromium',use:{...devices['Desktop Chrome']}},
  {name:'mobile-chromium',use:{...devices['Pixel 7'],browserName:'chromium'}}
 ],
 webServer:{command:'python3 -m http.server 8765 --bind 127.0.0.1',url:'http://127.0.0.1:8765',reuseExistingServer:!process.env.CI,timeout:20000}
});
