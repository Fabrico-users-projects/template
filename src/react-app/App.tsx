function App() {

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Hello Fabrico
        </h1>
        <p className="text-muted-foreground text-base">
          Your app will appear here
        </p>
        {import.meta.env.VITE_NEON_AUTH_URL}
      </div>
    </div>
  )
}

export default App