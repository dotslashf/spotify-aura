import { getRefreshToken, getUserPlaylists } from '@/lib/spotify';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { access_token } = await getRefreshToken();
  const data = await getUserPlaylists(access_token, params.id);

  if (!data) {
    return NextResponse.json({
      error: 'Not found'
    }, { status: 404 })
  }

  return NextResponse.json({
    data,
  });
}
