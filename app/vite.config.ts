import { defineConfig } from "vite";
import { createRequire } from "module";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import cesium from "vite-plugin-cesium";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    // optimizeDeps: {
    //     include: ["cesium"], //lmw add 5 构建cesium.js
    // },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            // "@cesium": path.resolve( "cesium/Source"),
            // 需要将 Cesium 资源路径指向正确的位置
            // cesium: path.resolve("cesium/Source"),
            // cesium: path.resolve(__dirname, "src/assets/Build/Cesium/Cesium.js"),
        },
    },
    css: {
        // 禁用 CSS 提取以避免与 Cesium 的样式冲突
        extract: false,
    },
    plugins: [vue(),   vueJsx(),cesium()],
});
