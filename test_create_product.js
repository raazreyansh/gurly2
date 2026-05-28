const { chromium } = require('playwright');

(async () => {
  console.log("Launching Chromium browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let alertMessage = null;
  page.on('dialog', async dialog => {
    alertMessage = dialog.message();
    console.log("ALERT: " + alertMessage);
    await dialog.dismiss();
  });

  console.log("Navigating to GURLY Admin — https://gurly2.vercel.app/admin/products/new");
  await page.goto('https://gurly2.vercel.app/admin/products/new', { waitUntil: 'networkidle', timeout: 60000 });

  // Screenshot current state
  await page.screenshot({ path: 'test_01_page_loaded.png' });
  console.log("Screenshot 1: Page loaded");

  // Fill title using name attribute
  await page.locator('input[name="title"]').fill('Test Gold Jhumka');
  await page.locator('input[name="price"]').fill('3999');
  await page.locator('input[name="stock"]').fill('20');
  await page.locator('textarea[name="description"]').fill('Exquisite handcrafted gold jhumka earrings.');
  await page.locator('input[name="shippingDays"]').fill('3');

  // Get selected category
  const selectedCat = await page.locator('select[name="categoryId"]').inputValue();
  console.log("Selected Category ID: " + selectedCat);

  await page.screenshot({ path: 'test_02_form_filled.png' });
  console.log("Screenshot 2: Form filled");

  // Submit
  console.log("Clicking submit button...");
  await page.locator('button[type="submit"]').click();

  // Wait up to 15s for redirect or alert
  await page.waitForTimeout(15000);

  const finalUrl = page.url();
  console.log("Final URL after submission: " + finalUrl);

  await page.screenshot({ path: 'test_03_after_submit.png' });
  console.log("Screenshot 3: After submit");

  if (finalUrl.includes('/admin/products') && !finalUrl.includes('/new')) {
    console.log("SUCCESS: Redirected to product catalog. Product created successfully!");
  } else if (alertMessage) {
    console.log("FAILURE - Alert shown: " + alertMessage);
  } else {
    console.log("UNKNOWN STATE: Still on " + finalUrl);
  }

  await browser.close();
})();
