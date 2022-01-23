import { DateTime } from 'luxon';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { timeSimple, timeRemaining } from './TimeHelper';
import { Marker } from "./Marker";

export function Timeline({ userTimeZone, data, rule, use12Hr }) {

  const [tlFocused, setTlFocused] = useState(false);
  const [showEvent, setShowEvent] = useState(false);

  const markers = data.markers.map((marker, index) =>
    <Marker
      key={index}
      marker={marker}
      userTimeZone={userTimeZone}
      dataTimeZone={data.timeZone}
      rule={rule}
      showEvent={showEvent}
      use12Hr={use12Hr}
    />
  );

  const firstMarker = data.markers[0];
  let firstMarkerText;
  if (firstMarker) {
    const markerTime = DateTime.fromISO(firstMarker.time + data.timeZone);
    firstMarkerText =
      <div className='first-marker-info'>
        <span className='first-icon'>▲</span>
        <span className='first-time'>
          {firstMarker.name}
          <FontAwesomeIcon icon={faArrowRight} />
          {timeSimple(userTimeZone, use12Hr, markerTime)} (In {timeRemaining(markerTime).toFormat("hh:mm")})
        </span>
        <button><FontAwesomeIcon icon={faTrashAlt} /></button>
      </div>;
  }

  return (
    <figure className='timeline' tabIndex='0'
      onMouseDown={() => setShowEvent(true)}
      onFocus={() => { setTlFocused(true); }}
      onBlur={() => { setTlFocused(false); }}
    >
      <div className='timeline-bar'
        onMouseEnter={() => setShowEvent(true)}
        onMouseLeave={() => setShowEvent(false || tlFocused)}
      >
        {markers}
      </div>
      <div className='timeline-info'>
        <img src={data.icon} alt={data.name} />
        <figcaption>{data.name}</figcaption>
        {firstMarker && firstMarkerText}
      </div>
    </figure>
  );
}
