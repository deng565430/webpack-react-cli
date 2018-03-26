import _ from 'lodash'
import local from './local'

const server = {
  'port': 8082
}

let config = {
  'env': process.env.NODE_ENV
}

if (config.env === 'production') {
  config = _.extend(server)
} else {
  config = _.extend(local)
}

export default config
