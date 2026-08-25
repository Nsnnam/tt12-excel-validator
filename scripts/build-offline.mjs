/** Tạo một HTML tự chứa để chạy từ ổ đĩa; ponytail: không tạo pipeline đóng gói thứ hai. */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, renameSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const stage = resolve(root, "releases", ".offline-stage");
const releaseDir = resolve(root, "releases");
const packageMeta = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const output = resolve(releaseDir, `TT12-Excel-Validator-v${packageMeta.version}-offline.html`);

rmSync(stage, { recursive: true, force: true });
mkdirSync(stage, { recursive: true });
execFileSync("pnpm", ["exec", "vite", "build", "--base=./", "--outDir", stage], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, VITE_NSN_OFFLINE: "1", NSN_OFFLINE: "1" },
});

const html = readFileSync(resolve(stage, "index.html"), "utf8");
if (/\.\/assets\//.test(html) || /src="\.\//.test(html)) throw new Error("Không thể nội tuyến toàn bộ asset cho bản HTML offline.");
renameSync(resolve(stage, "index.html"), output);
rmSync(stage, { recursive: true, force: true });
console.log(`Đã tạo HTML offline: ${output}`);
