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
import ReactMarkdown from 'react-markdown';

const FormSchema = z.object({
  spotifyUserId: z.string().min(2, {
    message: 'Spotify username must be at least 2 characters.',
  }),
  playlistId: z.string({
    required_error: 'Playlist cannot be null',
  }),
});

const BASE_API_URL = 'api/spotify/playlist';

export default function AuraForm() {
  const { toast } = useToast();
  const [playlists, setPlaylists] = useState<{ name: string; id: string }[]>(
    []
  );
  const [isUsernameFound, setIsUsernameFound] = useState(false);
  const [aura, setAura] = useState(``);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      spotifyUserId: '',
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const res = await fetch(
      `${BASE_API_URL}/${values.spotifyUserId}/${values.playlistId}`
    );

    const data = await res.json();

    const resGenAura = await fetch(`api/gen`, {
      method: 'POST',
      body: JSON.stringify({
        genres: data.data,
      }),
    });

    const dataResGenAura = await resGenAura.json();

    setAura(dataResGenAura.message);
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
                          Fetch
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isUsernameFound && (
                <>
                  <FormField
                    control={form.control}
                    name="playlistId"
                    render={({ field }) => (
                      <FormItem>
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
                  <Button type="submit">Check the aura 👀</Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      {aura && (
        <CardContent>
          <ReactMarkdown
            className={
              'bg-card text-card-foreground p-4 rounded-md font-mono border'
            }
          >
            {aura}
          </ReactMarkdown>
        </CardContent>
      )}
    </Card>
  );
}
