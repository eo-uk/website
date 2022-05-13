const locales = require('./locales');

module.exports = {
  locale: locales.filter((locale) => locale.code == process.env.LOCALE)[0],
  url: 'https://geolytix.com',
  name: 'Geolytix',
};
