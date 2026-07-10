import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Manthan</h1>
      <p className="max-w-md text-muted-foreground">
        Conference and research paper management platform — foundation scaffold.
      </p>
      <Button>Get started</Button>
    </main>
  );
}