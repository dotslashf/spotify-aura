import { ArtistDetails, PlaylistDetailData } from '@/interface';
import {
  getArtistsGenres,
  getRefreshToken,
  getUserPlaylistDetail,
} from '@/lib/spotify';
import { getRandomObject } from '@/lib/utils';
import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; playlistId: string } }
) {
  const USERNAME_ID_PLAYLIST_ID = `${params.id}:${params.playlistId}`;
  try {
    const isGenreExist = await kv.hgetall(USERNAME_ID_PLAYLIST_ID);
    if (isGenreExist) {
      return NextResponse.json({
        data: isGenreExist.genres,
      });
    }

    const { access_token } = await getRefreshToken();
    const data = (await getUserPlaylistDetail(
      access_token,
      params.playlistId
    )) as PlaylistDetailData;

    const artistIds = Array.from(
      new Set(
        data.items
          .map((track) => {
            return track.track.artists.map((artist) => artist.id);
          })
          .flat()
      )
    );

    const artistsGenres = (await getArtistsGenres(
      access_token,
      artistIds
    )) as ArtistDetails;

    const genres = getRandomObject(
      Array.from(
        new Set(artistsGenres.artists.map((artist) => artist.genres).flat())
      ),
      15
    );

    await kv.hset(USERNAME_ID_PLAYLIST_ID, {
      genres,
    });

    return NextResponse.json({
      data: genres,
    });
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
}
