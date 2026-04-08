import { promises as fs } from "node:fs";
import path from "node:path";

const facultyPath = path.join(process.cwd(), "data", "store.json");

export async function getFaculty() {
  const raw = await fs.readFile(facultyPath, "utf-8");
  const data = JSON.parse(raw);
  return data.faculty || [];
}
