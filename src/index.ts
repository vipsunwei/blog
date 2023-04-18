import Koa from 'koa'
import { koaBody } from 'koa-body'
import cors from '@koa/cors'
import koaStatic from 'koa-static'

import { getLogger } from './utils/logger'

const logger = getLogger('app')

const port = process.env?.PORT || 9000

const app = new Koa()

app.use(cors())
app.use(koaStatic('public'))
app.use(koaBody())

app.listen(port)

logger.log(`app is running at port ${port} !`)
