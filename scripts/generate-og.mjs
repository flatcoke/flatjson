import satori from "satori";
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Fetch fonts
async function fetchFont(url) {
  const res = await fetch(url);
  return await res.arrayBuffer();
}

async function main() {
  // JetBrains Mono Bold (for braces)
  const jbMono = await fetchFont(
    "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.ttf"
  );

  // Inter Bold (clean sans-serif for "flatJSON")
  const interBold = await fetchFont(
    "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf"
  );

  // Inter Regular (for subtitle)
  const interRegular = await fetchFont(
    "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
  );

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                fontSize: 72,
                fontWeight: 700,
                color: "#e5e5e5",
                letterSpacing: "-1px",
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: { fontFamily: "JetBrains Mono", color: "#4A0E8F", marginRight: "8px" },
                    children: "{",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: { fontFamily: "Inter" },
                    children: "flatJSON",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: { fontFamily: "JetBrains Mono", color: "#4A0E8F", marginLeft: "8px" },
                    children: "}",
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                marginTop: "16px",
                fontSize: 28,
                color: "#9ca3af",
                fontWeight: 400,
                fontFamily: "Inter",
                letterSpacing: "0.5px",
              },
              children: "JSON & YAML Parser",
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "JetBrains Mono", data: jbMono, weight: 700, style: "normal" },
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
      ],
    }
  );

  const png = await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();
  const outPath = join(root, "public", "og.jpg");
  writeFileSync(outPath, png);
  console.log(`✅ Generated ${outPath} (${png.length} bytes)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
