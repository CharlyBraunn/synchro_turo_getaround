import { NextResponse } from "next/server";
import { syncTuroToGetaround } from "@/lib/sync/sync-logic";
import mappings from "@/lib/sync/mappings.json";

/**
 * Route: /api/cron/sync
 * Triggered by Vercel Cron or external service to sync all vehicles.
 */
export async function GET(request: Request) {
  // Simple security check (optional, but recommended if using an API key)
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get('authorization');
  
  // You can add a CRON_SECRET in Vercel environment variables for security
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const results = [];

  // 1. Check from Environment Variables (Single vehicle shortcut)
  if (process.env.TURO_ICAL_URL && process.env.GETAROUND_VEHICLE_ID) {
    try {
      console.log(`Auto-syncing vehicle from ENV...`);
      const result = await syncTuroToGetaround(process.env.TURO_ICAL_URL, process.env.GETAROUND_VEHICLE_ID);
      results.push({ source: "ENV", status: "success", synced: result.synced });
    } catch (error: any) {
      results.push({ source: "ENV", status: "error", error: error.message });
    }
  }

  // 2. Check from mappings.json
  for (const mapping of mappings) {
    if (mapping.turoIcalUrl && mapping.getaroundVehicleId) {
      // Avoid duplicating sync if already in ENV
      if (mapping.turoIcalUrl === process.env.TURO_ICAL_URL) continue;

      try {
        console.log(`Auto-syncing ${mapping.name}...`);
        const result = await syncTuroToGetaround(mapping.turoIcalUrl, mapping.getaroundVehicleId);
        results.push({ name: mapping.name, status: "success", synced: result.synced });
      } catch (error: any) {
        results.push({ name: mapping.name, status: "error", error: error.message });
      }
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    results
  });
}
