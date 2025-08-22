import { expect, Locator, Page } from "@playwright/test";

export default class BasePage {
    protected page: Page;
    private readonly successAddToCartMessage: Locator;
    private readonly miniCartProductCounter: Locator;
    private readonly miniCartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.successAddToCartMessage = this.page.locator('.message-success.success.message');
        this.miniCartLink = this.page.locator('.action.showcart');
        this.miniCartProductCounter = this.miniCartLink.locator('.counter-number');
    }

    // ACTIONS

    async expandMiniCart(): Promise<void> {
        await this.miniCartLink.click();
    }

    // VERIFICATIONS

    async verifyPageTitle(title: string): Promise<void> {
        await expect(this.page).toHaveTitle(title);
    }

    async verifyPageURL(url: string): Promise<void> {
        await expect(this.page).toHaveURL(url);
    }

    async verifySuccessAddToCartMessage(): Promise<void> {
        await expect(this.successAddToCartMessage).toBeVisible();
    }

    async verifyUpdatedMiniCartCounter(expectedProductCount: number = 1): Promise<void> {
        await expect(this.miniCartProductCounter).toContainText(`${expectedProductCount}`);
    }
}