import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Ruler } from "./Ruler";
import { dayFraction } from './TimeHelper';

export function MainTimeline({ userTimeZone, barRef, use12Hr }) {
  const [time, setTime] = useState(DateTime.now().setZone(userTimeZone));

  function updateClock() {
    setTime(DateTime.now().setZone(userTimeZone));
  }

  useEffect(() => {
    const timerId = setInterval(updateClock, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  let percentage = dayFraction(userTimeZone);

  return (
    <figure className='main-timeline'>
      <figcaption>
        <p>{time.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}</p>
      </figcaption>
      <div className='timeline-bar'>
        <div style={{ width: percentage * 100 + '%' }} ref={barRef}></div>
      </div>
      <Ruler use12Hr={use12Hr} />
    </figure>
  );
}
