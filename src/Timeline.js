import { DateTime } from 'luxon';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faArrowRight, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { timeSimple, timeRemaining } from './TimeHelper';
import { Marker } from "./Marker";

export function Timeline({ userTimeZone, data, rule, use12Hr, removeTimeline }) {

  const [showEvent, setShowEvent] = useState(false);
  const [imageReverted, setImageReverted] = useState(false);

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

  function tryReloadDefault(e) {
    if(!imageReverted) {
      setImageReverted(true);
      e.currentTarget.src = 'images/default.png';
      // Don't loop
      e.currentTarget.onerror = null;
    }
  }

  return (
    <figure className='timeline' tabIndex='0' aria-label={`Timeline for ${data.name}`} id={`timeline-${data.id}`}>
    <div className='timeline-info'>
      <img src={data.icon} alt={data.name} onError={tryReloadDefault}/>
      <figcaption>{data.preset && <FontAwesomeIcon className='me-2' icon={faMobileAlt} />} {data.name}</figcaption>
      <FirstMarkerInfo
        marker={data.markers[0]}
        userTimeZone={userTimeZone}
        use12Hr={use12Hr}
        removeTimeline={removeTimeline}
        data={data}
      />
    </div>
      <div className='timeline-bar'
        onMouseEnter={() => setShowEvent(true)}
        onMouseLeave={() => setShowEvent(false)}
      >
        {markers}
      </div>
    </figure>
  );
}

function FirstMarkerInfo({marker, userTimeZone, use12Hr, removeTimeline, data}) {

  let info = undefined;
  if(marker) {
    const markerTime = DateTime.fromISO(marker.time + data.timeZone);
    const markerTimeSimple = timeSimple(userTimeZone, use12Hr, markerTime);
    const markerTimeRemaining = timeRemaining(markerTime).toHuman({ unitDisplay: "short" }).replace(',', '');

    info = (
      <span
        className='first-marker-info'
        tabIndex='0'
        aria-label={`Info for event ${marker.name} at ${markerTimeSimple} in ${markerTimeRemaining}`}
      >
        {marker.icon && <span className='first-icon'>{marker.icon}</span>}
        <span className='first-time'>
          {marker.name} @ {markerTimeSimple}
        </span>
        <span className='remaining-time'>
          <FontAwesomeIcon icon={faArrowRight} />
          {markerTimeRemaining}
        </span>
      </span>
    );
  }

  return (
    <div className='timeline-toolbar'>
      { info }
      <span className='timeline-toolbar-buttons'>
        <button aria-label='Edit timeline' onClick={() => console.log('edit')}><FontAwesomeIcon icon={faEdit} /></button>
        <button aria-label='Remove timeline' onClick={() => removeTimeline(data.id)}><FontAwesomeIcon icon={faTrashAlt} /></button>
      </span>
    </div>
    );
}
