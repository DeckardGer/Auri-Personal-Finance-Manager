import { SettingsForm } from '@/components/settings/SettingsForm';
import { getUser } from '@/lib/data';

export default async function Settings() {
  const user = await getUser();

  return <div className="mx-auto h-full max-w-2xl">{user && <SettingsForm user={user} />}</div>;
}
