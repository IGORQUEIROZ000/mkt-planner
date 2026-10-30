import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./e2e',timeout:120000,workers:1,use:{baseURL:'http://127.0.0.1:4173',channel:process.env.PLAYWRIGHT_CHANNEL||undefined},webServer:{command:'node e2e/static-server.mjs',port:4173,reuseExistingServer:!process.env.CI}});




