import fs from "fs";

import prettier from "prettier";
import * as cheerio from "cheerio";
import { select } from "@inquirer/prompts";

(async () => {
    let galleries = fs.readFileSync("data/gallery.json");

    let choices = JSON.parse(galleries).flatMap((item) =>
        item.gallery.map((galleryItem) => ({
            name: `${item.generator} - ${galleryItem}`,
            value: `${item.generator}_${galleryItem}`,
        })),
    );

    console.log("--------------------------------------------------");
    const answer = await select({
        message: "Select a Gallery",
        choices: choices,
    });
    console.log("--------------------------------------------------");

    const html = fs.readFileSync(`html_raw/${answer}.html`, "utf-8");
    const $ = cheerio.load(html);

    let list = [];
    let currentDate = new Date().toISOString().slice(0, 10);
    let galleryInfo = answer.split("_");

    let images = $(".imageCtn");
    let count = images.length;

    images.each((index, element) => {
        let dataIndex = count - index;
        $(element).attr("data-index", dataIndex);
        $(element).prepend(`<div class="index">No. ${dataIndex}</div>`);

        let image = $(element).find(".image");
        let url = image.attr("src");
        let type = url.substring(url.lastIndexOf(".") + 1);
        let ratio = image.attr("style").match(/aspect-ratio:\s*(\d+)\s*\/\s*(\d+)/);

        list.push({
            index: dataIndex,
            imageId: $(element).attr("data-image-id"),
            type: type,
            height: ratio[2],
            width: ratio[1],
        });
    });

    console.log("Images: " + count);

    fs.writeFileSync(`data/images_index/${answer}_${currentDate}.json`, JSON.stringify(list, null, 4));

    console.log(`File Created: data/images_index/${answer}_${currentDate}.json`);

    $(".imageWrapper").removeAttr("style");
    $(".imageWrapper").find(".info-btn").remove();
    $(".imageWrapper").find(".image-hover-ctn").remove();

    $("head").append(`
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${galleryInfo[0]} - ${galleryInfo[1]}</title>
        <link rel="stylesheet" href="assets/style.css" />
        <script src="assets/app.js" defer></script>
    `);

    $("body").prepend(`
        <div class="page-header">
            <div>
                <label>Generator</label>
                <p>${galleryInfo[0]}</p>
            </div>
            <div>
                <label>Gallery</label>
                <p>${galleryInfo[1]}</p>
            </div>
            <div>
                <label>Total Images</label>
                <p>${count}</p>
            </div>
            <div>
                <label>Last Modified</label>
                <p>${currentDate}</p>
            </div>
        </div>
    `);

    // Get the modified HTML
    const modifiedHtml = $.html();

    const prettifiedHtml = await prettier.format(modifiedHtml, {
        parser: "html",
        tabWidth: 4,
        printWidth: 120,
    });

    fs.writeFileSync(`html_cleaned/${answer}_${currentDate}.html`, prettifiedHtml, "utf-8");
    console.log(`File Created: html_cleaned/${answer}_${currentDate}.html`);

    let resourcesPath = `resources/${answer}_${currentDate}`;

    if (!fs.existsSync(resourcesPath)) {
        fs.mkdirSync(resourcesPath, { recursive: true });
        console.log(`Folder Created: ${resourcesPath}`);
    } else {
        console.log(`Folder Exists: ${resourcesPath}`);
    }

    console.log("--------------------------------------------------");
})();
