import getWeatherInfo from './openWeather'
import getBackGroundImg from './unsplash'

export function initSearchButton() {
  const search = document.querySelector('.top-info .fa-search')
  window.onkeypress = e => {
    const input = document.querySelector('input').value
    if (e.key === 'Enter') {
      e.preventDefault()
      updateInfo(input)
    }
  }
  search.onclick = () => {
    const input = document.querySelector('input').value
    updateInfo(input)
  }
}

export async function updateInfo(input) {
  const info = await getWeatherInfo(input)
  updateMainInfos(info)
  updateSideInfos(info)
  updateForecast(info)
  const city_link = await getBackGroundImg(input)
  setBackgroundImg(city_link)

  document.querySelector('input').value = ''
}

function setBackgroundImg(link) {
  document.body.style.background = `url(${link}) no-repeat center`
}

// https://api.unsplash.com/search/photos?client_id=LOffEiqJfK29D_2cNJtuW_BQfW1cF-Sv-nhyLzZY0oE&color=black&query=fukuoka

// random
// https://api.unsplash.com/photos/random?client_id=LOffEiqJfK29D_2cNJtuW_BQfW1cF-Sv-nhyLzZY0oE&color=black&query=fukuoka
function updateMainInfos(info) {
  const description = document.querySelector('.main-infos>.description>h1')
  const city = document.querySelector('.main-infos>.description>.city')
  const date = document.querySelector('.main-infos>.date')
  const time = document.querySelector('.main-infos>.time')
  const temp = document.querySelector('.main-infos>.temp>span')
  const img = document.querySelector('.main-infos>.temp>img')

  description.innerText = info.description
    .split(' ')
    .map(word => capitalizeFirstLetter(word))
    .join(' ')
  city.innerText = `${info.city}, ${info.country}`
  date.innerText = `${info.weekday}, ${info.date}`
  time.innerText = info.time.toUpperCase()
  temp.innerText = info['current temperature']
  img.setAttribute(
    'src',
    `http://openweathermap.org/img/wn/${info.icon}@2x.png`
  )
  img.setAttribute('alt', info.description)
}

function updateSideInfos(info) {
  const feels_like = document.querySelector('[feels-like]')
  const humidity = document.querySelector('[humidity]')
  const chance_of_rain = document.querySelector('[chance-of-rain]')
  const wind_speed = document.querySelector('[wind-speed]')

  feels_like.innerText = info['feels like']
  humidity.innerText = info.humidity
  chance_of_rain.innerText = info['chance of rain']
  wind_speed.innerText = info['wind speed']
}

function updateForecast(info) {}

// chance of rain: "0.85%"
// city: "Vung Tau"
// country: "Viet Nam"
// current temperature: "28°C"
// dailyForecast: (7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}]
// date: "July 3rd, 2021"
// description: "overcast clouds"
// feels like: "32°C"
// hourlyForecast: (24) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// humidity: "75%"
// time: "7:59 am"
// weekday: "Saturday"
// wind speed: "2.76m/s"
// __proto__: Object

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
