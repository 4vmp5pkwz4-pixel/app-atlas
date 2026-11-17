const {test,expect}=require("@playwright/test");
const root="/apps/brahmi/";
test("BFG research lab: analysis, DNA round trip, graph, transport, comparison and responsive layout",async({page})=>{
 await page.goto(root+"research-lab.html");
 await expect(page.locator("#result")).toBeVisible();
 await page.locator("#source").fill("aba");await page.locator("#run").click();await expect(page.locator("#count")).toHaveText("3");
 await expect(page.locator("#n")).toHaveText("3");
 await page.locator("#empty").click();await page.locator("#rows input").nth(0).check();await expect(page.locator("#mask")).toHaveText("101");await expect(page.locator("#dna")).toHaveValue("GTACGT");
 await page.locator("#decode").click();await expect(page.locator("#decoded")).toHaveText("101");
 await page.locator("#rows input").nth(1).check();await expect(page.locator("#valid")).toContainText("11");await expect(page.locator("#fusion")).toHaveText("—");
 await page.locator("#other").fill("xyx");await page.locator("#compareRun").click();await expect(page.locator("#comparison")).toContainText("Equivalent");
 await page.locator("#kind").selectOption("tree");await page.locator("#w").fill("3");await page.locator("#tunnelRun").click();await expect(page.locator("#tunnelOut")).toContainText("T = 4");
 await page.locator("#noiseRun").click();await expect(page.locator("#noiseOut")).toContainText("δ(μ, μ̄) = 8/10");
 await page.locator("#lang").selectOption("de");await expect(page.locator("#title")).toHaveText("Forschungslabor");
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test("BFG handoff from the existing converter preserves Unicode",async({page})=>{
 await page.goto(root+"index.html");
 await page.locator("#langSelect").selectOption("en");
 await page.locator('.nav [data-page="convert"]').click();
 await page.locator("#convSource").fill("𑀓𑀮𑀓");
 await page.locator("#bfgTransfer").click();
 await expect(page).toHaveURL(/index\.html#research$/);
 const lab=page.frameLocator("#atelier-frame-research");
 await expect(lab.locator("#source")).toHaveValue("𑀓𑀮𑀓");
 await expect(lab.locator("#count")).toHaveText("3");
 await expect(page.locator("#page-research")).toHaveClass(/active/);
 expect(await page.evaluate(()=>sessionStorage.getItem("bfg-lab-input-v1"))).toBeNull();
});
