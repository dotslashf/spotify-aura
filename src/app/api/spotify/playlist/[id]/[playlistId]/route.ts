import { ArtistDetails, PlaylistDetailData } from '@/interface';
import {
  getArtistsGenres,
  getRefreshToken,
  getUserPlaylistDetail,
} from '@/lib/spotify';
import { getRandomObject } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { playlistId: string } }
) {
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

  return NextResponse.json({
    data: getRandomObject(
      Array.from(
        new Set(artistsGenres.artists.map((artist) => artist.genres).flat())
      ),
      15
    ),
  });
}
