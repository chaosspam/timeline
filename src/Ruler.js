export default function Ruler({ use12Hr }) {
  const ticks = [];

  for (let i = 0; i < 12; i++) {
    if (use12Hr) {
      ticks.push(<li key={i * 2}>{(i === 0 ? '12 AM' : i)}</li>);
    } else {
      ticks.push(<li key={i * 2}>{i}</li>);
    }
    ticks.push(<li key={i * 2 + 1}></li>);
  }

  for (let i = 0; i < 12; i++) {
    if (use12Hr) {
      ticks.push(<li key={(i + 12) * 2}>{(i === 0 ? '12 PM' : i).toString()}</li>);
    } else {
      ticks.push(<li key={(i + 12) * 2}>{i + 12}</li>);
    }
    ticks.push(<li key={(i + 12) * 2 + 1}></li>);
  }

  if (use12Hr) {
    ticks.push(<li key={48}>12</li>);
  } else {
    ticks.push(<li key={48}>0</li>);
  }

  return (
    <ul className='ruler' aria-hidden='true'>
      {ticks}
    </ul>
  );
}
