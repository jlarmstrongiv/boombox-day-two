import { prismaObjectType } from 'nexus-prisma';

const Playlist = prismaObjectType({
  name: 'Playlist',
  description: 'A playlist containing songs',
  definition(t) {
    t.prismaFields(['*']);
  },
});

export default Playlist;
