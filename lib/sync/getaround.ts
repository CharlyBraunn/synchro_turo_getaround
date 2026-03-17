const GETAROUND_API_BASE = "https://api.getaround.com/v1";
const TOKEN = process.env.GETAROUND_TOKEN;

export interface GetaroundBooking {
  id: string;
  vehicle_id: string;
  start_at: string;
  end_at: string;
  status: string;
}

export async function getGetaroundBookings(vehicleId: string): Promise<GetaroundBooking[]> {
  const response = await fetch(`${GETAROUND_API_BASE}/vehicles/${vehicleId}/bookings`, {
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error(`Failed to fetch Getaround bookings: ${response.statusText}`);
  const data = await response.json();
  return data.bookings || [];
}

export async function blockGetaroundDates(vehicleId: string, startAt: Date, endAt: Date) {
  const response = await fetch(`${GETAROUND_API_BASE}/vehicles/${vehicleId}/unavailability_periods`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      unavailability_period: {
        start_at: startAt.toISOString(),
        end_at: endAt.toISOString(),
        reason: "Turo booking sync",
      },
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to block Getaround dates: ${errorData.message || response.statusText}`);
  }
  return await response.json();
}
