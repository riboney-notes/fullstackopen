import React from 'react'

const Persons = ({persons, filter}) => {
    if(!filter){
      return(
        <div>
          {persons.map(person=><p key={person.name}>{person.name} {person.number}</p>)}
        </div>
      )
    } else {
      return(
        <div>
          {persons
          .filter( person => 
            person.name.toLowerCase().includes(filter.toLowerCase()))
          .map( person => 
            <p key={person.name}>{person.name} {person.number}</p>)}
        </div>
      )
    }
  }

  export default Persons