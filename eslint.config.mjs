import globals from 'globals';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [{
	ignores: ['**/node_modules', '**/*example.js'],
}, ...compat.extends('eslint:recommended', 'plugin:@stylistic/all-extends'), {
	languageOptions: {
		globals: {
			...globals.node,
		},

		ecmaVersion: 2025,
		sourceType: 'module',
	},


	rules: {
		'curly': 'error',
		'no-implicit-coercion': 'error',

		'no-unused-vars': ['error', {
			vars: 'all',
			args: 'none',
			ignoreRestSiblings: false,
		}],

		'@stylistic/array-bracket-newline': ['error', 'consistent'],
		'@stylistic/array-element-newline': ['error', 'consistent'],
		'@stylistic/arrow-parens': 'off',
		'@stylistic/comma-dangle': ['error', 'always-multiline'],
		'@stylistic/dot-location': ['error', 'property'],
		'@stylistic/function-call-argument-newline': ['error', 'consistent'],
		'@stylistic/function-paren-newline': 'off',
		'@stylistic/indent': ['error', 'tab'],
		'@stylistic/indent-binary-ops': ['error', 'tab'],
		'@stylistic/max-len': 'off',
		'@stylistic/multiline-ternary': ['error', 'always-multiline'],

		'@stylistic/newline-per-chained-call': ['error', {
			ignoreChainWithDepth: 1,
		}],

		'@stylistic/no-mixed-operators': 'off',
		'@stylistic/no-tabs': 'off',
		'@stylistic/object-property-newline': 'off',
		'@stylistic/one-var-declaration-per-line': 'off',
		'@stylistic/operator-linebreak': ['error', 'before'],
		'@stylistic/padded-blocks': 'off',
		'@stylistic/quote-props': ['error', 'consistent-as-needed'],
		'@stylistic/quotes': ['error', 'single'],
	},
}, {
	files: ['test/**'],

	rules: {
		'no-unused-vars': 'off',
	},
}];
