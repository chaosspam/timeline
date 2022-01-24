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

  let fraction = -midnight.diff(dateTime, 'seconds').values.seconds / SECONDS_PER_DAY;

  if(fraction > 1) {
    while(fraction > 1) {
      fraction -= 1;
    }
  } else if (fraction < 0) {
    while(fraction < 0) {
      fraction += 1;
    }
  }

  return fraction;
}

function timeRemaining(dateTime) {
  let diff = dateTime.diff(DateTime.now(), 'seconds').values.seconds;

  while(diff < 0) {
    diff += SECONDS_PER_DAY;
  }

  const duration = Duration.fromMillis(diff * 1000).shiftTo('hours', 'minutes').mapUnits(
    (x, u) => {
      if(u === 'minutes') {
        return Math.ceil(x);
      } else {
        return x;
      }
    }
  );

  if(duration.hours === 0) {
    return duration.shiftTo('minutes');
  }

  return duration;
}

function timeSimple(userTimeZone, use12Hr, dateTime) {
  const dateFormat = use12Hr ? DateTime.TIME_SIMPLE : DateTime.TIME_24_SIMPLE;
  return dateTime.setZone(userTimeZone).toLocaleString(dateFormat);
}

function localZoneOffset(){
  return DateTime.local().zone.formatOffset(Date.now(), 'short');
}

export { dayFraction, dayFractionAt, timeSimple, timeRemaining, localZoneOffset };