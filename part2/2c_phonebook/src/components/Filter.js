import React from 'react'

const Filter = ({filter, setFilter}) => {

    const handleFilterOnChange = (event) => {
        setFilter(event.target.value)
    }

    return (
        <div>
            <label for="filter">filter shown with</label>
            <input type="text" id="filter" 
             onChange={handleFilterOnChange} value={filter} />
        </div>
    )
}

export default Filter