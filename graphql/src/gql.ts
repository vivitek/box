import { gql } from "apollo-boost";

export const BAN_UPDATED =
  gql`
    subscription($routerSet: String!) {
      banUpdated(routerSet: $routerSet) {
        address
        banned
      }
    }
  `

export const SERVICE_UPDATED =
  gql`
    subscription($routerId: String!) {
      serviceUpdated(routerId: $routerId) {
        name
        banned
        ips
      }
    }
`

export const GET_BANS =
  gql`
      query($id: String!) {
          getBans(id: $id) {
            _id
            address
            banned
        }
    }
  `

export const CREATE_BAN =
  gql`
    mutation createBan($banCreationData: BanCreation!) {
      createBan(banCreationData: $banCreationData) {
        _id
      }
    }
  `

export const CREATE_BOX =
  gql`
    mutation createRouter($createRouterData: RouterCreationInput!) {
      createRouter(createRouterData: $createRouterData) {
        router {
          _id
        }
      }
    }
  `

export const CREATE_SERVICE =
  gql`
    mutation createService($serviceCreationData: ServiceCreationInput!) {
      createService(serviceCreationData: $serviceCreationData) {
        _id
      }
    }
  `
