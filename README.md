<a href="http://hapijs.com"><img src="https://raw.githubusercontent.com/hapijs/assets/master/images/family.png" width="180px" align="right" /></a>

# @hapi/eslint-config-hapi

[![Build Status](https://travis-ci.org/hapijs/eslint-config-hapi.svg?branch=master)](https://travis-ci.org/hapijs/eslint-config-hapi)

Shareable ESLint config for the hapi ecosystem. To use in your project, add `@hapi/eslint-config-hapi` and [`@hapi/eslint-plugin-hapi`](https://github.com/hapijs/eslint-plugin-hapi) to your `package.json`, then in your ESLint configuration add:

```
{
  "extends": "@hapi/eslint-config-hapi"
}
```

**Note:** `@hapi/eslint-plugin-hapi` is a plugin containing custom hapi linting rules. It is a peer dependency because of the way ESLint handles shareable configs that include plugins and custom rules (see [eslint/eslint#3458](https://github.com/eslint/eslint/issues/3458) and [eslint/eslint#2518](https://github.com/eslint/eslint/issues/2518) for more background).
