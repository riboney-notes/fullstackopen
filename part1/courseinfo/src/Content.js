import React from 'react';
import Part from './Parts';

const Content = (props) => {
  let contents = props.contents;
  let listParts = contents.map((c) => {
    return <Part part={c.part} num={c.num}/>
  });

  return (
    <p>{listParts}</p>
  )
}

export default Content;