const {By, until} = require('selenium-webdriver');

class Common {
    constructor(driver) {
        this.driver = driver;
    }

    async getPage(url) {
        await this.driver.get(url);
    }

    async getLinkToFirstProductFromCurrentPage() {
        const products = await this.driver.findElements(By.css('div[class="product-items-wrapper"] article[class="product-item "]'));
        const link = await products[0].findElement(By.css('a')).getAttribute('href');
        return link;
    }

    async openProductPage(link) {
        await this.driver.get(link);
    }
}

module.exports = {
    Common
}