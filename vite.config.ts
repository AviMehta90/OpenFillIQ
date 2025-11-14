import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@common': resolve(__dirname, './src/common'),
      '@content': resolve(__dirname, './src/content'),
      '@background': resolve(__dirname, './src/background'),
      '@popup': resolve(__dirname, './src/popup'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background/index.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
        popup: resolve(__dirname, 'src/popup/popup.html'),
        options: resolve(__dirname, 'src/options/options.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Put HTML files in root, CSS in assets
          if (assetInfo.name?.endsWith('.html')) {
            return '[name][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
    minify: mode === 'production',
    sourcemap: mode === 'development',
  },
  plugins: [
    {
      name: 'copy-public-files',
      closeBundle() {
        const publicDir = resolve(__dirname, 'public');
        const distDir = resolve(__dirname, 'dist');

        // Copy manifest.json
        const manifestSrc = path.join(publicDir, 'manifest.json');
        const manifestDest = path.join(distDir, 'manifest.json');
        if (fs.existsSync(manifestSrc)) {
          fs.copyFileSync(manifestSrc, manifestDest);
        }

        // Copy icons directory if it exists
        const iconsSrc = path.join(publicDir, 'icons');
        const iconsDest = path.join(distDir, 'icons');
        if (fs.existsSync(iconsSrc)) {
          fs.mkdirSync(iconsDest, { recursive: true });
          const files = fs.readdirSync(iconsSrc);
          files.forEach((file) => {
            if (file.endsWith('.png')) {
              fs.copyFileSync(path.join(iconsSrc, file), path.join(iconsDest, file));
            }
          });
        }

        // Move HTML files to root (Vite puts them in nested paths)
        const htmlFiles = ['popup.html', 'options.html'];
        htmlFiles.forEach((file) => {
          const nestedPath = path.join(
            distDir,
            'src',
            file === 'popup.html' ? 'popup' : 'options',
            file
          );
          const rootPath = path.join(distDir, file);
          if (fs.existsSync(nestedPath)) {
            fs.copyFileSync(nestedPath, rootPath);
          }
        });

        // Clean up nested src directory
        const srcDir = path.join(distDir, 'src');
        if (fs.existsSync(srcDir)) {
          fs.rmSync(srcDir, { recursive: true, force: true });
        }
      },
    },
  ],
}));
