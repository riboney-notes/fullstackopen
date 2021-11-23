import React from 'react'
import Countries from './Countries'

const Results = ({countries, search}) => {

    if(!search) return <p>Search is empty</p>

    const allMatching = country => country.name.common.toLowerCase().includes(search.toLowerCase())
    const exactMatching = country => country.name.common.toLowerCase() === search.toLowerCase()
    const results = countries.filter(c => allMatching(c))

    if(results.some(c => exactMatching(c))){
        return <Countries countries={results.find(c => exactMatching(c))} />
    } else if(results.length > 10) 
        return <p>Too many matches, specify another filter</p>
    else if(results.length <= 10 && results.length > 0) 
        return <Countries countries={results} />
    else 
        return <p>Found no results.</p>
}

export default Results