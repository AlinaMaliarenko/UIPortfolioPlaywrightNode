import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class MiniCart extends BasePage {
    private readonly proceedToCheckoutButton: Locator;
    private readonly viewAndEditCartLink: Locator;
    private readonly itemsTotalCount: Locator;
    private readonly subTotalPrice: Locator;
    private readonly productPrice: Locator;

    constructor(page: Page) {
        super(page);
        this.proceedToCheckoutButton = page.getByRole('button', { name: "Proceed to Checkout" });
        this.viewAndEditCartLink = page.getByRole('link').locator('span', { hasText: "View and Edit Cart" });
        this.itemsTotalCount = page.locator('.items-total .count');
        this.subTotalPrice = page.locator('.subtotal .price');
        this.productPrice = page.locator('.minicart-price .price');
    }

    // ACTIONS

    async clickViewAndEditCartLink(): Promise<void> {
        await this.viewAndEditCartLink.click();
    }

    // VERIFICATIONS

    async verifyMiniCartWithExpectedData(productPrice: number, subtotal: number, quantity: number = 1): Promise<void> {
        await Promise.all([
            expect(this.itemsTotalCount).toContainText(`${quantity}`),
            expect(this.productPrice).toContainText(`${productPrice}`),
            expect(this.subTotalPrice).toContainText(`${subtotal}`),

            expect(this.proceedToCheckoutButton).toBeVisible(),
            expect(this.viewAndEditCartLink).toBeVisible()
        ]);
    }
}