const i18n = require('./filters/i18n.js');

module.exports = {
  eleventyComputed: {
    title: (data) => {
      let str = i18n(data.title)
      //console.log(str)
      return str;
    },
    metaDesc: (data) => {
      return i18n(data.metaDesc);
    },
  },
};
