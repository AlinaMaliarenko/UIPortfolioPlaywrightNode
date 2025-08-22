import { Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class HomePage extends BasePage {
    private readonly homePageTitle = 'Home Page';
    private readonly whatsNewLink: Locator;

    constructor(page: Page) {
        super(page);
        this.whatsNewLink = page.getByRole('menuitem', { name: "What\'s New" });
    }

    // ACTIONS

    async clickWhatsNew(): Promise<void> {
        await this.whatsNewLink.click();
    }

    // VERIFICATIONS

    async verifyHomePage(): Promise<void> {
        await this.verifyPageTitle(this.homePageTitle);
    }
}