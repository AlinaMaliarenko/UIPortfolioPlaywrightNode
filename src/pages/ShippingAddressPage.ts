import { Locator, Page, expect } from "@playwright/test"
import { faker, fakerEN_US } from "@faker-js/faker";
import BasePage from "./BasePage";
import Person from "../model/types";

// WIP

export default class ShippingAddressPage extends BasePage {
    private readonly shippingUrl = "/checkout/#shipping";
    private readonly shippingAddressForm: Locator;
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
        this.emailInputField = page.locator('#customer-email-fieldset input[type="email"]');
        this.shippingAddressForm = page.locator('#shipping-new-address-form');
        this.firstNameInputField = this.shippingAddressForm.locator('[name="shippingAddress.firstname"] input');
        this.lastNameInputField = this.shippingAddressForm.locator('[name="shippingAddress.lastname"] input');
        this.streetInputField = this.shippingAddressForm.locator('[name="shippingAddress.street.0"] input');
        this.cityInputField = this.shippingAddressForm.locator('[name="shippingAddress.city"] input');
        this.regionDropDown = this.shippingAddressForm.locator('[name="shippingAddress.region_id"] select');
        this.countryDropDown = this.shippingAddressForm.locator('[name="shippingAddress.country_id"] select');
        this.zipInputField = this.shippingAddressForm.locator('[name="shippingAddress.postcode"] input');
        this.phoneInputField = this.shippingAddressForm.locator('[name="shippingAddress.telephone"] input');
        this.methodBestWay = page.locator('//*input[value="tablerate_bestway"]');
        this.methodBestWayPrice = this.methodBestWay.locator(`/parent::*//*[@class="price"][not(span)]`);
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
            }

            // Static country check
            await expect(this.countryDropDown).toHaveValue('US');
        };
    }

    async selectShippingMethodBestWay(): Promise<number> {
        const priceText = await this.methodBestWayPrice.innerText();
        const match = priceText.match(/\$([\d.]+)/);
        if (!match) throw new Error("Could not parse shipping price");
        console.log(`match : ${match}; ${match[0]} and ${match[1]}`);
        const shippingPrice = parseFloat(match[1]);
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