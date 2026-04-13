function App() {
	return (
		<div className="min-h-screen bg-background text-foreground flex  items-center justify-center px-4 w-full">
			<div className="max-w-xl w-full text-center space-y-6">
				<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-xs text-muted uppercase tracking-widest">
					Powered by Fabrico
				</div>

				<h1 className="text-4xl font-bold tracking-tight">
					Your app is ready
				</h1>

				<p className="text-muted text-lg leading-relaxed">
					Describe what you want to build in the chat and Fabrico will generate your frontend, backend, and AI layer.
				</p>
			</div>
		</div>
	);
}

export default App;
