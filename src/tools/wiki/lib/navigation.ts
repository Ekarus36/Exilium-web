// Navigation structure matching actual content

export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
  icon?: string;
}

export interface NavigationConfig {
  sections: NavItem[];
}

// Player navigation - same structure, links to /player/...
export const playerNavigation: NavigationConfig = {
  sections: [
    {
      label: "Home",
      href: "/player",
      icon: "🏠",
    },
    {
      label: "World",
      icon: "🌍",
      children: [
        { label: "Overview", href: "/player/world/world-overview-exilium" },
        { label: "Religion System", href: "/player/world/religion-in-exilium-the-one-god-many-names" },
        { label: "Magic Users", href: "/player/world/magic-users-in-exilium" },
        { label: "Magic Items", href: "/player/world/magic-items-in-exilium" },
        { label: "Geography & Distances", href: "/player/world/world-geography" },
        { label: "Cultural Systems", href: "/player/world/cultural-systems" },
      ],
    },
    {
      label: "Geography",
      icon: "🗺️",
      children: [
        {
          label: "Veraheim",
          children: [
            { label: "Overview", href: "/player/geography/veraheim" },
            { label: "City Layout", href: "/player/geography/veraheim-city-layout-structure" },
            { label: "Demographics", href: "/player/geography/veraheim-demographics-racial-composition" },
            { label: "Citizenship", href: "/player/geography/veraheim-citizenship-process" },
            { label: "The Floating Docks", href: "/player/geography/the-floating-docks" },
          ],
        },
        {
          label: "Elven Empire",
          children: [
            { label: "Aelindor (Capital)", href: "/player/geography/aelindor-the-eternal-city" },
            { label: "The Elven Enclaves", href: "/player/geography/the-elven-enclaves" },
          ],
        },
        {
          label: "Broken Isles",
          children: [
            { label: "Freehold Harbor", href: "/player/geography/freehold-harbor" },
            { label: "Ironhold", href: "/player/geography/ironhold" },
            { label: "Mistwood", href: "/player/geography/mistwood" },
            { label: "Saltmere", href: "/player/geography/saltmere" },
            { label: "Skarath", href: "/player/geography/skarath" },
            { label: "Stormcrag", href: "/player/geography/stormcrag" },
            { label: "Copperhill", href: "/player/geography/copperhill" },
          ],
        },
      ],
    },
    {
      label: "History",
      icon: "📜",
      children: [
        { label: "Timeline", href: "/player/history/timeline-major-events" },
        { label: "The Dragon War", href: "/player/history/the-elves-dragon-war" },
        { label: "The Founding", href: "/player/history/the-founding-80-years-ago" },
        { label: "Broken Isles History", href: "/player/history/history-of-the-broken-isles" },
      ],
    },
    {
      label: "Factions",
      icon: "⚔️",
      children: [
        { label: "Veraheim", href: "/player/factions/veraheim-the-sanctuary" },
        { label: "Aloria (Elven Empire)", href: "/player/factions/aloria" },
        { label: "Thelassian (Human Kingdom)", href: "/player/factions/thelassian" },
        { label: "The Broken Isles", href: "/player/factions/the-broken-isles" },
        { label: "The Eleven Domains", href: "/player/factions/the-eleven-domains" },
      ],
    },
    {
      label: "Peoples",
      icon: "👥",
      children: [
        { label: "Drow Persecution", href: "/player/peoples/drow-persecution" },
        { label: "Drow Culture", href: "/player/peoples/drow-culture-and-society" },
        { label: "Dragon Ecology", href: "/player/peoples/dragon-ecology" },
        { label: "Non-Humans in Kingdom", href: "/player/peoples/non-human-life-in-the-kingdom" },
      ],
    },
    {
      label: "NPCs",
      icon: "🎭",
      children: [
        {
          label: "Veraheim",
          children: [
            { label: "Overview", href: "/player/npcs/veraheim-npc-summary" },
            { label: "Vera Wyrdweaver", href: "/player/npcs/vera-wyrdweaver" },
            { label: "Thaelen Ruincalen", href: "/player/npcs/thaelen-ruincalen" },
            { label: "Thorongil (Dragon)", href: "/player/npcs/thorongil-vaethor" },
            { label: "Maethor Ruincalen", href: "/player/npcs/maethor-ruincalen" },
          ],
        },
        {
          label: "Elven Empire",
          children: [
            { label: "Court Overview", href: "/player/npcs/imperial-court-of-aelindor-overview" },
            { label: "Emperor Valandor", href: "/player/npcs/emperor-valandor-aethril" },
            { label: "First Steward Faendril", href: "/player/npcs/first-steward-faendril" },
            { label: "High Warden Caerwyn", href: "/player/npcs/high-warden-caerwyn" },
            { label: "Starwarden Isileth", href: "/player/npcs/starwarden-isileth" },
          ],
        },
        {
          label: "Human Kingdom",
          children: [
            { label: "Overview", href: "/player/npcs/thelassian-npc-summary" },
            { label: "Lords Relationships", href: "/player/npcs/the-eleven-lords-relationships-and-alliances" },
            { label: "King Aldric Greymont", href: "/player/npcs/king-aldric-greymont" },
            { label: "Queen Margarethe", href: "/player/npcs/queen-margarethe-greymont" },
            { label: "Prince Roderick", href: "/player/npcs/prince-roderick-greymont" },
          ],
        },
        {
          label: "Broken Isles",
          children: [
            { label: "Overview", href: "/player/npcs/broken-isles-npc-summary" },
            { label: "Vaelith Draegor", href: "/player/npcs/vaelith-the-storm-draegor" },
            { label: "Queen Graza Bloodtide", href: "/player/npcs/graza-bloodtide" },
            { label: "Kozrek The Admiral", href: "/player/npcs/kozrek-the-admiral" },
            { label: "Skrag Chainbreaker", href: "/player/npcs/skrag-chainbreaker" },
          ],
        },
      ],
    },
  ],
};

