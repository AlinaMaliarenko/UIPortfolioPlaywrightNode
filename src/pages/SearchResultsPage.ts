import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class SearchResultsPage extends BasePage {
    private readonly FILTERS = {
        style: "Style",
        size: "Size",
        color: "Color"
    };

    private readonly FILTER_OPTIONS = {
        tankStyle: "Tank"
    };

    private readonly productItems: Locator;
    private readonly listOfAvailableColors: Locator;
    private readonly listOfAvailableSizes: Locator;
    private readonly appliedFilter: Locator;

    private getStyleOptionByName = (styleName: string) => this.page.locator('.filter-options-content a', { hasText: styleName });
    private getFilterByName = (filterName: string) => this.page.getByRole('tab', { name: filterName });
    private getAppliedFilterByLabel = (filterLabel: string) => this.appliedFilter.filter({ hasText: filterLabel });

    constructor(page: Page) {
        super(page);
        this.productItems = page.locator('.products.list.items.product-items .item.product.product-item');
        this.listOfAvailableColors = page.locator('a .swatch-option.color');
        this.listOfAvailableSizes = page.locator('.swatch-attribute.swatch-layered.size a div');
        this.appliedFilter = page.locator('.filter-current .filter-value');
    }


    // ACTIONS

    async verifyAppliedFilterByLabel(filterLabel: string): Promise<void> {
        await expect(this.getAppliedFilterByLabel(filterLabel)).toBeVisible();
    }

    async expandSizeFilteringOptions(): Promise<void> {
        await this.getFilterByName(this.FILTERS.size).click();
    }

    async selectFirstAvailableSize(): Promise<string> {
        await this.expandSizeFilteringOptions();

        const firstSizeOption = this.listOfAvailableSizes.first();
        const firstSizeLabel = await firstSizeOption.innerText();

        await Promise.all([
            firstSizeOption.click(),
            this.verifyAppliedFilterByLabel(firstSizeLabel)
        ]);

        return firstSizeLabel;
    }


    async expandStyleFilteringOptions(): Promise<void> {
        await this.getFilterByName(this.FILTERS.style).click();
    }

    async selectTankStyle(): Promise<void> {
        await this.expandStyleFilteringOptions();
        await Promise.all([
            this.getStyleOptionByName(this.FILTER_OPTIONS.tankStyle).click(),
            this.verifyAppliedFilterByLabel(this.FILTER_OPTIONS.tankStyle),
        ]);
    }

    async expandColorFilteringOptions(): Promise<void> {
        await this.getFilterByName(this.FILTERS.color).click();
    }

    async selectFirstAvailableColor(): Promise<string> {
        await this.expandColorFilteringOptions();

        const firstColorOption = this.listOfAvailableColors.first();
        const firstColorLabel = await firstColorOption.getAttribute("option-label");

        if (firstColorLabel === null) {
            throw new Error("option-label attribute is missing for firstColorOption")
        }

        await Promise.all([
            firstColorOption.click(),
            this.verifyAppliedFilterByLabel(firstColorLabel)
        ]);

        return firstColorLabel;
    }

    async clickFirstSearchResultProduct(): Promise<void> {
        await this.productItems.first().click();
    }

    // VERIFICATIONS
    async verifyAtLeastThreeProductsAvailable(): Promise<void> {
        expect(await this.productItems.count()).toBeGreaterThanOrEqual(3);
    }
}