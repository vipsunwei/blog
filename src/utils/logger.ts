import { configure, getLogger } from 'log4js'

console.log(process.env.NODE_ENV)

const isPROD = process.env?.NODE_ENV === 'production'

const level = isPROD ? 'warn' : 'trace'

const appenders = isPROD ? ['app'] : ['out']

configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: 'app.log' },
  },
  categories: {
    default: { appenders, level },
  },
})

const logger = getLogger()

export { getLogger, logger as default }
