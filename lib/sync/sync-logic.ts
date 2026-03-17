import { fetchTuroBookings } from "./turo";
import { blockGetaroundDates, getGetaroundBookings } from "./getaround";

export async function syncTuroToGetaround(turoIcalUrl: string, getaroundVehicleId: string) {
  const turoBookings = await fetchTuroBookings(turoIcalUrl);
  const getaroundBookings = await getGetaroundBookings(getaroundVehicleId);

  for (const turoBooking of turoBookings) {
    const isAlreadyBlocked = getaroundBookings.some((gaBooking) => {
      const gaStart = new Date(gaBooking.start_at);
      const gaEnd = new Date(gaBooking.end_at);
      return (turoBooking.start < gaEnd && turoBooking.end > gaStart);
    });

    if (!isAlreadyBlocked) {
      await blockGetaroundDates(getaroundVehicleId, turoBooking.start, turoBooking.end);
    }
  }
  return { success: true, synced: turoBookings.length };
}
