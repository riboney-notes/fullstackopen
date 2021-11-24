import React from 'react'
import personService from '../services/PersonAPI'

const PersonForm = ({persons, name, number, setPersons, setName, setNumber, notify}) => {

    const handleNameOnChange = (event) => {
        setName(event.target.value)
    }
    
    const handleNumberOnChange = (event) => {
        setNumber(event.target.value)
    }

    const handleOnSubmit = (event) => {
      
      event.preventDefault();
      const confirmMsg = `${name} is already added to phonebook, replace the old number with new one?`
      const matchesName = (person) => person.name === name

      const updatePerson = () => {
        const updatedPerson = persons.find(matchesName)
        // change person's number
        updatedPerson.number = number
        // save to backend
        personService
          .update(updatedPerson)
          .then(response => {
            // if matches name, set to updated Person, otherwise don't change
            const updateMatchingPerson = (p) => matchesName(p) ? response: p 
            setPersons(persons.map(updateMatchingPerson))

        }) 
      }

      const addPerson = () => {
        const newPerson = {name: name, number: number}
        personService.create(newPerson)
          .then(res => {
            setPersons(persons.concat(res))
            setName('')
            setNumber('')
          }
        )
      }

      if(persons.some(matchesName)){
        if(window.confirm(confirmMsg)) {
          updatePerson()
          notify(`Updated ${name}'s number`, 'notify')
        }
      } else if(!name) notify('Please enter a name!', 'error')
      else if(!number) notify('Please enter a number!', 'error')
      else {
        addPerson()
        notify(`Added ${name}`, 'notify')
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