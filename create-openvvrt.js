const  chalk = require("chalk")
const { openSync, writeSync } = require("fs")
const Spinnies = require("spinnies")
const execa = require("execa")

const config = require('./config/openvvrt.config.json')
const log = openSync(`${+new Date()}.log`, "a+")
const spinnies = new Spinnies()

const runCommands = async (name, commands, execPath) => {
  if (!commands || commands.length === 0)
    return
 await Promise.all(commands.map(async command => {
    try {
      spinnies.add(name)
      const { stdout, stderr } = await execa.command(command, {execPath})
	    console.log(stderr)
      if (stderr && !stderr.startsWith("\nWARNING"))
        throw stderr
      writeSync(log, stdout)
      spinnies.succeed(name)
      console.log(stdout)
    } catch (err) {
      spinnies.fail(name)
      writeSync(log, String(err))
      console.log(chalk.red(err))
      process.exit(1)
    }
  }))
}

const start = async () => {
  try {
    writeSync(log, `Logs from ${+new Date()}`)

    console.log(chalk.bold('Installing dependencies'))
    await runCommands([`sudo apt install -y ${config.dependencies.join(' ')}`])

    console.log(chalk.bold('Initializing services'))
    await Promise.all(config.services.map(async service => {
      spinnies.add(service.name)
      const path = `${process.cwd()}/${service.name}`
      if (service.dependencies && service.dependencies.length)
        await runCommands("Install dependencies", [`sudo apt install -y ${service.dependencies.join(' ')}`])
      await runCommands("Run pre-install commands", service.preInstallCmd)
      await runCommands("Run install commands", service.installCmd, path)
      await runCommands("Start service", service.runCmd, path)
      spinnies.success(service.name)
      console.log(chalk.green("All done !"))
    }))
  } catch (err) {
    console.log(chalk.red('Critical error occured.'))
    console.log(err)
    process.exit(1)
  }
}

start()
