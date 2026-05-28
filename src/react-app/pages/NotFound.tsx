import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-destructive">
          404 - Page Not Found
        </h1>
        <p className="text-muted-foreground text-base">
          The page you are looking for does not exist.
        </p>
      </div>
      <div className="flex gap-4 items-center">
        <Link
          to="/"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
