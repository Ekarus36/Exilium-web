import Link from "next/link";
import { LightningIcon, ClipboardIcon, MapPinIcon, SlidersIcon } from "@/components/ui/Icons";

export const metadata = {
  title: "DM Tools",
  description: "Initiative tracker, campaign management, and encounter builder",
};

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-stone-100">DM Tools</h1>
        <p className="text-lg text-stone-400">
          Tools for running your Exilium campaigns.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/tools/tracker"
          className="block p-6 bg-stone-900/50 border border-stone-800 rounded-xl hover:border-blue-600/50 hover:bg-stone-900 transition-all group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-600/20 rounded-lg text-blue-400 group-hover:bg-blue-600/30 transition-colors">
              <LightningIcon size={32} />
            </div>
            <h2 className="text-xl font-semibold text-stone-100">
              Initiative Tracker
            </h2>
          </div>
          <p className="text-stone-400 text-sm mb-4">
            Track combat initiative, HP, conditions, and more. Supports
            multi-user campaigns with persistent data.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-stone-800 text-stone-400 px-2 py-1 rounded">
              Combat tracking
            </span>
            <span className="text-xs bg-stone-800 text-stone-400 px-2 py-1 rounded">
              Conditions
            </span>
            <span className="text-xs bg-stone-800 text-stone-400 px-2 py-1 rounded">
              SRD monsters
            </span>
          </div>
        </Link>

        <div className="p-6 bg-stone-900/30 border border-stone-800 rounded-xl opacity-60">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-stone-700/20 rounded-lg text-stone-500">
              <ClipboardIcon size={32} />
            </div>
            <h2 className="text-xl font-semibold text-stone-500">
              Session Notes
            </h2>
          </div>
          <p className="text-stone-500 text-sm mb-4">
            Track session summaries, player decisions, and campaign events.
          </p>
          <span className="text-xs bg-stone-800/50 text-stone-500 px-2 py-1 rounded">
            Coming soon
          </span>
        </div>

        <div className="p-6 bg-stone-900/30 border border-stone-800 rounded-xl opacity-60">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-stone-700/20 rounded-lg text-stone-500">
              <MapPinIcon size={32} />
            </div>
            <h2 className="text-xl font-semibold text-stone-500">
              Encounter Builder
            </h2>
          </div>
          <p className="text-stone-500 text-sm mb-4">
            Build balanced encounters with CR calculations and terrain options.
          </p>
          <span className="text-xs bg-stone-800/50 text-stone-500 px-2 py-1 rounded">
            Coming soon
          </span>
        </div>

        <div className="p-6 bg-stone-900/30 border border-stone-800 rounded-xl opacity-60">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-stone-700/20 rounded-lg text-stone-500">
              <SlidersIcon size={32} />
            </div>
            <h2 className="text-xl font-semibold text-stone-500">
              Random Tables
            </h2>
          </div>
          <p className="text-stone-500 text-sm mb-4">
            Roll on custom random tables for loot, encounters, and events.
          </p>
          <span className="text-xs bg-stone-800/50 text-stone-500 px-2 py-1 rounded">
            Coming soon
          </span>
        </div>
      </div>

      <div className="mt-8 p-4 bg-stone-900/30 border border-stone-800 rounded-lg">
        <p className="text-stone-500 text-sm">
          <strong className="text-stone-400">Note:</strong> Tools require sign-in
          to save data. Your campaigns and creatures are stored securely and only
          accessible to you.
        </p>
      </div>
    </div>
  );
}
