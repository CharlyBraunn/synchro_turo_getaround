import { NextResponse } from "next/server";
import { syncTuroToGetaround } from "@/lib/sync/sync-logic";

export async function POST(request: Request) {
  try {
    const { turoIcalUrl, getaroundVehicleId } = await request.json();
    if (!turoIcalUrl || !getaroundVehicleId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }
    const result = await syncTuroToGetaround(turoIcalUrl, getaroundVehicleId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
