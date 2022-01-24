import { Modal, Button, InputGroup, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { TimezoneSelect } from './TimezoneSelect';
import { localZoneOffset } from './TimeHelper';
import { useState } from 'react';

let markerId = 0;

export function AddTimelineModal({show, onHide, addTimeline}) {

  const [timeline, setTimeline] = useState(getDefaultTimeline());

  function updateTimeline(update) {
    setTimeline(Object.assign({}, timeline, update));
  }

  function addMarker() {
    updateTimeline({markers: [...timeline.markers, {id: getNewId(), name: 'Marker', time: '00:00', icon: ''}]});
  }

  function removeMarker(id) {
    updateTimeline({markers: timeline.markers.filter(marker => marker.id !== id)});
  };

  function changeMarker(id, update) {
    updateTimeline({markers: timeline.markers.map(marker => marker.id === id ?  Object.assign(marker, update) : marker)});
  };

  const markers = timeline.markers.map((marker, index) => {
    return <AddMarkerInfo
      key={marker.id}
      index={index}
      removeMarker={removeMarker}
      changeMarker={changeMarker}
      {...marker}
    />
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="addTimeline.Modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="addTimeline.Modal">
          <FontAwesomeIcon icon={faPlus} className='me-2'/> Add Timeline
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label id="addTimeline.TimelineName">Name</Form.Label>
        <InputGroup  className="mb-3" aria-describedby="addTimeline.TimelineName">
          <Form.Control
            placeholder="Timeline Name"
            value={timeline.name}
            onChange={e => updateTimeline({name: e.target.value})}
          />
        </InputGroup>
        <Form.Label id="addTimeline.TimelineIcon">Icon URL</Form.Label>
        <InputGroup  className="mb-3" aria-describedby="addTimeline.TimelineIcon">
          <div className='icon-preview'>
            <img src={timeline.icon} alt={timeline.name} />
          </div>
          <Form.Control
            placeholder="Timeline URL (Default: images/default.png)"
            value={timeline.icon}
            onChange={e => updateTimeline({icon: e.target.value})}
          />
        </InputGroup>
        <Form.Label id="addTimeline.TimelineZone">Time Zone</Form.Label>
        <InputGroup  className="mb-3" aria-describedby="addTimeline.TimelineZone">
          <TimezoneSelect
            className='form-select'
            value={timeline.timeZone}
            onChange={e => updateTimeline({timeZone: e.target.value})}
           />
        </InputGroup>
        <Form.Label>Markers</Form.Label>
        <button style={{float:'right'}}><FontAwesomeIcon icon={faPlus} className='me-2' onClick={addMarker}/></button>
        {markers}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={() => {
          setTimeline(getDefaultTimeline());
          onHide();
        }}>
          Cancel
        </Button>
        <Button onClick={() => {
          addTimeline(timeline);
          setTimeline(getDefaultTimeline());
          onHide();
        }}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function getNewId() {
  markerId++;
  return markerId;
}

function getDefaultTimeline() {
  const localOffset = localZoneOffset();
  return {
    name: 'Timeline',
    timeZone: localOffset,
    icon: 'images/default.png',
    markers: []
  }
}

function AddMarkerInfo({removeMarker, changeMarker, id, name, time, icon}) {
  return (
    <InputGroup className='mb-1'>
      <Form.Control
        maxLength="2"
        value={icon}
        onChange={e => changeMarker(id, {icon: e.target.value})}
        placeholder="Icon"
        style={{flex: '0 1 3.5rem'}}
        aria-label="Marker icon"
      />
      <Form.Control
        type="time"
        value={time}
        onChange={e => changeMarker(id, {time: e.target.value === "" ? "00:00" : e.target.value})}
        style={{flex: '0 1 fit-content'}}
        aria-label="Marker time"
      />
      <Form.Control
        placeholder="Name"
        value={name}
        onChange={e => changeMarker(id, {name: e.target.value})}
        aria-label="Marker name"

      />
      <Button
        style={{flex: '0 1 fit-content'}}
        variant="outline-danger"
        aria-label="Delete marker"
        onClick={() => removeMarker(id)}
      >
        <FontAwesomeIcon icon={faTrashAlt}/>
      </Button>
    </InputGroup>
  );
}


