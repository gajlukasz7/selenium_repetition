const {Builder} = require('selenium-webdriver');
const {expect} = require('chai');

const Common = require('./src/common').Common;
const ProductPage = require('./src/product_page').ProductPage;
const HomePage = require('./src/home_page').HomePage;
const ShoppingBasket = require('./src/shopping_basket').ShoppingBasket;


describe('morele.net test', async function() {
    this.timeout(0);
    let common;
    let productPage;
    let homePage;
    let shoppingBasket;

    before(async function() {
        const driver = await new Builder().forBrowser('chrome').build();
        common = new Common(driver);
        productPage = new ProductPage(driver);
        homePage = new HomePage(driver);
        shoppingBasket = new ShoppingBasket(driver);
    });

    it('Adds 3 products from given categories to cart and checks if they were properly added', async function() {
        const productLinks = {};
        let productInfo = [];
        
        await common.getPage('http://www2.hm.com/pl_pl/index.html');
        await homePage.closePrivacyPolicyModal();
        await homePage.closeCookiesModal();

        await homePage.clickMainMenuOption('ONA');
        await homePage.selectCategory('Kardigany i swetry');
        await homePage.selectSubcategory('Swetry');
        productLinks.first = await common.getLinkToFirstProductFromCurrentPage();

        await homePage.clickMainMenuOption('ON');
        await homePage.selectCategory('Koszule');
        await homePage.selectSubcategory('Na co dzień');
        productLinks.second = await common.getLinkToFirstProductFromCurrentPage();

        await homePage.clickMainMenuOption('DZIECKO');
        await homePage.selectCategory('Dziewczynki 8-14+ lat');
        await homePage.selectSubcategory('Bajki i komiksy');
        productLinks.third = await common.getLinkToFirstProductFromCurrentPage();

        await productPage.openProductPage(productLinks.first);
        await productPage.addProductToShoppingBasket('S');
        productInfo[0] = await productPage.getProductInfo();

        await productPage.openProductPage(productLinks.second);
        await productPage.addProductToShoppingBasket('M');
        productInfo[1] = await productPage.getProductInfo();

        await productPage.openProductPage(productLinks.third);
        await productPage.addProductToShoppingBasket('158/164');
        productInfo[2] = await productPage.getProductInfo();

        await shoppingBasket.open();
        const productsFromBasketInfo = await shoppingBasket.getProductsInfo();
        
        let totalPrice = 0;

        for(elem of productInfo) {
            totalPrice += parseFloat(elem.price.replace(/(\d*),(\d*)\sPLN/, '$1.$2'));
        }

        expect(productInfo).to.deep.equal(productsFromBasketInfo);
        expect(totalPrice.toFixed(2)).to.equal(await shoppingBasket.getTotalPrice());

    });
})