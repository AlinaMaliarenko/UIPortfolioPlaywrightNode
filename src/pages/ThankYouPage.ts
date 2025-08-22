import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

// WIP 
export default class ThankYouPage extends BasePage {
    private readonly checkoutSuccessUrl = "checkout/onepage/success/";
    private readonly successPageTitle = "Success Page";
    private readonly createAccountButton: Locator;
    private readonly continueButton: Locator;
    private readonly orderNumber: Locator;

    constructor(page: Page) {
        super(page);
        this.createAccountButton = this.page.locator("#registration .action.primary");
        this.continueButton = this.page.locator(".action.primary.continue");
        this.orderNumber = this.page.locator('//*[@class="checkout-success"]/p[contains(.,"Your order # is: ")]/span');
    }

    async getOrderNumber(): Promise<string> {
        return await this.orderNumber.innerText();
    }

    async clickCreateAccountButton(): Promise<void> {
        await this.createAccountButton.click();
    }

    async verifyThankYouPage(): Promise<void> {
        await Promise.all([
            this.verifyPageURL(this.checkoutSuccessUrl),
            this.verifyPageTitle(this.successPageTitle),
            expect(this.continueButton).toBeVisible(),
            expect(this.createAccountButton).toBeVisible(),
        ]);
    }
}