import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
   
  // const points = new Array(anecdotes.length).fill(0)
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const changeAnecdote = () => {
    const items = anecdotes.length;
    const getRandomInt = (max) => Math.floor(Math.random() * max)
    setSelected(getRandomInt(items))
  }

  const vote = () => {
    const votesCopy = [...votes]
    votesCopy[selected] = votesCopy[selected] + 1
    setVotes(votesCopy)
  }

  const Button = ({label, onClick}) => {
    return (
      <button onClick={onClick}>{label}</button>
    )
  }

  const Header = ({title}) => <h1>{title}</h1>

  const Anecdote = ({item, votes}) => {
    return (
      <div>
        <p>{item}</p>
        <p>has {votes} votes</p>
      </div>
    )
  } 

  const mostVotes = () => votes.indexOf(Math.max(...votes))

  return (
    <div>
      <Header title={'Anecdote of the day'} />
      <Anecdote item={anecdotes[selected]} votes={votes[selected]} />
      <Button label={'vote'} onClick={vote} />
      <Button label={'next anecdote'} onClick={changeAnecdote} />
      <Header title={'Anecdote with most votes'} />
      <Anecdote item={anecdotes[mostVotes()]} votes={votes[mostVotes()]} />
    </div>
  )
}

export default App