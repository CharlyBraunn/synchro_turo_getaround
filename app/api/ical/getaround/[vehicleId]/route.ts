import { NextResponse } from "next/server";
import { generateGetaroundIcal } from "@/lib/sync/getaround-ical";

export async function GET(request: Request, { params }: { params: { vehicleId: string } }) {
  try {
    const { vehicleId } = params;
    const icalData = await generateGetaroundIcal(vehicleId);
    return new Response(icalData, {
      headers: {
        "Content-Type": "text/calendar",
        "Content-Disposition": `attachment; filename="getaround-${vehicleId}.ics"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