// DM navigation - same structure but links to /dm/... plus Oracle
export const dmNavigation: NavigationConfig = {
  sections: [
    {
      label: "Oracle",
      href: "/dm/oracle",
    },
    ...playerNavigation.sections.map((section) =>
      transformNavForDM(section)
    ),
  ],
};

function transformNavForDM(item: NavItem): NavItem {
  return {
    ...item,
    href: item.href?.replace("/player/", "/dm/"),
    children: item.children?.map(transformNavForDM),
  };
}

// Get breadcrumb path for a given href
export function getBreadcrumbs(
  href: string,
  nav: NavigationConfig
): { label: string; href?: string }[] {
  const breadcrumbs: { label: string; href?: string }[] = [];

  function search(items: NavItem[], path: { label: string; href?: string }[]): boolean {
    for (const item of items) {
      const currentPath = [...path, { label: item.label, href: item.href }];

      if (item.href === href) {
        breadcrumbs.push(...currentPath);
        return true;
      }

      if (item.children && search(item.children, currentPath)) {
        return true;
      }
    }
    return false;
  }

  search(nav.sections, []);
  return breadcrumbs;
}

// Find nav item by href
export function findNavItem(href: string, nav: NavigationConfig): NavItem | null {
  function search(items: NavItem[]): NavItem | null {
    for (const item of items) {
      if (item.href === href) return item;
      if (item.children) {
        const found = search(item.children);
        if (found) return found;
      }
    }
    return null;
  }
  return search(nav.sections);
}

// Get all document hrefs from navigation for validation
export function getAllNavHrefs(nav: NavigationConfig): string[] {
  const hrefs: string[] = [];

  function collect(items: NavItem[]) {
    for (const item of items) {
      if (item.href) hrefs.push(item.href);
      if (item.children) collect(item.children);
    }
  }

  collect(nav.sections);
  return hrefs;
}
