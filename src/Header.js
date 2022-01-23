import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

export function Header({ setUse12Hr }) {
  return (
    <header className='container d-flex align-items-center p-4 pb-0'>
      <h1><FontAwesomeIcon icon={faClock} /> Timeline</h1>
      <SettingsPanel setUse12Hr={setUse12Hr}/>
    </header>
  );
}

function SettingsPanel({ setUse12Hr }) {
  return (
    <div className="form-check form-switch ms-4">
      <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={(e) => { setUse12Hr(e.currentTarget.checked); }} defaultChecked={true} />
      <label className="form-check-label" htmlFor="flexSwitchCheckDefault">12-hour Format</label>
    </div>
  );
}