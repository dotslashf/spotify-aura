import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronUp, Share } from 'lucide-react';

export default function AuraCardSkeleton() {
  return (
    <Card className="w-full mx-auto rounded-md dark:bg-[#252525] bg-[#f3f3f3]">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col w-full h-full">
              <div className="flex relative">
                <Skeleton className="w-full aspect-square rounded-t-md rounded-b-none" />
              </div>
              <Skeleton className="h-14 w-full rounded-b-md rounded-t-none" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-1/2 rounded-sm" />
              <Skeleton className="h-8 w-1/2 rounded-sm" />
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <Button className="w-full">
            View Details
            <ChevronUp className="ml-2 h-4 w-4" />
          </Button>
          <Button>
            Share <Share className="ml-2 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
