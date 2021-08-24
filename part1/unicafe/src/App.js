import React, { useState } from 'react';
import { Header, Button } from './UtilComponents';
import Statistics from './Statistics';

// Objects
class Feedback {
  constructor(name, counter, increment) {
    this.name = name;
    this.counter = counter;
    this.increment = increment;
  }
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const goodFB = new Feedback('good', good, ()=>setGood(good+1));
  const neutralFB = new Feedback('neutral', neutral, ()=>setNeutral(neutral+1));
  const badFB = new Feedback('bad', bad, ()=>setBad(bad+1));

  return (
    <div>
      <Header name='give feedback' />
      <Button onClick={goodFB.increment} text={goodFB.name}/>
      <Button onClick={neutralFB.increment} text={neutralFB.name}/>
      <Button onClick={badFB.increment} text={badFB.name}/>
      <Header name='statistics' />
      <Statistics good={goodFB.counter} neutral={neutralFB.counter} bad={badFB.counter} />
    </div>
  )
}

export default App
