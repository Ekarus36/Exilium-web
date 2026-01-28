"use client";

import { use } from "react";
import { ThreePanel } from "@/components/tracker/ThreePanel";

interface EncounterPageProps {
  params: Promise<{ id: string }>;
}

export default function EncounterPage({ params }: EncounterPageProps) {
  const { id } = use(params);

  return <ThreePanel encounterId={id} />;
}
