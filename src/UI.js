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

function updateForecast(info) {
  updateDaily(info.dailyForecast)
  updateHourly(info.hourlyForecast)
}

function updateDaily(infoDaily) {
  const dailyBoard = document.querySelector('.daily-board')
  dailyBoard.innerHTML = ''
  infoDaily.forEach(info => {
    dailyBoard.innerHTML += `
        <div class="fc weekday">
            <div class="left">${info.weekday}</div>
            <div class="right">
                <div class="temperature">
                <div class="max">${info.maxTemp}</div>
                <div class="min">${info.minTemp}</div>
                </div>
                <img
                class="icon"
                src="http://openweathermap.org/img/wn/${info.icon}@2x.png"
                />
            </div>
        </div>
        `
  })
}

function updateHourly(infoHourly) {
  const hourlyBoard = document.querySelector('.hourly-board')
  hourlyBoard.innerHTML = ''
  infoHourly.forEach(info => {
    hourlyBoard.innerHTML += `
        <div class="fc hour">
            <div class="left">${info.time}</div>
            <div class="right">
                <div class="temperature">${info.temp}</div>
                <img src="http://openweathermap.org/img/wn/${info.icon}@2x.png"></img>
            </div>
        </div>
        `
  })
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
