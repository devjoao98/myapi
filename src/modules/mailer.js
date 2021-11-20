const path = require('path');
const nodemailer = require('nodemailer')
const hbs = require("nodemailer-express-handlebars")

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "2678963ec42b34",
    pass: "ccbb852e4d5c75"
  },
})

transport.use('compile', hbs({
  viewEngine: 'handlebars',
  viewPath: path.join(__dirname, '..', 'resources', 'mail'),
  extName: '.html',
}))

module.exports = transport