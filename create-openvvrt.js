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
      const { stdout, stderr } = await execa.command(command, {execPath, preferLocal: true, path: execPath, cwd: execPath})
      writeSync(log, String(stdout))
      console.log(stdout)
      if (stderr && !stderr.startsWith("\nWARNING"))
        throw stderr
      spinnies.succeed(name)
    } catch (err) {
      spinnies.fail(name)
      writeSync(log, String(err))
      console.log(chalk.red(err))
      process.exit(1)
    }
  })
}


/* TODO */
// Start openvvrt api on boot
// Add a cronjob to pull master every day
// Generate and store uuid & name using openvvrt

const start = async () => {
  try {
    writeSync(log, `Logs from ${+new Date()}\n`)

    console.log(chalk.bold('Installing dependencies'))
    await Aigle.eachSeries(config.dependencies, async (dependency) => {
      spinnies.add(dependency)
      await runCommands(dependency, [`sudo apt install -y ${dependency}`], process.cwd())
    })

    console.log(chalk.bold('Initializing services'))
    await Aigle.eachSeries(config.services, async (service) => {
      const path = `${process.cwd()}/${service.folder}`
      
      spinnies.add(service.name)
      await runCommands("Run pre-install commands", service.preInstallCmd, process.cwd())
      await runCommands("Run install commands", service.installCmd, path)
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
