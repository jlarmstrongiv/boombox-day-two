import { prismaObjectType } from 'nexus-prisma';
import titleCase from 'ap-style-title-case';

const Song = prismaObjectType({
  name: 'Song',
  description: 'A song in an album by an artist',
  definition(t) {
    t.prismaFields(['*']);
    t.string('nameTitleCase', {
      description: 'Name, but in title case, APA Style',
      resolve: ({ name }) => titleCase(name.toLowerCase()),
    });
  },
});

export default Song;
