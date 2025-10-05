#!/usr/bin/env node

/**
 * Script to update theme presets from tweakcn
 * Downloads the latest themes and replaces the local file
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const THEME_PRESETS_URL =
  "https://raw.githubusercontent.com/jnsahaj/tweakcn/0e400ecbfc04c2d07515235e0ed3f2e8b0cfbe3d/utils/theme-presets.ts";
const TARGET_PATH = path.join(__dirname, "..", "lib", "theme-presets.ts");

console.log("🎨 Updating theme presets from tweakcn...\n");

https
  .get(THEME_PRESETS_URL, (response) => {
    if (response.statusCode !== 200) {
      console.error(
        `❌ Error: Unable to download file (status ${response.statusCode})`,
      );
      process.exit(1);
    }

    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      try {
        // Write new file
        fs.writeFileSync(TARGET_PATH, data, "utf8");
        console.log(`✅ File updated: ${path.basename(TARGET_PATH)}`);
        console.log("✨ Update completed successfully!");

        // Exit with success code
        process.exit(0);
      } catch (error) {
        console.error(`❌ Error writing file: ${error.message}`);
        process.exit(1);
      }
    });
  })
  .on("error", (error) => {
    console.error(`❌ Error downloading file: ${error.message}`);
    process.exit(1);
  });
