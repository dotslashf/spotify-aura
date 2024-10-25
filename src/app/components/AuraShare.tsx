'use client';

import AuraCard from '@/components/AuraCard';
import AuraCardSkeleton from '@/components/AuraCardSkeleton';
import { AuraJSON, Playlist } from '@/interface';
import { decodeSpotifyAuraId } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

interface AuraShareProps {
  id: string;
}
export default function AuraShare({ id }: AuraShareProps) {
  const decodedSpotifyAuraId = decodeSpotifyAuraId(id);

  const {
    data: aura,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['auraId', id],
    queryFn: async () => {
      const auraRes = await fetch(`/api/gen`, {
        method: 'POST',
        body: JSON.stringify({
          keys: `${decodedSpotifyAuraId}:aura`,
        }),
      });
      const auraData = await auraRes.json();

      if (!auraRes.ok) {
        throw new Error('Aura not found');
      }

      const message = auraData.message as AuraJSON;
      return {
        aura: message.translations['english'],
        colors: message.auraColors,
        score: message.auraScore,
      };
    },
    retry: 2,
  });

  const { data: genres } = useQuery({
    queryKey: ['genres', decodedSpotifyAuraId],
    queryFn: async () => {
      const [spotifyUserId, playlistId] = decodedSpotifyAuraId.split(':');
      const res = await fetch(
        `/api/spotify/playlist/${spotifyUserId}/${playlistId}`,
        {
          cache: 'no-store',
          next: { revalidate: 0 },
        }
      );
      const data = await res.json();
      return data.data;
    },
  });

  if (error) return <div>{error.message}</div>;

  return (
    <div className="max-w-lg w-full">
      {isLoading && <AuraCardSkeleton />}
      {aura && (
        <AuraCard
          genres={genres ? genres : []}
          auraDescription={aura.aura.auraDescription}
          colorMeanings={aura.aura.colorMeanings}
          colors={aura.colors}
          keyPoint={aura.aura.keyPoint}
          musicNickname={aura.aura.musicNickname}
          score={aura.score}
          uniqueId={`${decodedSpotifyAuraId}`}
        />
      )}
    </div>
  );
}