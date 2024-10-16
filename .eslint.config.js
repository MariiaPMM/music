import globals from 'globals';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';

export default [
	{ files: ['**/*.{js,mjs,cjs,vue}'] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	eslintPluginPrettier,
	...pluginVue.configs[('flat/essential', 'flat/strongly-recommended', 'flat/recommended')],
	{
		rules: {
			'vue/no-undef-properties': 'off',
			'vue/singleline-html-element-content-newline': 'off',
			'vue/valid-template-root': 'off',
			'vue/attributes-order': [
				'error',
				{
					order: [
						'DEFINITION',
						'LIST_RENDERING',
						'CONDITIONALS',
						'RENDER_MODIFIERS',
						'TWO_WAY_BINDING',
						'ATTR_DYNAMIC',
						'GLOBAL',
						['UNIQUE', 'SLOT'],
						['ATTR_STATIC', 'ATTR_SHORTHAND_BOOL'],
						'EVENTS',
						'CONTENT'
					],
					alphabetical: false
				}
			],
			'vue/no-v-html': 'off',
			'vue/component-tags-order': [
				'error',
				{
					order: ['template', 'script', 'style']
				}
			],
			'vue/v-slot-style': ['error', 'shorthand'],
			'vue/component-name-in-template-casing': [
				'error',
				'PascalCase',
				{ registeredComponentsOnly: false }
			],
			'vue/component-options-name-casing': ['error', 'PascalCase'],
			'vue/custom-event-name-casing': ['error', 'kebab-case'],
			'vue/html-button-has-type': 'error',
			'vue/html-comment-content-spacing': 'error',
			'vue/html-comment-indent': 'error',
			'vue/no-potential-component-option-typo': 'error',
			'vue/no-required-prop-with-default': 'error',
			'vue/no-undef-components': ['error', { ignorePatterns: ['router(\\-\\w+)+'] }],
			'vue/no-unused-emit-declarations': 'error',
			'vue/no-unused-properties': 'error',
			'vue/no-use-v-else-with-v-for': 'error',
			'vue/no-useless-mustaches': 'error',
			'vue/no-useless-v-bind': 'error',
			'vue/padding-line-between-blocks': 'error',
			'vue/prefer-separate-static-class': 'error',
			'vue/prefer-true-attribute-shorthand': 'error',
			'vue/require-name-property': 'error',
			'vue/html-self-closing': [
				'error',
				{
					html: {
						void: 'any',
						normal: 'any',
						component: 'always'
					}
				}
			],
			'vue/html-indent': ['error', 'tab']
		}
	}
];
