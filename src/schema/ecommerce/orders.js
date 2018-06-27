import { graphql, GraphQLString } from "graphql"
import { connectionDefinitions } from "graphql-relay"
import { OrderConnection } from "schema/ecommerce/types/order"

export const Orders = {
  name: "Orders",
  type: OrderConnection,
  description: "Returns list of orders",
  args: {
    userId: { type: GraphQLString },
    partnerId: { type: GraphQLString },
    state: { type: GraphQLString },
  },
  resolve: (
    _parent,
    { userId, partnerId, state },
    context,
    { rootValue: { exchangeSchema } }
  ) => {
    const query = `
      query EcommerceOrders($userId: String, $partnerId: String, $state: EcommerceOrderStateEnum, $sort: EcommerceOrderConnectionSortEnum) {
        ecommerce_orders(userId: $userId, partnerId: $partnerId, state: $state, sort: $sort) {
          edges{
            node{
              id
              code
              currencyCode
              state
              partnerId
              userId
              updatedAt
              createdAt
              lineItems{
                edges{
                  node{
                    id
                    priceCents
                    artworkId
                    editionSetId
                    quantity
                  }
                }
              }
            }
          }
        }
      }
    `
    return graphql(exchangeSchema, query, null, context, {
      userId,
      partnerId,
      state,
    }).then(a => a.data.ecommerce_orders)
  },
}