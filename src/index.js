const plugin = require('tailwindcss/plugin')
const components = require('../dist/components')

const mainFunction = ({ addComponents }) => {
  addComponents(components)
}

module.exports = plugin(mainFunction, {})
