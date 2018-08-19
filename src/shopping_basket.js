const {By, until} = require ('selenium-webdriver');

class ShoppingBasket{
    constructor (driver) {
        this.driver = driver;
    }

    async open() {
        const shoppingBasketURL = await this.driver.findElement(By.css('a[class="goto-shopping-bag rollover-toggle"]')).getAttribute('href');
        await this.driver.get(shoppingBasketURL);
    }

    async getProductsInfo() {
        let productsInfo = [];
        await this.driver.wait(until.elementLocated(By.css('li[class="product-detail-list-item ng-scope"]')));
        const productsWebElements = await this.driver.findElements(By.css('li[class="product-detail-list-item ng-scope"]'));
        for (let i = 0; i < productsWebElements.length; i++) {
            productsInfo[i] = {};
            productsInfo[i].size = await productsWebElements[i].findElement(By.css('dl[class="product-detail-list-item-details-list"] dd[class="ng-binding"]:nth-child(6)')).getText();
            productsInfo[i].name = await productsWebElements[i].findElement(By.css('h3[class="sub-sub-heading ng-binding"]')).getText();
            productsInfo[i].price = await productsWebElements[i].findElement(By.css('p[class="product-detail-price ng-binding"]')).getText();
            productsInfo[i].productNumber = await productsWebElements[i].findElement(By.css('dl[class="product-detail-list-item-details-list"] dd[class="ng-binding"]:nth-child(2)')).getText();
            //Color in product description is given in capital letters and in shopping basket it's given as normal string
            let color = await productsWebElements[i].findElement(By.css('dl[class="product-detail-list-item-details-list"] dd[class="ng-binding"]:nth-child(4)')).getText();                    
            productsInfo[i].color = color.toUpperCase();
        }
        return productsInfo;
    }

    async getTotalPrice() {
        const totalPrice = await this.driver.findElement(By.css('#newPriceSubtotal')).getText();
        return totalPrice.replace(/(\d*),(\d*)\sPLN/, '$1.$2');
    }

}

module.exports = {
    ShoppingBasket
}