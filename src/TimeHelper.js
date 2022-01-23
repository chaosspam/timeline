import { DateTime, Duration } from 'luxon';

const SECONDS_PER_DAY = 86400;

function dayFraction(userTimeZone) {
  return dayFractionAt(userTimeZone, DateTime.now());
}


function dayFractionAt(userTimeZone, dateTime) {
  if(!dateTime) {
    return 0;
  }

  // This is 00:00:00 of the day in the user's timezone
  const midnight = DateTime.fromObject({
    hour: 0,
    minute: 0,
    second: 0
  }, {
    zone: userTimeZone
  });
  return -midnight.diff(dateTime, 'seconds').values.seconds / SECONDS_PER_DAY;
}

function timeRemaining(dateTime) {
  let diff = dateTime.diff(DateTime.now(), 'seconds').values.seconds;
  while(diff < 0) {
    diff += SECONDS_PER_DAY;  }
  return Duration.fromMillis(diff * 1000).shiftTo('hours', 'minutes').mapUnits((x, u) => u === 'hours' ? x : Math.ceil(x));
}

function timeSimple(userTimeZone, use12Hr, dateTime) {
  const dateFormat = use12Hr ? DateTime.TIME_SIMPLE : DateTime.TIME_24_SIMPLE;
  return dateTime.setZone(userTimeZone).toLocaleString(dateFormat);
}

export { dayFraction, dayFractionAt, timeSimple, timeRemaining };