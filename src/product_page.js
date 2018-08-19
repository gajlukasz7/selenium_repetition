const {By, until} = require('selenium-webdriver');
const util = require('util');

class ProductPage {
    constructor(driver) {
        this.driver = driver;
    }

    async openProductPage(URL) {
        await this.driver.get(URL);
    }

    async addProductToShoppingBasket(size) {
        await this.selectSize(size);
        const shoppingBasketItemCountElement = await this.driver.findElement(By.css('span[class="shoppingbag-item-count"]'));
        const shoppingBasketItemCountText = await shoppingBasketItemCountElement.getText();
        const expectedProductCount = parseInt(shoppingBasketItemCountText) + 1;
        await this.driver.findElement(By.css('span[class="icon icon-shopping-bag-white"]')).click();
        await this.driver.wait(until.elementTextIs(shoppingBasketItemCountElement, expectedProductCount.toString()), 15000);
    }

    async selectSize(size) {
        await this.driver.findElement(By.css('button[class^="trigger-button"]')).click();
        await util.promisify(setTimeout)(1000);        
        const sizes = await this.driver.findElements(By.css('button[class="option"]'));
        for (let elem of sizes) {
            if (await elem.getText() === size) {
                await elem.click();
                await util.promisify(setTimeout)(1000);
                return null;
            }
        }
        throw new Error('Size: ' + size + ' is not avilable');
    }

    async getProductInfo() {
        const productInfo = {};
        productInfo.size = await this.driver.findElement(By.css('button[class^="trigger-button"]')).getText();
        productInfo.name = await this.driver.findElement(By.css('h1[class="primary product-item-headline"]')).getText();
        productInfo.color = await this.driver.findElement(By.css('h3[class="product-input-label"]')).getText();
        productInfo.price = await this.driver.findElement(By.css('span[class="price-value"]')).getText();
        productInfo.productNumber = await this.driver.findElement(By.css('div[class="pdp-description-list"] h4[class="art_no"]+ul')).getText();
        return productInfo;
    }
}


module.exports = { 
    ProductPage
}