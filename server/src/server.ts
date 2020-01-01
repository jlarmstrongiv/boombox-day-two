import { ApolloServer } from 'apollo-server';
import { prisma } from '../generated/prisma-client';
import schema from './schema';

const server = new ApolloServer({
  schema,
  context: { prisma },
});

export default server;
