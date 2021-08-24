import React, { useState } from 'react';
import { Header, Button } from './Utils';
import Quote from './Quote';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ];

   
  const [selected, setSelected] = useState(0);
  const [votes, setVote] = useState(new Array(anecdotes.length).fill(0));

  const randomQuote = () => {
    setSelected( Math.floor(Math.random() * (anecdotes.length)));
  }

  const addVote = () => {
    const newArray = [...votes];
    newArray[selected] += 1;
    setVote(newArray);
  }

  const indexOfMostVotes = votes.indexOf(Math.max(...votes));

  return (
    <div>
      <Header name='Anecdote of the day'/>
      <Quote quote={anecdotes[selected]} votes={votes[selected]} />
      <Button text='next anecdote' onClick={randomQuote} />
      <Button text='vote' onClick={addVote} />
      <Header name='Anecdote with most votes'/>
      <Quote quote={anecdotes[indexOfMostVotes]} votes={votes[indexOfMostVotes]} />
    </div>
  )
}

export default App
