import { defineConfig } from 'vite';
import Terser from '@rollup/plugin-terser';

export default defineConfig({
	base: '/',
    esbuild: {
    target: 'es2022'
  }, build: {

    minify: 'terser',
    rollupOptions: {
			output:{
			entryFileNames: "jatlab.min.js"	
		}, 
        plugins: [
        // Configure Terser or other minification plugin
        Terser()
      ]
      },
        target: 'es2022'
    }
});