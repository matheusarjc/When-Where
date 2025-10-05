import { useTrip } from "../contexts/TripContext";

export function useTripData() {
  const {
    selectedTrip,
    tripEvents,
    tripMemories,
    tripExpenses,
    tripChecklistItems,
    pendingInvites,
  } = useTrip();
  
  return {
    selectedTrip,
    tripEvents,
    tripMemories,
    tripExpenses,
    tripChecklistItems,
    pendingInvites,
  };
}
