import fs from "fs";
const t = fs.readFileSync("src/lib/recCenters.ts", "utf8");
const nb = t.match(/const NEIGHBORHOOD_MINI[\s\S]*?= \[([\s\S]*?)\];/)[1];
const ids = [...nb.matchAll(/id: "([^"]+)"/g)].map((m) => m[1]);
const imgs = [
  "/graphics/rec-centers/neighborhood-a-sq.jpg",
  "/graphics/rec-centers/neighborhood-b-sq.jpg",
  "/graphics/rec-centers/neighborhood-c-sq.jpg",
];
for (const id of ["caroline", "clarendon", "alden-bungalows", "amelia", "ashland"]) {
  const i = ids.indexOf(id);
  console.log(id, "idx", i, "->", imgs[i % 3]);
}
// also list which regional images might differ
const reg = [...t.matchAll(/id: "([^"]+)"[\s\S]*?image: "([^"]+)"/g)].slice(0, 20);
