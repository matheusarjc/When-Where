import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import skoolabConfig from '@skoolab/eslint-config'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
  ...compat.config({
    extends: ['plugin:@next/next/recommended'],
  }),
  ...skoolabConfig,
  {
    files: ['commitlint.config.js'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
  { rules: { 'custom/no-direct-return': 'off' } },
]

export default eslintConfig
