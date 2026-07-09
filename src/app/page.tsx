import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-5xl font-bold">
          Welcome to Navorika
        </h1>
      </main>
    </>
  );
}