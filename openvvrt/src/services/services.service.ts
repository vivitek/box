import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common"
import { execSync } from "../utils"
import Aigle from "aigle"

@Injectable()
export class ServicesService {
  private readonly SERVICES_FOLDER_PATH = "~/Delivery/Eip/box"
  public async getAll() {
    const { stdout, stderr } = await execSync("pm2 jlist")
    if (stderr)
      throw new InternalServerErrorException(stderr)
    return JSON.parse(stdout).map(e => {
      const {name, pm_id, pm2_env} = e
      return {
        name,
        id: pm_id,
        env: pm2_env,
      }
    })
  }

  public async reboot(service: string) {
    const s = service || await this.getAllServicesNames()
    const { stderr } = await execSync(`pm2 restart ${s}`)
    if (stderr)
      throw new BadRequestException(stderr)
    return s.split(' ')
  }

  public async start(service: string) {
    const s = service || await this.getAllServicesNames()
    await Aigle.eachSeries(s.split(' '), async (e) => {
      const { stderr } = await execSync(`cd ${this.SERVICES_FOLDER_PATH}/${e} && pm2 start -f dist/index.js --name ${e}`)
      if (stderr)
        throw new InternalServerErrorException(stderr)

    })
    return s.split(' ')
  }

  public async build(service: string) {
    const s = service || await this.getAllServicesNames()
    await Aigle.eachSeries(s.split(' '), async (e: string) => {
      const { stderr } = await execSync(`cd ${this.SERVICES_FOLDER_PATH}/${e} && npm i  && tsc`)
      if (stderr)
        throw new InternalServerErrorException(stderr)
    })
    return s.split(' ')
  }

  public async stop(service: string) {
    const s = service || await this.getAllServicesNames()
    const { stderr } = await execSync(`pm2 kill ${s} && pm2 delete ${s}`)
    if (stderr)
      throw new InternalServerErrorException(stderr)
    return s.split(' ')
  }

  public async update(service: string) {
    await this.stop(service)
    return await this.build(service)
  }


  private async getAllServicesNames() {
    return "dhcp dhcpd pcap graphql"
  }
}