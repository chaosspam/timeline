import './App.css';
import gameData from './data/game.json';
import { useEffect, useState, useRef } from 'react';
import { Header } from './Header';
import { MainTimeline } from './MainTimeline';
import { Timeline } from './Timeline';

function App() {

  const [rule, setRule] = useState(0);
  const [timelineData, setTimelineData] = useState(gameData);
  const [use12Hr, setUse12Hr] = useState(true);
  const [bound, ref] = useBounds();
  const [userTimeZone, setUserTimeZone] = useState('UTC+8');

  function updateRuleLeft(e) {
    setRule(e.clientX);
  }

  const timelines = timelineData.map((item, index) =>
    <Timeline
      key={index}
      data={item}
      rule={rule}
      userTimeZone={userTimeZone}
      use12Hr={use12Hr}
    />
  );

  return (
    <>
      <Header setUse12Hr={setUse12Hr}/>
      <main className='container' onMouseMove={updateRuleLeft} onTouchStart={updateRuleLeft}>
        <MainTimeline userTimeZone={userTimeZone} barRef={ref} use12Hr={use12Hr}/>
        <section>
          {timelines}
          <div className='current-rule' style={{left: bound.right + 'px'}}></div>
          <div className='vertical-rule' style={{left: rule + 'px'}}></div>
        </section>
      </main>
    </>
  );
}

export function useBounds() {
  const ref = useRef();
  const [bound, setBound] = useState({});

  function updateBound() {
    setBound(ref && ref.current ? ref.current.getBoundingClientRect() : {});
  }

  useEffect(() => {
    updateBound();
    window.addEventListener('resize', updateBound);
    return () => window.removeEventListener('resize', updateBound);
  }, []);

  return [bound, ref];
}

export default App;
