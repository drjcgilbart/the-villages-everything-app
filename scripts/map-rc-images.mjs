import fs from "fs";
const t = fs.readFileSync("src/lib/recCenters.ts", "utf8");
const villageBlock = t.match(/const VILLAGE_MINI[\s\S]*?= \[([\s\S]*?)\];/)[1];
const ids = [...villageBlock.matchAll(/id: "([^"]+)"/g)].map((m) => m[1]);
const imgs = [
  "/graphics/rec-centers/village-a.jpg",
  "/graphics/rec-centers/village-b.jpg",
  "/graphics/rec-centers/village-c.jpg",
  "/graphics/rec-centers/village-d.jpg",
];
const targets = ["chula-vista", "churchill-street", "canal-street", "burnsed", "caroline"];
for (const id of targets) {
  const i = ids.indexOf(id);
  console.log(id, "index", i, "->", imgs[i % 4], "fileIndex", i % 4);
}
// list all on village-a and village-d
for (let k = 0; k < 4; k++) {
  const users = ids.filter((_, i) => i % 4 === k);
  console.log("village-" + String.fromCharCode(97 + k), users.join(", "));
}
