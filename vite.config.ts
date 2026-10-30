import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import {VitePWA} from 'vite-plugin-pwa';
export default defineConfig({base:'./',define:{__APP_BUILD__:JSON.stringify(process.env.MKT_BUILD_ID??'1.2.0')},plugins:[react(),tailwind(),VitePWA({registerType:'prompt',includeAssets:['icon.svg'],manifest:{name:'MKT Planner | Igor Queiroz',short_name:'MKT Planner',description:'Planejamento editorial local e offline',theme_color:'#0D0D0D',background_color:'#F5F5F5',display:'standalone',start_url:'./',scope:'./',icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}]},workbox:{skipWaiting:false,clientsClaim:false,cleanupOutdatedCaches:false,globPatterns:['**/*.{js,css,html,svg,png,ico,woff2}'],navigateFallback:'index.html'}})],test:{environment:'jsdom',setupFiles:['./tests/setup.ts'],include:['tests/**/*.test.{ts,tsx}']}});

