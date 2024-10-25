import AuraShare from '@/app/components/AuraShare';
export type PropsPage = {
  params: { id: string };
};
export default function AuraSharePage({ params }: PropsPage) {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="container mb-auto px-4 py-10 lg:px-[6.5rem]">
        <div className="mx-auto my-auto flex w-full max-w-4xl flex-col items-center justify-center gap-y-4">
          <AuraShare id={params.id} />
        </div>
      </div>
    </main>
  );
}
