import { Modal, Button, InputGroup, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import gameData from './data/game.json';

let tlId = 0;

export function GameTimelineModal({show, onHide, addTimeline}) {

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);

  function addGame(tl) {
    setSelected([...selected, {id: getNewId(), timeline: tl}]);
  }

  function removeGame(id) {
    setSelected(selected.filter(tl => tl.id !== id));
  };

  // Effect for API call
  useEffect(
    () => {
      if (query) {
        setResults(gameData.filter(timeline => timeline.name.toLowerCase().includes(query.toLowerCase())));
      } else {
        setResults(gameData);
      }
    },
    [query]
  );

  const queryResults = results.map((timeline, index) => {
    return <GameInfo key={index} timeline={timeline} addGame={addGame}/>
  });

  const selectedTimelines = selected.map((item, index) => {
    return <SelectedGameInfo key={item.id} item={item} removeGame={removeGame}/>
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="addGame.Modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="addGame.Modal">
          <FontAwesomeIcon icon={faMobileAlt} className='me-2'/> Add Game Preset
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label id="addGame.GameSearch">Search for Games to Add</Form.Label>
        <InputGroup  className="mb-3" aria-describedby="addGame.GameSearch">
          <Form.Control
            placeholder="Name of Game"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </InputGroup>
        <div className='game-container'>
          {queryResults}
        </div>
        <Form.Label>Games to Add</Form.Label>
        <div className='game-container'>
          {selectedTimelines}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={() => {
          setQuery('');
          setSelected([]);
          onHide();
        }}>
          Cancel
        </Button>
        <Button onClick={() => {
          addTimeline(...selected.map(x => x.timeline));
          setSelected([]);
          onHide();
        }}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function getNewId() {
  tlId++;
  return tlId;
}

function GameInfo({timeline, addGame}) {
  return (
    <div className='game-info'>
      <img src={timeline.icon} alt={timeline.name} />
      <h4>{timeline.name}</h4>
    <button onClick={() => addGame({...timeline, preset: true})}><FontAwesomeIcon icon={faPlus} className='me-2'/></button>
    </div>
  );
}

function SelectedGameInfo({item, removeGame}) {
  return (
    <div className='game-info'>
    <img src={item.timeline.icon} alt={item.timeline.name} />
    <h4>{item.timeline.name}</h4>
      <button onClick={() => removeGame(item.id)}><FontAwesomeIcon icon={faTrashAlt} className='me-2'/></button>
    </div>
  );
}
