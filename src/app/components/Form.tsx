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
  const [aura, setAura] = useState(
    `**You groove to the rhythm of the archipelago, a heart split between the nostalgic melodies of the past and the vibrant energy of the Indonesian music scene.** 🎶🇮🇩\n\nYour aura is a blend of chill coffee shop vibes with a dash of rebellious energy, reflecting a love for both introspective ballads and energetic anthems.  You appreciate the classics, but you're always down to discover new sounds from your homeland and beyond. 🎧☕🤘\n\nAura Color: Sunset Orange with a touch of Electric Blue 🌅💙\n\nMusic Nickname: Irama Jiwa (Rhythm of the Soul) \n\n**Kamu bergoyang mengikuti irama nusantara, hati yang terbagi antara melodi nostalgia masa lalu dan energi dinamis dari skena musik Indonesia.** 🎶🇮🇩\n\nAuramu adalah perpaduan antara suasana kedai kopi yang santai dengan sedikit energi pemberontak, mencerminkan kecintaan pada lagu-lagu balada yang introspektif dan lagu-lagu yang energik.  Kamu menghargai musik klasik, tetapi kamu juga selalu ingin menemukan suara-suara baru dari tanah air dan sekitarnya. 🎧☕🤘\n\nWarna Aura: Jingga Senja dengan sentuhan Biru Elektrik 🌅💙\n\nNama Panggilan Musik: Irama Jiwa \n`
  );

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

    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(dataResGenAura, null, 2)}
          </code>
        </pre>
      ),
    });
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
    const items = data.data.items as {
      name: string;
      id: string;
    }[];

    setPlaylists(items);
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
                              <SelectItem value={playlist.id} key={playlist.id}>
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
