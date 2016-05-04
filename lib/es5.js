'use strict';
var Path = require('path');

module.exports = {
  extends: Path.join(__dirname, 'index.js'),
  rules: {
    'no-var': 'off',
    'prefer-arrow-callback': 'off'
  }
};
