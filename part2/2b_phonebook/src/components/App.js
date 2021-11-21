import React, { useState } from 'react'
import Persons from './Persons'
import Filter from './Filter'
import PersonForm from './PersonForm'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')


  // const DisplayNumbers = ({persons}) => {
  //   if(!newFilter){
  //     return(
  //       <div>
  //         {persons.map(person=><p key={person.name}>{person.name} {person.number}</p>)}
  //       </div>
  //     )
  //   } else {
  //     return(
  //       <div>
  //         {persons
  //         .filter( person => 
  //           person.name.toLowerCase().includes(newFilter.toLowerCase()))
  //         .map( person => 
  //           <p key={person.name}>{person.name} {person.number}</p>)}
  //       </div>
  //     )
  //   }
  // }

  // can use person.name as key value
  // remember, you must define key for collections
  // Adding value to input so the input field clears after each submission
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={newFilter} setFilter={setNewFilter} />
      <h3>Add a new </h3>
      <PersonForm persons={persons} setPersons={setPersons} name={newName} number={newNumber} setName={setNewName} setNumber={setNewNumber} />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={newFilter} />
    </div>
  )
}

export default App