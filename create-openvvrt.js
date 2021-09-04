const  chalk = require("chalk")
const { openSync, writeSync } = require("fs")
const Spinnies = require("spinnies")
const execa = require("execa")
const Aigle = require("aigle")
const config = require('./config/openvvrt.config.json')

const log = openSync(`${+new Date()}.log`, "a+")
const spinnies = new Spinnies()

const runCommands = async (name, commands, {execPath, hideLogs = true}) => {
  if (!commands || commands.length === 0)
    return
  await Aigle.eachSeries(commands, async command => {
    try {
      spinnies.add(name, {indent: 4})
      const { stdout, stderr } = await execa.command(command, {execPath, preferLocal: true, path: execPath, cwd: execPath})
      writeSync(log, String(stdout))
      if (!hideLogs)
        console.log(stdout)
      if (stderr && !stderr.startsWith("\nWARNING") && !stderr.startsWith("npm WARN"))
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
// Start hotspot
// Add a cronjob to pull master every day
// Start openvvrt api on boot
// Generate and store uuid & name using openvvrt

const start = async () => {
  try {
    writeSync(log, `Logs from ${+new Date()}\n`)

    console.log(chalk.bold('Installing dependencies'))
    await Aigle.eachSeries(config.dependencies, async (dependency) => {
      spinnies.add(dependency)
      await runCommands(dependency, [`sudo apt install -y ${dependency}`], {execPath: process.cwd()})
    })
    
    console.log(chalk.bold('Installing node dependencies'))
    await Aigle.eachSeries(config.nodeDependencies, async (dependency) => {
      spinnies.add(dependency)
      await runCommands(dependency, [`sudo npm i -g ${dependency}`], {execPath: process.cwd()})
    })

    console.log(chalk.bold('Initializing services'))
    await Aigle.eachSeries(config.services, async (service) => {
      const path = `${process.cwd()}/${service.folder}`
      
      spinnies.add(service.name, {color: "white", succeedColor: "white"})
      await runCommands("Run pre-install commands", service.preInstallCmd, {execPath: process.cwd()})
      await runCommands("Run install commands", service.installCmd, {execPath: path})
      await runCommands("Start service", service.runCmd, {execPath: path})
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
