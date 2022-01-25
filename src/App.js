import './App.scss';
import gameData from './data/game.json';
import { useEffect, useState, useRef } from 'react';
import { Header } from './Header';
import { MainTimeline } from './MainTimeline';
import { Timeline } from './Timeline';
import { dayFractionAt } from './TimeHelper';
import { DateTime } from 'luxon';

let timelineId = 0;
let timelineToStore = [];
const loadedTimeZone = loadTimeZone();
const loadedData = loadTimelineData(loadedTimeZone);

function App() {

  const [rule, setRule] = useState(0);
  const [use12Hr, setUse12Hr] = useState(loadUse12Hr());
  const [bound, ref, updateBound] = useBounds();
  const [userTimeZone, setUserTimeZone] = useState(loadedTimeZone);
  const [userZoneOffset, setUserZoneOffset] = useState(DateTime.now().setZone(loadedTimeZone).zone.formatOffset(Date.now(), 'short'));
  const [timelineData, setTimelineData] = useState(loadedData);
  const [ruleActive, setRuleActive] = useState(false);

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
    for(let i = 0; i < arguments.length; i++) {
      const timeline = arguments[i];
      if(validateTimeline(timeline)) {
        timelineToStore.push(timeline);
        toAdd.push({...timeline, id: getNewId()});
      }
    }
    setTimelineData(sortFirstMarker(userTimeZone, timelineData.concat(toAdd)));
  }

  function removeTimeline(id) {
    setTimelineData(timelineData.filter(tl => tl.id !== id));
  };

  function updateTimeline(id, update) {
    setTimelineData(timelineData.map(tl => tl.id === id ?  Object.assign(tl, update) : tl));
  };

  function updateTimeZone(zoneOffset) {
    console.log(zoneOffset);
    const timeZone = 'UTC' + zoneOffset;
    localStorage.setItem('userTimeZone', timeZone);
    setUserZoneOffset(zoneOffset);
    setUserTimeZone(timeZone);
    updateBound();
  }

  function updateRuleLeft(e) {
    setRule(e.clientX);
  }

  const timelines = timelineData.map(timeline =>
    <Timeline
      key={timeline.id}
      data={timeline}
      rule={rule}
      userTimeZone={userTimeZone}
      removeTimeline={removeTimeline}
      use12Hr={use12Hr}
    />
  );

  return (
    <>
      <Header
        use12Hr={use12Hr}
        setUse12Hr={setUse12Hr}
        addTimeline={addTimeline}
        updateTimeZone={updateTimeZone}
        userZoneOffset={userZoneOffset}
      />
      <main className='container'
        onMouseMove={updateRuleLeft}
        onMouseEnter={()=>setRuleActive(true)}
        onMouseLeave={()=>setRuleActive(false)}
        onTouchStart={updateRuleLeft}
      >
        <MainTimeline
          userTimeZone={userTimeZone}
          barRef={ref}
          use12Hr={use12Hr}
          userZoneOffset={userZoneOffset}
        />
        <section>
          {timelines}
          <div className='current-rule' style={{left: bound.right + 'px'}}></div>
          <div className={`vertical-rule ${ruleActive ? 'active' : ''}`} style={{left: rule + 'px'}}></div>
        </section>
      </main>
    </>
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
      for(let i = 0; i < storedTimelines.length; i++) {
        const tl = storedTimelines[i];
        if(validateTimeline(tl)) {

          // Check if it's a game preset, make sure data is up to date if it is
          const game = gamesByName[tl.name];
          if(game !== undefined && tl.preset) {
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

  for(let i = 0; i < timelineData.length; i++) {
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
}

export default App;
