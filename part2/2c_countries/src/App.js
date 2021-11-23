import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Search from './components/Search'
import Results from './components/Results'

const App = () => {

  const [countries, setCountry] = useState([])
  const [search, setSearch] = useState('')

  const fetchData = () => axios
    .get('https://restcountries.com/v3.1/all')
    .then(res => setCountry(res.data))

  useEffect(fetchData, [])

  return (
    <div>
      <Search setSearch={setSearch}/>
      <Results countries={countries} search={search}/>
    </div>
  )
}

export default App