export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  tags: string[];
  status: "active" | "coming-soon";
  /** Whether this tool appears in the DM sidebar navigation */
  showInDmNav?: boolean;
  /** Label override for DM sidebar (defaults to name) */
  navLabel?: string;
}

export const tools: ToolDefinition[] = [
  {
    id: "oracle",
    name: "The Oracle",
    description:
      "Ask questions about the world of Exilium. The Oracle searches lore documents and answers with cited sources.",
    route: "/dm/oracle",
    icon: "EyeIcon",
    tags: ["Lore search", "AI-powered", "Cited answers"],
    status: "active",
    showInDmNav: true,
    navLabel: "Oracle",
  },
  {
    id: "tracker",
    name: "Initiative Tracker",
    description:
      "Track combat initiative, HP, conditions, and more. Supports multi-user campaigns with persistent data.",
    route: "/tools/tracker",
    icon: "LightningIcon",
    tags: ["Combat tracking", "Conditions", "SRD monsters"],
    status: "active",
  },
  {
    id: "session-notes",
    name: "Session Notes",
    description:
      "Track session summaries, player decisions, and campaign events.",
    route: "/tools/session-notes",
    icon: "ClipboardIcon",
    tags: [],
    status: "coming-soon",
  },
  {
    id: "encounter-builder",
    name: "Encounter Builder",
    description:
      "Build balanced encounters with CR calculations and terrain options.",
    route: "/tools/encounter-builder",
    icon: "MapPinIcon",
    tags: [],
    status: "coming-soon",
  },
  {
    id: "random-tables",
    name: "Random Tables",
    description:
      "Roll on custom random tables for loot, encounters, and events.",
    route: "/tools/random-tables",
    icon: "SlidersIcon",
    tags: [],
    status: "coming-soon",
  },
];

export function getActiveTools(): ToolDefinition[] {
  return tools.filter((t) => t.status === "active");
}

export function getDmNavTools(): ToolDefinition[] {
  return tools.filter((t) => t.status === "active" && t.showInDmNav);
}
