import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './Persons'
import Filter from './Filter'
import PersonForm from './PersonForm'
import personService from '../services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

  const fetchData = () => personService.getAll().then(res => setPersons(res))

  // need to pass empty array to prevent too many requests
  useEffect(fetchData, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={newFilter} setFilter={setNewFilter} />
      <h3>Add a new </h3>
      <PersonForm 
        persons={persons} setPersons={setPersons} 
        name={newName} number={newNumber} 
        setName={setNewName} setNumber={setNewNumber} 
      />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={newFilter} setPersons={setPersons} />
    </div>
  )
}

export default App