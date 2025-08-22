import { Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class WhatsNewPage extends BasePage {
    private readonly whatsNewTitle = "What\'s New";
    private readonly whatsNewUrl = "what-is-new.html";
    private readonly brasAndTanksLink: Locator;

    constructor(page: Page) {
        super(page);
        this.brasAndTanksLink = this.page.getByRole('link', { name: "Bras & Tanks" });
    }

    // ACTIONS
    async clickBrasAndTanksLink(): Promise<void> {
        await this.brasAndTanksLink.click();
    }

    // VERIFICATIONS
    async verifyWhatsNewPage(): Promise<void> {
        await Promise.all([
            this.verifyPageURL(this.whatsNewUrl),
            this.verifyPageTitle(this.whatsNewTitle)
        ]);
    }
}