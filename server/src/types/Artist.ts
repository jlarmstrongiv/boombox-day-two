import { prismaObjectType } from 'nexus-prisma';
import titleCase from 'ap-style-title-case';

const Artist = prismaObjectType({
  name: 'Artist',
  description: 'A music artist, who creates albums with songs',
  definition(t) {
    t.prismaFields(['*']);
    t.string('nameTitleCase', {
      description: 'Name, but in title case, APA Style',
      resolve: ({ name }) => titleCase(name.toLowerCase()),
    });
  },
});

export default Artist;
