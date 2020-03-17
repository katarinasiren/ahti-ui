import { gql } from 'apollo-boost';

const FEATURE_QUERY = gql`
  query feature($ahtiId: String) {
    feature(ahtiId: $ahtiId) {
      id
      type
      geometry {
        type
        coordinates
      }
      properties {
        ahtiId
        category {
          id
        }
        name
        tags {
          id
          name
        }
        description
        shortDescription @client
        url
        contactInfo {
          phoneNumber
          address {
            postalCode
            municipality
          }
        }
        images {
          url
          copyrightOwner
        }
        source {
          system
        }
        modifiedAt
        ferries @client {
          properties {
            ahtiId
            name
          }
        }
        harbors @client {
          properties {
            ahtiId
            name
          }
        }
      }
    }
  }
`;

export default FEATURE_QUERY;
