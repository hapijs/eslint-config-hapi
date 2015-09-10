'use strict';
var Fs = require('fs');
var Path = require('path');
var Code = require('code');
var ESLint = require('eslint');
var Lab = require('lab');
var Config = require('../lib');
var CLIEngine = ESLint.CLIEngine;

// Test shortcuts
var lab = exports.lab = Lab.script();
var expect = Code.expect;
var describe = lab.describe;
var it = lab.it;

Code.settings.truncateMessages = false;

function getLinter() {
  return new CLIEngine({
    useEslintrc: false,
    baseConfig: Config
  });
}

function lintFile(file) {
  var cli = getLinter();
  var data = Fs.readFileSync(Path.join(__dirname, file), 'utf8');

  return cli.executeOnText(data);
}

function lintString(str) {
  var cli = getLinter();

  return cli.executeOnText(str);
}

describe('eslint-config-hapi', function () {
  it('enforces four space indentation', function (done) {
    var output = lintFile('fixtures/indent.js');
    var results = output.results[0];

    expect(output.errorCount).to.equal(1);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(1);
    expect(results.warningCount).to.equal(0);
    expect(results.messages).to.deep.equal([{
      ruleId: 'indent',
      severity: 2,
      message: 'Expected indentation of 4 space characters but found 2.',
      line: 3,
      column: 3,
      nodeType: 'ReturnStatement',
      source: '  return value + 1;'
    }]);
    done();
  });

  it('enforces case indentation in switch statements', function (done) {
    var output = lintFile('fixtures/indent-switch-case.js');
    var results = output.results[0];

    expect(output.errorCount).to.equal(5);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(5);
    expect(results.warningCount).to.equal(0);
    expect(results.messages).to.deep.equal([
      {
        ruleId: 'indent',
        severity: 2,
        message: 'Expected indentation of 4 space characters but found 0.',
        line: 9,
        column: 1,
        nodeType: 'SwitchCase',
        source: 'case \'bar\':'
      },
      {
        ruleId: 'indent',
        severity: 2,
        message: 'Expected indentation of 8 space characters but found 4.',
        line: 10,
        column: 5,
        nodeType: 'ExpressionStatement',
        source: '    result = 2;'
      },
      {
        ruleId: 'indent',
        severity: 2,
        message: 'Expected indentation of 8 space characters but found 4.',
        line: 11,
        column: 5,
        nodeType: 'BreakStatement',
        source: '    break;'
      },
      {
        ruleId: 'indent',
        severity: 2,
        message: 'Expected indentation of 8 space characters but found 4.',
        line: 13,
        column: 5,
        nodeType: 'ExpressionStatement',
        source: '    result = 3;'
      },
      {
        ruleId: 'indent',
        severity: 2,
        message: 'Expected indentation of 8 space characters but found 4.',
        line: 14,
        column: 5,
        nodeType: 'BreakStatement',
        source: '    break;'
      }
    ]);
    done();
  });

  it('enforces semicolon usage', function (done) {
    var output = lintFile('fixtures/semi.js');
    var results = output.results[0];

    expect(output.errorCount).to.equal(1);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(1);
    expect(results.warningCount).to.equal(0);
    expect(results.messages).to.deep.equal([{
      ruleId: 'semi',
      severity: 2,
      message: 'Missing semicolon.',
      line: 3,
      column: 14,
      nodeType: 'ReturnStatement',
      source: '    return 42'
    }]);
    done();
  });

  it('enforces hapi/hapi-scope-start', function (done) {
    var output = lintFile('fixtures/hapi-scope-start.js');
    var results = output.results[0];

    expect(output.errorCount).to.equal(0);
    expect(output.warningCount).to.equal(1);
    expect(results.errorCount).to.equal(0);
    expect(results.warningCount).to.equal(1);
    expect(results.messages).to.deep.equal([{
      ruleId: 'hapi/hapi-scope-start',
      severity: 1,
      message: 'Missing blank line at beginning of function.',
      line: 1,
      column: 11,
      nodeType: 'FunctionExpression',
      source: 'var foo = function () {'
    }]);
    done();
  });

  it('enforces hapi/no-shadow-relaxed', function (done) {
    var output = lintFile('fixtures/no-shadow-relaxed.js');
    var results = output.results[0];

    expect(output.errorCount).to.equal(0);
    expect(output.warningCount).to.equal(1);
    expect(results.errorCount).to.equal(0);
    expect(results.warningCount).to.equal(1);
    expect(results.messages).to.deep.equal([{
      ruleId: 'hapi/no-shadow-relaxed',
      severity: 1,
      message: 'res is already declared in the upper scope.',
      line: 27,
      column: 31,
      nodeType: 'Identifier',
      source: '        var inner = function (res) {'
    }]);
    done();
  });

  it('uses the node environment', function (done) {
    var output = lintFile('fixtures/node-env.js');
    var results = output.results[0];

    expect(output.errorCount).to.equal(0);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(0);
    expect(results.warningCount).to.equal(0);
    expect(results.messages).to.deep.equal([]);
    done();
  });

  it('uses the ES6 environment', function (done) {
    // Do this as a string to prevent problems during testing on old versions of Node
    var output = lintString('module.exports = `__filename = ${__filename}`;\n');
    var results = output.results[0];

    expect(output.errorCount).to.equal(0);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(0);
    expect(results.warningCount).to.equal(0);
    expect(results.messages).to.deep.equal([]);
    done();
  });

  it('does not enforce the camelcase lint rule', function (done) {
    var output = lintFile('fixtures/camelcase.js');
    var results = output.results[0];

    expect(output.errorCount).to.equal(0);
    expect(output.warningCount).to.equal(0);
    expect(results.errorCount).to.equal(0);
    expect(results.warningCount).to.equal(0);
    expect(results.messages).to.deep.equal([]);
    done();
  });
});
