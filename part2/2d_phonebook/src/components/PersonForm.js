import React from 'react'
import axios from 'axios'
import personService from '../services/persons'

const PersonForm = ({persons, name, number, setPersons, setName, setNumber}) => {

    const handleNameOnChange = (event) => {
        setName(event.target.value)
    }
    
    const handleNumberOnChange = (event) => {
        setNumber(event.target.value)
    }

    const handleOnSubmit = (event) => {
        event.preventDefault();
        if(persons.some(person => person.name === name)){
          const updateIt = window.confirm(`${name} is already added to phonebook, 
          replace the old number with new one?`)
          if(updateIt){
            const person = persons.find(p => p.name === name)
            person.number = number
            personService.update(person).then(res => {
              setPersons(persons.map(p => p.name === name ? res:p))
            }) 
          } else return
        } else if(!name) {
          alert('Please enter a name!')
        } else if(!number) {
          alert('Please enter a number!')
        } else {
          const newPerson = {name: name, number: number}
          personService.create(newPerson)
            .then(res => {
              setPersons(persons.concat(res))
              setName('')
              setNumber('')
            })
        }
      }

    return (
        <form onSubmit={handleOnSubmit}>
        <div>
          <label for="name">name:</label>
          <input type="text" onChange={handleNameOnChange} value={name} id="name"/>
          <p></p>
          <label for="number">number:</label>
          <input type="text" onChange={handleNumberOnChange} value={number} id="number"/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonForm