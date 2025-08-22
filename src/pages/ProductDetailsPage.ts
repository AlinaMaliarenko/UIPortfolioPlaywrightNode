import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class ProductDetailsPage extends BasePage {
    private readonly productName: Locator;
    private readonly sizeReflectsSelected: Locator;
    private readonly productPrice: Locator;
    private readonly addToCartButton: Locator;
    private readonly qtyField: Locator;
    private readonly addToWishlistButton: Locator;
    private readonly addToCompareButton: Locator;

    private getColorOptionByName = (colorName: string) => this.page.locator(`div[aria-label="${colorName}"]`);
    private getSizeOptionByName = (sizeName: string) => this.page.getByRole('option', { name: sizeName, exact: true });

    constructor(page: Page) {
        super(page);
        this.productName = page.locator('.product-info-main [itemprop="name"]');
        this.productPrice = page.locator('.product-info-main .normal-price .price');
        this.sizeReflectsSelected = page.locator('.swatch-attribute.size');
        this.addToCartButton = page.getByRole('button', { name: "Add to Cart" });
        this.qtyField = page.getByTitle("Qty");
        this.addToWishlistButton = page.getByRole('link', { name: "Add to Wish List" });
        this.addToCompareButton = page.getByRole('link', { name: "Add to Compare" });
    }

    // ACTIONS
    async getProductPrice(): Promise<number> {
        const priceText = await this.productPrice.textContent() ?? "";
        const numericPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        return numericPrice;
    }

    getExpectedSubTotalPrice(productPriceNumber: number, quantity: number = 1): number {
        return quantity > 1 ? productPriceNumber * quantity : productPriceNumber;
    }

    async getProductName(): Promise<string> {
        return await this.productName.textContent() ?? "";
    }

    async clickAddToCartButton(): Promise<void> {
        await this.addToCartButton.click();
    }

    async setQuantity(quantity: number): Promise<void> {
        await this.qtyField.fill(`${quantity}`);
    }

    async selectSizeByName(size: string): Promise<void> {
        const sizeLocator = this.getSizeOptionByName(size);
        await sizeLocator.click();
        await expect(this.sizeReflectsSelected).toHaveAttribute("option-selected", /.+/);
    }

    async selectColorByName(colorName: string): Promise<void> {
        const colorLocator = this.getColorOptionByName(colorName);
        await colorLocator.click();
        await expect(colorLocator).toHaveClass(/selected/);
    }

    // VERIFICATIONS
    async verifyProductDetailsPage(): Promise<void> {
        await this.page.waitForLoadState("domcontentloaded");
        await Promise.all([
            expect(this.addToCartButton).toBeVisible(),
            expect(this.addToWishlistButton).toBeVisible(),
            expect(this.addToCompareButton).toBeVisible()
        ]);
    }

}