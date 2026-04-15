
function App() {
	return (
		<div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
			<div className="max-w-xl w-full text-center space-y-8">
				<span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-xs text-muted-foreground uppercase tracking-widest">
					Powered by Fabrico
				</span>

				<div className="space-y-4">
					<h1 className="text-4xl font-bold tracking-tight">
						Your app is ready
					</h1>
					<p className="text-muted-foreground text-lg leading-relaxed">
						Describe what you want to build in the chat and Fabrico will
						generate your frontend, backend, and AI layer.
					</p>
				</div>
			</div>
		</div>
	);
}

export default App;
