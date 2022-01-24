import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMobileAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AddTimelineModal } from './AddTimelineModal';
import { GameTimelineModal } from './GameTimelineModal';
import { TimeSettingModal } from './TimeSettingModal';

export function Header(props) {
  return (
    <header className='container p-4 pb-0'>
      <h1><FontAwesomeIcon icon={faClock} /> Timeline</h1>
      <SettingsPanel {...props}/>
    </header>
  );
}

function SettingsPanel({ use12Hr, setUse12Hr, updateTimeZone, userZoneOffset, addTimeline }) {
  const [addModalShow, setAddModalShow] = useState(false);
  const [gameModalShow, setGameModalShow] = useState(false);
  const [timeModalShow, setTimeModalShow] = useState(false);

  return (
    <section className='settings-panel'>
      <div className='settings-panel-buttons'>
        <button aria-label='Open Time Setting Modal' onClick={() => setTimeModalShow(true)}><FontAwesomeIcon icon={faClock}/></button>/
        <button aria-label='Open Add Timeline from Preset Modal' onClick={() => setGameModalShow(true)}><FontAwesomeIcon icon={faMobileAlt}/></button>/
        <button aria-label='Open Add Timeline Modal' onClick={() => setAddModalShow(true)}><FontAwesomeIcon icon={faPlus}/></button>
      </div>
      <AddTimelineModal show={addModalShow} onHide={() => setAddModalShow(false)} addTimeline={addTimeline}/>
      <GameTimelineModal show={gameModalShow} onHide={() => setGameModalShow(false)} addTimeline={addTimeline}/>
      <TimeSettingModal show={timeModalShow} onHide={() => setTimeModalShow(false)}
        use12Hr={use12Hr}
        setUse12Hr={setUse12Hr}
        updateTimeZone={updateTimeZone}
        userZoneOffset={userZoneOffset}
      />
    </section>
  );
}