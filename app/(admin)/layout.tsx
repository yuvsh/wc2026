export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {children}
    </div>
  );
}
