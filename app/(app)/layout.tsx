import BottomTabBar from "@/components/BottomTabBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 flex flex-col pb-[calc(56px+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
}
