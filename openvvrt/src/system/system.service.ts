import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { freemem, totalmem, cpus, uptime } from 'os'
import { exec } from "child_process"
import { execSync } from "../utils"

@Injectable()
export class SystemService {
  public async cpu() {
    const stats = [];

    cpus().forEach((cpu, idx) => {
      const { user, sys, idle } = cpu.times;
      const total = Object.keys(cpu.times)
        .map((e) => cpu.times[e])
        .reduce((prev, curr) => prev + curr);

      stats.push({
        name: `cpu${idx}`,
        user: this.percent(user, total),
        sys: this.percent(sys, total),
        used: this.percent(user + sys, total),
        idle: this.percent(idle, total),
      });
    });
    stats.push({
      name: 'average',
      user: this.average(stats, 'user'),
      sys: this.average(stats, 'sys'),
      used: this.average(stats, 'used'),
      idle: this.average(stats, 'idle'),
    });
    return stats;
  }

  public ram() {
    const left = freemem();
    const total = totalmem();
    const used = total - left;
    return {
      total,
      used,
      left,
      percentage: this.percent(used, total),
    };
  }

  public async storage() {
    const { stdout } = await execSync("df -h | grep '/$'");
    const stat = stdout.split(' ').filter((e) => e);

    return {
      fs: stat[0],
      total: stat[1],
      used: stat[2],
      left: stat[3],
      percent: stat[4],
    };
  }

  public getUptime() {
    return uptime();
  }

  public async logs(service: string, lines: string) {
    if (Number(lines) === NaN)
      throw new BadRequestException("Lines should be an integer")
    const { stdout, stderr } = await execSync(`pm2 logs --nostream --lines ${lines} ${service}`);
    if (stderr)
      throw new InternalServerErrorException(stderr)
    return stdout
  }

  public reboot() {
    exec('sudo systemctl reboot');
  }

  public poweroff() {
    exec('sudo systemctl poweroff');
  }

  private average = (arr: Array<{}>, key: string) => {
    const list = arr.map((e) => e[key]);
    return Number(
      (list.reduce((prev, curr) => prev + curr) / list.length).toFixed(2),
    );
  };

  private percent = (value: number, max: number) => {
    return Number(((100 * value) / max).toFixed(2));
  };
}
