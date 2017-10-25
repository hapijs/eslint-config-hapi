'use strict';
const Fs = require('fs');
const Path = require('path');
const Code = require('code');
const ESLint = require('eslint');
const Lab = require('lab');
const Config = require('../lib');
const CLIEngine = ESLint.CLIEngine;

// Test shortcuts
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;

Code.settings.truncateMessages = false;

function getLinter (config) {
  return new CLIEngine({
    useEslintrc: false,
    baseConfig: config || Config
  });
}

function lintFile (file, config) {
  const cli = getLinter(config);
  const data = Fs.readFileSync(Path.join(__dirname, file), 'utf8');

  return cli.executeOnText(data);
}

describe('eslint-config-hapi', () => {
  it('enforces file level strict mode', (done) => {
    const output = lintFile('fixtures/strict.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(1);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(1);
    expect(results.warningCount).to.equal(0);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('strict');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Use the global form of \'use strict\'.');
    expect(msg.line).to.equal(2);
    expect(msg.column).to.equal(1);
    expect(msg.nodeType).to.equal('Program');
    expect(msg.source).to.equal('const foo = \'this should be using strict mode but isnt\';');
    done();
  });

  it('enforces stroustrup style braces', (done) => {
    const output = lintFile('fixtures/brace-style.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(0);
    expect(output.warningCount).to.equal(1);
    expect(results.errorCount).to.equal(0);
    expect(results.warningCount).to.equal(1);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('brace-style');
    expect(msg.severity).to.equal(1);
    expect(msg.message).to.equal('Closing curly brace appears on the same line as the subsequent block.');
    expect(msg.line).to.equal(9);
    expect(msg.column).to.equal(1);
    expect(msg.nodeType).to.equal('Punctuator');
    expect(msg.source).to.equal('} else {');
    done();
  });

  it('enforces four space indentation', (done) => {
    const output = lintFile('fixtures/indent.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(1);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(1);
    expect(results.warningCount).to.equal(0);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('indent');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Expected indentation of 4 spaces but found 2.');
    expect(msg.line).to.equal(4);
    expect(msg.column).to.equal(1);
    expect(msg.nodeType).to.equal('Keyword');
    expect(msg.source).to.equal('  return value + 1;');
    done();
  });

  it('enforces case indentation in switch statements', (done) => {
    const output = lintFile('fixtures/indent-switch-case.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(5);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(5);
    expect(results.warningCount).to.equal(0);

    let msg = results.messages[0];

    expect(msg.ruleId).to.equal('indent');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Expected indentation of 4 spaces but found 0.');
    expect(msg.line).to.equal(10);
    expect(msg.column).to.equal(1);
    expect(msg.nodeType).to.equal('Keyword');
    expect(msg.source).to.equal('case \'bar\':');

    msg = results.messages[1];

    expect(msg.ruleId).to.equal('indent');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Expected indentation of 8 spaces but found 4.');
    expect(msg.line).to.equal(11);
    expect(msg.column).to.equal(1);
    expect(msg.nodeType).to.equal('Identifier');
    expect(msg.source).to.equal('    result = 2;');

    msg = results.messages[2];

    expect(msg.ruleId).to.equal('indent');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Expected indentation of 8 spaces but found 4.');
    expect(msg.line).to.equal(12);
    expect(msg.column).to.equal(1);
    expect(msg.nodeType).to.equal('Keyword');
    expect(msg.source).to.equal('    break;');

    msg = results.messages[3];

    expect(msg.ruleId).to.equal('indent');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Expected indentation of 8 spaces but found 4.');
    expect(msg.line).to.equal(14);
    expect(msg.column).to.equal(1);
    expect(msg.nodeType).to.equal('Identifier');
    expect(msg.source).to.equal('    result = 3;');

    msg = results.messages[4];

    expect(msg.ruleId).to.equal('indent');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Expected indentation of 8 spaces but found 4.');
    expect(msg.line).to.equal(15);
    expect(msg.column).to.equal(1);
    expect(msg.nodeType).to.equal('Keyword');
    expect(msg.source).to.equal('    break;');

    done();
  });

  it('enforces semicolon usage', (done) => {
    const output = lintFile('fixtures/semi.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(1);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(1);
    expect(results.warningCount).to.equal(0);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('semi');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Missing semicolon.');
    expect(msg.line).to.equal(4);
    expect(msg.column).to.equal(14);
    expect(msg.nodeType).to.equal('ReturnStatement');
    expect(msg.source).to.equal('    return 42');
    done();
  });

  it('enforces space-before-function-paren', (done) => {
    const output = lintFile('fixtures/space-before-function-paren.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(2);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(2);
    expect(results.warningCount).to.equal(0);

    let msg = results.messages[0];

    expect(msg.ruleId).to.equal('space-before-function-paren');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Missing space before function parentheses.');
    expect(msg.line).to.equal(8);
    expect(msg.column).to.equal(21);
    expect(msg.nodeType).to.equal('FunctionExpression');
    expect(msg.source).to.equal('const bar = function() {');

    msg = results.messages[1];

    expect(msg.ruleId).to.equal('space-before-function-paren');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Unexpected space before function parentheses.');
    expect(msg.line).to.equal(16);
    expect(msg.column).to.equal(27);
    expect(msg.nodeType).to.equal('FunctionExpression');
    expect(msg.source).to.equal('const quux = function quux () {');
    done();
  });

  it('enforces hapi/hapi-for-you', (done) => {
    const output = lintFile('fixtures/hapi-for-you.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(0);
    expect(output.warningCount).to.equal(2);
    expect(results.errorCount).to.equal(0);
    expect(results.warningCount).to.equal(2);

    let msg = results.messages[0];

    expect(msg.ruleId).to.equal('hapi/hapi-for-you');
    expect(msg.severity).to.equal(1);
    expect(msg.message).to.equal('Expected iterator \'j\', but got \'k\'.');
    expect(msg.line).to.equal(6);
    expect(msg.column).to.equal(5);
    expect(msg.nodeType).to.equal('ForStatement');
    expect(msg.source).to.equal('    for (let k = 0; k < arr.length; k++) {');

    msg = results.messages[1];

    expect(msg.ruleId).to.equal('hapi/hapi-for-you');
    expect(msg.severity).to.equal(1);
    expect(msg.message).to.equal('Update to iterator should use prefix operator.');
    expect(msg.line).to.equal(6);
    expect(msg.column).to.equal(5);
    expect(msg.nodeType).to.equal('ForStatement');
    expect(msg.source).to.equal('    for (let k = 0; k < arr.length; k++) {');
    done();
  });

  it('enforces hapi/hapi-scope-start', (done) => {
    const output = lintFile('fixtures/hapi-scope-start.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(0);
    expect(output.warningCount).to.equal(1);
    expect(results.errorCount).to.equal(0);
    expect(results.warningCount).to.equal(1);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('hapi/hapi-scope-start');
    expect(msg.severity).to.equal(1);
    expect(msg.message).to.equal('Missing blank line at beginning of function.');
    expect(msg.line).to.equal(2);
    expect(msg.column).to.equal(13);
    expect(msg.nodeType).to.equal('FunctionExpression');
    expect(msg.source).to.equal('const foo = function () {');
    done();
  });

  it('enforces hapi/hapi-capitalize-modules', (done) => {
    const output = lintFile('fixtures/hapi-capitalize-modules.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(0);
    expect(output.warningCount).to.equal(1);
    expect(results.errorCount).to.equal(0);
    expect(results.warningCount).to.equal(1);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('hapi/hapi-capitalize-modules');
    expect(msg.severity).to.equal(1);
    expect(msg.message).to.equal('Imported module variable name not capitalized.');
    expect(msg.line).to.equal(4);
    expect(msg.column).to.equal(7);
    expect(msg.nodeType).to.equal('VariableDeclarator');
    expect(msg.source).to.equal('const net = require(\'net\');');
    done();
  });

  it('enforces hapi/no-arrowception', (done) => {
    const output = lintFile('fixtures/no-arrowception.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(1);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(1);
    expect(results.warningCount).to.equal(0);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('hapi/no-arrowception');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Arrow function implicitly creates arrow function.');
    expect(msg.line).to.equal(2);
    expect(msg.column).to.equal(13);
    expect(msg.nodeType).to.equal('ArrowFunctionExpression');
    expect(msg.source).to.equal('const foo = () => () => 85;');
    done();
  });

  it('enforces no-shadow rule', (done) => {
    const output = lintFile('fixtures/no-shadow.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(0);
    expect(output.warningCount).to.equal(1);
    expect(results.errorCount).to.equal(0);
    expect(results.warningCount).to.equal(1);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('no-shadow');
    expect(msg.severity).to.equal(1);
    expect(msg.message).to.equal('\'res\' is already declared in the upper scope.');
    expect(msg.line).to.equal(27);
    expect(msg.column).to.equal(33);
    expect(msg.nodeType).to.equal('Identifier');
    expect(msg.source).to.equal('        const inner = function (res) {');
    done();
  });

  it('enforces one-var rule', (done) => {
    const output = lintFile('fixtures/one-var.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(1);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(1);
    expect(results.warningCount).to.equal(0);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('one-var');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Split \'let\' declarations into multiple statements.');
    expect(msg.line).to.equal(5);
    expect(msg.column).to.equal(1);
    expect(msg.nodeType).to.equal('VariableDeclaration');
    expect(msg.source).to.equal('let baz, quux;');
    done();
  });

  it('enforces no-undef rule', (done) => {
    lintFile('fixtures/no-undef.js');
    const output = lintFile('fixtures/no-undef.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(1);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(1);
    expect(results.warningCount).to.equal(0);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('no-undef');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('\'bar\' is not defined.');
    expect(msg.line).to.equal(5);
    expect(msg.column).to.equal(17);
    expect(msg.nodeType).to.equal('Identifier');
    expect(msg.source).to.equal('    const baz = bar;');
    done();
  });

  it('enforces no-unused-vars', (done) => {
    const output = lintFile('fixtures/no-unused-vars.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(0);
    expect(output.warningCount).to.equal(1);
    expect(results.errorCount).to.equal(0);
    expect(results.warningCount).to.equal(1);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('no-unused-vars');
    expect(msg.severity).to.equal(1);
    expect(msg.message).to.match(/'internals2' is assigned a value but never used\./);
    expect(msg.line).to.equal(3);
    expect(msg.column).to.equal(7);
    expect(msg.nodeType).to.equal('Identifier');
    expect(msg.source).to.equal('const internals2 = {};');
    done();
  });

  it('enforces prefer-const', (done) => {
    const output = lintFile('fixtures/prefer-const.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(1);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(1);
    expect(results.warningCount).to.equal(0);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('prefer-const');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('\'foo\' is never reassigned. Use \'const\' instead.');
    expect(msg.line).to.equal(4);
    expect(msg.column).to.equal(5);
    expect(msg.nodeType).to.equal('Identifier');
    expect(msg.source).to.equal('let foo = 1;');
    done();
  });

  it('enforces hapi/hapi-no-var', (done) => {
    const output = lintFile('fixtures/no-var.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(1);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(1);
    expect(results.warningCount).to.equal(0);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('hapi/hapi-no-var');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Unexpected var, use let or const instead.');
    expect(msg.line).to.equal(3);
    expect(msg.column).to.equal(1);
    expect(msg.nodeType).to.equal('VariableDeclaration');
    expect(msg.source).to.equal('var foo = 1;');
    done();
  });

  it('enforces arrow-parens', (done) => {
    const output = lintFile('fixtures/arrow-parens.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(1);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(1);
    expect(results.warningCount).to.equal(0);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('arrow-parens');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Expected parentheses around arrow function argument.');
    expect(msg.line).to.equal(2);
    expect(msg.column).to.equal(13);
    expect(msg.nodeType).to.equal('ArrowFunctionExpression');
    expect(msg.source).to.equal('const foo = bar => {');
    done();
  });

  it('enforces arrow-spacing', (done) => {
    const output = lintFile('fixtures/arrow-spacing.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(2);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(2);
    expect(results.warningCount).to.equal(0);

    let msg = results.messages[0];
    expect(msg.ruleId).to.equal('arrow-spacing');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Missing space before =>.');
    expect(msg.line).to.equal(2);
    expect(msg.column).to.equal(17);
    expect(msg.nodeType).to.equal('Punctuator');
    expect(msg.source).to.equal('const foo = (bar)=> {');

    msg = results.messages[1];
    expect(msg.ruleId).to.equal('arrow-spacing');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Missing space after =>.');
    expect(msg.line).to.equal(7);
    expect(msg.column).to.equal(22);
    expect(msg.nodeType).to.equal('Punctuator');
    expect(msg.source).to.equal('const baz = (quux) =>{');
    done();
  });

  it('enforces object-shorthand', (done) => {
    const output = lintFile('fixtures/object-shorthand.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(1);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(1);
    expect(results.warningCount).to.equal(0);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('object-shorthand');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Expected property shorthand.');
    expect(msg.line).to.equal(10);
    expect(msg.column).to.equal(5);
    expect(msg.nodeType).to.equal('Property');
    expect(msg.source).to.equal('    b: b,');
    done();
  });

  it('enforces prefer-arrow-callback', (done) => {
    const output = lintFile('fixtures/prefer-arrow-callback.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(1);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(1);
    expect(results.warningCount).to.equal(0);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('prefer-arrow-callback');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Unexpected function expression.');
    expect(msg.line).to.equal(21);
    expect(msg.column).to.equal(8);
    expect(msg.nodeType).to.equal('FunctionExpression');
    expect(msg.source).to.equal('foo(4, function (err, value) {');
    done();
  });

  it('enforces no-constant-condition rule', (done) => {
    const output = lintFile('fixtures/no-constant-condition.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(1);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(1);
    expect(results.warningCount).to.equal(0);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('no-constant-condition');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Unexpected constant condition.');
    expect(msg.line).to.equal(3);
    expect(msg.column).to.equal(1);
    expect(msg.nodeType).to.equal('IfStatement');
    expect(msg.source).to.equal('if ((foo) => 1) {');
    done();
  });

  it('enforces no-unsafe-finally rule', (done) => {
    const output = lintFile('fixtures/no-unsafe-finally.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(1);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(1);
    expect(results.warningCount).to.equal(0);

    const msg = results.messages[0];

    expect(msg.ruleId).to.equal('no-unsafe-finally');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Unsafe usage of ReturnStatement.');
    expect(msg.line).to.equal(12);
    expect(msg.column).to.equal(9);
    expect(msg.nodeType).to.equal('ReturnStatement');
    expect(msg.source).to.equal('        return 3;');
    done();
  });

  it('enforces no-useless-computed-key rule', (done) => {
    const output = lintFile('fixtures/no-useless-computed-key.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(5);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(5);
    expect(results.warningCount).to.equal(0);

    let msg = results.messages[0];

    expect(msg.ruleId).to.equal('no-useless-computed-key');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Unnecessarily computed property [\'0\'] found.');
    expect(msg.line).to.equal(2);
    expect(msg.column).to.equal(22);
    expect(msg.nodeType).to.equal('Property');
    expect(msg.source).to.equal('module.exports.a = { [\'0\']: 0 };');

    msg = results.messages[1];

    expect(msg.ruleId).to.equal('no-useless-computed-key');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Unnecessarily computed property [\'0+1,234\'] found.');
    expect(msg.line).to.equal(3);
    expect(msg.column).to.equal(22);
    expect(msg.nodeType).to.equal('Property');
    expect(msg.source).to.equal('module.exports.a = { [\'0+1,234\']: 0 };');

    msg = results.messages[2];

    expect(msg.ruleId).to.equal('no-useless-computed-key');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Unnecessarily computed property [0] found.');
    expect(msg.line).to.equal(4);
    expect(msg.column).to.equal(22);
    expect(msg.nodeType).to.equal('Property');
    expect(msg.source).to.equal('module.exports.a = { [0]: 0 };');

    msg = results.messages[3];

    expect(msg.ruleId).to.equal('no-useless-computed-key');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Unnecessarily computed property [\'x\'] found.');
    expect(msg.line).to.equal(5);
    expect(msg.column).to.equal(22);
    expect(msg.nodeType).to.equal('Property');
    expect(msg.source).to.equal('module.exports.a = { [\'x\']: 0 };');

    msg = results.messages[4];

    expect(msg.ruleId).to.equal('no-useless-computed-key');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Unnecessarily computed property [\'x\'] found.');
    expect(msg.line).to.equal(6);
    expect(msg.column).to.equal(22);
    expect(msg.nodeType).to.equal('Property');
    expect(msg.source).to.equal('module.exports.a = { [\'x\']() {} };');
    done();
  });

  it('enforces handle-callback-err rule', (done) => {
    const output = lintFile('fixtures/handle-callback-err.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(2);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(2);
    expect(results.warningCount).to.equal(0);

    let msg = results.messages[0];

    expect(msg.ruleId).to.equal('handle-callback-err');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Expected error to be handled.');
    expect(msg.line).to.equal(6);
    expect(msg.column).to.equal(17);
    expect(msg.nodeType).to.equal('FunctionExpression');
    expect(msg.source).to.equal('    const top = function (err) {');

    msg = results.messages[1];

    expect(msg.ruleId).to.equal('handle-callback-err');
    expect(msg.severity).to.equal(2);
    expect(msg.message).to.equal('Expected error to be handled.');
    expect(msg.line).to.equal(8);
    expect(msg.column).to.equal(23);
    expect(msg.nodeType).to.equal('FunctionExpression');
    expect(msg.source).to.equal('        const inner = function (e) {');

    done();
  });

  it('uses the node environment', (done) => {
    const output = lintFile('fixtures/node-env.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(0);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(0);
    expect(results.warningCount).to.equal(0);
    expect(results.messages).to.equal([]);
    done();
  });

  it('uses the ES6 environment', (done) => {
    const output = lintFile('fixtures/es6-env.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(0);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(0);
    expect(results.warningCount).to.equal(0);
    expect(results.messages).to.equal([]);
    done();
  });

  it('does not enforce the camelcase lint rule', (done) => {
    const output = lintFile('fixtures/camelcase.js');
    const results = output.results[0];

    expect(output.errorCount).to.equal(0);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(0);
    expect(results.warningCount).to.equal(0);
    expect(results.messages).to.equal([]);
    done();
  });
});
