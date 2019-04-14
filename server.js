const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const Company = require('./models/company-model');

const crawl = require('./lib/crawler').crawl;

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

app.get('/', async (req, res) => {
    const companies = await Company.find();
    const top10 = companies.splice(0, 10);

    res.json(top10);
});

crawl();

app.listen(port, () => {
    console.log(`Server up on port ${port}...`);
});