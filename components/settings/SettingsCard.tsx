import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SettingsCardProps = {
  title: string;
  children: React.ReactNode;
};

export function SettingsCard({ title, children }: SettingsCardProps) {
  return (
    <Card className="gap-0 border-none p-2 shadow-none">
      <CardHeader className="px-2 py-1">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <Card className="rounded-md bg-background">
        <CardContent>{children}</CardContent>
      </Card>
    </Card>
  );
}
