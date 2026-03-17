"use client";

import React, { useState } from "react";

export default function SyncApp() {
  const [turoUrl, setTuroUrl] = useState("");
  const [getaroundId, setGetaroundId] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    setStatus("Synchronisation en cours...");
    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ turoIcalUrl: turoUrl, getaroundVehicleId: getaroundId }),
      });
      const data = await response.json();
      if (data.success) setStatus(`Succès ! ${data.synced} réservations synchronisées.`);
      else setStatus(`Erreur : ${data.error}`);
    } catch (err) {
      setStatus("Erreur réseau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Sync Turo / Getaround</h1>
          <p className="text-slate-600">Plateforme indépendante de gestion des calendriers.</p>
        </header>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">URL iCal Turo</label>
              <input type="text" value={turoUrl} onChange={(e) => setTuroUrl(e.target.value)} placeholder="webcal://..." className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">ID Véhicule Getaround</label>
              <input type="text" value={getaroundId} onChange={(e) => setGetaroundId(e.target.value)} placeholder="123456" className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none" />
            </div>
            <button onClick={handleSync} disabled={isLoading || !turoUrl || !getaroundId} className="w-full py-4 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:bg-slate-300">
              {isLoading ? "Synchronisation..." : "Synchroniser maintenant"}
            </button>
            {status && <div className="p-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">{status}</div>}
          </div>
        </section>

        <section className="mt-12 p-6 bg-slate-100 rounded-xl">
          <h2 className="font-bold mb-4">Configuration Turo</h2>
          <p className="text-sm text-slate-600">Copiez ce lien dans Turo (Importer un calendrier) :</p>
          <code className="block mt-2 p-3 bg-white border rounded text-xs break-all">
            {"/api/ical/getaround/"}{getaroundId || "ID_VEHICULE"}
          </code>
        </section>
      </div>
    </div>
  );
}
