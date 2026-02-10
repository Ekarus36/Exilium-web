import { WikiLayout } from "@/components/layout/WikiLayout";
import { playerNavigation } from "@/tools/wiki/lib/navigation";

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
