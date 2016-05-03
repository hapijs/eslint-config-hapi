/* eslint-disable strict */
module.exports.a = { ['0']: 0 };
module.exports.a = { ['0+1,234']: 0 };
module.exports.a = { [0]: 0 };
module.exports.a = { ['x']: 0 };
module.exports.a = { ['x']() {} };
