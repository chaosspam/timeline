import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMobileAlt, faPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function Header(props) {
  return (
    <header className='container p-4 pb-0'>
      <h1><FontAwesomeIcon icon={faClock} /> Timeline</h1>
      <SettingsPanel {...props} />
    </header>
  );
}

function SettingsPanel({ setInfoModalShow, setTimeModalShow, setGameModalShow, setAddModalShow }) {
  return (
    <section className='settings-panel'>
      <div className='settings-panel-buttons'>
        <button aria-label='Open About Modal' onClick={() => setInfoModalShow(true)}><FontAwesomeIcon icon={faInfoCircle} /></button>/
        <button aria-label='Open Time Setting Modal' onClick={() => setTimeModalShow(true)}><FontAwesomeIcon icon={faClock} /></button>/
        <button aria-label='Open Add Timeline from Preset Modal' onClick={() => setGameModalShow(true)}><FontAwesomeIcon icon={faMobileAlt} /></button>/
        <button aria-label='Open Add Timeline Modal' onClick={() => setAddModalShow(true)}><FontAwesomeIcon icon={faPlus} /></button>
      </div>
    </section>
  );
}