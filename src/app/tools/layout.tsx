import { Header } from "@/components/layout/Header";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--study-dark)]">
      <Header variant="tools" />
      <main>{children}</main>
    </div>
  );
}
