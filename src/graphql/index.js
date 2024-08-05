// Dependencia que crea un servidor
const { ApolloServer } = require('@apollo/server')
// Playground incluido en @apollo/server
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default')
// Middleware de Express también en @apollo/server
const { expressMiddleware } = require('@apollo/server/express4')

const { loadFiles } = require('@graphql-tools/load-files');

const resolvers = {
  Query: {
    hello: () => 'Hola mundo',
    getPerson: (_, args) => `Hello, my name is ${args.name}, I'm ${args.age} years old!`,
    getInt: (_, args) => args.age,
    getFloat: (_, args) => args.price,
    getString: () => 'palabra',
    getBoolean: () => true,
    getID: () => '121212',
    getNumbers: (_, args) => args.numbers,
    getProduct: () => {
      return {
        id: '1212',
        name: 'product 1',
        price: 100.12,
        description: 'bla bla bla',
        image: 'http://image.asas',
        createdAt: new Date().toISOString()
      }
    }

  }
}

const useGraphQL = async (app) => {
  const server = new ApolloServer({
    typeDefs: await loadFiles('./src/**/*.graphql'),
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
