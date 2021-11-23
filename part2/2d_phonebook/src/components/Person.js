import React from 'react'
import personService from '../services/persons'



const Person = ({person, persons, setPersons}) => {

    const onClick = () => {
        const deleteIt = window.confirm(`Delete ${person.name}?`)
        if(deleteIt) {
            personService.remove(person.id)
                .then(res => {
                    console.log(res.status)
                    setPersons(persons
                        .filter(p => p.id !== person.id))
                })
        } else {
            return
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