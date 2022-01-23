import { DateTime } from 'luxon';
import { useBounds } from './App';
import { dayFractionAt, timeSimple } from './TimeHelper';


export function Marker({ marker, userTimeZone, dataTimeZone, rule, showEvent, use12Hr }) {

  const [bound, ref] = useBounds();

  let iso = marker.time + dataTimeZone;
  let percentage = dayFractionAt(userTimeZone, DateTime.fromISO(iso)) * 100;

  while (percentage < 0) {
    percentage += 100;
  }

  while (percentage > 100) {
    percentage -= 100;
  }

  const ruleInBound = bound.left ? (bound.left - 5 <= rule) && (rule <= bound.left + 5) : false;
  const show = (showEvent || ruleInBound);

  return (
    <div className='marker' style={{ left: percentage + '%' }} ref={ref}>
      <span className={`marker-name ${show ? 'active' : ''}`}>
        {marker.name}
        <br />
        <span className={`marker-time ${show ? 'active' : ''}`}>{timeSimple(userTimeZone, use12Hr, DateTime.fromISO(iso))}</span>
      </span>

    </div>
  );
}
