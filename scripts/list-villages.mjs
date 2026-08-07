import fs from "fs";
const t = fs.readFileSync("src/lib/villages.ts", "utf8");
const re = /v\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*([^,]+),\s*"([^"]+)"/g;
const villages = [];
let m;
while ((m = re.exec(t))) {
  villages.push({
    name: m[1],
    region: m[2],
    county: m[3],
    blurb: m[5],
    slug: m[1]
      .toLowerCase()
      .replace(/['']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
  });
}
console.log("count", villages.length);
fs.writeFileSync("scripts/village-names.json", JSON.stringify(villages, null, 2));
