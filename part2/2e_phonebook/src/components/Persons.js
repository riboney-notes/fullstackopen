import React from 'react'
import Person from './Person'

const Persons = ({persons, setPersons, filter, notify}) => {
    if(!filter){
      return(
        <div>
          {persons.map(person => 
            <Person 
              key={person.name}
              person={person}
              persons={persons}
              setPersons={setPersons}
              notify={notify}
            />)
          }
        </div>
      )
    } else {
      return(
        <div>
          {persons
          .filter( person => 
            person.name.toLowerCase().includes(filter.toLowerCase()))
            .map(person => 
              <Person 
                key={person.name}
                person={person}
                persons={persons}
                setPersons={setPersons}
              />)
            }
        </div>
      )
    }
  }

  export default Persons