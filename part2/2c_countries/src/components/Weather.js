import React, {useState, useEffect} from 'react'
import axios from 'axios'

const Weather = ({capital}) => {

    const [ weather, setWeather] = useState({})

    const fetchData = () => axios
        .get(`http://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=${'metric'}`)
        .then(res => {
            console.log('resonpse:',res)
            setWeather(res.data)
        })
    
    useEffect(fetchData, [])

    // need to check if weather data was fetched
    if(Object.keys(weather).length !== 0)
        return (
            <div>
                <h2>Weather in {capital}</h2>
                <p><b>temperature:</b> {weather.main.temp} Celcius</p>
                <p><b>wind:</b> {weather.wind.speed}</p>
            </div>
        )
    else
        // if weather data is not ready, display default html or else you will get error...it will eventually re-render once data is fetched
        return <p>Weather is loading....</p>
}

export default Weather