const  chalk = require("chalk")
const { openSync, writeSync } = require("fs")
const Spinnies = require("spinnies")
const execa = require("execa")
const Aigle = require("aigle")
const config = require('./config/openvvrt.config.json')

const log = openSync(`${+new Date()}.log`, "a+")
const spinnies = new Spinnies()

const runCommands = async (name, commands, execPath) => {
  if (!commands || commands.length === 0)
    return
  await Aigle.eachSeries(commands, async command => {
    try {
      spinnies.add(name)
      const { stdout, stderr } = await execa.command(command, {execPath})
      console.log(stdout)
      if (stderr && !stderr.startsWith("\nWARNING"))
        throw stderr
      writeSync(log, stdout)
      spinnies.succeed(name)
    } catch (err) {
      spinnies.fail(name)
      writeSync(log, String(err))
      // console.log(chalk.red(err))
      throw err
      process.exit(1)
    }
  })
}

const start = async () => {
  try {
    writeSync(log, `Logs from ${+new Date()}\n`)

    console.log(chalk.bold('Installing dependencies'))
    await runCommands([`sudo apt install -y ${config.dependencies.join(' ')}`])

    console.log(chalk.bold('Initializing services'))
    await Aigle.eachSeries(config.services, async (service) => {
      const path = `${process.cwd()}/${service.name}`
      
      spinnies.add(service.name)
      await runCommands("Run pre-install commands", service.preInstallCmd, process.cwd())
      //await runCommands("Run install commands", [service.installCmd.join(' && ')], path)
      //await runCommands("Start service", service.runCmd, path)
      spinnies.succeed(service.name)
    })

    console.log(chalk.bold("All done !"))
  } catch (err) {
    console.log(chalk.red('Critical error occured.'))
    console.log(err)
    process.exit(1)
  }
}

start()
