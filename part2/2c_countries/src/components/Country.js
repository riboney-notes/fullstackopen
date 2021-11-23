import React, {useState} from 'react'
import Weather from './Weather'

const Country = ({country}) => {

    const [ toggle, setToggle ] = useState(false)

    const onClick = () => {
        setToggle(!toggle)
    }

    if(toggle){
        return (
            <div>
                <h1>{country.name.common}</h1>
                <p>capital {country.capital[0]}</p>
                <p>Latitude & Longitude {country.latlng[0]}, {country.latlng[1]}</p>
                <h2>Spoken Languages</h2>
                <ul>{Object.entries(country.languages).map(l => <li key={l[0]}>{l[1]}</li>)}</ul>
                <p>{country.flag}</p>
                <Weather capital={country.capital[0]}/>
                <button onClick={onClick}>Hide</button>
            </div>
        )
    } else {
        return (
            <div>
                {country.name.common} 
                <button onClick={onClick}>Show</button>
            </div>
        )
    }
}

export default Country