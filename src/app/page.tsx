import AuraForm from '@/app/components/AuraForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="container mb-auto px-4 py-10 lg:px-[6.5rem]">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-y-4">
          <AuraForm />
        </div>
      </div>
    </main>
  );
}
