import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";
import { CartItem } from "../model/types";

// WIP

export default class ShoppingCartPage extends BasePage {
    private readonly checkoutCartUrl = 'checkout/cart/';
    private readonly shoppingCartTitle = 'Shopping Cart';
    private readonly cartItemLocator: Locator;
    private readonly productTitle: Locator;
    private readonly productSize: Locator;
    private readonly productColor: Locator;
    private readonly productPrice: Locator;
    private readonly subtotal: Locator;
    private readonly productQuantity: Locator;
    private readonly summarySubtotal: Locator;
    private readonly orderTotal: Locator;
    private readonly proceedToCheckoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.cartItemLocator = page.locator('.cart.item');
        this.productTitle = this.cartItemLocator.locator('.col.item .product-item-name');
        this.productSize = this.cartItemLocator.locator('.col.item .item-options dd').first();
        this.productColor = this.cartItemLocator.locator('.col.item .item-options dd').last();
        this.productPrice = this.cartItemLocator.locator('.col.price .price-excluding-tax .price');
        this.subtotal = this.cartItemLocator.locator('.col.subtotal .price-excluding-tax .price');
        this.productQuantity = this.cartItemLocator.locator('.control.qty input');
        this.summarySubtotal = page.locator('.cart-summary .totals.sub .amount .price');
        this.orderTotal = page.locator('.cart-summary .grand.totals .price');
        this.proceedToCheckoutButton = page.getByRole('button', { name: "Proceed to Checkout" });
    }

    async clickProceedToCheckoutButton(): Promise<void> {
        await this.proceedToCheckoutButton.click();
    }

    async verifyShoppingCartItemData(item: CartItem): Promise<void> {
        const { name, size, color, price, subtotal, quantity = 1 } = item;
        await Promise.all([
            expect(this.productTitle).toContainText(name),
            expect(this.productSize).toHaveText(size, { ignoreCase: false }),
            expect(this.productColor).toHaveText(color),
            expect(this.productPrice).toContainText(`${price}`),
            expect(this.subtotal).toContainText(`${subtotal}`),
            expect(this.productQuantity).toHaveValue(`${quantity}`)
        ]);
    }

    async verifyShoppingCartSummaryData(subtotal: number): Promise<void> {
        await expect(this.summarySubtotal).toContainText(`${subtotal}`);
        await expect(this.orderTotal).toContainText(`${subtotal}`);
    }

    async verifyShoppingCartPage(): Promise<void> {
        await Promise.all([
            await this.verifyPageTitle(this.shoppingCartTitle),
            await this.verifyPageURL(this.checkoutCartUrl)
        ]);
    }
}