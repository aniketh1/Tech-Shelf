import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-blue-500/10 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-blue-900/20">
      <div className="w-full max-w-md p-8 mx-4 backdrop-blur-sm bg-background/80 rounded-lg shadow-xl border border-purple-500/20">
        <SignIn />
      </div>
    </div>
  );
}