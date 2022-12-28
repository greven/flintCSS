const plugin = require('tailwindcss/plugin')
const components = require('../dist/components')

const mainFunction = ({ addBase, addUtilities, addComponents, config }) => {
  addComponents(components)
}

module.exports = plugin(mainFunction, {})
