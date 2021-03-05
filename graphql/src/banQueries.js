const gql = require('graphql-tag');

const GET_BANS = gql`
    query($id: String!) {
        getBans(id: $id)
        {
            _id
            address
            banned
        }
    }
`;

const SUBSCRIBE_BAN = gql`
    subscription($routerSet: String!) {
        banUpdated(routerSet: $routerSet)
        {
            address
            banned
        }
    }
`;

const CREATE_BAN = gql`
    mutation($banCreationData: BanCreation!) {
        createBan (banCreationData: $banCreationData)
        {
            _id
            address
            banned
        }
    }
`;

module.exports = {
    GET_BANS,
    SUBSCRIBE_BAN,
    CREATE_BAN
};