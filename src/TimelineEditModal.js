import { Modal, Button, InputGroup, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { localZoneOffset } from './TimeHelper';
import { useCallback, useEffect, useState } from 'react';

import TimezoneSelect from './TimezoneSelect';

let markerId = 0;

const defaultTimeline = {
  name: 'Timeline',
  timeZone: localZoneOffset(),
  icon: 'images/default.png',
  markers: []
}

export default function TimelineEditModal({ show, onHide, startTimeline, onSave, title }) {

  // State for the editing timeline
  const [timeline, setTimeline] = useState(defaultTimeline);

  const setDefaultTimeline = useCallback(() => {
    setTimeline(retagTimeline(startTimeline));
  }, [startTimeline]);

  // On show set the edit timeline to the starting timeline
  useEffect(() => {
    if (show) {
      setDefaultTimeline();
    }
  }, [show, setDefaultTimeline]);


  // Update properties of the timeline
  function updateTimeline(update) {
    setTimeline(Object.assign({}, timeline, update));
  }

  // Handle marker updates
  function addMarker() {
    updateTimeline({
      markers: [...timeline.markers, getNewMarker()]
    });
  }

  function removeMarker(id) {
    updateTimeline({
      markers: timeline.markers.filter(marker => marker.id !== id)
    });
  };

  function changeMarker(id, update) {
    updateTimeline({
      markers: timeline.markers.map(marker => marker.id === id ? Object.assign(marker, update) : marker)
    });
  };

  // Handle when cancel button is clicked
  function handleTimelineCancel() {
    onHide();
  }

  // Handle when save button is clicked
  function handleTimelineSave() {
    // Callback with timeline
    onSave(timeline);
    onHide();
  }

  // Marker items
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
      size='lg'
      aria-labelledby='addTimeline.Modal'
    >
      <Modal.Header closeButton>
        <Modal.Title id='addTimeline.Modal'>
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Form.Label id='addTimeline.TimelineName'>Name</Form.Label>
        <InputGroup className='mb-3' aria-describedby='addTimeline.TimelineName'>
          <Form.Control
            placeholder='Timeline Name'
            value={timeline.name}
            onChange={e => updateTimeline({ name: e.target.value })}
          />
        </InputGroup>

        <Form.Label id='addTimeline.TimelineIcon'>Icon URL</Form.Label>
        <InputGroup className='mb-3' aria-describedby='addTimeline.TimelineIcon'>
          <div className='icon-preview'>
            <img src={timeline.icon} alt={timeline.name} />
          </div>
          <Form.Control
            placeholder='Timeline URL (Default: images/default.png)'
            value={timeline.icon}
            onChange={e => updateTimeline({ icon: e.target.value })}
          />
        </InputGroup>

        <Form.Label id='addTimeline.TimelineZone'>Time Zone</Form.Label>
        <InputGroup className='mb-3' aria-describedby='addTimeline.TimelineZone'>
          <TimezoneSelect
            className='form-select'
            value={timeline.timeZone}
            onChange={e => updateTimeline({ timeZone: e.target.value })}
          />
        </InputGroup>

        <Form.Label>Markers</Form.Label>
        <button aria-label='Add marker' style={{ float: 'right' }} onClick={addMarker}><FontAwesomeIcon icon={faPlus} className='me-2' /></button>
        {markers}

      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleTimelineCancel} variant='outline-danger'>
          Cancel
        </Button>
        <Button onClick={handleTimelineSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );

  function retagTimeline(timeline) {
    // ok this is not ideal but
    const retagged = JSON.parse(JSON.stringify(timeline));
    if (retagged.markers) {
      for (let i = 0; i < retagged.markers.length; i++) {
        retagged.markers[i].id = getNewId();
      }
    }
    if (retagged.preset) {
      retagged.preset = false;
    }
    return retagged;
  }
}

function getNewId() {
  markerId++;
  return markerId;
}

function getNewMarker() {
  return { id: getNewId(), name: 'Marker', time: '00:00', icon: '' };
}

function AddMarkerInfo({ removeMarker, changeMarker, id, name, time, icon }) {
  return (
    <InputGroup className='mb-1'>
      <Form.Control
        maxLength='2'
        value={icon}
        onChange={e => changeMarker(id, { icon: e.target.value })}
        placeholder='Icon'
        style={{ flex: '0 1 3.5rem' }}
        aria-label='Marker icon'
      />
      <Form.Control
        type='time'
        value={time}
        onChange={e => changeMarker(id, { time: e.target.value === '' ? '00:00' : e.target.value })}
        style={{ flex: '0 1 fit-content' }}
        aria-label='Marker time'
      />
      <Form.Control
        placeholder='Name'
        value={name}
        onChange={e => changeMarker(id, { name: e.target.value })}
        aria-label='Marker name'

      />
      <Button
        style={{ flex: '0 1 fit-content' }}
        variant='outline-danger'
        aria-label='Delete marker'
        onClick={() => removeMarker(id)}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </Button>
    </InputGroup>
  );
}


