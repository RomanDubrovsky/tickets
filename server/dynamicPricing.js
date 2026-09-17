// Dynamic Pricing Algorithm
// Calculates price multiplier based on demand, remaining capacity, time to departure, and weather

export function calculateDynamicPrice(basePrice, totalCapacity, bookedCount, eventDate, eventTime, weatherCondition = 'clear') {
  let multiplier = 1.0;

  // 1. Occupancy factor (Demand curve)
  const occupancyRate = totalCapacity > 0 ? (bookedCount / totalCapacity) : 0;
  if (occupancyRate > 0.85) {
    multiplier += 0.25; // +25% if ship is almost full
  } else if (occupancyRate > 0.60) {
    multiplier += 0.15; // +15% moderate-high demand
  } else if (occupancyRate < 0.20) {
    multiplier -= 0.10; // -10% early-bird or low demand discount
  }

  // 2. Time-to-departure factor (Urgency / Last-minute)
  try {
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    const now = new Date();
    const hoursLeft = (eventDateTime - now) / (1000 * 60 * 60);

    if (hoursLeft > 0 && hoursLeft <= 2) {
      if (occupancyRate < 0.50) {
        // "Burning" ticket discount to fill empty seats
        multiplier -= 0.15;
      } else {
        // High surge last minute
        multiplier += 0.20;
      }
    } else if (hoursLeft > 48) {
      // Advance booking stability
      multiplier -= 0.05;
    }
  } catch (e) {
    console.error('Date parse error in dynamic pricing:', e);
  }

  // 3. Weather factor (Saint Petersburg rain/sun factor)
  if (weatherCondition === 'rain' || weatherCondition === 'storm') {
    multiplier -= 0.10;
  } else if (weatherCondition === 'sunny' || weatherCondition === 'clear') {
    multiplier += 0.10;
  }

  // Cap bounds: min 70% of base price, max 160% of base price
  multiplier = Math.max(0.70, Math.min(1.60, multiplier));

  const finalPrice = Math.round(basePrice * multiplier);
  return {
    basePrice,
    finalPrice,
    multiplier: Number(multiplier.toFixed(2)),
    occupancyRate: Math.round(occupancyRate * 100),
    surgeReason: multiplier > 1.0 ? 'Высокий спрос / погода' : (multiplier < 1.0 ? 'Скидка на раннее/горящее бронирование' : 'Стандартный тариф')
  };
}
