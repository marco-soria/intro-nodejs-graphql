// Dependencia que crea un servidor
const { ApolloServer } = require('@apollo/server')
// Playground incluido en @apollo/server
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default')
// Middleware de Express también en @apollo/server
const { expressMiddleware } = require('@apollo/server/express4')

const typeDefs = `
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hola mundillo'
  }
}

const useGraphQL = async (app) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault
    ]
  })

  await server.start()

// Uso del middleware en Express
  app.use(expressMiddleware(server,{
    context: async ({req}) => ({
      token: req.headers.token
    })
  }))
}

module.exports = useGraphQL
