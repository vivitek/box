import { promisify } from 'util';
import { exec } from 'child_process';

const execSync = async (cmd: string) => {
  const _execSync = promisify(exec);
  return await _execSync(cmd);
};

export { execSync };
