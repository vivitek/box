import chalk from "chalk";
import { openSync, writeSync } from "fs"
import Spinnies from "spinnies"
import execa from "execa";

const config = require('./config/openvvrt.config.json')
const log = openSync(`${+new Date()}.log`)
const spinnies = new Spinnies()

const runCommands = async (commands) => {
  if (!commands || !commands.length)
    return
  commands.forEach(command => {
    try {
      spinnies.add(command)
      const { stdout, stderr } = await execa.command(command)
      if (stderr && stderr.length)
        throw `Could not run ${command}`
      writeSync(log, stdout)
      console.log(stdout)
    } catch (err) {
      spinnies.fail(`Could not run ${command}`)
      writeSync(log, err)
      console.log(chalk.red(err))
      process.exit(1)
    }
  })
}

const start = async () => {
  try {
    writeSync(log, `Logs from ${+new Date()}`)

    console.log(chalk.bold('Installing dependencies'))
    await runCommands([`sudo apt install -y ${config.dependencies.join(' ')}`])

    console.log(chalk.bold('Initialzing services'))
    await Promise.all(config.services.map(async service => {
      spinnies.add(service.name)
      if (service.dependencies && service.dependencies.length)
        await runCommands([`sudo apt install -y ${service.dependencies}`])
      await runCommands(service.preInstallCmd)
      await runCommands(`cd ${service.folder} && ${service.installCmd.join(' && ')}`)
      await runCommands(`cd ${service.folder} && ${service.runCmd.join(' && ')}`)
      spinnies.success(service.name)
    }))
  } catch (err) {
    console.log(chalk.red('Critical error occured.'))
    console.log(err)
    process.exit(1)
  }
}

start()
