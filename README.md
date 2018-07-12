### DEPLOY TO HEROKU

* `$ git push heroku master`

* `$ heroku addons:create mongolab:sandbox`

* `$ git push heroku master`

* Add puppeteer heroku buildpack: `$ heroku buildpacks:add https://github.com/jontewks/puppeteer-heroku-buildpack`

* `$ git commit --allow-empty -m "Add puppeteer heroku buildpack"`

* `$ git push heroku master`

### Run in DEV mode

`npm install`
`node server.js`

In another window:
`npm start`

### Prod build (for deployments)

You need to run the build command first:

`npm run build`

`NODE_ENV=production node server.js`
