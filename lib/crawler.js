const puppeteer = require('puppeteer');
const Company = require('../models/company-model');

const crawl = async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    await page.goto('http://berlinstartupjobs.com/');
    
    const content = await page.evaluate(extractValues);
    const companies = cleanUpData(content);

    await save(companies);

    await browser.close();
};

const save = async (companies) => {
    for (company of companies) {
        const entry = await Company.findOne({ name: company.name });
  
        entry ? 
            await entry.update({ $push: { data: company.data } }) : 
            await Company.create(company);
    }
}

const extractValues = () => {
    const values = document.querySelectorAll('.companies-container .tag-link');
    const arr = [];
    values.forEach(value => arr.push(value.innerText));
  
    return arr;
};

const cleanUpData = (raw) => {
    const data = raw.map(companyToValue => companyToValue.replace(/["'()]/g,''));
    const pristine = data.map(companyToValue => {
        const obj = createTemplate();
        obj.name = companyToValue.split(' ').slice(0, - 1).join(',').replace(/,/g, ' ');
        obj.data.value = companyToValue.split(' ').pop();
        obj.data.date = new Date();
    
        return obj;
    });

    return pristine;
};

const createTemplate = () => {
    return {
        name: '',
        data: {
          value: '',
          date: ''
        }
      };
}

module.exports = { crawl };