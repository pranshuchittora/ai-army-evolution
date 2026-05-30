import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
    },
  },
  resolve: {
    alias: {
      // vitest 不读 tsconfig 的 paths，这里手动把 @ 映射到 ./src
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
