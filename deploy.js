
const scpClient = require('scp2')
const ora = require('ora')
const chalk = require('chalk')
const serverList = require('./products')

const server = serverList[process.env.DEPLOY_ENV]

const spinner = ora(`正在发布到${server.name}服务器... \n`)

// 如果传入DEPLOY_METHOD等于delete则先执行删除服务器旧文件，然后开始上传部署新代码
if (process.env.DEPLOY_METHOD === 'delete') {
  const { Client } = require('ssh2')
  const conn = new Client()
  conn.on('ready', () => {
    // rm 删除服务器上的文件
    conn.exec(`rm -rf ${server.path}`, (err, stream) => {
      if (err) throw err
      stream.on('close', (code, signal) => {
        // 在执行shell命令后，把开始上传部署项目代码放到这里面
        spinner.start()
        scpClient.scp(
          server.relativePath,
          {
            host: server.host,
            port: server.port,
            username: server.username,
            password: server.password,
            path: server.path
          },
          (err) => {
            spinner.stop()
            if (err) {
              console.log(chalk.red(`发布${server.name}服务器失败! \n`))
              throw err
            } else {
              console.log(chalk.green(`Success! 成功发布到${server.name}服务器! \n`))
            }
          }
        )
        conn.end()
      }).on('data', (data) => {
        console.log(`STDOUT: ${data}`)
      }).stderr.on('data', (data) => {
        console.log(`STDERR: ${data}`)
      })
    })
  }).connect({
    host: server.host,
    port: server.port,
    username: server.username,
    password: server.password
    // privateKey: require('fs').readFileSync('/home/admin/.ssh/id_dsa')
  })
} else { // 默认不删除服务器上的旧文件
  spinner.start()
  scpClient.scp(
    server.relativePath,
    {
      host: server.host,
      port: server.port,
      username: server.username,
      password: server.password,
      path: server.path
    },
    (err) => {
      spinner.stop()
      if (err) {
        console.log(chalk.red(`发布到${server.name}服务器失败! \n`))
        throw err
      } else {
        console.log(chalk.green(`Success! 成功发布到${server.name}服务器! \n`))
      }
    }
  )
}
