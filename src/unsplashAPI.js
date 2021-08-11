export default async function getBackGroundImg(input) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?client_id=LOffEiqJfK29D_2cNJtuW_BQfW1cF-Sv-nhyLzZY0oE&per_page=100&orientation=landscape&query=${input}`,
      { mode: 'cors' }
    )
    const json = await response.json()

    const randImg = getRandomNum(0, json.results.length - 1)
    return json.results[randImg].urls.raw
  } catch (err) {
    alert('Picture Not Found')
  }
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
