### DEPLOY TO HEROKU

* `$ git push heroku master`

* `$ heroku addons:create mongolab:sandbox`

* `$ git push heroku master`

* Add puppeteer heroku buildpack: `$ heroku buildpacks:add https://github.com/jontewks/puppeteer-heroku-buildpack`

* `$ git commit --allow-empty -m "Add puppeteer heroku buildpack"`

* `$ git push heroku master`