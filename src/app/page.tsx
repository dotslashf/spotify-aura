import AuraForm from "@/app/components/Form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="container mb-auto px-4 pb-10 pt-14 lg:px-[6.5rem] lg:pt-16">
        <div
          className="mx-auto mt-6 flex w-full max-w-4xl flex-col items-center justify-center gap-y-4 lg:mt-8">
          <AuraForm/>
        </div>
      </div>
    </main>
  );
}
