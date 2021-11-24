import React, { useState, useEffect } from 'react'
import Persons from './Persons'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Notification from './Notification'
import personService from '../services/PersonAPI'

const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ msg, setMsg] = useState('')
  const [ style, setStyle] = useState('none')

  const fetchData = () => personService.getAll().then(res => setPersons(res))
  const resetNotification = () => setTimeout(() => { 
    setMsg('')
    setStyle('none')
    console.log('resetting notification')
  }, 5000)

  // need to pass empty array to prevent too many requests
  useEffect(fetchData, [])
  useEffect(resetNotification, [msg])

  const notify = (msg, style) => {
    setMsg(msg)
    setStyle(style)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification msg={msg} style={style} />
      <Filter filter={newFilter} setFilter={setNewFilter} />
      <h3>Add a new </h3>
      <PersonForm 
        persons={persons} setPersons={setPersons} 
        name={newName} number={newNumber} 
        setName={setNewName} setNumber={setNewNumber} 
        notify={notify}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={newFilter} setPersons={setPersons} notify={notify}/>
    </div>
  )
}

export default App