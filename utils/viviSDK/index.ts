import * as api from './baseRequest'

// Types
import { TRouterResponse } from '../../types/Router'
import { TBansResponse } from '../../types/Banned'


class Vivi {
  private routerId: string

  constructor() {
    this.routerId = ''
    // Get Balena
  }

  // Getter & Setters
  getRouterId(): string { return this.routerId }

  // Utils
  async isOnline(): Promise<boolean> {
    const res = await api.get<string>('/')
    if (!res) return false
    return true
  }

  /**
   * Router
   * 
   * Endpoint relative to router
   */

  /**
   * Update Router informations
   *
   * @param name name of the router
   * @param publicUrl public url of the raspi
   */
  async updateRouter(name: string, publicUrl: string): Promise<TRouterResponse | undefined> {
    const body = {
      name,
      url: publicUrl
    }
    const res = await api.patch<TRouterResponse>(`/router/${this.routerId}`, undefined, body)
    return res
  }

  /**
   * Register the current device as new available router
   *
   * @param name name of the router
   * @param publicUrl public url of the router
   */
  async pushRouter(name: string, publicUrl: string): Promise<TRouterResponse | undefined> {
    const body = {
      name,
      url: publicUrl
    }
    const res = await api.post<TRouterResponse>('/router', undefined, body)
    if (!res || res.error) return
    this.routerId = res._id
    return res
  }

  /**
   * IP
   * 
   * Informations relative to banned IP/Services
   */

  /**
   * Get all IPs
   */
  async getIp(): Promise<boolean> {
    return false
  }

  /**
   * BAN
   * 
   * Banned people on the network
   */
  async getBan(): Promise<TBansResponse | undefined> {
    return await api.get('/bans')
  }
}

export default Vivi