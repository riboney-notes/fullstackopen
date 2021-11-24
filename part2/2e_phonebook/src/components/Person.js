import React from 'react'
import personService from '../services/PersonAPI'


const Person = ({person, persons, setPersons, notify}) => {
    const filterOutPerson = p => p.id !== person.id

    const onClick = () => {
        const deleteIt = window.confirm(`Delete ${person.name}?`)
        
        if(deleteIt) {
            personService.remove(person.id)
                .then(res => {
                    console.log(res.status)
                    setPersons(persons.filter(filterOutPerson))})
                .catch(err => notify(`Information of ${person.name} had already been removed from the server`, 'error'))
        }
    }

    return (
        <div>
            {person.name} {person.number}
            <button onClick={onClick}>delete</button>
        </div>
    )
}

export default Person