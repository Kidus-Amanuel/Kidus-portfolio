import { Suspense } from "react";
import IntegrationsClient from "./IntegrationsClient";

export const dynamic = "force-dynamic";

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-white/40">Loading integrations…</div>}>
      <IntegrationsClient />
    </Suspense>
  );
}
