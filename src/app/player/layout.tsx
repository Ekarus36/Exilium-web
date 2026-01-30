import { WikiLayout } from "@/components/layout/WikiLayout";
import { playerNavigation } from "@/lib/content/navigation";

export default function PlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WikiLayout
      navigation={playerNavigation}
      variant="player"
      title="Exilium Player Guide"
    >
      {children}
    </WikiLayout>
  );
}
