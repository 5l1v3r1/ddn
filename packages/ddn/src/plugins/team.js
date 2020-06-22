import fs from 'fs'
import nodeSdk from '@ddn/node-sdk'
import cryptoLib from '@ddn/crypto'

import accountHelper from '../helpers/account.js'
import config from '../config'

function writeFileSync (file, obj) {
  const content = (typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2))
  fs.writeFileSync(file, content, 'utf8')
}

function appendFileSync (file, obj) {
  const content = (typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2))
  fs.appendFileSync(file, content, 'utf8')
}

// 用于分割原始100亿
function genUsers ({ nethash }) {
  const tokenPrefix = nodeSdk.constants.nethash[nethash || config.nethash].tokenPrefix

  const wan = 10000
  const users = []
  // 5000万的150个，75亿
  for (var i = 1; i < 151; i++) {
    var user = accountHelper.account(cryptoLib.generateSecret(), tokenPrefix)
    user.username = `user_${i}`
    user.amount = 5000 * wan
    users.push(user)
  }

  // 2000万的75个, 15亿
  for (let i = 151; i < 226; i++) {
    var user = accountHelper.account(cryptoLib.generateSecret(), tokenPrefix)
    user.username = `user_${i}`
    user.amount = 2000 * wan
    users.push(user)
  }

  // 1000万的100个，10亿
  for (var i = 226; i < 326; i++) {
    var user = accountHelper.account(cryptoLib.generateSecret(), tokenPrefix)
    user.username = `user_${i}`
    user.amount = 1000 * wan
    users.push(user)
  }

  // 基金账号
  var user = accountHelper.account(cryptoLib.generateSecret(), tokenPrefix)

  user.username = `${nodeSdk.constants.nethash[nethash || config.nethash].tokenName} Foundation`
  user.amount = 0
  users.push(user)

  const teamusers = users.map(i => {
    delete i.keypair
    return i
  })

  let liststr = ''
  const teamfile = users.map(({ address, amount }) => {
    const str = `${address}  ${amount}\n`
    liststr += str
    return liststr
  })

  const logFile = './teams.log'
  writeFileSync(logFile, 'team account:\n')
  appendFileSync(logFile, teamusers)
  writeFileSync('./teams.txt', liststr)
  console.log('New team and related users have been created, please see the two file: ./teams.log and ./teams.txt')
}

export default program => {
  program
    .command('createUsers')
    .description('create some accounts')
    .option('-n, --nethash <nethash>', 'default to generate a new nethash')
    .action(genUsers)
}
