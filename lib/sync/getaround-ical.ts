import { getGetaroundBookings } from "./getaround";

export async function generateGetaroundIcal(vehicleId: string): Promise<string> {
  const bookings = await getGetaroundBookings(vehicleId);
  let ical = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Next2You//CalendarSync//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n";
  for (const booking of bookings) {
    const start = formatIcalDate(new Date(booking.start_at));
    const end = formatIcalDate(new Date(booking.end_at));
    ical += `BEGIN:VEVENT\nUID:getaround-${booking.id}@next2you.immo\nDTSTAMP:${formatIcalDate(new Date())}\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:Getaround Booking\nEND:VEVENT\n`;
  }
  ical += "END:VCALENDAR";
  return ical;
}

function formatIcalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}
