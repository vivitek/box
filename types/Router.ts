export interface RouterCreation {
  name: string
  url: string
}

export interface RouterUpdate {
  name?: string
  url?: string
}

export interface RouterDTO {
  _id: string
  name: string
  url: string
}

export type TRouterResponse = {
  error?: string
} & RouterDTO

export type TRoutersResponse = {
  error?: string
} & RouterDTO[]