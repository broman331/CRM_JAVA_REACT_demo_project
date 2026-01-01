import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: false, // Force serial to avoid DB races
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1, // Force 1 worker for shared DB
    reporter: 'html',
    timeout: 60000,
    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'api',
            testDir: './tests/api',
            use: {
                baseURL: 'http://localhost:9090', // Backend URL
                extraHTTPHeaders: {
                    'Content-Type': 'application/json',
                },
            },
            // DB Reset requires serial execution to prevent race conditions
            fullyParallel: false,
            workers: 1,
        },
    ],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
