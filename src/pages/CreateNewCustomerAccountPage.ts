import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";
import { faker } from "@faker-js/faker";

export default class CreateNewCustomerAccountPage extends BasePage {
    private readonly createNewCustomerAccHeader = 'Create New Customer Account';
    private readonly createCustomerAccUrl = 'customer/account/create/';
    private readonly formInputField: Locator;
    private readonly emailInputField: Locator;
    private readonly firstNameInputField: Locator;
    private readonly lastNameInputField: Locator;
    private readonly passwordInputField: Locator;
    private readonly confirmPasswordInputField: Locator;
    private readonly createAccountButton: Locator;

    constructor(page: Page) {
        super(page);
        this.formInputField = page.locator('.form.create.account.form-create-account');
        this.emailInputField = this.formInputField.locator('input[type="email"]');
        this.firstNameInputField = this.formInputField.locator('#firstname');
        this.lastNameInputField = this.formInputField.locator('#lastname');
        this.passwordInputField = this.formInputField.locator('#password');
        this.confirmPasswordInputField = this.formInputField.locator('#password-confirmation');
        this.createAccountButton = this.formInputField.locator('button[title="Create an Account"]');
    }

    // ACTIONS
    generatePassword(length: number = 8): string {
        const specialChars = '!@#$%^&*()_-+=<>?/';
        const lower = faker.string.alpha({ casing: 'lower', length: 1 });
        const upper = faker.string.alpha({ casing: 'upper', length: 1 });
        const digit = faker.string.numeric(1);
        const special = specialChars.charAt(faker.number.int({ min: 0, max: specialChars.length - 1 }));

        // Fill remaining length randomly
        const remaining = Array.from({ length: length - 4 }, () => {
            const all = lower + upper + digit + special;
            return all.charAt(faker.number.int({ min: 0, max: all.length - 1 }));
        });

        const passwordArray = [lower, upper, digit, special, ...remaining];
        return faker.helpers.shuffle(passwordArray).join('');
    }

    async clickCreateAccountButton(): Promise<void> {
        await this.createAccountButton.click();
    }

    async fillInPassword(): Promise<string> {
        const randomPassword = this.generatePassword();
        await this.passwordInputField.fill(randomPassword);
        return randomPassword;
    }

    async fillInConfirmPassword(password: string): Promise<void> {
        await this.confirmPasswordInputField.fill(password);
    }

    // VERIFICATIONS

    async verifyPrefilledPersonData(firstName: string, lastName: string, email: string): Promise<void> {
        await Promise.all([
            expect(this.firstNameInputField).toHaveValue(firstName),
            expect(this.lastNameInputField).toHaveValue(lastName),
            expect(this.emailInputField).toHaveValue(email)
        ]);
    }

    async verifyCreateNewCustomerAccountPage(): Promise<void> {
        await Promise.all([
            this.verifyPageTitle(this.createNewCustomerAccHeader),
            this.verifyPageURL(this.createCustomerAccUrl)
        ]);
    }
}