const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const { mongoose } = require('./db/mongoose');
const Company = require('./models/company-model');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

app.get('/', async (req, res) => {
  const companies = await Company.find();
  const top10 = companies.splice(0, 10);

  res.json(top10);
});

const extractValues = () => {
  const values = document.querySelectorAll('.companies-container .tag-link');
  const arr = [];
  values.forEach(v => arr.push(v.innerText));

  return arr;
};

const cleanUpData = (raw) => {
  const data = raw.map(d => d.replace(/["'()]/g,''));
  const pristine = data.map(d => {
    const obj = {
      name: '',
      data: {
        value: '',
        date: ''
      }
    };

    obj.name = d.split(' ').slice(0, - 1).join(',').replace(/,/g, ' ');
    obj.data.value = d.split(' ').pop();
    obj.data.date = new Date();

    return obj;
  });

  return pristine;
};

const scrape = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.goto('http://berlinstartupjobs.com/');
  
  const content = await page.evaluate(extractValues);
  const companies = cleanUpData(content);

  await browser.close();

  for (company of companies) {
    const entry = await Company.findOne({ name: company.name });
  
    entry ? 
    await entry.update({ 
      $push: { data: company.data } 
    }) : await Company.create(company);
  }
};

scrape();

app.listen(port, () => {
  console.log(`Server up on port ${port}...`);
});