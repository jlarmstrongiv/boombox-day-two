import Query from './Query';
import Mutation from './Mutation';

import Artist from './Artist';
import Album, { decadeMusic } from './Album';
import Song from './Song';
import Playlist from './Playlist';

const types = [Query, Mutation, Artist, Album, Song, Playlist, decadeMusic];

export default types;
