import gql from 'graphql-tag';

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
        details {
          harbor {
            moorings
            depth {
              min
              max
            }
          }
        }
        children {
          properties {
            ahtiId
            name
            category {
              id
            }
          }
        }
        parents {
          properties {
            ahtiId
            name
            category {
              id
            }
          }
        }
        category {
          id
        }
        links {
          type
          url
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
      }
    }
  }
`;

export default FEATURE_QUERY;
