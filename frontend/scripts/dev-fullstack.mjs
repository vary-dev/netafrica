import net from "node:net";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");
const backendRoot = path.resolve(frontendRoot, "../backend");
const backendEntry = path.resolve(backendRoot, "server.js");
const viteEntry = path.resolve(
  frontendRoot,
  "node_modules/vite/bin/vite.js"
);

const BACKEND_HOST = "127.0.0.1";
const BACKEND_PORT = 5000;

function canConnect(host, port, timeout = 500) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });

    const finish = (value) => {
      socket.destroy();
      resolve(value);
    };

    socket.setTimeout(timeout);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

async function waitForBackend(maxAttempts = 24) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (await canConnect(BACKEND_HOST, BACKEND_PORT)) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  return false;
}

let backendProcess = null;
let viteProcess = null;

async function startBackendIfNeeded() {
  if (await canConnect(BACKEND_HOST, BACKEND_PORT)) {
    console.log(
      `[24/7Box] Backend already running at http://${BACKEND_HOST}:${BACKEND_PORT}`
    );
    return;
  }

  console.log("[24/7Box] Starting Node/MySQL backend...");

  backendProcess = spawn(
    process.execPath,
    [backendEntry],
    {
      cwd: backendRoot,
      stdio: "inherit",
      env: process.env,
    }
  );

  backendProcess.once("exit", (code) => {
    if (code && code !== 0) {
      console.error(
        `[24/7Box] Backend exited with code ${code}. Check backend/.env and MySQL.`
      );
    }
  });

  const ready = await waitForBackend();

  if (ready) {
    console.log(
      `[24/7Box] Backend is listening on http://${BACKEND_HOST}:${BACKEND_PORT}`
    );
  } else {
    console.warn(
      "[24/7Box] Backend did not become reachable. Vite will still start so you can inspect the UI and backend logs."
    );
  }
}

function startVite() {
  viteProcess = spawn(
    process.execPath,
    [viteEntry],
    {
      cwd: frontendRoot,
      stdio: "inherit",
      env: process.env,
    }
  );

  viteProcess.once("exit", (code) => {
    cleanup();
    process.exit(code ?? 0);
  });
}

function cleanup() {
  if (viteProcess && !viteProcess.killed) {
    viteProcess.kill("SIGTERM");
  }

  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill("SIGTERM");
  }
}

process.once("SIGINT", () => {
  cleanup();
  process.exit(0);
});

process.once("SIGTERM", () => {
  cleanup();
  process.exit(0);
});

await startBackendIfNeeded();
startVite();
