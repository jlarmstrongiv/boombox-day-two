import { prismaObjectType } from 'nexus-prisma';

const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields([
      'createPlaylist',
      'updatePlaylist',
      'upsertPlaylist',
      'deletePlaylist',
    ]);
  },
});

export default Mutation;
