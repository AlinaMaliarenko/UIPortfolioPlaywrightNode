import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";
import Person from "../model/types";

export default class PaymentMethodPage extends BasePage {
    private readonly checkoutPaymentUrl = "checkout/#payment";
    private readonly checkoutBillingContainer: Locator;
    private readonly orderSummaryBlock: Locator;
    private readonly addressDataContainer: Locator;
    private readonly cartSubtotal: Locator;
    private readonly shippingTotal: Locator;
    private readonly orderTotal: Locator;
    private readonly billingShippingAddressSameCheckbox: Locator;
    private readonly placeOrderButton: Locator;

    constructor(page: Page) {
        super(page);
        this.checkoutBillingContainer = page.locator('.checkout-billing-address');
        this.addressDataContainer = this.checkoutBillingContainer.locator('.billing-address-details');
        this.billingShippingAddressSameCheckbox = this.checkoutBillingContainer.locator(".billing-address-same-as-shipping-block.field.choice input");
        this.orderSummaryBlock = page.locator('.opc-block-summary');
        this.cartSubtotal = this.orderSummaryBlock.locator(`.totals.sub .amount .price`);
        this.shippingTotal = this.orderSummaryBlock.locator(`.totals.shipping .amount .price`);
        this.orderTotal = this.orderSummaryBlock.locator(`.grand.totals .price`);
        this.placeOrderButton = page.getByRole("button", { name: "Place Order" });
    }

    // ACTIONS

    async clickPlaceOrderButton(): Promise<void> {
        await this.placeOrderButton.click();
    }

    // VERIFICATIONS

    async verifyPaymentMethodUrl(): Promise<void> {
        await this.page.waitForLoadState("load");
        await this.verifyPageURL(this.checkoutPaymentUrl);
    }

    async verifyBillingShippingAddressSameChecked(): Promise<void> {
        await expect(this.billingShippingAddressSameCheckbox).toBeChecked();
    }

    async verifyCartSubtotal(numberValue: number): Promise<void> {
        await expect(this.cartSubtotal).toContainText(`${numberValue}`);
    }

    async verifyOrderTotal(subtotal: number, shippingPrice: number): Promise<void> {
        const orderTotal = (subtotal * 100 + shippingPrice * 100) / 100;
        await (expect(this.orderTotal).toContainText(`${orderTotal}`));
    }

    async verifyCartShippingPrice(shippingPrice: number): Promise<void> {
        await expect(this.shippingTotal).toContainText(`${shippingPrice}`);
    }

    async verifyShippingData(expectedData: Person): Promise<void> {
        const { email, ...addressFields } = expectedData; // a.k.a. excluding email value

        const fieldsToVerify = [...Object.values(addressFields), "United States"];

        for (const field of fieldsToVerify) {
            await expect(this.addressDataContainer).toContainText(field);
        }
    }
}