#!/usr/bin/env node

import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { ADDITIONAL_THEMES } from "../constants/additional-themes.js";

const THEME_PRESETS_URL =
  "https://raw.githubusercontent.com/jnsahaj/tweakcn/0e400ecbfc04c2d07515235e0ed3f2e8b0cfbe3d/utils/theme-presets.ts";
const TARGET_PATH = path.join(__dirname, "..", "lib", "theme-presets.ts");

// Additional themes moved to `scripts/additional-themes.js`

function appendAdditionalThemes(data) {
  const exportRegex =
    /export\s+const\s+defaultPresets\s*:\s*Record<string,\s*ThemePreset>\s*=\s*{[\s\S]*?};/;
  const match = data.match(exportRegex);
  // if no match found skipp adding additional themes
  if (!match) {
    console.warn(
      "⚠️ Warning: Could not find themePresets export. Skipping additional themes.",
    );
    return data;
  }
  const originalExport = match[0];
  const modifiedExport = originalExport.replace(
    /};\s*$/,
    `${ADDITIONAL_THEMES}\n};`,
  );
  return data.replace(originalExport, modifiedExport);
}

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
        data = appendAdditionalThemes(data);
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
