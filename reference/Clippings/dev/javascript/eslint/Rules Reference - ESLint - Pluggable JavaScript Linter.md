---
title: "Rules Reference - ESLint - Pluggable JavaScript Linter"
source: "https://eslint.org/docs/latest/rules/"
author:
published:
created: 2026-04-11
description: "A pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript. Maintain your code quality with ease."
tags:
  - "clippings"
---
## Rules Reference

Rules in ESLint are grouped by type to help you understand their purpose. Each rule has emojis denoting:

🔧

Some problems reported by this rule are automatically fixable by the `--fix` [command line](https://eslint.org/docs/latest/use/command-line-interface#--fix) option

💡

Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions)

❄️

This rule is currently [frozen](https://eslint.org/docs/latest/contribute/core-rules#frozen-rules) and is not accepting feature requests.

## Possible Problems

These rules relate to possible logic errors in code:

[array-callback-return](https://eslint.org/docs/latest/rules/array-callback-return)

Enforce `return` statements in callbacks of array methods

[constructor-super](https://eslint.org/docs/latest/rules/constructor-super)

Require `super()` calls in constructors

[for-direction](https://eslint.org/docs/latest/rules/for-direction)

Enforce `for` loop update clause moving the counter in the right direction

[getter-return](https://eslint.org/docs/latest/rules/getter-return)

Enforce `return` statements in getters

[no-async-promise-executor](https://eslint.org/docs/latest/rules/no-async-promise-executor)

Disallow using an async function as a Promise executor

[no-await-in-loop](https://eslint.org/docs/latest/rules/no-await-in-loop)

Disallow `await` inside of loops

[no-class-assign](https://eslint.org/docs/latest/rules/no-class-assign)

Disallow reassigning class members

[no-compare-neg-zero](https://eslint.org/docs/latest/rules/no-compare-neg-zero)

Disallow comparing against `-0`

[no-cond-assign](https://eslint.org/docs/latest/rules/no-cond-assign)

Disallow assignment operators in conditional expressions

[no-const-assign](https://eslint.org/docs/latest/rules/no-const-assign)

Disallow reassigning `const`, `using`, and `await using` variables

[no-constant-binary-expression](https://eslint.org/docs/latest/rules/no-constant-binary-expression)

Disallow expressions where the operation doesn’t affect the value

[no-constant-condition](https://eslint.org/docs/latest/rules/no-constant-condition)

Disallow constant expressions in conditions

[no-constructor-return](https://eslint.org/docs/latest/rules/no-constructor-return)

Disallow returning value from constructor

[no-control-regex](https://eslint.org/docs/latest/rules/no-control-regex)

Disallow control characters in regular expressions

[no-debugger](https://eslint.org/docs/latest/rules/no-debugger)

Disallow the use of `debugger`

[no-dupe-args](https://eslint.org/docs/latest/rules/no-dupe-args)

Disallow duplicate arguments in `function` definitions

[no-dupe-class-members](https://eslint.org/docs/latest/rules/no-dupe-class-members)

Disallow duplicate class members

[no-dupe-else-if](https://eslint.org/docs/latest/rules/no-dupe-else-if)

Disallow duplicate conditions in if-else-if chains

[no-dupe-keys](https://eslint.org/docs/latest/rules/no-dupe-keys)

Disallow duplicate keys in object literals

[no-duplicate-case](https://eslint.org/docs/latest/rules/no-duplicate-case)

Disallow duplicate case labels

[no-duplicate-imports](https://eslint.org/docs/latest/rules/no-duplicate-imports)

Disallow duplicate module imports

[no-empty-character-class](https://eslint.org/docs/latest/rules/no-empty-character-class)

Disallow empty character classes in regular expressions

[no-empty-pattern](https://eslint.org/docs/latest/rules/no-empty-pattern)

Disallow empty destructuring patterns

[no-ex-assign](https://eslint.org/docs/latest/rules/no-ex-assign)

Disallow reassigning exceptions in `catch` clauses

[no-fallthrough](https://eslint.org/docs/latest/rules/no-fallthrough)

Disallow fallthrough of `case` statements

[no-func-assign](https://eslint.org/docs/latest/rules/no-func-assign)

Disallow reassigning `function` declarations

[no-import-assign](https://eslint.org/docs/latest/rules/no-import-assign)

Disallow assigning to imported bindings

[no-inner-declarations](https://eslint.org/docs/latest/rules/no-inner-declarations)

Disallow variable or `function` declarations in nested blocks

[no-invalid-regexp](https://eslint.org/docs/latest/rules/no-invalid-regexp)

Disallow invalid regular expression strings in `RegExp` constructors

[no-irregular-whitespace](https://eslint.org/docs/latest/rules/no-irregular-whitespace)

Disallow irregular whitespace

[no-loss-of-precision](https://eslint.org/docs/latest/rules/no-loss-of-precision)

Disallow literal numbers that lose precision

[no-misleading-character-class](https://eslint.org/docs/latest/rules/no-misleading-character-class)

Disallow characters which are made with multiple code points in character class syntax

[no-new-native-nonconstructor](https://eslint.org/docs/latest/rules/no-new-native-nonconstructor)

Disallow `new` operators with global non-constructor functions

[no-obj-calls](https://eslint.org/docs/latest/rules/no-obj-calls)

Disallow calling global object properties as functions

[no-promise-executor-return](https://eslint.org/docs/latest/rules/no-promise-executor-return)

Disallow returning values from Promise executor functions

[no-prototype-builtins](https://eslint.org/docs/latest/rules/no-prototype-builtins)

Disallow calling some `Object.prototype` methods directly on objects

[no-self-assign](https://eslint.org/docs/latest/rules/no-self-assign)

Disallow assignments where both sides are exactly the same

[no-self-compare](https://eslint.org/docs/latest/rules/no-self-compare)

Disallow comparisons where both sides are exactly the same

[no-setter-return](https://eslint.org/docs/latest/rules/no-setter-return)

Disallow returning values from setters

[no-sparse-arrays](https://eslint.org/docs/latest/rules/no-sparse-arrays)

Disallow sparse arrays

[no-template-curly-in-string](https://eslint.org/docs/latest/rules/no-template-curly-in-string)

Disallow template literal placeholder syntax in regular strings

[no-this-before-super](https://eslint.org/docs/latest/rules/no-this-before-super)

Disallow `this` / `super` before calling `super()` in constructors

[no-unassigned-vars](https://eslint.org/docs/latest/rules/no-unassigned-vars)

Disallow `let` or `var` variables that are read but never assigned

[no-unexpected-multiline](https://eslint.org/docs/latest/rules/no-unexpected-multiline)

Disallow confusing multiline expressions

[no-unmodified-loop-condition](https://eslint.org/docs/latest/rules/no-unmodified-loop-condition)

Disallow unmodified loop conditions

[no-unreachable](https://eslint.org/docs/latest/rules/no-unreachable)

Disallow unreachable code after `return`, `throw`, `continue`, and `break` statements

[no-unreachable-loop](https://eslint.org/docs/latest/rules/no-unreachable-loop)

Disallow loops with a body that allows only one iteration

[no-unsafe-finally](https://eslint.org/docs/latest/rules/no-unsafe-finally)

Disallow control flow statements in `finally` blocks

[no-unsafe-negation](https://eslint.org/docs/latest/rules/no-unsafe-negation)

Disallow negating the left operand of relational operators

[no-unsafe-optional-chaining](https://eslint.org/docs/latest/rules/no-unsafe-optional-chaining)

Disallow use of optional chaining in contexts where the `undefined` value is not allowed

[no-unused-private-class-members](https://eslint.org/docs/latest/rules/no-unused-private-class-members)

Disallow unused private class members

[no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)

Disallow unused variables

[no-use-before-define](https://eslint.org/docs/latest/rules/no-use-before-define)

Disallow the use of variables before they are defined

[no-useless-assignment](https://eslint.org/docs/latest/rules/no-useless-assignment)

Disallow variable assignments when the value is not used

[no-useless-backreference](https://eslint.org/docs/latest/rules/no-useless-backreference)

Disallow useless backreferences in regular expressions

[require-atomic-updates](https://eslint.org/docs/latest/rules/require-atomic-updates)

Disallow assignments that can lead to race conditions due to usage of `await` or `yield`

[use-isnan](https://eslint.org/docs/latest/rules/use-isnan)

Require calls to `isNaN()` when checking for `NaN`

[valid-typeof](https://eslint.org/docs/latest/rules/valid-typeof)

Enforce comparing `typeof` expressions against valid strings

## Suggestions

These rules suggest alternate ways of doing things:

[accessor-pairs](https://eslint.org/docs/latest/rules/accessor-pairs)

Enforce getter and setter pairs in objects and classes

[arrow-body-style](https://eslint.org/docs/latest/rules/arrow-body-style)

❄️

Require braces around arrow function bodies

[block-scoped-var](https://eslint.org/docs/latest/rules/block-scoped-var)

Enforce the use of variables within the scope they are defined

[camelcase](https://eslint.org/docs/latest/rules/camelcase)

❄️

Enforce camelcase naming convention

[class-methods-use-this](https://eslint.org/docs/latest/rules/class-methods-use-this)

Enforce that class methods utilize `this`

[complexity](https://eslint.org/docs/latest/rules/complexity)

Enforce a maximum cyclomatic complexity allowed in a program

[consistent-return](https://eslint.org/docs/latest/rules/consistent-return)

Require `return` statements to either always or never specify values

[consistent-this](https://eslint.org/docs/latest/rules/consistent-this)

❄️

Enforce consistent naming when capturing the current execution context

[curly](https://eslint.org/docs/latest/rules/curly)

❄️

Enforce consistent brace style for all control statements

[default-case](https://eslint.org/docs/latest/rules/default-case)

Require `default` cases in `switch` statements

[default-case-last](https://eslint.org/docs/latest/rules/default-case-last)

Enforce `default` clauses in `switch` statements to be last

[default-param-last](https://eslint.org/docs/latest/rules/default-param-last)

❄️

Enforce default parameters to be last

[dot-notation](https://eslint.org/docs/latest/rules/dot-notation)

❄️

Enforce dot notation whenever possible

[eqeqeq](https://eslint.org/docs/latest/rules/eqeqeq)

Require the use of `===` and `!==`

[func-name-matching](https://eslint.org/docs/latest/rules/func-name-matching)

❄️

Require function names to match the name of the variable or property to which they are assigned

[func-names](https://eslint.org/docs/latest/rules/func-names)

Require or disallow named `function` expressions

[func-style](https://eslint.org/docs/latest/rules/func-style)

❄️

Enforce the consistent use of either `function` declarations or expressions assigned to variables

[grouped-accessor-pairs](https://eslint.org/docs/latest/rules/grouped-accessor-pairs)

Require grouped accessor pairs in object literals and classes

[guard-for-in](https://eslint.org/docs/latest/rules/guard-for-in)

Require `for-in` loops to include an `if` statement

[id-denylist](https://eslint.org/docs/latest/rules/id-denylist)

❄️

Disallow specified identifiers

[id-length](https://eslint.org/docs/latest/rules/id-length)

❄️

Enforce minimum and maximum identifier lengths

[id-match](https://eslint.org/docs/latest/rules/id-match)

❄️

Require identifiers to match a specified regular expression

[init-declarations](https://eslint.org/docs/latest/rules/init-declarations)

❄️

Require or disallow initialization in variable declarations

[logical-assignment-operators](https://eslint.org/docs/latest/rules/logical-assignment-operators)

❄️

Require or disallow logical assignment operator shorthand

[max-classes-per-file](https://eslint.org/docs/latest/rules/max-classes-per-file)

Enforce a maximum number of classes per file

[max-depth](https://eslint.org/docs/latest/rules/max-depth)

Enforce a maximum depth that blocks can be nested

[max-lines](https://eslint.org/docs/latest/rules/max-lines)

Enforce a maximum number of lines per file

[max-lines-per-function](https://eslint.org/docs/latest/rules/max-lines-per-function)

Enforce a maximum number of lines of code in a function

[max-nested-callbacks](https://eslint.org/docs/latest/rules/max-nested-callbacks)

Enforce a maximum depth that callbacks can be nested

[max-params](https://eslint.org/docs/latest/rules/max-params)

Enforce a maximum number of parameters in function definitions

[max-statements](https://eslint.org/docs/latest/rules/max-statements)

Enforce a maximum number of statements allowed in function blocks

[new-cap](https://eslint.org/docs/latest/rules/new-cap)

Require constructor names to begin with a capital letter

[no-alert](https://eslint.org/docs/latest/rules/no-alert)

Disallow the use of `alert`, `confirm`, and `prompt`

[no-array-constructor](https://eslint.org/docs/latest/rules/no-array-constructor)

Disallow `Array` constructors

[no-bitwise](https://eslint.org/docs/latest/rules/no-bitwise)

Disallow bitwise operators

[no-caller](https://eslint.org/docs/latest/rules/no-caller)

Disallow the use of `arguments.caller` or `arguments.callee`

[no-case-declarations](https://eslint.org/docs/latest/rules/no-case-declarations)

Disallow lexical declarations in case clauses

[no-console](https://eslint.org/docs/latest/rules/no-console)

Disallow the use of `console`

[no-continue](https://eslint.org/docs/latest/rules/no-continue)

❄️

Disallow `continue` statements

[no-delete-var](https://eslint.org/docs/latest/rules/no-delete-var)

Disallow deleting variables

[no-div-regex](https://eslint.org/docs/latest/rules/no-div-regex)

❄️

Disallow equal signs explicitly at the beginning of regular expressions

[no-else-return](https://eslint.org/docs/latest/rules/no-else-return)

❄️

Disallow `else` blocks after `return` statements in `if` statements

[no-empty](https://eslint.org/docs/latest/rules/no-empty)

Disallow empty block statements

[no-empty-function](https://eslint.org/docs/latest/rules/no-empty-function)

Disallow empty functions

[no-empty-static-block](https://eslint.org/docs/latest/rules/no-empty-static-block)

Disallow empty static blocks

[no-eq-null](https://eslint.org/docs/latest/rules/no-eq-null)

Disallow `null` comparisons without type-checking operators

[no-eval](https://eslint.org/docs/latest/rules/no-eval)

Disallow the use of `eval()`

[no-extend-native](https://eslint.org/docs/latest/rules/no-extend-native)

Disallow extending native types

[no-extra-bind](https://eslint.org/docs/latest/rules/no-extra-bind)

Disallow unnecessary calls to `.bind()`

[no-extra-boolean-cast](https://eslint.org/docs/latest/rules/no-extra-boolean-cast)

❄️

Disallow unnecessary boolean casts

[no-extra-label](https://eslint.org/docs/latest/rules/no-extra-label)

❄️

Disallow unnecessary labels

[no-global-assign](https://eslint.org/docs/latest/rules/no-global-assign)

Disallow assignments to native objects or read-only global variables

[no-implicit-coercion](https://eslint.org/docs/latest/rules/no-implicit-coercion)

❄️

Disallow shorthand type conversions

[no-implicit-globals](https://eslint.org/docs/latest/rules/no-implicit-globals)

Disallow declarations in the global scope

[no-implied-eval](https://eslint.org/docs/latest/rules/no-implied-eval)

Disallow the use of `eval()` -like methods

[no-invalid-this](https://eslint.org/docs/latest/rules/no-invalid-this)

Disallow use of `this` in contexts where the value of `this` is `undefined`

[no-iterator](https://eslint.org/docs/latest/rules/no-iterator)

Disallow the use of the `__iterator__` property

[no-labels](https://eslint.org/docs/latest/rules/no-labels)

❄️

Disallow labeled statements

[no-lone-blocks](https://eslint.org/docs/latest/rules/no-lone-blocks)

Disallow unnecessary nested blocks

[no-lonely-if](https://eslint.org/docs/latest/rules/no-lonely-if)

❄️

Disallow `if` statements as the only statement in `else` blocks

[no-loop-func](https://eslint.org/docs/latest/rules/no-loop-func)

Disallow function declarations that contain unsafe references inside loop statements

[no-magic-numbers](https://eslint.org/docs/latest/rules/no-magic-numbers)

❄️

Disallow magic numbers

[no-multi-assign](https://eslint.org/docs/latest/rules/no-multi-assign)

Disallow use of chained assignment expressions

[no-multi-str](https://eslint.org/docs/latest/rules/no-multi-str)

❄️

Disallow multiline strings

[no-negated-condition](https://eslint.org/docs/latest/rules/no-negated-condition)

❄️

Disallow negated conditions

[no-nested-ternary](https://eslint.org/docs/latest/rules/no-nested-ternary)

❄️

Disallow nested ternary expressions

[no-new](https://eslint.org/docs/latest/rules/no-new)

Disallow `new` operators outside of assignments or comparisons

[no-new-func](https://eslint.org/docs/latest/rules/no-new-func)

Disallow `new` operators with the `Function` object

[no-new-wrappers](https://eslint.org/docs/latest/rules/no-new-wrappers)

Disallow `new` operators with the `String`, `Number`, and `Boolean` objects

[no-nonoctal-decimal-escape](https://eslint.org/docs/latest/rules/no-nonoctal-decimal-escape)

Disallow `&#92;8` and `&#92;9` escape sequences in string literals

[no-object-constructor](https://eslint.org/docs/latest/rules/no-object-constructor)

Disallow calls to the `Object` constructor without an argument

[no-octal](https://eslint.org/docs/latest/rules/no-octal)

Disallow octal literals

[no-octal-escape](https://eslint.org/docs/latest/rules/no-octal-escape)

Disallow octal escape sequences in string literals

[no-param-reassign](https://eslint.org/docs/latest/rules/no-param-reassign)

Disallow reassigning function parameters

[no-plusplus](https://eslint.org/docs/latest/rules/no-plusplus)

❄️

Disallow the unary operators `++` and `--`

[no-proto](https://eslint.org/docs/latest/rules/no-proto)

Disallow the use of the `__proto__` property

[no-redeclare](https://eslint.org/docs/latest/rules/no-redeclare)

Disallow variable redeclaration

[no-regex-spaces](https://eslint.org/docs/latest/rules/no-regex-spaces)

Disallow multiple spaces in regular expressions

[no-restricted-exports](https://eslint.org/docs/latest/rules/no-restricted-exports)

Disallow specified names in exports

[no-restricted-globals](https://eslint.org/docs/latest/rules/no-restricted-globals)

Disallow specified global variables

[no-restricted-imports](https://eslint.org/docs/latest/rules/no-restricted-imports)

Disallow specified modules when loaded by `import`

[no-restricted-properties](https://eslint.org/docs/latest/rules/no-restricted-properties)

Disallow certain properties on certain objects

[no-restricted-syntax](https://eslint.org/docs/latest/rules/no-restricted-syntax)

Disallow specified syntax

[no-return-assign](https://eslint.org/docs/latest/rules/no-return-assign)

Disallow assignment operators in `return` statements

[no-script-url](https://eslint.org/docs/latest/rules/no-script-url)

Disallow `javascript:` URLs

[no-sequences](https://eslint.org/docs/latest/rules/no-sequences)

Disallow comma operators

[no-shadow](https://eslint.org/docs/latest/rules/no-shadow)

Disallow variable declarations from shadowing variables declared in the outer scope

[no-shadow-restricted-names](https://eslint.org/docs/latest/rules/no-shadow-restricted-names)

Disallow identifiers from shadowing restricted names

[no-ternary](https://eslint.org/docs/latest/rules/no-ternary)

❄️

Disallow ternary operators

[no-throw-literal](https://eslint.org/docs/latest/rules/no-throw-literal)

Disallow throwing literals as exceptions

[no-undef-init](https://eslint.org/docs/latest/rules/no-undef-init)

❄️

Disallow initializing variables to `undefined`

[no-undefined](https://eslint.org/docs/latest/rules/no-undefined)

❄️

Disallow the use of `undefined` as an identifier

[no-underscore-dangle](https://eslint.org/docs/latest/rules/no-underscore-dangle)

❄️

Disallow dangling underscores in identifiers

[no-unneeded-ternary](https://eslint.org/docs/latest/rules/no-unneeded-ternary)

❄️

Disallow ternary operators when simpler alternatives exist

[no-unused-expressions](https://eslint.org/docs/latest/rules/no-unused-expressions)

Disallow unused expressions

[no-unused-labels](https://eslint.org/docs/latest/rules/no-unused-labels)

Disallow unused labels

[no-useless-call](https://eslint.org/docs/latest/rules/no-useless-call)

Disallow unnecessary calls to `.call()` and `.apply()`

[no-useless-catch](https://eslint.org/docs/latest/rules/no-useless-catch)

Disallow unnecessary `catch` clauses

[no-useless-computed-key](https://eslint.org/docs/latest/rules/no-useless-computed-key)

❄️

Disallow unnecessary computed property keys in objects and classes

[no-useless-concat](https://eslint.org/docs/latest/rules/no-useless-concat)

❄️

Disallow unnecessary concatenation of literals or template literals

[no-useless-constructor](https://eslint.org/docs/latest/rules/no-useless-constructor)

Disallow unnecessary constructors

[no-useless-escape](https://eslint.org/docs/latest/rules/no-useless-escape)

Disallow unnecessary escape characters

[no-useless-rename](https://eslint.org/docs/latest/rules/no-useless-rename)

Disallow renaming import, export, and destructured assignments to the same name

[no-useless-return](https://eslint.org/docs/latest/rules/no-useless-return)

Disallow redundant return statements

[no-var](https://eslint.org/docs/latest/rules/no-var)

Require `let` or `const` instead of `var`

[no-void](https://eslint.org/docs/latest/rules/no-void)

❄️

Disallow `void` operators

[no-with](https://eslint.org/docs/latest/rules/no-with)

Disallow `with` statements

[object-shorthand](https://eslint.org/docs/latest/rules/object-shorthand)

❄️

Require or disallow method and property shorthand syntax for object literals

[one-var](https://eslint.org/docs/latest/rules/one-var)

❄️

Enforce variables to be declared either together or separately in functions

[operator-assignment](https://eslint.org/docs/latest/rules/operator-assignment)

❄️

Require or disallow assignment operator shorthand where possible

[prefer-arrow-callback](https://eslint.org/docs/latest/rules/prefer-arrow-callback)

❄️

Require using arrow functions for callbacks

[prefer-const](https://eslint.org/docs/latest/rules/prefer-const)

Require `const` declarations for variables that are never reassigned after declared

[prefer-destructuring](https://eslint.org/docs/latest/rules/prefer-destructuring)

❄️

Require destructuring from arrays and/or objects

[prefer-exponentiation-operator](https://eslint.org/docs/latest/rules/prefer-exponentiation-operator)

❄️

Disallow the use of `Math.pow` in favor of the `**` operator

[prefer-named-capture-group](https://eslint.org/docs/latest/rules/prefer-named-capture-group)

Enforce using named capture group in regular expression

[prefer-numeric-literals](https://eslint.org/docs/latest/rules/prefer-numeric-literals)

❄️

Disallow `parseInt()` and `Number.parseInt()` in favor of binary, octal, and hexadecimal literals

[prefer-object-has-own](https://eslint.org/docs/latest/rules/prefer-object-has-own)

Disallow use of `Object.prototype.hasOwnProperty.call()` and prefer use of `Object.hasOwn()`

[prefer-object-spread](https://eslint.org/docs/latest/rules/prefer-object-spread)

❄️

Disallow using `Object.assign` with an object literal as the first argument and prefer the use of object spread instead

[prefer-promise-reject-errors](https://eslint.org/docs/latest/rules/prefer-promise-reject-errors)

Require using Error objects as Promise rejection reasons

[prefer-regex-literals](https://eslint.org/docs/latest/rules/prefer-regex-literals)

Disallow use of the `RegExp` constructor in favor of regular expression literals

[prefer-rest-params](https://eslint.org/docs/latest/rules/prefer-rest-params)

Require rest parameters instead of `arguments`

[prefer-spread](https://eslint.org/docs/latest/rules/prefer-spread)

❄️

Require spread operators instead of `.apply()`

[prefer-template](https://eslint.org/docs/latest/rules/prefer-template)

❄️

Require template literals instead of string concatenation

[preserve-caught-error](https://eslint.org/docs/latest/rules/preserve-caught-error)

Disallow losing originally caught error when re-throwing custom errors

[radix](https://eslint.org/docs/latest/rules/radix)

Enforce the use of the radix argument when using `parseInt()`

[require-await](https://eslint.org/docs/latest/rules/require-await)

Disallow async functions which have no `await` expression

[require-unicode-regexp](https://eslint.org/docs/latest/rules/require-unicode-regexp)

Enforce the use of `u` or `v` flag on regular expressions

[require-yield](https://eslint.org/docs/latest/rules/require-yield)

Require generator functions to contain `yield`

[sort-imports](https://eslint.org/docs/latest/rules/sort-imports)

❄️

Enforce sorted `import` declarations within modules

[sort-keys](https://eslint.org/docs/latest/rules/sort-keys)

❄️

Require object keys to be sorted

[sort-vars](https://eslint.org/docs/latest/rules/sort-vars)

❄️

Require variables within the same declaration block to be sorted

[strict](https://eslint.org/docs/latest/rules/strict)

Require or disallow strict mode directives

[symbol-description](https://eslint.org/docs/latest/rules/symbol-description)

Require symbol descriptions

[vars-on-top](https://eslint.org/docs/latest/rules/vars-on-top)

❄️

Require `var` declarations be placed at the top of their containing scope

[yoda](https://eslint.org/docs/latest/rules/yoda)

❄️

Require or disallow “Yoda” conditions

## Layout & Formatting

These rules care about how the code looks rather than how it executes:

[unicode-bom](https://eslint.org/docs/latest/rules/unicode-bom)

Require or disallow Unicode byte order mark (BOM)

## Deprecated

These rules have been deprecated in accordance with the [deprecation policy](https://eslint.org/docs/latest/use/rule-deprecation), and replaced by newer rules:

array-bracket-newline deprecated

Replaced by [`array-bracket-newline`](https://eslint.style/rules/array-bracket-newline) in [`@stylistic/eslint-plugin`](https://eslint.style/)

array-bracket-spacing deprecated

Replaced by [`array-bracket-spacing`](https://eslint.style/rules/array-bracket-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

array-element-newline deprecated

Replaced by [`array-element-newline`](https://eslint.style/rules/array-element-newline) in [`@stylistic/eslint-plugin`](https://eslint.style/)

arrow-parens deprecated

Replaced by [`arrow-parens`](https://eslint.style/rules/arrow-parens) in [`@stylistic/eslint-plugin`](https://eslint.style/)

arrow-spacing deprecated

Replaced by [`arrow-spacing`](https://eslint.style/rules/arrow-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

block-spacing deprecated

Replaced by [`block-spacing`](https://eslint.style/rules/block-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

brace-style deprecated

Replaced by [`brace-style`](https://eslint.style/rules/brace-style) in [`@stylistic/eslint-plugin`](https://eslint.style/)

callback-return deprecated

Replaced by [`callback-return`](https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/rules/callback-return.md) in [`eslint-plugin-n`](https://github.com/eslint-community/eslint-plugin-n)

comma-dangle deprecated

Replaced by [`comma-dangle`](https://eslint.style/rules/comma-dangle) in [`@stylistic/eslint-plugin`](https://eslint.style/)

comma-spacing deprecated

Replaced by [`comma-spacing`](https://eslint.style/rules/comma-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

comma-style deprecated

Replaced by [`comma-style`](https://eslint.style/rules/comma-style) in [`@stylistic/eslint-plugin`](https://eslint.style/)

computed-property-spacing deprecated

Replaced by [`computed-property-spacing`](https://eslint.style/rules/computed-property-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

dot-location deprecated

Replaced by [`dot-location`](https://eslint.style/rules/dot-location) in [`@stylistic/eslint-plugin`](https://eslint.style/)

eol-last deprecated

Replaced by [`eol-last`](https://eslint.style/rules/eol-last) in [`@stylistic/eslint-plugin`](https://eslint.style/)

func-call-spacing deprecated

Replaced by [`function-call-spacing`](https://eslint.style/rules/function-call-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

function-call-argument-newline deprecated

Replaced by [`function-call-argument-newline`](https://eslint.style/rules/function-call-argument-newline) in [`@stylistic/eslint-plugin`](https://eslint.style/)

function-paren-newline deprecated

Replaced by [`function-paren-newline`](https://eslint.style/rules/function-paren-newline) in [`@stylistic/eslint-plugin`](https://eslint.style/)

generator-star-spacing deprecated

Replaced by [`generator-star-spacing`](https://eslint.style/rules/generator-star-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

global-require deprecated

Replaced by [`global-require`](https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/rules/global-require.md) in [`eslint-plugin-n`](https://github.com/eslint-community/eslint-plugin-n)

handle-callback-err deprecated

Replaced by [`handle-callback-err`](https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/rules/handle-callback-err.md) in [`eslint-plugin-n`](https://github.com/eslint-community/eslint-plugin-n)

id-blacklist deprecated

Replaced by [`id-denylist`](https://eslint.org/docs/latest/rules/id-denylist)

implicit-arrow-linebreak deprecated

Replaced by [`implicit-arrow-linebreak`](https://eslint.style/rules/implicit-arrow-linebreak) in [`@stylistic/eslint-plugin`](https://eslint.style/)

indent deprecated

Replaced by [`indent`](https://eslint.style/rules/indent) in [`@stylistic/eslint-plugin`](https://eslint.style/)

indent-legacy deprecated

Replaced by [`indent`](https://eslint.style/rules/indent) in [`@stylistic/eslint-plugin`](https://eslint.style/)

jsx-quotes deprecated

Replaced by [`jsx-quotes`](https://eslint.style/rules/jsx-quotes) in [`@stylistic/eslint-plugin`](https://eslint.style/)

key-spacing deprecated

Replaced by [`key-spacing`](https://eslint.style/rules/key-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

keyword-spacing deprecated

Replaced by [`keyword-spacing`](https://eslint.style/rules/keyword-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

line-comment-position deprecated

Replaced by [`line-comment-position`](https://eslint.style/rules/line-comment-position) in [`@stylistic/eslint-plugin`](https://eslint.style/)

linebreak-style deprecated

Replaced by [`linebreak-style`](https://eslint.style/rules/linebreak-style) in [`@stylistic/eslint-plugin`](https://eslint.style/)

lines-around-comment deprecated

Replaced by [`lines-around-comment`](https://eslint.style/rules/lines-around-comment) in [`@stylistic/eslint-plugin`](https://eslint.style/)

lines-around-directive deprecated

Replaced by [`padding-line-between-statements`](https://eslint.style/rules/padding-line-between-statements) in [`@stylistic/eslint-plugin`](https://eslint.style/)

lines-between-class-members deprecated

Replaced by [`lines-between-class-members`](https://eslint.style/rules/lines-between-class-members) in [`@stylistic/eslint-plugin`](https://eslint.style/)

max-len deprecated

Replaced by [`max-len`](https://eslint.style/rules/max-len) in [`@stylistic/eslint-plugin`](https://eslint.style/)

max-statements-per-line deprecated

Replaced by [`max-statements-per-line`](https://eslint.style/rules/max-statements-per-line) in [`@stylistic/eslint-plugin`](https://eslint.style/)

multiline-comment-style deprecated

Replaced by [`multiline-comment-style`](https://eslint.style/rules/multiline-comment-style) in [`@stylistic/eslint-plugin`](https://eslint.style/)

multiline-ternary deprecated

Replaced by [`multiline-ternary`](https://eslint.style/rules/multiline-ternary) in [`@stylistic/eslint-plugin`](https://eslint.style/)

new-parens deprecated

Replaced by [`new-parens`](https://eslint.style/rules/new-parens) in [`@stylistic/eslint-plugin`](https://eslint.style/)

newline-after-var deprecated

Replaced by [`padding-line-between-statements`](https://eslint.style/rules/padding-line-between-statements) in [`@stylistic/eslint-plugin`](https://eslint.style/)

newline-before-return deprecated

Replaced by [`padding-line-between-statements`](https://eslint.style/rules/padding-line-between-statements) in [`@stylistic/eslint-plugin`](https://eslint.style/)

newline-per-chained-call deprecated

Replaced by [`newline-per-chained-call`](https://eslint.style/rules/newline-per-chained-call) in [`@stylistic/eslint-plugin`](https://eslint.style/)

no-buffer-constructor deprecated

Replaced by [`no-deprecated-api`](https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/rules/no-deprecated-api.md) in [`eslint-plugin-n`](https://github.com/eslint-community/eslint-plugin-n)

no-catch-shadow deprecated

Replaced by [`no-shadow`](https://eslint.org/docs/latest/rules/no-shadow)

no-confusing-arrow deprecated

Replaced by [`no-confusing-arrow`](https://eslint.style/rules/no-confusing-arrow) in [`@stylistic/eslint-plugin`](https://eslint.style/)

no-extra-parens deprecated

Replaced by [`no-extra-parens`](https://eslint.style/rules/no-extra-parens) in [`@stylistic/eslint-plugin`](https://eslint.style/)

no-extra-semi deprecated

Replaced by [`no-extra-semi`](https://eslint.style/rules/no-extra-semi) in [`@stylistic/eslint-plugin`](https://eslint.style/)

no-floating-decimal deprecated

Replaced by [`no-floating-decimal`](https://eslint.style/rules/no-floating-decimal) in [`@stylistic/eslint-plugin`](https://eslint.style/)

no-mixed-operators deprecated

Replaced by [`no-mixed-operators`](https://eslint.style/rules/no-mixed-operators) in [`@stylistic/eslint-plugin`](https://eslint.style/)

no-mixed-requires deprecated

Replaced by [`no-mixed-requires`](https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/rules/no-mixed-requires.md) in [`eslint-plugin-n`](https://github.com/eslint-community/eslint-plugin-n)

no-mixed-spaces-and-tabs deprecated

Replaced by [`no-mixed-spaces-and-tabs`](https://eslint.style/rules/no-mixed-spaces-and-tabs) in [`@stylistic/eslint-plugin`](https://eslint.style/)

no-multi-spaces deprecated

Replaced by [`no-multi-spaces`](https://eslint.style/rules/no-multi-spaces) in [`@stylistic/eslint-plugin`](https://eslint.style/)

no-multiple-empty-lines deprecated

Replaced by [`no-multiple-empty-lines`](https://eslint.style/rules/no-multiple-empty-lines) in [`@stylistic/eslint-plugin`](https://eslint.style/)

no-native-reassign deprecated

Replaced by [`no-global-assign`](https://eslint.org/docs/latest/rules/no-global-assign)

no-negated-in-lhs deprecated

Replaced by [`no-unsafe-negation`](https://eslint.org/docs/latest/rules/no-unsafe-negation)

no-new-object deprecated

Replaced by [`no-object-constructor`](https://eslint.org/docs/latest/rules/no-object-constructor)

no-new-require deprecated

Replaced by [`no-new-require`](https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/rules/no-new-require.md) in [`eslint-plugin-n`](https://github.com/eslint-community/eslint-plugin-n)

no-new-symbol deprecated

Replaced by [`no-new-native-nonconstructor`](https://eslint.org/docs/latest/rules/no-new-native-nonconstructor)

no-path-concat deprecated

Replaced by [`no-path-concat`](https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/rules/no-path-concat.md) in [`eslint-plugin-n`](https://github.com/eslint-community/eslint-plugin-n)

no-process-env deprecated

Replaced by [`no-process-env`](https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/rules/no-process-env.md) in [`eslint-plugin-n`](https://github.com/eslint-community/eslint-plugin-n)

no-process-exit deprecated

Replaced by [`no-process-exit`](https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/rules/no-process-exit.md) in [`eslint-plugin-n`](https://github.com/eslint-community/eslint-plugin-n)

no-restricted-modules deprecated

Replaced by [`no-restricted-require`](https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/rules/no-restricted-require.md) in [`eslint-plugin-n`](https://github.com/eslint-community/eslint-plugin-n)

no-return-await deprecated

no-spaced-func deprecated

Replaced by [`function-call-spacing`](https://eslint.style/rules/function-call-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

no-sync deprecated

Replaced by [`no-sync`](https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/rules/no-sync.md) in [`eslint-plugin-n`](https://github.com/eslint-community/eslint-plugin-n)

no-tabs deprecated

Replaced by [`no-tabs`](https://eslint.style/rules/no-tabs) in [`@stylistic/eslint-plugin`](https://eslint.style/)

no-trailing-spaces deprecated

Replaced by [`no-trailing-spaces`](https://eslint.style/rules/no-trailing-spaces) in [`@stylistic/eslint-plugin`](https://eslint.style/)

no-whitespace-before-property deprecated

Replaced by [`no-whitespace-before-property`](https://eslint.style/rules/no-whitespace-before-property) in [`@stylistic/eslint-plugin`](https://eslint.style/)

nonblock-statement-body-position deprecated

Replaced by [`nonblock-statement-body-position`](https://eslint.style/rules/nonblock-statement-body-position) in [`@stylistic/eslint-plugin`](https://eslint.style/)

object-curly-newline deprecated

Replaced by [`object-curly-newline`](https://eslint.style/rules/object-curly-newline) in [`@stylistic/eslint-plugin`](https://eslint.style/)

object-curly-spacing deprecated

Replaced by [`object-curly-spacing`](https://eslint.style/rules/object-curly-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

object-property-newline deprecated

Replaced by [`object-property-newline`](https://eslint.style/rules/object-property-newline) in [`@stylistic/eslint-plugin`](https://eslint.style/)

one-var-declaration-per-line deprecated

Replaced by [`one-var-declaration-per-line`](https://eslint.style/rules/one-var-declaration-per-line) in [`@stylistic/eslint-plugin`](https://eslint.style/)

operator-linebreak deprecated

Replaced by [`operator-linebreak`](https://eslint.style/rules/operator-linebreak) in [`@stylistic/eslint-plugin`](https://eslint.style/)

padded-blocks deprecated

Replaced by [`padded-blocks`](https://eslint.style/rules/padded-blocks) in [`@stylistic/eslint-plugin`](https://eslint.style/)

padding-line-between-statements deprecated

Replaced by [`padding-line-between-statements`](https://eslint.style/rules/padding-line-between-statements) in [`@stylistic/eslint-plugin`](https://eslint.style/)

prefer-reflect deprecated

quote-props deprecated

Replaced by [`quote-props`](https://eslint.style/rules/quote-props) in [`@stylistic/eslint-plugin`](https://eslint.style/)

quotes deprecated

Replaced by [`quotes`](https://eslint.style/rules/quotes) in [`@stylistic/eslint-plugin`](https://eslint.style/)

rest-spread-spacing deprecated

Replaced by [`rest-spread-spacing`](https://eslint.style/rules/rest-spread-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

semi deprecated

Replaced by [`semi`](https://eslint.style/rules/semi) in [`@stylistic/eslint-plugin`](https://eslint.style/)

semi-spacing deprecated

Replaced by [`semi-spacing`](https://eslint.style/rules/semi-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

semi-style deprecated

Replaced by [`semi-style`](https://eslint.style/rules/semi-style) in [`@stylistic/eslint-plugin`](https://eslint.style/)

space-before-blocks deprecated

Replaced by [`space-before-blocks`](https://eslint.style/rules/space-before-blocks) in [`@stylistic/eslint-plugin`](https://eslint.style/)

space-before-function-paren deprecated

Replaced by [`space-before-function-paren`](https://eslint.style/rules/space-before-function-paren) in [`@stylistic/eslint-plugin`](https://eslint.style/)

space-in-parens deprecated

Replaced by [`space-in-parens`](https://eslint.style/rules/space-in-parens) in [`@stylistic/eslint-plugin`](https://eslint.style/)

space-infix-ops deprecated

Replaced by [`space-infix-ops`](https://eslint.style/rules/space-infix-ops) in [`@stylistic/eslint-plugin`](https://eslint.style/)

space-unary-ops deprecated

Replaced by [`space-unary-ops`](https://eslint.style/rules/space-unary-ops) in [`@stylistic/eslint-plugin`](https://eslint.style/)

spaced-comment deprecated

Replaced by [`spaced-comment`](https://eslint.style/rules/spaced-comment) in [`@stylistic/eslint-plugin`](https://eslint.style/)

switch-colon-spacing deprecated

Replaced by [`switch-colon-spacing`](https://eslint.style/rules/switch-colon-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

template-curly-spacing deprecated

Replaced by [`template-curly-spacing`](https://eslint.style/rules/template-curly-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

template-tag-spacing deprecated

Replaced by [`template-tag-spacing`](https://eslint.style/rules/template-tag-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

wrap-iife deprecated

Replaced by [`wrap-iife`](https://eslint.style/rules/wrap-iife) in [`@stylistic/eslint-plugin`](https://eslint.style/)

wrap-regex deprecated

Replaced by [`wrap-regex`](https://eslint.style/rules/wrap-regex) in [`@stylistic/eslint-plugin`](https://eslint.style/)

yield-star-spacing deprecated

Replaced by [`yield-star-spacing`](https://eslint.style/rules/yield-star-spacing) in [`@stylistic/eslint-plugin`](https://eslint.style/)

## Removed

These rules from older versions of ESLint (before the [deprecation policy](https://eslint.org/docs/latest/use/rule-deprecation) existed) have been replaced by newer rules:

generator-star removed

Replaced by [`generator-star-spacing`](https://eslint.org/docs/latest/rules/generator-star-spacing)

global-strict removed

Replaced by [`strict`](https://eslint.org/docs/latest/rules/strict)

no-arrow-condition removed

Replaced by [`no-confusing-arrow`](https://eslint.org/docs/latest/rules/no-confusing-arrow) or  
[`no-constant-condition`](https://eslint.org/docs/latest/rules/no-constant-condition)

no-comma-dangle removed

Replaced by [`comma-dangle`](https://eslint.org/docs/latest/rules/comma-dangle)

no-empty-class removed

Replaced by [`no-empty-character-class`](https://eslint.org/docs/latest/rules/no-empty-character-class)

no-empty-label removed

Replaced by [`no-labels`](https://eslint.org/docs/latest/rules/no-labels)

no-extra-strict removed

Replaced by [`strict`](https://eslint.org/docs/latest/rules/strict)

no-reserved-keys removed

Replaced by [`quote-props`](https://eslint.org/docs/latest/rules/quote-props)

no-space-before-semi removed

Replaced by [`semi-spacing`](https://eslint.org/docs/latest/rules/semi-spacing)

no-wrap-func removed

Replaced by [`no-extra-parens`](https://eslint.org/docs/latest/rules/no-extra-parens)

space-after-function-name removed

Replaced by [`space-before-function-paren`](https://eslint.org/docs/latest/rules/space-before-function-paren)

space-after-keywords removed

Replaced by [`keyword-spacing`](https://eslint.org/docs/latest/rules/keyword-spacing)

space-before-function-parentheses removed

Replaced by [`space-before-function-paren`](https://eslint.org/docs/latest/rules/space-before-function-paren)

space-before-keywords removed

Replaced by [`keyword-spacing`](https://eslint.org/docs/latest/rules/keyword-spacing)

space-in-brackets removed

Replaced by [`object-curly-spacing`](https://eslint.org/docs/latest/rules/object-curly-spacing) or  
[`array-bracket-spacing`](https://eslint.org/docs/latest/rules/array-bracket-spacing) or  
[`computed-property-spacing`](https://eslint.org/docs/latest/rules/computed-property-spacing)

space-return-throw-case removed

Replaced by [`keyword-spacing`](https://eslint.org/docs/latest/rules/keyword-spacing)

space-unary-word-ops removed

Replaced by [`space-unary-ops`](https://eslint.org/docs/latest/rules/space-unary-ops)

spaced-line-comment removed

Replaced by [`spaced-comment`](https://eslint.org/docs/latest/rules/spaced-comment)

valid-jsdoc removed

require-jsdoc removed