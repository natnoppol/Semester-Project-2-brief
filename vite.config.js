import { resolve } from "path";
import { defineConfig } from "vite";

import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  optimizeDeps: {
    include: ['swiper'],
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  appType: "mpa",
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./index.html"),
        login: resolve(__dirname, "./auth/login/index.html"),
        register: resolve(__dirname, "./auth/register/index.html"),
        profile: resolve(__dirname, "./profile/index.html"),
        createlisting: resolve(__dirname, "./listing/create/index.html"),
        // auth: resolve(__dirname, "./auth/index.html"),
        // post: resolve(__dirname, "./post/index.html"),
        // editPost: resolve(__dirname, "./post/edit/index.html"),
      },
    },
  },
});