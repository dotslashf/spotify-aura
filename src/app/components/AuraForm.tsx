'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Aura, AuraColors, AuraJSON, Playlist } from '@/interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { ArrowDownToLine, Loader2Icon } from 'lucide-react';
import AuraCard from '@/components/AuraCard';
import ThemeToggle from './ThemeToggle';
import { getSpotifyUsername } from '@/lib/utils';

const FormSchema = z.object({
  spotifyUserId: z.string().min(2, {
    message: 'Spotify username must be at least 2 characters.',
  }),
  playlistId: z.string({
    required_error: 'Playlist cannot be null',
  }),
  languages: z.enum(['id', 'en']).default('en'),
});

const BASE_API_URL = 'api/spotify/playlist';

export default function AuraForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      spotifyUserId: '',
      languages: 'en',
    },
  });
  const [genres, setGenres] = useState<string[]>([]);
  const [aura, setAura] = useState<{
    aura: Aura;
    colors: AuraColors;
    score: number;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  async function fetchUserPlaylist() {
    setIsLoading(true);
    try {
      const spotifyUserId = getSpotifyUsername(form.getValues('spotifyUserId'));

      if (!spotifyUserId) {
        return toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Spotify ID cannot be empty.',
        });
      }

      const res = await fetch(`${BASE_API_URL}/${spotifyUserId}`);

      if (!res.ok) {
        setPlaylists([]);
        return toast({
          variant: 'destructive',
          title: 'Error',
          description: 'User not found',
        });
      }

      const data = await res.json();
      const items = data.data.items as Playlist[];
      setPlaylists(items);
    } catch (error) {
      return toast({
        variant: 'destructive',
        title: 'Error',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        description: error.message,
      });
    }
  }

  async function handleFetchPlaylist() {
    await fetchUserPlaylist();
    setIsLoading(false);
  }

  const generateAuraMutation = useMutation({
    mutationFn: async (values: z.infer<typeof FormSchema>) => {
      const playlistRes = await fetch(
        `${BASE_API_URL}/${values.spotifyUserId}/${values.playlistId}`,
        { cache: 'no-store', next: { revalidate: 0 } }
      );
      const playlistData = await playlistRes.json();
      setGenres(playlistData.data);

      const auraRes = await fetch(`api/gen`, {
        method: 'POST',
        body: JSON.stringify({
          genres: playlistData.data,
          keys: `${form.getValues('spotifyUserId')}:${form.getValues(
            'playlistId'
          )}:aura`,
        }),
      });
      const auraData = await auraRes.json();

      return auraData.message as AuraJSON;
    },
    onSuccess: (data) => {
      const language =
        form.getValues('languages') === 'en' ? 'english' : 'indonesian';
      setAura({
        aura: data.translations[language],
        colors: data.auraColors,
        score: data.auraScore,
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate aura. Please try again.',
      });
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    generateAuraMutation.mutate(values);
  }

  return (
    <Card className="max-w-xl w-full">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Spotify Aura 🔮</CardTitle>
        <ThemeToggle />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <FormField
                control={form.control}
                name="spotifyUserId"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Spotify Username</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="fadhluu or https://open.spotify.com/user/fadhluu"
                          {...field}
                        />
                        <Button
                          onClick={handleFetchPlaylist}
                          type={'button'}
                          disabled={isLoading}
                        >
                          Get
                          {isLoading ? (
                            <Loader2Icon className="w-4 ml-2 animate-spin" />
                          ) : (
                            <ArrowDownToLine className="w-4 h-4 ml-2" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Spotify username can be checked at profile.
                      <br />
                      It looks like this https://open.spotify.com/user/fadhluu
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {playlists.length > 0 && (
                <>
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="playlistId"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Playlist</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a playlists" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {playlists.map((playlist) => {
                                  return (
                                    <SelectItem
                                      value={playlist.id}
                                      key={playlist.id}
                                    >
                                      {playlist.name}
                                    </SelectItem>
                                  );
                                })}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="languages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Languages</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="en/id" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={'en'}>English</SelectItem>
                              <SelectItem value={'id'}>Indonesian</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={generateAuraMutation.isPending}
                  >
                    {generateAuraMutation.isPending ? (
                      <>
                        Generating{' '}
                        <Loader2Icon className="ml-2 w-4 animate-spin" />
                      </>
                    ) : (
                      'get the aura 👀'
                    )}
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      {aura && (
        <CardContent>
          <AuraCard
            genres={genres}
            auraDescription={aura.aura.auraDescription}
            colorMeanings={aura.aura.colorMeanings}
            colors={aura.colors}
            keyPoint={aura.aura.keyPoint}
            musicNickname={aura.aura.musicNickname}
            score={aura.score}
            uniqueId={`${form.getValues('spotifyUserId')}:${form.getValues(
              'playlistId'
            )}`}
          />
        </CardContent>
      )}
    </Card>
  );
}
