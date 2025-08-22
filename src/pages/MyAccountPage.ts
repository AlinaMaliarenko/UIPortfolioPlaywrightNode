import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";
import Person from "../model/types";

export default class MyAccountPage extends BasePage {
    private readonly myAccountTitle = "My Account";
    private readonly customerAccountUrl = "customer/account/";
    private readonly thankYouForRegisteringMessage: Locator;
    private readonly contactInfoContainer: Locator;
    private readonly billingAddressContainer: Locator;
    private readonly shippingAddressContainer: Locator;
    private readonly myOrderId: Locator;

    constructor(page: Page) {
        super(page);
        this.thankYouForRegisteringMessage = page.getByRole('alert').filter({ hasText: "Thank you for registering with Main Website Store." });
        this.contactInfoContainer = page.locator('.block.block-dashboard-info .box-content');
        this.billingAddressContainer = page.locator('.box.box-billing-address');
        this.shippingAddressContainer = page.locator('.box.box-shipping-address');
        this.myOrderId = page.locator('table#my-orders-table tbody .col.id');
    }

    // VERIFICATIONS

    async verifyMyOrderId(id: string): Promise<void> {
        await expect(this.myOrderId).toHaveText(id);
    }

    async verifyContactInfo(firstName: string, lastName: string, email: string): Promise<void> {
        await Promise.all([
            expect(this.contactInfoContainer).toContainText(firstName),
            expect(this.contactInfoContainer).toContainText(lastName),
            expect(this.contactInfoContainer).toContainText(email)
        ]);
    }

    async verifyBillingShippingData(expectedData: Person): Promise<void> {
        const { email, ...addressFields } = expectedData; // a.k.a. excluding email value

        const fieldsToVerify = [...Object.values(addressFields), "United States"];

        for (const field of fieldsToVerify) {
            await expect(this.billingAddressContainer).toContainText(field);
            await expect(this.shippingAddressContainer).toContainText(field);
        }
    }

    async verifyMyAccountPage(): Promise<void> {
        await Promise.all([
            this.verifyPageTitle(this.myAccountTitle),
            this.verifyPageURL(this.customerAccountUrl)
        ]);
    }

    async verifyThankYouForRegisteringMessage(): Promise<void> {
        await expect(this.thankYouForRegisteringMessage).toBeVisible();
    }
}