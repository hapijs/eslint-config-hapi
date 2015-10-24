/* eslint-disable strict */
const foo = function () {
    return 'there should be a blank line before this line';
};

const bar = function () {

    return 'no lint errors';
};

foo();
bar();
