import gql from 'graphql-tag'

const CREATE_ROUTER = gql`
    mutation($createRouterData: RouterCreationInput!) {
        createRouter (createRouterData: $createRouterData)
        {
            _id
            name
            url
        }
    }
`;

export {
    CREATE_ROUTER
};