import {Display} from './UtilComponents';

// Functions
function sum(...args){
  return args.reduce( (prevVal, currVal) => prevVal+currVal);
}

function avg(args){
  const {good, neutral, bad} = args;
  const total = good + neutral + bad;

  if(!total) return 0.00;

  const sum = good + (bad*-1);
  return (sum/total).toFixed(2);
}

function percentage(part, total) {
  if(!total) return '0.00%';
  return `${(part/total * 100).toFixed(2)}%`;
}


const Statistics = ({good, neutral, bad}) => {
  const sumStat = sum(good, neutral, bad);
  const avgStat = avg({good:good, neutral:neutral, bad:bad});
  const postiveStat = percentage(good, sumStat);

  if(!(good || neutral || bad)) return (<div>No feedback given</div>);

  return (
    <table>
      <tbody>
      <Display name='good' counter={good}/>
      <Display name='neutral' counter={neutral}/>
      <Display name='bad' counter={bad}/>
      <Display name='all' counter={sumStat}/>
      <Display name='average' counter={avgStat}/>
      <Display name='postive' counter={postiveStat}/>
      </tbody>
    </table>
  );
}

export default Statistics;

const table = (
  <table>

  </table>
)