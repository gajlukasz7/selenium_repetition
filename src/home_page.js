const {By, until} = require('selenium-webdriver');

class HomePage {
    constructor(driver) {
        this.driver = driver;
    }

    async closePrivacyPolicyModal() {
        const modal = await this.driver.wait(until.elementLocated(By.css('div[class="modaloverlay responsive"]')));
        await this.driver.wait(until.elementIsVisible(modal));
        await this.driver.findElement(By.css('button[class="modalclose icon-close-black"]')).click();
    }

    async closeCookiesModal() {
        const modal = await this.driver.wait(until.elementLocated(By.css('div[class="cookie-notification js-notification js-cookie-notification"]')));
        await this.driver.wait(until.elementIsVisible(modal));
        await this.driver.findElement(By.css('button[class="close icon-close-white js-close"]')).click();
    }

    async clickMainMenuOption(menuLabel) {
        const menuElement = await this.driver.findElement(By.linkText(menuLabel));
        await this.driver.get(await menuElement.getAttribute('href'));
    }

    async selectCategory(categoryName) {
        const categories = await this.driver.findElements(By.css('li[class="section-menu-subdepartment "] a'));
        for (let elem of categories) {
            if (await elem.getText() === categoryName) {
                await this.driver.get(await elem.getAttribute('href'));
                return null;
            }
        }
        throw new Error('Category: ' + categoryName + ' not found');
    }

    async selectSubcategory(categoryName) {
        const categories = await this.driver.findElements(By.css('li[class="section-menu-subcategory "] a'));
        for (let elem of categories) {
            if (await elem.getText() === categoryName) {
                await this.driver.get(await elem.getAttribute('href'));
                return null;
            }
        }
        throw new Error('Category: ' + categoryName + ' not found');
    }
}

module.exports = {
    HomePage
}