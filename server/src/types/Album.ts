import { prismaObjectType, prismaExtendType } from 'nexus-prisma';
import { intArg } from 'nexus';
import titleCase from 'ap-style-title-case';

const Album = prismaObjectType({
  name: 'Album',
  description: 'A music album containing songs by an artist',
  definition(t) {
    t.prismaFields({ filter: ['release'] });
    t.string('nameTitleCase', {
      description: 'Name, but in title case, APA Style',
      resolve: ({ name }) => titleCase(name.toLowerCase()),
    });
  },
});

export const decadeMusic = prismaExtendType({
  type: 'Query',
  definition(t) {
    t.field('decadeMusic', {
      ...t.prismaType.albums,
      args: {
        decade: intArg({
          nullable: false,
          description: 'Two digit decade of music from 1930s–2020s',
        }),
      },
      async resolve(_, { decade }, ctx) {
        // Error Handling
        if (decade < 0) {
          throw new Error('Decade must be a positive integer');
        }
        if (decade > 100) {
          throw new Error('Decade must be below 100');
        }
        if (decade % 10 !== 0) {
          throw new Error('Decade must end in 0');
        }
        // Fetching
        let year;
        if (decade < 30) {
          year = 2000 + decade;
        }
        if (decade >= 30) {
          year = 1900 + decade;
        }
        return ctx.prisma.albums({
          where: {
            year_gte: year,
            year_lte: year + 9,
          },
        });
      },
    });
  },
});

export default Album;
