// vite.config.js
import { defineConfig } from "file:///C:/Users/divye/Development/JS/Internship-CRM/main/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/divye/Development/JS/Internship-CRM/main/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { resolve } from "path";
import fs from "fs/promises";
import svgr from "file:///C:/Users/divye/Development/JS/Internship-CRM/main/node_modules/@svgr/rollup/dist/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
var __vite_injected_original_import_meta_url = "file:///C:/Users/divye/Development/JS/Internship-CRM/main/vite.config.js";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, "src")
    }
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
        ".ts": "tsx",
        ".jsx": "jsx",
        ".tsx": "tsx"
      },
      plugins: [
        {
          name: "load-js-files-as-jsx",
          setup(build) {
            build.onLoad({ filter: /src[\\\\].*\.js$/ }, async (args) => ({
              loader: "jsx",
              contents: await fs.readFile(args.path, "utf8")
            }));
          }
        }
      ]
    }
  },
  plugins: [
    svgr({
      exportAsDefault: true,
      svgrOptions: {
        icon: true,
        svgoConfig: {
          plugins: [
            {
              name: "removeViewBox",
              active: false
            }
          ]
        }
      }
    }),
    react()
  ],
  server: {
    port: 5173,
    open: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkaXZ5ZVxcXFxEZXZlbG9wbWVudFxcXFxKU1xcXFxJbnRlcm5zaGlwLUNSTVxcXFxtYWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkaXZ5ZVxcXFxEZXZlbG9wbWVudFxcXFxKU1xcXFxJbnRlcm5zaGlwLUNSTVxcXFxtYWluXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9kaXZ5ZS9EZXZlbG9wbWVudC9KUy9JbnRlcm5zaGlwLUNSTS9tYWluL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzL3Byb21pc2VzJztcclxuaW1wb3J0IHN2Z3IgZnJvbSAnQHN2Z3Ivcm9sbHVwJztcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XHJcbmltcG9ydCB7IGRpcm5hbWUgfSBmcm9tICdwYXRoJztcclxuXHJcbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCk7XHJcbmNvbnN0IF9fZGlybmFtZSA9IGRpcm5hbWUoX19maWxlbmFtZSk7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIHNyYzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBlc2J1aWxkOiB7XHJcbiAgICBsb2FkZXI6ICdqc3gnLFxyXG4gICAgaW5jbHVkZTogL3NyY1xcLy4qXFwuW2p0XXN4PyQvLFxyXG4gICAgZXhjbHVkZTogW10sXHJcbiAgfSxcclxuXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBlc2J1aWxkT3B0aW9uczoge1xyXG4gICAgICBsb2FkZXI6IHtcclxuICAgICAgICAnLmpzJzogJ2pzeCcsXHJcbiAgICAgICAgJy50cyc6ICd0c3gnLFxyXG4gICAgICAgICcuanN4JzogJ2pzeCcsXHJcbiAgICAgICAgJy50c3gnOiAndHN4JyxcclxuICAgICAgfSxcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6ICdsb2FkLWpzLWZpbGVzLWFzLWpzeCcsXHJcbiAgICAgICAgICBzZXR1cChidWlsZCkge1xyXG4gICAgICAgICAgICBidWlsZC5vbkxvYWQoeyBmaWx0ZXI6IC9zcmNbXFxcXFxcXFxdLipcXC5qcyQvIH0sIGFzeW5jIChhcmdzKSA9PiAoe1xyXG4gICAgICAgICAgICAgIGxvYWRlcjogJ2pzeCcsXHJcbiAgICAgICAgICAgICAgY29udGVudHM6IGF3YWl0IGZzLnJlYWRGaWxlKGFyZ3MucGF0aCwgJ3V0ZjgnKSxcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICBwbHVnaW5zOiBbXHJcbiAgICBzdmdyKHtcclxuICAgICAgZXhwb3J0QXNEZWZhdWx0OiB0cnVlLFxyXG4gICAgICBzdmdyT3B0aW9uczoge1xyXG4gICAgICAgIGljb246IHRydWUsXHJcbiAgICAgICAgc3Znb0NvbmZpZzoge1xyXG4gICAgICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogJ3JlbW92ZVZpZXdCb3gnLFxyXG4gICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICAgIHJlYWN0KCksXHJcbiAgXSxcclxuXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiA1MTczLFxyXG4gICAgb3BlbjogdHJ1ZSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVixTQUFTLG9CQUFvQjtBQUNoWCxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUNqQixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLGVBQWU7QUFOK0wsSUFBTSwyQ0FBMkM7QUFReFEsSUFBTSxhQUFhLGNBQWMsd0NBQWU7QUFDaEQsSUFBTSxZQUFZLFFBQVEsVUFBVTtBQUdwQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLFFBQVEsV0FBVyxLQUFLO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixTQUFTO0FBQUEsSUFDVCxTQUFTLENBQUM7QUFBQSxFQUNaO0FBQUEsRUFFQSxjQUFjO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxNQUNkLFFBQVE7QUFBQSxRQUNOLE9BQU87QUFBQSxRQUNQLE9BQU87QUFBQSxRQUNQLFFBQVE7QUFBQSxRQUNSLFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUDtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sTUFBTSxPQUFPO0FBQ1gsa0JBQU0sT0FBTyxFQUFFLFFBQVEsbUJBQW1CLEdBQUcsT0FBTyxVQUFVO0FBQUEsY0FDNUQsUUFBUTtBQUFBLGNBQ1IsVUFBVSxNQUFNLEdBQUcsU0FBUyxLQUFLLE1BQU0sTUFBTTtBQUFBLFlBQy9DLEVBQUU7QUFBQSxVQUNKO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ1AsS0FBSztBQUFBLE1BQ0gsaUJBQWlCO0FBQUEsTUFDakIsYUFBYTtBQUFBLFFBQ1gsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFVBQ1YsU0FBUztBQUFBLFlBQ1A7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxNQUFNO0FBQUEsRUFDUjtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
