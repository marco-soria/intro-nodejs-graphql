const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default')
const { loadFiles } = require('@graphql-tools/load-files')
const { buildContext } = require('graphql-passport')
const { typeDefs: scalarsTypeDefs, resolvers: scalarsResolvers } = require('graphql-scalars');

const resolvers = require('./resolvers')

//crear servidor de GraphQL
const useGraphql = async (app) => {
    const typeDefs = [
      ...await loadFiles('./src/**/*.graphql'),
      scalarsTypeDefs,
    ];
    const allResolvers = [
      resolvers,
      scalarsResolvers,
    ];
    const server = new ApolloServer({
      typeDefs,
      resolvers: allResolvers,// llamada de Querys y Mutations
        plugins: [
            // Install a landing page plugin based on NODE_ENV
            process.env.NODE_ENV === 'production'
                ? ApolloServerPluginLandingPageLocalDefault({
                    graphRef: 'API-graphql@graph-variant',
                    footer: false,
                })
                : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
        ],
    });
    await server.start();
    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: async ({req, res}) => buildContext({req, res})
        }),
    );
};

module.exports = useGraphql;
