require('babel-core/register')({
  'presets': [
    'env',
    ['latest-node', { 'target': 'current' }]
  ]
})

require('babel-polyfill')
require('./app')
