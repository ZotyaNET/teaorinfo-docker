"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
// In this example, we'll scrape links on HN
exports.default = async ({page}) => {
    const args = process.argv;
    // console.log(args);
    // const make = "audi";
    // const model = "a7";
    // const year = ;
    // const price = null;
    // const km = null;
    const make = args[3];
    const model = args[4];
    const year = args[5];
    const price = args[6];
    const km = args[7];
    await page.goto('https://www.mobile.de'); // Replace with your desired URL
    // Wait for the element to appear on the page
    await page.waitForSelector('.mde-consent-accept-btn');
    // Click on the element with the specified class
    await page.click('.mde-consent-accept-btn');
    // Wait for the element with the specific "data-testid" attribute
    await page.waitForSelector('[data-testid="qs-select-make"]');
    // Click on the element with the specified "data-testid" attribute
    await page.click('[data-testid="qs-select-make"]');
    // Type text into the input field
    await page.keyboard.type(make);
    // Simulate pressing the Enter key
    await page.keyboard.press('Enter');
    // Wait for the element with the specific "data-testid" attribute
    await page.waitForSelector('[data-testid="qs-select-model"]');
    // Wait for 2 seconds (200 milliseconds)
    await page.waitForTimeout(500);
    // Click on the element with the specified "data-testid" attribute
    await page.click('[data-testid="qs-select-model"]');
    // Type text into the input field
    await page.keyboard.type(model);
    // Simulate pressing the Enter key
    await page.keyboard.press('Enter');

    if (year != null) {
        // Wait for the element with the specific "data-testid" attribute
        await page.waitForSelector('[data-testid="qs-select-1st-registration-from-input"]');
        // Click on the element with the specified "data-testid" attribute
        await page.click('[data-testid="qs-select-1st-registration-from-input"]');
        // Type text into the input field
        await page.keyboard.type(year);
        // Simulate pressing the Enter key
        await page.keyboard.press('Enter');
    }

    if (km != null) {
        // Wait for the element with the specific "data-testid" attribute
        await page.waitForSelector('[data-testid="qs-select-mileage-up-to-input"]');
        // Click on the element with the specified "data-testid" attribute
        await page.click('[data-testid="qs-select-mileage-up-to-input"]');
        // Type text into the input field
        await page.keyboard.type(km);
        // Simulate pressing the Enter key
        await page.keyboard.press('Enter');
    }

    if (price != null) {
        // Wait for the element with the specific "data-testid" attribute
        await page.waitForSelector('[data-testid="qs-select-price-up-to-input"]');
        // Click on the element with the specified "data-testid" attribute
        await page.click('[data-testid="qs-select-price-up-to-input"]');
        // Type text into the input field
        await page.keyboard.type(price);
        // Simulate pressing the Enter key
        await page.keyboard.press('Tab');
    }

    // Wait for the button to be available (you can replace this selector)
    await page.waitForSelector('[data-testid="qs-submit-button"]');
    await page.waitForTimeout(500);
    // Click on the element with the specified "data-testid" attribute
    await page.click('[data-testid="qs-submit-button"]');
    await page.waitForTimeout(500);
    // Wait for the element with the specific "data-testid" attribute
    await page.waitForSelector("#root > div > div.NGBg0 > div.leHcX > article:nth-child(1) > section.HaBLt.ku0Os.WPqkQ > div > div.uCLLn > div > div > div > select");
    // Click on the element with the specified "data-testid" attribute
    await page.waitForTimeout(2000);
    await page.click("#root > div > div.NGBg0 > div.leHcX > article:nth-child(1) > section.HaBLt.ku0Os.WPqkQ > div > div.uCLLn > div > div > div > select");
    // Type text into the input field
    await page.keyboard.type('Inserate (ne');
    // Simulate pressing the Enter key
    await page.keyboard.press('Enter');
    // Wait for the elements with class "result-item" to appear
    //await page.waitForSelector('a.result-item');

    await page.waitForTimeout(2000);
    // Extract href and src attributes and store them in an associative array
    // Now, imgSrcArray contains the src attributes of the images that meet your criteria
    //console.log(associativeArray);
    // Loop through the key-value pairs
    let associativeArray;
    associativeArray = await page.$$eval('a.result-item', (elements) => {
        return elements.map((element) => {
            const link = element.getAttribute('href');
            const img = element.querySelector('img');
            const image = img ? img.getAttribute('src') : null;
            const div = element.querySelector('div.g-col-12');
            const teaser = div ? div.textContent.trim() : null;

            return {
                link,
                image,
                teaser,
            };

        });
    });
    // Close the tab
    await page.close();

    console.log(JSON.stringify(associativeArray));
};
