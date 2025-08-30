import { Locator, Page, expect } from "@playwright/test"
import { faker, fakerEN_US } from "@faker-js/faker";
import BasePage from "./BasePage";
import Person from "../model/types";

// WIP

export default class ShippingAddressPage extends BasePage {
    private readonly shippingUrl = "/checkout/#shipping";
    private readonly emailInputField: Locator;
    private readonly firstNameInputField: Locator;
    private readonly lastNameInputField: Locator;
    private readonly streetInputField: Locator;
    private readonly cityInputField: Locator;
    private readonly regionDropDown: Locator;
    private readonly countryDropDown: Locator;
    private readonly zipInputField: Locator;
    private readonly phoneInputField: Locator;
    private readonly methodBestWay: Locator;
    private readonly methodBestWayPrice: Locator;
    private readonly nextButton: Locator;

    constructor(page: Page) {
        super(page);
        this.emailInputField = page.getByRole('textbox', { name: 'Email Address * Email Address' });
        this.firstNameInputField = page.getByRole('textbox', { name: 'First Name *' });
        this.lastNameInputField = page.getByRole('textbox', { name: 'Last Name *' });
        this.streetInputField = page.getByRole('textbox', { name: 'Street Address: Line 1' });
        this.cityInputField = page.getByRole('textbox', { name: 'City *' });
        this.regionDropDown = page.locator('select[name="region_id"]');
        this.countryDropDown = page.locator('select[name="country_id"]');
        this.zipInputField = page.getByRole('textbox', { name: 'Zip/Postal Code *' });
        this.phoneInputField = page.getByRole('textbox', { name: 'Phone Number *' });
        this.methodBestWay = page.getByRole('radio', { name: 'Table Rate Best Way' });
        this.methodBestWayPrice = this.methodBestWay
            .locator("..")
            .locator(":scope +td")
            .locator(".price .price");
        this.nextButton = page.getByRole('button', { name: "Next" });
    }

    static generatePerson(): Person {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = `${firstName}.${lastName}@example.com`.toLowerCase();

        return {
            firstName, lastName, email,
            address: faker.location.streetAddress(),
            region: fakerEN_US.location.state(),
            city: fakerEN_US.location.city(),
            zip: faker.location.zipCode(),
            phone: faker.phone.number()
        };
    }

    // ACTIONS
    private async fillInField(field: Locator, value: string): Promise<void> {
        await field.fill(value);
        await expect(field).toHaveValue(value);
    }

    async fillShippingAddress(person: Person): Promise<void> {
        const fieldMap: Record<keyof Person, Locator> = {
            email: this.emailInputField,
            firstName: this.firstNameInputField,
            lastName: this.lastNameInputField,
            address: this.streetInputField,
            city: this.cityInputField,
            region: this.regionDropDown,
            zip: this.zipInputField,
            phone: this.phoneInputField,
        };

        for (const [key, value] of Object.entries(person)) {
            if (key === 'country' || value == null) continue; // skip undefined/null 

            if (key === 'region') {
                await this.regionDropDown.selectOption({ label: value })
            } else {
                await this.fillInField(fieldMap[key as keyof Person], value)
            };

            // Static country check
            await expect(this.countryDropDown).toHaveValue('US');
        };
    }

    async selectShippingMethodBestWay(): Promise<number> {
        const priceText = await this.methodBestWayPrice.innerText();
        const shippingPrice = parseFloat(priceText.replace(/[^0-9.]/g, ""));
        await this.methodBestWay.click();
        return shippingPrice;
    }

    async clickNextButton(): Promise<void> {
        await this.nextButton.click();
    }

    // VERIFICATIONS
    async verifyShippingPageUrl(): Promise<void> {
        await this.verifyPageURL(this.shippingUrl);
    }
}