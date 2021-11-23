import React from 'react'
import Country from './Country'

const Countries = ({countries}) => {

    if(!Array.isArray(countries)) return <Country country={countries} />
    else 
        return (
            <div>
                {countries
                    .map(country => 
                        <Country key={country.name.common} country={country}/>)}
            </div>
        )
}

export default Countries