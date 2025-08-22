import { Page } from "@playwright/test";
import SearchResultsPage from "./SearchResultsPage";

export default class BrasAndTanksPage extends SearchResultsPage {
    private readonly brasAndTanksTitle = "Bras & Tanks - Tops - Women";
    private readonly brasAndTanksURL = "women/tops-women/tanks-women.html";

    constructor(page: Page) {
        super(page);
    }

    async verifyBrasAndTanksPage(): Promise<void> {
        await Promise.all([
            this.verifyPageTitle(this.brasAndTanksTitle),
            this.verifyPageURL(this.brasAndTanksURL),
            this.verifyAtLeastThreeProductsAvailable()]);
    }
}