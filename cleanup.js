import fs from "fs";

import * as cheerio from "cheerio";
import { select } from "@inquirer/prompts";

(async () => {
    let galleries = fs.readFileSync("data/gallery.json");

    let choices = JSON.parse(galleries).flatMap((item) =>
        item.gallery.map((galleryItem) => ({
            name: `${item.generator} - ${galleryItem}`,
            value: `${item.generator}_${galleryItem}`,
        }))
    );

    console.log("--------------------------------------------------");
    const answer = await select({
        message: "Select a Gallery",
        choices: choices,
    });
    console.log("--------------------------------------------------");

    const html = fs.readFileSync(`html_raw/${answer}.html`, "utf-8");
    const $ = cheerio.load(html);

    console.log("Images: " + $(".imageCtn").length);

    $(".imageWrapper").removeAttr("style");
    $(".imageWrapper").find(".info-btn").remove();
    $(".imageWrapper").find(".image-hover-ctn").remove();

    // Get the modified HTML
    const modifiedHtml = $.html();

    fs.writeFileSync(`html_cleaned/${answer}.html`, modifiedHtml, "utf-8");

    console.log(`Output: html_cleaned/${answer}.html`);
    console.log("--------------------------------------------------");
})();
