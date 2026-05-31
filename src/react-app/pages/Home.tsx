export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to Fabrico
        </h1>
        <p className="text-muted-foreground text-base">
          Your app will appear here
        </p>
      </div>
    </div>
  );
}
