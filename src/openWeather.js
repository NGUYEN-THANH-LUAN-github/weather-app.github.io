import { format, fromUnixTime } from 'date-fns'
const iso3311a2 = require('iso-3166-1-alpha-2')

const isMetric = true

export default async function getWeatherInfo(input) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=${
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
        maxTemp: `${Math.round(
          jsonForecast.daily[i].temp.max
        )}°${getTempSymbol()}`,
        minTemp: `${Math.round(
          jsonForecast.daily[i].temp.min
        )}°${getTempSymbol()}`,
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
        temp: `${Math.round(jsonForecast.hourly[i].temp)}°${getTempSymbol()}`,
        icon: jsonForecast.hourly[i].weather[0].icon,
      })
    }

    return {
      description: json.weather[0].description,
      icon: json.weather[0].icon,
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
      'current temperature': `${Math.round(
        json.main.temp
      )} °${getTempSymbol()}`,
      'feels like': `${Math.round(json.main['feels_like'])}°${getTempSymbol()}`,
      humidity: `${json.main.humidity}%`,
      'chance of rain': `${jsonForecast.daily[0].pop}%`,
      'wind speed': `${json.wind.speed}m/s`,
      dailyForecast,
      hourlyForecast,
    }
  } catch (err) {
    alert('Not Found')
  }
}

function getTempSymbol() {
  return isMetric ? 'C' : 'F'
}
