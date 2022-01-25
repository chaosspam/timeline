import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Ruler } from "./Ruler";
import { dayFraction } from './TimeHelper';

let timerId = null;

export function MainTimeline({ userTimeZone, barRef, use12Hr }) {
  const [time, setTime] = useState(DateTime.now().setZone(userTimeZone));

  useEffect(() => {

    function updateClock() {
      setTime(DateTime.now().setZone(userTimeZone));
    }

    if(timerId !== null) {
      clearInterval(timerId);
    }

    timerId = setInterval(updateClock, 1000);
    updateClock();

    return () => { clearInterval(timerId); };

  }, [userTimeZone]);

  const percentage = dayFraction(userTimeZone);
  const currentTime = time.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);

  return (
    <figure className='main-timeline' id='mainTimelineInfo'>
      <div className='main-timeline-info'>
        <figcaption tabIndex='0' aria-label={`The current time is ${currentTime}`}>
          {currentTime}
        </figcaption>
      </div>
      <div className='timeline-bar'>
        <div style={{ width: percentage * 100 + '%' }} ref={barRef} className='timeline-main'></div>
      </div>
      <Ruler use12Hr={use12Hr} />
    </figure>
  );
}
