export enum PCAPTYPE {
  REQUEST,
  RESPONSE,
  PUSH,
}

export type PcapPacket = {
  source: string
  destination: string
  service: string | undefined
  type: PCAPTYPE
}
