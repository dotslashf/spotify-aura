'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ChevronUp } from 'lucide-react';
import { Aura, AuraColors } from '@/interface';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import AuraColor from './AuraColor';
import ColorBar from './ColorBar';

interface AuraProps extends Aura {
  genres: string[]
  colors: AuraColors
  score: number
}
export default function AuraCard({
  auraDescription,
  keyPoint,
  musicNickname,
  genres,
  colorMeanings,
  colors,
  score
}: AuraProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="w-full mx-auto rounded-md bg-slate-50">
      <CardContent className="pt-6">
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col w-full h-full">
              <AuraColor
                color={{
                  primary: colors.primary.hex,
                  secondary: colors.secondary.hex,
                }}
                position={colors.gradientPosition}
                preview={true}
              />
              <div className='bg-[#252525] h-10 w-full justify-center items-center flex rounded-b-sm text-white'>{musicNickname}</div>
            </div>
            <div className="flex gap-2">
              <ColorBar hex={colors.primary.hex} height={4} rounded='sm' />
              <ColorBar hex={colors.secondary.hex} height={4} rounded='sm' />
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center my-auto">
            <CardTitle className="text-center">Aura Score: {score}</CardTitle>
            <p className="text-sm px-3 text-center font-mono">
              {auraDescription}
            </p>
          </div>
        </div>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button className="w-full mt-6">
              <ChevronUp className="mr-2 h-4 w-4" /> View Details
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[100vh]">
            <div className="mx-auto w-full max-w-md">
              <DrawerHeader>
                <DrawerTitle>
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-2">
                      <AuraColor
                        color={{
                          primary: colors.primary.hex,
                          secondary: colors.secondary.hex,
                        }}
                        position={colors.gradientPosition}
                      />
                    </div>
                    {musicNickname}
                  </div>
                </DrawerTitle>
                <DrawerDescription className='text-justify'>{keyPoint}</DrawerDescription>
              </DrawerHeader>
              <Separator />
              <ScrollArea className="py-4 max-h-[60vh] overflow-auto">
                <div className="p-4 pt-0 pb-0">
                  <p className=" mb-4 text-sm text-muted-foreground text-justify">{auraDescription}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold text-primary">
                        Primary Color
                      </h3>
                      <ColorBar hex={colors.primary.hex} height={2} rounded='full' />
                      <p className="text-sm text-muted-foreground">
                        {colors.primary.name} ({colors.primary.hex})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {colorMeanings.primary}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold text-primary">
                        Secondary Color
                      </h3>
                      <ColorBar hex={colors.secondary.hex} height={2} rounded='full' />
                      <p className="text-sm text-muted-foreground">
                        {colors.secondary.name} ({colors.secondary.hex})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {colorMeanings.secondary}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <DrawerDescription className='text-justify'>Aura is generated from this genres:</DrawerDescription>
                    <div className='flex flex-wrap gap-2'>{genres.map(genre => <Badge variant={'secondary'} className='text-xs' key={genre}>{genre}</Badge>)}</div>
                  </div>
                </div>
              </ScrollArea>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </CardContent>
    </Card>
  );
}
