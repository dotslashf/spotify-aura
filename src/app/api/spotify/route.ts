import { getRefreshToken } from '@/lib/spotify';
import { NextResponse } from 'next/server';

export async function GET() {
  const { access_token } = await getRefreshToken();
  const result = await fetch(
    `https://api.spotify.com/v1/users/null/playlists`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const data = await result.json();

  return NextResponse.json({
    data: data,
  });
}
