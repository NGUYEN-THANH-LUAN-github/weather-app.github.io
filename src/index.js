const iso3311a2 = require('../node_modules/iso-3166-1-alpha-2')
import { format, fromUnixTime } from 'date-fns'
const form = document.querySelector('form')
const input = document.querySelector('input')

function initSubmitEvent() {
  window.onkeypress = e => {
    if (e.key === 'Enter') getWeatherInfo
  }
  form.onsubmit = getWeatherInfo
}

let isMetric = true
let tempSymbol
isMetric ? (tempSymbol = 'C') : (tempSymbol = 'F')

initSubmitEvent()

async function getWeatherInfo() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&units=${
        isMetric ? 'metric' : 'imperial'
      }&appid=180d9a514ad964c76a4f3917c58c9227`,
      { mode: 'cors' }
    )
    const json = await response.json()

    const resForecast = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${
        json.coord.lat
      }&lon=${json.coord.lon}&units=${
        isMetric ? 'metric' : 'imperial'
      }&appid=180d9a514ad964c76a4f3917c58c9227`,
      { mode: 'cors' }
    )
    const jsonForecast = await resForecast.json()

    const dTF = [
      ...fromUnixTime(json.dt)
        .toLocaleDateString('en-US', {
          timeZone: jsonForecast.timezone,
        })
        .split('/'),
    ]

    const dailyForecast = []
    const hourlyForecast = []

    for (let i = 1; i <= 7; i++) {
      dailyForecast.push({
        weekday: format(fromUnixTime(jsonForecast.daily[i].dt), 'EEEE'),
        maxTemp: `${Math.round(jsonForecast.daily[i].temp.max)}°${tempSymbol}`,
        minTemp: `${Math.round(jsonForecast.daily[i].temp.min)}°${tempSymbol}`,
        icon: jsonForecast.daily[i].weather[0].icon,
      })
    }

    for (let i = 1; i <= 24; i++) {
      hourlyForecast.push({
        time: fromUnixTime(jsonForecast.hourly[i].dt)
          .toLocaleTimeString('en-US', {
            timeZone: jsonForecast.timezone,
            hour: 'numeric',
          })
          .toLowerCase(),
        temp: `${Math.round(jsonForecast.hourly[i].temp)}°${tempSymbol}`,
        icon: jsonForecast.hourly[i].weather[0].icon,
      })
    }

    const weatherInfo = {
      description: json.weather[0].description,
      city: json.name,
      country: iso3311a2.getCountry(json.sys.country),
      weekday: format(new Date(dTF[2], dTF[0] - 1, dTF[1]), 'EEEE'),
      date: format(new Date(dTF[2], dTF[0] - 1, dTF[1]), 'PPP'),
      time: fromUnixTime(json.dt)
        .toLocaleTimeString('en-US', {
          timeZone: jsonForecast.timezone,
          hour: 'numeric',
          minute: '2-digit',
        })
        .toLowerCase(),
      'current temperature': `${Math.round(json.main.temp)}°${tempSymbol}`,
      'feels like': `${Math.round(json.main['feels_like'])}°${tempSymbol}`,
      humidity: `${json.main.humidity}%`,
      'chance of rain': `${jsonForecast.daily[0].pop}%`,
      'wind speed': `${json.wind.speed}m/s`,
      dailyForecast,
      hourlyForecast,
    }
    console.log(weatherInfo)
    /* console.log(json)
    console.log(jsonForecast) */
  } catch (err) {
    alert('Not Found')
  }
}
