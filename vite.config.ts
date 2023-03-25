import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// jsx support
import vueJsx from "@vitejs/plugin-vue-jsx";

// vite.config.ts
import UnoCSS from "unocss/vite";
import { presetUno, presetAttributify, presetIcons } from "unocss";
import transformerDirective from "@unocss/transformer-directives";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS({
      presets: [presetUno(), presetAttributify(), presetIcons()],
      transformers: [transformerDirective()],
    }),
  ],
});
