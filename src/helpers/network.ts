import { Page } from "playwright/test"

export async function blockAds(page: Page): Promise<void> {
    await page.route('**/*', route => {
        const url = route.request().url();
        if (url.includes('ads') || url.includes('doubleclick.net') || url.includes('googlesyndication.com')) {
            route.abort();
        } else {
            route.continue();
        }
    });
}