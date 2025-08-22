import test from "@playwright/test";
import ShippingAddressPage from "../src/pages/ShippingAddressPage";
import HomePage from "../src/pages/HomePage";
import WhatsNewPage from "../src/pages/WhatsNewPage";
import BrasAndTanksPage from "../src/pages/BrasAndTanksPage";
import ProductDetailsPage from "../src/pages/ProductDetailsPage";
import MiniCart from "../src/pages/MiniCart";
import ShoppingCartPage from "../src/pages/ShoppingCartPage";
import PaymentMethodPage from "../src/pages/PaymentMethodPage";
import ThankYouPage from "../src/pages/ThankYouPage";
import CreateNewCustomerAccountPage from "../src/pages/CreateNewCustomerAccountPage";
import MyAccountPage from "../src/pages/MyAccountPage";
import { blockAds } from "../src/helpers/network";

test.beforeEach(async ({ page }) => {
    await blockAds(page);
});

test('User should be able to place the Order and Create an Account', async ({ page }, testInfo) => {
    await page.goto("")
    const homePage = new HomePage(page)
    await homePage.verifyHomePage()

    // 1. Go to "What's new" page > click "Bras & Tanks" link
    await homePage.clickWhatsNew()
    const whatsNewPage = new WhatsNewPage(page)
    await whatsNewPage.verifyWhatsNewPage()
    await whatsNewPage.clickBrasAndTanksLink()

    // 2. On "Bras & Tanks" page apply some Filter options...
    const brasAndTanksPage = new BrasAndTanksPage(page)
    await brasAndTanksPage.verifyBrasAndTanksPage()

    await brasAndTanksPage.selectTankStyle()
    const firstSize = await brasAndTanksPage.selectFirstAvailableSize()
    const firstColor = await brasAndTanksPage.selectFirstAvailableColor()

    // ... and click 1st Product on filtered Search Result Page
    await brasAndTanksPage.clickFirstSearchResultProduct()

    // 3. Product Details Page: set Size, Color and Qty > click Add to Cart
    const productDetailsPage = new ProductDetailsPage(page)
    await productDetailsPage.verifyProductDetailsPage()
    await productDetailsPage.selectSizeByName(firstSize)
    await productDetailsPage.selectColorByName(firstColor)

    const productPrice = await productDetailsPage.getProductPrice()
    const expectedSubtotal = productDetailsPage.getExpectedSubTotalPrice(productPrice)
    const productName = await productDetailsPage.getProductName()

    await productDetailsPage.clickAddToCartButton()
    await productDetailsPage.verifySuccessAddToCartMessage()
    await productDetailsPage.verifyUpdatedMiniCartCounter()

    // 4. Expand Mini-cart and verify correct Product data  

    await productDetailsPage.expandMiniCart()

    const miniCart = new MiniCart(page)
    await miniCart.verifyMiniCartWithExpectedData(productPrice, expectedSubtotal)

    // 5. Mini-Cart: proceed to Shopping Cart Page
    await miniCart.clickViewAndEditCartLink()
    const shoppingCartPage = new ShoppingCartPage(page)
    await shoppingCartPage.verifyShoppingCartPage()

    // 6. Shopping Cart Page: verify correct Product data and "Proceed to Checkout"
    await shoppingCartPage.verifyShoppingCartItemData({
        name: productName,
        size: firstSize,
        color: firstColor,
        price: productPrice,
        subtotal: expectedSubtotal
    })

    await shoppingCartPage.verifyShoppingCartSummaryData(expectedSubtotal)
    await shoppingCartPage.clickProceedToCheckoutButton()

    // 7. Shipping Address Page: fill in all required fields and select "Shipping Methods" > click Next
    const shippingAddressPage = new ShippingAddressPage(page)
    const person = ShippingAddressPage.generatePerson()
    await shippingAddressPage.verifyShippingPageUrl()
    await shippingAddressPage.fillShippingAddress(person)
    const shippingPrice = await shippingAddressPage.selectShippingMethodBestWay()
    await shippingAddressPage.clickNextButton()

    // 8. Payment Method Page: verify Shipping and Product data and "Place Order"
    const paymentMethodPage = new PaymentMethodPage(page)
    await paymentMethodPage.verifyBillingShippingAddressSameChecked()
    await paymentMethodPage.verifyShippingData(person)

    await paymentMethodPage.verifyCartSubtotal(expectedSubtotal)
    await paymentMethodPage.verifyCartShippingPrice(shippingPrice)
    await paymentMethodPage.verifyOrderTotal(expectedSubtotal, shippingPrice)

    await paymentMethodPage.clickPlaceOrderButton()

    // 9. On "Thank you for your purchase!" page click "Create an Account" button
    const thankYouPage = new ThankYouPage(page)
    await thankYouPage.verifyThankYouPage()
    const orderNumber = await thankYouPage.getOrderNumber()
    await thankYouPage.clickCreateAccountButton()

    // 10. Verify that on Create New Customer Account page previously entered data are pre-filled
    const createNewAccountPage = new CreateNewCustomerAccountPage(page)
    await createNewAccountPage.verifyCreateNewCustomerAccountPage()
    await createNewAccountPage.verifyPrefilledPersonData(person.firstName, person.lastName, person.email)

    // 11. Set Password and click "Create Account"
    const pass = await createNewAccountPage.fillInPassword()
    await createNewAccountPage.fillInConfirmPassword(pass)
    await createNewAccountPage.clickCreateAccountButton()

    // collect important test data
    const testData = {
        customerEmail: person.email,
        orderNumber,
        generatedPassword: pass
    };

    await testInfo.attach('test data', {
        body: JSON.stringify(testData, null, 2),
        contentType: 'application/json'
    });

    // 12. My Account page: verify that all data are correctly saved and order's number is displayed in Recent Orders section
    const myAccountPage = new MyAccountPage(page)
    await myAccountPage.verifyMyAccountPage()
    await myAccountPage.verifyThankYouForRegisteringMessage()

    await myAccountPage.verifyContactInfo(person.firstName, person.lastName, person.email)
    await myAccountPage.verifyBillingShippingData(person)
    await myAccountPage.verifyMyOrderId(orderNumber)
});

