import { WikiLayout } from "@/components/layout/WikiLayout";
import { dmNavigation } from "@/lib/content/navigation";

export default function DMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WikiLayout
      navigation={dmNavigation}
      variant="dm"
      title="Exilium DM Guide"
    >
      {children}
    </WikiLayout>
  );
}
