'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { SelectGroup } from '@radix-ui/react-select';
import { Aura, AuraColors, AuraJSON } from '@/interface';
import AuraCard from '@/components/AuraCard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowDownToLine } from 'lucide-react';

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
  const [playlists, setPlaylists] = useState<{ name: string; id: string }[]>(
    []
  );
  const [isUsernameFound, setIsUsernameFound] = useState(false);
  const [aura, setAura] = useState<{
    aura: Aura,
    colors: AuraColors,
    score: number
  }>();
  const [genres, setGenres] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const generateAuraMutation = useMutation({
    mutationFn: async (values: z.infer<typeof FormSchema>) => {
      const playlistRes = await fetch(
        `${BASE_API_URL}/${values.spotifyUserId}/${values.playlistId}`,
        { cache: 'no-store' }
      );
      const playlistData = await playlistRes.json();
      setGenres(playlistData.data);

      const auraRes = await fetch(`api/gen`, {
        method: 'POST',
        body: JSON.stringify({
          genres: playlistData.data,
          keys: `${form.getValues('spotifyUserId')}:${form.getValues('playlistId')}:aura`
        }),
      });
      const auraData = await auraRes.json();

      return auraData.message as AuraJSON;
    },
    onSuccess: (data) => {
      const language = form.getValues('languages') === 'en' ? 'english' : 'indonesian'
      setAura({
        aura: data.translations[language],
        colors: data.auraColors,
        score: data.auraScore
      });
      queryClient.invalidateQueries({ queryKey: ['aura'] });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate aura. Please try again.',
      });
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      spotifyUserId: '',
      languages: 'en'
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    generateAuraMutation.mutate(values);
  }

  async function fetchUserPlaylist() {
    const spotifyUserId = form.getValues('spotifyUserId');

    if (!spotifyUserId) {
      return toast({
        variant: 'destructive',
        title: 'Spotify ID cannot be empty',
        description: 'Go fill the spotify id, eg: fadhluu',
      });
    }

    const res = await fetch(
      `${BASE_API_URL}/${form.getValues('spotifyUserId')}`
    );

    const data = await res.json();
    if (data.data.error) {
      setIsUsernameFound(false);
      return toast({
        variant: 'destructive',
        title: 'Username is not found',
        description: 'Are you sure its a valid spotify username?',
      });
    }
    const items = data.data.items as {
      name: string;
      id: string;
    }[];

    setPlaylists(items);
    setIsUsernameFound(true);
  }

  return (
    <Card className={'max-w-xl w-full'}>
      <CardHeader>
        <CardTitle>Spotify Aura 🔮</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <FormField
                control={form.control}
                name="spotifyUserId"
                render={({ field }) => (
                  <FormItem className={'flex flex-col space-y-1.5'}>
                    <FormLabel>Spotify Username</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="fadhluu" {...field} />
                        <Button onClick={fetchUserPlaylist} type={'button'}>
                          Get Playlists <ArrowDownToLine className='w-4 h-4 ml-2' />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isUsernameFound && (
                <>
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="playlistId"
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormLabel>Playlist</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a playlist" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {!playlists.length && (
                                  <SelectLabel>
                                    Fetch Spotify Username First
                                  </SelectLabel>
                                )}
                                {playlists.map((playlist) => {
                                  return (
                                    <SelectItem
                                      value={playlist.id}
                                      key={playlist.id}
                                    >
                                      {playlist.name} - {playlist.id}
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
                                <SelectValue placeholder="EN/ID" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem
                                value={"en"}
                              >
                                English 🇬🇧
                              </SelectItem>
                              <SelectItem
                                value={"id"}
                              >
                                Indonesian 🇮🇩
                              </SelectItem>
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
                    {generateAuraMutation.isPending ? 'Generating...' : 'get the aura 👀'}
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      {aura && (
        <CardContent>
          <AuraCard genres={genres} auraDescription={aura.aura.auraDescription} colorMeanings={aura.aura.colorMeanings} colors={aura.colors} keyPoint={aura.aura.keyPoint} musicNickname={aura.aura.musicNickname} score={aura.score} />
        </CardContent>
      )}
    </Card>
  );
}
