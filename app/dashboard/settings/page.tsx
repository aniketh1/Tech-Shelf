import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import SettingsPage from './settings-page';

async function SettingsPageWrapper() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id }
  });

  if (!dbUser) {
    return null;
  }

  const initialData = {
    name: dbUser.name,
    email: dbUser.email,
    imageUrl: dbUser.imageUrl
  };

  return <SettingsPage initialData={initialData} />;
}
export default SettingsPageWrapper;
