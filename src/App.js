import './App.scss';
import gameData from './data/game.json';
import { useEffect, useState } from 'react';

import Header from './Header';
import MainTimeline from './MainTimeline';
import Timeline from './Timeline';
import TimelineEditModal from './TimelineEditModal';
import GameTimelineModal from './GameTimelineModal';
import TimeSettingModal from './TimeSettingModal';
import InfoModal from './InfoModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';

import { dayFractionAt, localZoneOffset } from './TimeHelper';
import { useBounds } from './useBounds';
import { DateTime } from 'luxon';

let timelineId = 0;
let timelineToStore = [];
const loadedTimeZone = loadTimeZone();
const loadedData = loadTimelineData(loadedTimeZone);

const defaultTimeline = {
  name: 'Timeline',
  timeZone: localZoneOffset(),
  icon: 'images/default.png',
  markers: []
}

function App() {

  const [rule, setRule] = useState(0);
  const [use12Hr, setUse12Hr] = useState(loadUse12Hr());
  const [bound, ref, updateBound] = useBounds();
  const [userTimeZone, setUserTimeZone] = useState(loadedTimeZone);
  const [userZoneOffset, setUserZoneOffset] = useState(DateTime.now().setZone(loadedTimeZone).zone.formatOffset(Date.now(), 'short'));
  const [timelineData, setTimelineData] = useState(loadedData);
  const [ruleActive, setRuleActive] = useState(false);

  const [infoModalShow, setInfoModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [gameModalShow, setGameModalShow] = useState(false);
  const [timeModalShow, setTimeModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);

  const [editTimeline, setEditTimeline] = useState(defaultTimeline);


  // Update the bound of bar and resort marker if timezone is changed
  useEffect(() => {
    setTimelineData(currState => sortFirstMarker(userTimeZone, currState));
    window.dispatchEvent(new Event('resize'));
  }, [userTimeZone]);

  // Update the storage if timeline data is changed
  useEffect(() => {
    localStorage.setItem('storedTimelines', JSON.stringify(timelineData));
  }, [timelineData])

  // Update the storage if timeline data is changed
  useEffect(() => {
    localStorage.setItem('use12Hr', use12Hr);
  }, [use12Hr])

  function addTimeline() {
    const toAdd = [];
    for (let i = 0; i < arguments.length; i++) {
      const timeline = arguments[i];
      if (validateTimeline(timeline)) {
        timelineToStore.push(timeline);
        toAdd.push({ ...timeline, id: getNewId() });
      }
    }
    setTimelineData(sortFirstMarker(userTimeZone, timelineData.concat(toAdd)));
  }

  function removeTimeline(id) {
    setTimelineData(timelineData.filter(tl => tl.id !== id));
  };

  function updateTimeline(newTl) {
    setTimelineData(timelineData.map(tl => tl.id === newTl.id ? Object.assign(tl, newTl) : tl));
  };

  function updateTimeZone(zoneOffset) {
    const timeZone = 'UTC' + zoneOffset;
    localStorage.setItem('userTimeZone', timeZone);
    setUserZoneOffset(zoneOffset);
    setUserTimeZone(timeZone);
    updateBound();
  }

  function updateRuleLeft(e) {
    if (e.type === 'touchmove') {
      setRule(e.touches[0].pageX);
    }
    else {
      setRule(e.clientX);
    }
  }

  function startEdit(timeline) {
    setEditTimeline(timeline);
    setEditModalShow(true);
  }

  const timelines = timelineData.map(timeline =>
    <Timeline
      key={timeline.id}
      data={timeline}
      rule={rule}
      userTimeZone={userTimeZone}
      removeTimeline={removeTimeline}
      use12Hr={use12Hr}
      startEdit={startEdit}
    />
  );

  return (
    <>
      <Header
        setTimeModalShow={setTimeModalShow}
        setGameModalShow={setGameModalShow}
        setAddModalShow={setAddModalShow}
        setInfoModalShow={setInfoModalShow}
      />
      <KeyboardNav timelineData={timelineData} />
      <main className='container'
        onTouchMove={updateRuleLeft}
        onMouseMove={updateRuleLeft}
        onMouseEnter={() => setRuleActive(true)}
        onMouseLeave={() => setRuleActive(false)}
      >
        <MainTimeline
          userTimeZone={userTimeZone}
          barRef={ref}
          use12Hr={use12Hr}
          userZoneOffset={userZoneOffset}
        />
        <section>
          {timelines}
          <div className='current-rule' style={{ left: bound.right + 'px' }}></div>
          <div className={`vertical-rule ${ruleActive ? 'active' : ''}`} style={{ left: rule + 'px' }}></div>
        </section>
      </main>
      <TimelineEditModal
        show={addModalShow}
        onHide={() => setAddModalShow(false)}
        startTimeline={defaultTimeline}
        onSave={addTimeline}
        title={<><FontAwesomeIcon icon={faPlus} className='me-2' /> Add Timeline</>}
      />
      <TimelineEditModal
        show={editModalShow}
        onHide={() => setEditModalShow(false)}
        startTimeline={editTimeline}
        onSave={updateTimeline}
        title={<><FontAwesomeIcon icon={faEdit} className='me-2' /> Edit Timeline</>}
      />
      <GameTimelineModal
        show={gameModalShow}
        onHide={() => setGameModalShow(false)}
        addTimeline={addTimeline}
      />
      <TimeSettingModal show={timeModalShow} onHide={() => setTimeModalShow(false)}
        use12Hr={use12Hr}
        setUse12Hr={setUse12Hr}
        updateTimeZone={updateTimeZone}
        userZoneOffset={userZoneOffset}
      />
      <InfoModal  show={infoModalShow} onHide={() => setInfoModalShow(false)} />
    </>
  );
}

function KeyboardNav({ timelineData }) {
  const anchors = timelineData.map(timeline => (
    <li key={timeline.id}>
      <a href={`#timeline-${timeline.id}`}>{timeline.name}</a>
    </li>
  ));

  return (
    <nav aria-label='Skip to timeline' className='keyboard-nav'>
      Skip to:
      <ul>
        <li>
          <a href='#mainTimelineInfo'>Current Time</a>
        </li>
        {anchors}
      </ul>
    </nav>
  );
}

function loadTimeZone() {
  let timeZone = localStorage.getItem('userTimeZone');
  // If no saved timezone is found, default to local
  if (!timeZone) {
    localStorage.setItem('userTimeZone', 'local');
    return 'local';
  }
  return timeZone;
}

function loadUse12Hr() {
  let use = localStorage.getItem('use12Hr');
  // If no saved timezone is found, default to local
  if (!use) {
    localStorage.setItem('use12Hr', true);
    return true;
  }
  return use === 'true';
}

function loadTimelineData(userTimeZone) {
  const timelineData = [];

  // Hash game data
  const gamesByName = gameData.reduce((map, obj) => {
    map[obj.name] = obj;
    return map;
  }, {});

  // Check for custom timelines
  let storedTimelines = localStorage.getItem('storedTimelines');
  if (storedTimelines) {
    try {
      storedTimelines = JSON.parse(storedTimelines);
      for (let i = 0; i < storedTimelines.length; i++) {
        const tl = storedTimelines[i];
        if (validateTimeline(tl)) {

          // Check if it's a game preset, make sure data is up to date if it is
          const game = gamesByName[tl.name];
          if (game !== undefined && tl.preset) {
            tl.timeZone = game.timeZone;
            tl.markers = game.markers;
          }

          timelineToStore.push(tl);
          timelineData.push(tl);
        }
      }
    } catch (e) {
      console.error(`Failed to parse timeline! ${e}`);
    }
  }

  for (let i = 0; i < timelineData.length; i++) {
    timelineData[i].id = getNewId();
  }

  return sortFirstMarker(userTimeZone, timelineData);
}

function sortFirstMarker(userTimeZone, timelineData) {
  const sorted = [...timelineData].sort((a, b) => {
    const aFrac = dayFractionAt(userTimeZone, a.markers[0] ? DateTime.fromISO(a.markers[0].time + a.timeZone) : undefined);
    const bFrac = dayFractionAt(userTimeZone, b.markers[0] ? DateTime.fromISO(b.markers[0].time + b.timeZone) : undefined);
    return aFrac - bFrac;
  });
  return sorted;
}

function getNewId() {
  timelineId++;
  return timelineId;
}

function validateTimeline(timeline) {
  return timeline.name !== undefined && timeline.timeZone !== undefined && timeline.icon !== undefined && timeline.markers !== undefined;
}
/*
export function useBounds() {
  const ref = useRef();
  const [bound, setBound] = useState({});

  function updateBound() {
    setBound(currBound => ref && ref.current ? ref.current.getBoundingClientRect() : {});
  }

  useEffect(() => {
    updateBound();
    window.addEventListener('resize', updateBound);
    return () => window.removeEventListener('resize', updateBound);
  }, []);

  return [bound, ref, updateBound];
}*/

export default App;
