import { Modal, Button, InputGroup, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { TimezoneSelect } from './TimezoneSelect';
import { useEffect, useState } from 'react';

export function TimeSettingModal({show, onHide, use12Hr, setUse12Hr, userZoneOffset, updateTimeZone}) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="timeSetting.Modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="timeSetting.Modal">
          <FontAwesomeIcon icon={faClock} className='me-2'/> Time Settings
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label id="timeSetting.timezone">Current Time Zone</Form.Label>
        <InputGroup  className="mb-3" aria-describedby="timeSetting.timezone">
          <TimezoneSelect
            className='form-select'
            value={userZoneOffset}
            onChange={e => updateTimeZone(e.target.value)}
          />
        </InputGroup>
        <Form.Label id="timeSetting.use12hr">Use 12-hour Format</Form.Label>
        <InputGroup  className="mb-3" aria-describedby="timeSetting.use12hr">
          <Form.Check
            type="switch"
            id="custom-switch"
            onChange={(e) => { setUse12Hr(e.currentTarget.checked); }}
            checked={use12Hr}
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => {
          onHide();
        }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
