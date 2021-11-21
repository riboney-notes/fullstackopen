import React, { useState } from 'react'

const Header = ({ title }) => {
  return (
    <h1>{title}</h1>
  )
}

const Button = ({onClick, label}) => {
  return (
    <button onClick={onClick}>{label}</button>
  )
}

// const StatisticLine = ({item, count}) => {
//   return (<p>{item} {count}</p>)
// }

const StatisticLine = ({item, count}) => {
  return (
  <tr>
    <td>{item}</td>
    <td>{count}</td>
  </tr>)
}

const App = () => {
  // save clicks of each button to its own StatisticLinee
  // hooks
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // button event handlers
  const goodButtonHandler = () => setGood(good+1)
  const neutralButtonHandler = () => setNeutral(neutral+1)
  const badButtonHandler = () => setBad(bad+1)

  // StatisticLines functions
  const allVotes = () => good+neutral+bad
  const avgFeedback = () => {
    const score = good + (bad * -1)
    return Number.parseFloat((score / allVotes()).toPrecision(4))
  }
  const posFeedback = () => {
    const pos = (good/allVotes() * 100).toPrecision(4)
    return pos + '%'
  }

  // Conditional rendering
  const Statistics = ({good, neutral, bad}) => {
    const display = () => {
      if(!good && !neutral && !bad){
        return (
          <div>
            <p>No feedback given</p>
          </div>
          )
      } else {
        return (
          <table>
            <tbody>
              <StatisticLine item={'good'} count={good} />
              <StatisticLine item={'neutral'} count={neutral} />
              <StatisticLine item={'bad'} count={bad} /> 
              <StatisticLine item={'all'} count={allVotes()} />
              <StatisticLine item={'average'} count={avgFeedback()} />
              <StatisticLine item={'positive'} count={posFeedback()} />
            </tbody>
          </table>
        )
      }
    } 

    // What App component returns
    return (
      <div>
        <Header title={'Statistics'} />
        {display()}
      </div>

    )
  }

  return (
    <div>
      <Header title={'give feedback'} />
      <Button onClick={goodButtonHandler} label={'good'} />
      <Button onClick={neutralButtonHandler} label={'neutral'} />
      <Button onClick={badButtonHandler} label={'bad'} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App