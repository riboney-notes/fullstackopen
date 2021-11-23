import React, { useState } from 'react'

const Search = ({setSearch}) => {

    const handleSearch = (event) => {
        setSearch(event.target.value)
    }

    return (
        <div>
            <label for="search">find countries </label>
            <input id="search" onChange={handleSearch} />
        </div>
    )
}

export default Search