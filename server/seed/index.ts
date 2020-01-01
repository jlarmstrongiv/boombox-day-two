import { prisma } from '../generated/prisma-client';
import fg from 'fast-glob';
import * as fs from 'fs-extra';
import path from 'path';
import faker from 'faker';

// TODO Fix song numbering

// npx ts-node-dev --no-notify --respawn --transpileOnly ./seed/index
// npx ts-node-dev --no-notify --transpileOnly ./seed/index
/**
 * ======================
 * Data Structure Example
 * ======================
 */
const artistsExample = [
  {
    name: 'Anri (杏里)',
    folderPath: 'music/Anri (杏里)/',
    albums: [
      {
        name: 'Timely!!',
        artwork: 'music/Anri (杏里)/Timely!!/Folder.jpg',
        release: '1983.12.05',
        bitrate: '320 Kbps',
        format: '.mp3',
        folderPath: 'music/Anri (杏里)/Timely!!/',
        songs: [
          {
            name: '01. CAT’S EYE(ALBUM VERSION)',
            filePath:
              'music/Anri (杏里)/Timely!!/01. CAT’S EYE(ALBUM VERSION)..mp3',
            format: '.mp3',
          },
        ],
      },
    ],
  },
];

/**
 * ================
 * Helper Functions
 * ================
 */
const escapeGlob = (glob = '') => {
  // Other troublesome characters
  // https://www.npmjs.com/package/fast-glob#advanced-syntax
  return glob.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
};

