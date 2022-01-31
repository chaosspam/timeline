import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faClock, faMobileAlt, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';

export default function InfoModal({ show, onHide }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="info.Modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="info.Modal">
          <FontAwesomeIcon icon={faInfoCircle} className='me-2' /> About
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          This is a simple tool I've made to keep track of events that occur daily at different timezones (read: this person plays too many gacha games).
        </p>
        <h3>How to Use</h3>
        <p>On the top right there are 4 buttons</p>
        <p>
          The <FontAwesomeIcon icon={faInfoCircle}  className='ms-1 me-1'/> button opens the about panel,
          or this panel, you probrably aready know this.
        </p>
        <p>
          The <FontAwesomeIcon icon={faClock} className='ms-1 me-1'/> button opens the time settings panel,
          where you can change the timezone of the main clock at the top, and the format the time should be
          displayed as.
        </p>
        <p>
          The <FontAwesomeIcon icon={faMobileAlt} className='ms-1 me-1'/> button opens the game preset panel,
          where you can add preset timelines of games marked with the time at which certain in-game events occur.
        </p>
        <p>
          The <FontAwesomeIcon icon={faPlus} className='ms-1 me-1'/> button opens the add timeline panel,
          where you can add your own timeline with event markers defined by yourself.
        </p>
        <h3>Timeline Editor</h3>
        <p>
          You enter the timeline editor when you either click the <FontAwesomeIcon icon={faPlus} className='ms-1 me-1'/>
          button on the top or the <FontAwesomeIcon icon={faEdit} className='ms-1 me-1'/> button on timelines
        </p>
        <p>
          Most options should be self-explainatory, the one thing to keep in mind is that the time for the markers
          you add should be the time in the time zone of the timeline, this app will automatically convert that to the time zone
          of the main clock.
        </p>
        <p>
          When you edit a preset timeline, they lose their preset status (indicated by the <FontAwesomeIcon icon={faMobileAlt} className='ms-1 me-1'/> icon
          to the left of the title of the timeline), which means their markers will not update if
          the information for that preset timeline is updated in the future (usually not an important thing if the reset time of that game doesn't change)
        </p>
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


