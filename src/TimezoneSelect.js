import { DateTime } from 'luxon';
import timeZones from './data/timezones.json';
import { localZoneOffset } from './TimeHelper';

export function TimezoneSelect({value, onChange, className}) {
  const zones = timeZones.map((zone, index) =>
    <option key={index} value={zone.value}>{zone.label}</option>
  );
  const dt = DateTime.local();
  const localOffset = localZoneOffset();
  return (
    <select aria-label="Timezone Select" onChange={e => onChange(e)} value={value} className={className}>
      <option value={localOffset}>({dt.offsetNameShort}) {dt.offsetNameLong} (System Time)</option>
      {zones}
    </select>
  );
}
