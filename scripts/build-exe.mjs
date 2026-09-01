/** Đóng gói máy chủ tĩnh và UI thành EXE Windows portable; không yêu cầu cài Node.js trên máy đích. */
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const version = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")).version;
const output = resolve(root, "releases", `TT12-Excel-Validator-v${version}-win-x64.exe`);
mkdirSync(resolve(root, "releases"), { recursive: true });

const pnpmCmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
spawnSync(pnpmCmd, ["build"], { cwd: root, stdio: "inherit", shell: true });
spawnSync(pnpmCmd, ["exec", "pkg", "--targets", "node22-win-x64", "--output", output, "dist/index.js"], { cwd: root, stdio: "inherit", shell: true });
console.log(`Đã tạo EXE portable: ${output}`);
