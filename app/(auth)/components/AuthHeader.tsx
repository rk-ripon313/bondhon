interface AuthHeaderProps {
  title: string;
  description: string;
}

export default function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="space-y-2 text-center">
      <h2 className="text-3xl font-bold">{title}</h2>

      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
