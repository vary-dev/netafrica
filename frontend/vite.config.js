import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendOrigin =
    env.VITE_BACKEND_ORIGIN ||
    "http://127.0.0.1:5000";

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: {
      proxy: {
        "/api": {
          target: backendOrigin,
          changeOrigin: true,
          configure(proxy) {
            proxy.on("error", (error) => {
              console.error(
                `[24/7Box proxy] Could not reach ${backendOrigin}:`,
                error.message
              );
            });
          },
        },
      },
    },
  };
});
