import fs from "fs";

export function loadCSV(path) {
  const raw = fs.readFileSync(path, "utf-8");
  const lines = raw.split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).filter(Boolean).map(line => {
    const values = line.split(",");
    let obj = {};
    headers.forEach((h, i) => obj[h] = values[i]);
    return obj;
  });
}
