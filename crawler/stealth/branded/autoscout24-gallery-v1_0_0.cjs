"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
// In this example, we'll scrape links on HN
exports.default = async ({page}) => {
    const args = process.argv;
    // console.log(args);
    const url = args[3];

    await page.goto(url); // Replace with your desired URL

    // Extract the src attribute of images with the specified class
    const imageSources = await page.evaluate(() => {
        const imageElements = document.querySelectorAll('img.image-gallery-thumbnail-image');
        return Array.from(imageElements, img => {
            return {src: img.getAttribute('src')}
        });
    });

    const response = {
        data: imageSources,
        success: true,
        message: 'OK'
    };

    // Close the tab
    await page.close();

    console.log(JSON.stringify(response));

    process.exit(0);
};


