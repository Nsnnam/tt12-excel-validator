/** Tạo một HTML tự chứa để chạy từ ổ đĩa; ponytail: không tạo pipeline đóng gói thứ hai. */
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, renameSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const stage = resolve(root, "releases", ".offline-stage");
const releaseDir = resolve(root, "releases");
const singleDir = resolve(root, "releases", "single-page");
const packageMeta = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const output = resolve(releaseDir, `TT12-Excel-Validator-v${packageMeta.version}-offline.html`);
const singleOutput = resolve(singleDir, "tt12-excel-validator.html");

rmSync(stage, { recursive: true, force: true });
mkdirSync(stage, { recursive: true });
mkdirSync(releaseDir, { recursive: true });
mkdirSync(singleDir, { recursive: true });

const pnpmCmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const res = spawnSync(pnpmCmd, ["exec", "vite", "build", "--base=./", "--outDir", stage], {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: { ...process.env, VITE_NSN_OFFLINE: "1", NSN_OFFLINE: "1" },
});
if (res.status) {
  process.exit(res.status);
}

const html = readFileSync(resolve(stage, "index.html"), "utf8");
if (/\.\/assets\//.test(html) || /src="\.\//.test(html)) throw new Error("Không thể nội tuyến toàn bộ asset cho bản HTML offline.");
renameSync(resolve(stage, "index.html"), output);
copyFileSync(output, singleOutput);
rmSync(stage, { recursive: true, force: true });
console.log(`Đã tạo HTML offline: ${output}`);
console.log(`Đã tạo single-page HTML: ${singleOutput}`);
