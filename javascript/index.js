const searchBtn = document.querySelectorAll('.footer__menu button');

let weatherData = [];

searchBtn.forEach((n) => {
  n.addEventListener('click', (e) => {
    weatherData = [];
    let city = e.target.value;
    let localName = e.target.innerHTML;
    let myKey = 'CWB-56EF1CC4-5FBF-4E8F-B52B-10E28543341D';
    let url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${myKey}&locationName=${city}`;
    async function getWeatherAPI() {
      try {
        let d = await fetch(url);
        let dj = await d.json();
        const locationData = dj.records.location[0];
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (
              ['WDSD', 'TEMP', 'HUMD', 'D_TX', 'D_TN'].includes(
                item.elementName,
              )
            ) {
              neededElements[item.elementName] = item.elementValue;
            }
            return neededElements;
          },
          {},
        );
        weatherData.push({
          observationTime: locationData.time.obsTime,
          locationName: localName,
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          humid: weatherElements.HUMD,
          DTX: weatherElements.D_TX,
          DTN: weatherElements.D_TN,
        });
        renderWeatherUI();
      } catch (error) {
        console.log(error);
        renderErrorUI();
      }
    }
    getWeatherAPI();
  });
});

const headerBox = document.querySelector('.header');
const tempBox = document.querySelector('.navbar__temp');

function renderWeatherUI() {
  let headerUI = weatherData.map(
    (info) => `<section class="header__location">
  <h1>${info.locationName}</h1>
</section>
<section class="header__info">
  <p>溫度 Temperature : <span>${info.temperature}</span> ℃</p>
  <p>最高溫度 Maximum Temperature : <span>${info.DTX}</span> ℃</p>
  <p>最低溫度 Lowest Temperature : <span>${info.DTN}</span> ℃</p>
  <p>濕度 Humidity : <span>${info.humid}</span> %RH</p>
  <p>風速 Wind Speed : <span>${info.windSpeed}</span> m/s</p>
</section>`,
  );

  let tempUI = weatherData.map(
    (info) => `<section class="icon"></section>
    <section class="temp">
      <h1>${info.temperature}</h1>
      <p>℃</p>
    </section>`,
  );
  headerBox.innerHTML = headerUI;
  tempBox.innerHTML = tempUI;
}

function renderErrorUI() {
  let errorUI = `<section class="header__location--error" >
  <h1>查無此地</h1></section>
`;
  headerBox.innerHTML = errorUI;
}

const monthsInEng = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const dayList = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const timeBox = document.querySelector('.navbar__timeBox');

function renderTime() {
  const today = new Date();
  let M = today.getMinutes();
  M <= 9 ? (M = '0' + M) : M;
  let S = today.getSeconds();
  S <= 9 ? (S = '0' + S) : S;
  const timeData = [
    {
      hour: today.getHours(),
      second: S,
      minute: M,
      dow: dayList[today.getDay()],
      day: today.getDate(),
      month: monthsInEng[today.getMonth()],
      year: today.getFullYear(),
    },
  ];
  let TimeUI = timeData.map(
    (
      time,
    ) => `<section class="clock"><p>${time.hour}:${time.minute}</p><span>${time.second}</span></section>
      <p class="date">${time.dow}, ${time.day} ${time.month} ${time.year}</p>`,
  );
  timeBox.innerHTML = TimeUI;
  setTimeout(renderTime, 1000);
}

renderTime();

const textBox = document.querySelector('.sayHi');

function renderText() {
  const today = new Date();
  const timeData = [
    {
      hour: today.getHours(),
    },
  ];
  // const hour = today.getHours();
  let textUI = timeData.map((time) => {
    if (time.hour < 12) {
      return `Good Morning`;
    } else if ((time.hour >= 12) & (time.hour < 18)) {
      return `Good Afternoon`;
    } else {
      return `Good Night`;
    }
  });

  textBox.innerHTML = textUI;
  setTimeout(renderText, 21600000);
}

renderText();
