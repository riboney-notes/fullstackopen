import React from 'react';
import ReactDOM from 'react-dom';

const Header = ({ course }) => {
    return (
      <h2>{course.name}</h2>
    )
}

const Content = ({ course }) => {
    return (
      <div>
        {course.parts.map(part => <Part key={part.id} part={part} />)}
      </div>
    )
}

const Part = (props) => {
    return (
      <p>
        {props.part.name} {props.part.exercises}
      </p>    
    )
}

const Total = ({course}) => {
    return <p><b>total of {course.parts.map(part=>part.exercises).reduce((a, b) => a+b )} exercises </b></p>
}

const Course = ({course}) => {
    return (
      <div>
        <Header course={course} />
        <Content course={course} /> 
        <Total course={course} />
      </div>
    )
}

export default Course