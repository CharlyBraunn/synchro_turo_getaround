export interface TuroBooking {
  uid: string;
  start: Date;
  end: Date;
  summary: string;
}

/**
 * Parses a VCALENDAR string into a list of TuroBookings without external dependencies.
 */
export function parseIcal(data: string): TuroBooking[] {
  const bookings: TuroBooking[] = [];
  const events = data.split("BEGIN:VEVENT");
  
  for (let i = 1; i < events.length; i++) {
    const event = events[i];
    
    const uidMatch = event.match(/UID:(.*)\r?\n/);
    const dtStartMatch = event.match(/DTSTART(?:;VALUE=DATE)?:(.*)\r?\n/);
    const dtEndMatch = event.match(/DTEND(?:;VALUE=DATE)?:(.*)\r?\n/);
    const summaryMatch = event.match(/SUMMARY:(.*)\r?\n/);

    if (dtStartMatch && dtEndMatch) {
      bookings.push({
        uid: uidMatch ? uidMatch[1].trim() : Math.random().toString(36),
        start: parseIcalDate(dtStartMatch[1].trim()),
        end: parseIcalDate(dtEndMatch[1].trim()),
        summary: summaryMatch ? summaryMatch[1].trim() : "Turo Booking",
      });
    }
  }

  return bookings;
}

function parseIcalDate(icalDate: string): Date {
  const year = parseInt(icalDate.substring(0, 4));
  const month = parseInt(icalDate.substring(4, 6)) - 1;
  const day = parseInt(icalDate.substring(6, 8));

  if (icalDate.includes("T")) {
    const hour = parseInt(icalDate.substring(9, 11));
    const min = parseInt(icalDate.substring(11, 13));
    const sec = parseInt(icalDate.substring(13, 15));
    return new Date(Date.UTC(year, month, day, hour, min, sec));
  }

  return new Date(Date.UTC(year, month, day));
}

export async function fetchTuroBookings(icalUrl: string): Promise<TuroBooking[]> {
  const url = icalUrl.replace("webcal://", "https://");
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch Turo iCal: ${response.statusText}`);
  const data = await response.text();
  return parseIcal(data);
}