const randomNumberBetween = (min = 0, max = 0) => {
  // https://stackoverflow.com/a/10134261
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createArrayOfLength = (length = 0) => {
  // https://stackoverflow.com/a/28599347
  return Array.from(Array(length));
};

(async () => {
  //

  /**
   * =================
   * Real Data Example
   * =================
   */

  /**
   * Artists
   */
  let artists = [];
  //
  const artistFilePaths = await fg(
    '**/music/**/artist.json',
  );

  for (const artistFilePath of artistFilePaths) {
    const artistJson = await fs.readJson(artistFilePath);
    const artistFolderName = artistFilePath.split(path.sep)[
      artistFilePath.split(path.sep).length - 2
    ];

    /**
     * Albums
     */
    let albums = [];
    //
    const albumFilePaths = await fg(
      `**/music/${escapeGlob(
        artistFolderName,
      )}/**/album.json`,
    );

    for (const albumFilePath of albumFilePaths) {
      const albumJson = await fs.readJson(albumFilePath);
      const albumFolderName = albumFilePath.split(path.sep)[
        albumFilePath.split(path.sep).length - 2
      ];

      const year = !isNaN(
        Number(albumJson.release.split('.')[0]),
      )
        ? Number(albumJson.release.split('.')[0])
        : null;
      const month = !isNaN(
        Number(albumJson.release.split('.')[1]),
      )
        ? Number(albumJson.release.split('.')[1])
        : null;
      const day = !isNaN(
        Number(albumJson.release.split('.')[2]),
      )
        ? Number(albumJson.release.split('.')[2])
        : null;

      // album artwork
      const artworks = await fg(
        `**/music/${escapeGlob(
          artistFolderName,
        )}/${escapeGlob(albumFolderName)}/*.(jpg|jpeg|png)`,
      );
      // TODO select first album artwork name COVER or FOLDER
      const artworkFullPath = artworks[0];
      // TODO add / in front of music for absolute paths for react
      const artwork = `/music/${artistFolderName}/${albumFolderName}/${
        path.parse(artworkFullPath).base
      }`;

      /**
       * Songs
       */
      let songs = [];
      //
      const songFilePaths = await fg(
        `**/music/${escapeGlob(
          artistFolderName,
        )}/${escapeGlob(albumFolderName)}/*.${
          albumJson.format
        }`,
      );

      for (const songFilePath of songFilePaths) {
        const songName = path.parse(songFilePath).name;
        const songFormat = path.parse(songFilePath).ext;

        songs.push({
          name: songName,
          filePath: `music/${artistFolderName}/${albumFolderName}/${songName}.${songFormat}`,
          format: songFormat,
        });
      }
      // console.log(songNames);
      // console.log(songFormats);

      albums.push({
        name: albumJson.album,
        artwork,
        release: albumJson.release,
        bitrate: albumJson.bitrate,
        format: '.' + albumJson.format,
        year: year,
        month: month,
        day: day,
        folderPath: `music/${artistFolderName}/${albumFolderName}/`,
        songs,
      });
    }
    // console.log(albumJsons);
    // console.log(albumFolderNames);
    // console.log(albumArtworks);
    artists.push({
      name: artistJson.artist,
      folderPath: `music/${artistFolderName}/`,
      albums,
    });
  }
  // console.log(artistJsons);
  // console.log(artistFolderNames);

  // RESULT
  // console.log(JSON.stringify(artists, null, 2));
  // await fs.writeJson('./seed/demo-real-data.json', artists, { spaces: 2 });

  /**
   * =================
   * Fake Data Example
   * =================
   */
  // Faker.js
  // https://www.npmjs.com/package/faker
  // https://fakerjsdocs.netlify.com/
  // console.log(faker.name.firstName());
  // console.log(faker.fake('{{name.firstName}} {{name.lastName}}'));

  const numberOfArtists = 2;
  const numberOfAlbums = 2;
  const numberOfSongs = 2;

  // loop 1
  const fakeArtists = createArrayOfLength(
    numberOfArtists,
  ).map(_ => {
    const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    return {
      name,
      folderPath: `/music/${name}/`,
      // loop 2
      albums: createArrayOfLength(numberOfAlbums).map(_ => {
        const album = faker.company.bsAdjective();
        const year = randomNumberBetween(1970, 1999);
        const month = randomNumberBetween(1, 12);
        const day = randomNumberBetween(1, 28);
        return {
          name: album,
          // artwork: `music/${name}/${album}/Folder.jpg`,
          release: `${year}.${month}.${day}`,
          year,
          month,
          day,
          bitrate: '320 Kbps',
          format: '.mp3',
          folderPath: `music/${name}/${album}/`,
          // loop 3
          songs: createArrayOfLength(numberOfSongs).map(
            (_, index) => {
              const song = faker.company.catchPhrase();
              return {
                name: `${(index + 1)
                  .toString()
                  .padStart(2, '0')}. ${song}`,
                filePath: `music/${name}/${album}/${song}.mp3`,
                format: '.mp3',
              };
            },
          ),
        };
      }),
    };
  });

  // RESULT
  // console.log(JSON.stringify(fakeArtists, null, 2));
  // await fs.writeJson('./seed/demo-fake-data.json', fakeArtists, { spaces: 2 });

  /**
   * ====================
   * Insert into Database
   * ====================
   */
  // npx prisma reset
  // in case of errors, just reset the database

  const seed = async (artists = []) => {
    for (const artist of artists) {
      const dbArtist = await prisma.createArtist({
        name: artist.name,
        folderPath: artist.folderPath,
      });

      for (const album of artist.albums) {
        const dbAlbum = await prisma.createAlbum({
          name: album.name,
          folderPath: album.folderPath,
          artwork: album.artwork,
          release: album.release,
          year: album.year,
          month: album.month,
          day: album.day,
          bitrate: album.bitrate,
          format: album.format,
          artist: {
            connect: {
              id: dbArtist.id,
            },
          },
        });

        for (const song of album.songs) {
          const dbSong = await prisma.createSong({
            name: song.name,
            format: song.format,
            filePath: song.filePath,
            artist: {
              connect: {
                id: dbArtist.id,
              },
            },
            album: {
              connect: {
                id: dbAlbum.id,
              },
            },
          });
        }
        // end song loop
      }
      // end album loop
    }
    // end artist loop
  };

  console.log('Seeding Artists…');
  await seed(artists);
  console.log('Seeding Fake Artists…');
  await seed(fakeArtists);
  //
})();

//

// mac bitrate
// afinfo filename |grep "bit rate"

// rename with index
// https://stackoverflow.com/a/5418035
// rename 's/\d+/sprintf("%02d",$&)/e' *.mp3
