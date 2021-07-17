import { promisify  } from "util"
import { exec } from "child_process"

const execSync = async (cmd: string) => {
  const execSync = promisify(exec);
  return await execSync(cmd);
}


export { execSync }