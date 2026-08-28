import { CAFE_INFO } from "../data/cafeInfo";

/**
 * Calculates real-time open/closed status for Duplex Lounge Cafe
 */
export function getCafeStatus(testDate = new Date()) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  const dayIndex = testDate.getDay(); // 0 is Sunday, 6 is Saturday
  const currentDayName = days[dayIndex];
  
  const currentMinutes = testDate.getHours() * 60 + testDate.getMinutes();

  // Find today's config
  const todayConfig = CAFE_INFO.hours.find(
    (h) => h.day.toLowerCase() === currentDayName.toLowerCase()
  );

  if (!todayConfig) {
    return {
      isOpen: false,
      statusLabel: "CLOSED",
      subLabel: "Check weekly schedule below",
      todayHours: "10:30 AM – 11:00 PM",
      todayDay: currentDayName
    };
  }

  // Check 24 Hours day (e.g., Saturday)
  if (todayConfig.is24Hours) {
    return {
      isOpen: true,
      statusLabel: "OPEN 24 HOURS",
      subLabel: "Open all day & night",
      todayHours: "Open 24 Hours",
      todayDay: currentDayName
    };
  }

  // Parse open & close minutes
  const [openHour, openMin] = todayConfig.open.split(":").map(Number);
  const [closeHour, closeMin] = todayConfig.close.split(":").map(Number);

  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    // Currently Open
    const closeTimeDisplay = formatMinutesTo12Hour(closeMinutes);
    return {
      isOpen: true,
      statusLabel: "OPEN NOW",
      subLabel: `Closes at ${closeTimeDisplay}`,
      todayHours: todayConfig.display,
      todayDay: currentDayName
    };
  } else if (currentMinutes < openMinutes) {
    // Closed - will open later today
    const openTimeDisplay = formatMinutesTo12Hour(openMinutes);
    return {
      isOpen: false,
      statusLabel: "CLOSED NOW",
      subLabel: `Opens today at ${openTimeDisplay}`,
      todayHours: todayConfig.display,
      todayDay: currentDayName
    };
  } else {
    // Closed - after hours, opens next day
    const nextDayIndex = (dayIndex + 1) % 7;
    const nextDayName = days[nextDayIndex];
    const nextDayConfig = CAFE_INFO.hours.find(
      (h) => h.day.toLowerCase() === nextDayName.toLowerCase()
    );

    let nextOpenText = "tomorrow at 10:30 AM";
    if (nextDayConfig?.is24Hours) {
      nextOpenText = "tomorrow (Open 24 Hours)";
    } else if (nextDayConfig?.open) {
      const [nOpenH, nOpenM] = nextDayConfig.open.split(":").map(Number);
      nextOpenText = `tomorrow at ${formatMinutesTo12Hour(nOpenH * 60 + nOpenM)}`;
    }

    return {
      isOpen: false,
      statusLabel: "CLOSED NOW",
      subLabel: `Opens ${nextOpenText}`,
      todayHours: todayConfig.display,
      todayDay: currentDayName
    };
  }
}

function formatMinutesTo12Hour(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayMins = mins < 10 ? `0${mins}` : mins;
  return `${displayHours}:${displayMins} ${period}`;
}
