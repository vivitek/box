const gql = require('graphql-tag');

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

module.exports = {
    CREATE_ROUTER
};

