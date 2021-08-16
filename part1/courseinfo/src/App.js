import React from 'react';
import Header from './Header.js';
import Total from './Total.js'
import Content from './Content.js'


function Part(part, num){
  this.part = part;
  this.num = num;
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14;
  const contents = [
    new Part(part1, exercises1),
    new Part(part2, exercises2),
    new Part(part3, exercises3),
  ];

  let exercises = Array.from(contents, (c) => c.num);

  return (
    <div>
      <Header name={course} />
      <Content contents={contents} />
      <Total exercises={exercises}/>
    </div>
  )
}

export default App;