require('alamode')()
const dotenv = require('@demimonde/dotenv')
if (process.env.NODE_ENV != 'production') {
  dotenv()
  dotenv({ name: '.settings' })
}
require('./app')