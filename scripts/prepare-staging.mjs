import { readFile, mkdir, rm, cp, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { stagingConfig, stagingEnvironment, stagingHostingConfig } from "./staging-config.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
try {
  const [file, mode] = process.argv.slice(2);
  if (!file || !["--check", "--build"].includes(mode)) {
    throw Error("Usage: npm run staging:prepare -- path/to/staging.json --check|--build");
  }
  const config = stagingConfig(JSON.parse(await readFile(file, "utf8")));
  if (mode === "--check") {
    console.log(`Valid staging configuration: ${config.projectId}. No cloud operations performed.`);
    process.exit(0);
  }
  // Invalidate any old artifact before starting; a failed build must not leave deployable stale output.
  await rm(new URL("../.staging", import.meta.url), { recursive: true, force: true });
  const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
    cwd: root, env: stagingEnvironment(config), stdio: "inherit",
  });
  if (result.error || result.status !== 0) throw Error("Staging build failed; no staging artifact generated.");
  const output = new URL("../.staging/", import.meta.url);
  await mkdir(output, { recursive: true });
  await cp(new URL("../out/", import.meta.url), new URL("out/", output), { recursive: true });
  // The legacy source worker intentionally stays untouched; only staging artifacts disable it.
  await writeFile(new URL("out/firebase-messaging-sw.js", output),
    '// Push notifications are disabled in isolated staging.\nself.addEventListener("install", () => self.skipWaiting());\n');
  await writeFile(new URL("out/robots.txt", output), "User-agent: *\nDisallow: /\n");
  await writeFile(new URL("firebase.json", output), JSON.stringify(stagingHostingConfig(), null, 2) + "\n");
  await writeFile(new URL("project.json", output), JSON.stringify({ projectId: config.projectId, publisherOrigin: config.publisherOrigin }, null, 2) + "\n");
  console.log(`Staging artifact ready in .staging for ${config.projectId}. Nothing deployed.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
