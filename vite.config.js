import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/tvquevedo/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        show: resolve(__dirname, "show.html"),
      },
    },
  },
});
