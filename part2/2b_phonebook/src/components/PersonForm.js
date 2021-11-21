import React from 'react'

const PersonForm = ({persons, name, number, setPersons, setName, setNumber}) => {

    const handleNameOnChange = (event) => {
        setName(event.target.value)
    }
    
    const handleNumberOnChange = (event) => {
        setNumber(event.target.value)
    }

    const handleOnSubmit = (event) => {
        // prevent default behavior of form submission
        event.preventDefault();
        if(persons.some(person => person.name === name)){
          alert(`${name} is already added to phonebook`)
        } else if(!name) {
          alert('Please enter a name!')
        } else if(!number) {
          alert('Please enter a number!')
        } else {
          const newPerson = {name: name, number: number}
          setPersons(persons.concat(newPerson))
          setName('')
          setNumber('')
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