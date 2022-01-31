import { DateTime } from 'luxon';
import { useBounds } from './useBounds';
import { dayFractionAt, timeSimple } from './TimeHelper';


export default function Marker({ marker, userTimeZone, dataTimeZone, rule, showEvent, use12Hr }) {

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
  const markerTimeSimple = timeSimple(userTimeZone, use12Hr, DateTime.fromISO(iso));

  return (
    <div className='marker' style={{ left: percentage + '%' }} ref={ref} tabIndex='0' aria-label={`Marker for event ${marker.name} at ${markerTimeSimple}`}>
      <span className={`marker-info ${show ? 'active' : ''}`} aria-hidden='true'>
        <div className='marker-name'>{marker.name}</div>
        <div className='marker-time'>{markerTimeSimple}</div>
      </span>
      {
        marker.icon &&
        <span className='marker-icon' role='note' aria-label={`${marker.name} at ${markerTimeSimple}`}>
          {marker.icon}
        </span>
      }
    </div>
  );
}
