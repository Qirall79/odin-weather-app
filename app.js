// Default city
getCoordinates("london").then((coords) => {
  getWeather(coords[0], coords[1]).then((data) => {
    displayWeather(data);
  });
});

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = document.querySelector("input").value;
  let [lat, lon] = await getCoordinates(city);

  const data = await getWeather(lat, lon);
  console.log(data);

  displayWeather(data);

  document.querySelector("input").value = "";
});

// Get city lat and lon
async function getCoordinates(city) {
  let response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=e05895a092c99a5cff56e0a99e8112f7`,
    {
      mode: "cors",
    }
  );

  const data = await response.json();
  return [data[0].lat, data[0].lon];
}

// Get city weather based on coordinates
async function getWeather(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=e05895a092c99a5cff56e0a99e8112f7&units=metric`,
    {
      mode: "cors",
    }
  );

  const data = await response.json();

  return data;
}

// Change dom elements based on weather data
function displayWeather(data) {
  // Current weather updates
  const city = document.querySelector("#hourly h2");
  const currentWeatherDescr = document.querySelector("#hourly h3");
  const currentTemp = document.querySelector("#hourly .now p");

  fetch(
    `http://api.openweathermap.org/geo/1.0/reverse?lat=${data.lat}&lon=${data.lon}&limit=1&appid=e05895a092c99a5cff56e0a99e8112f7`,
    { mode: "cors" }
  )
    .then((response) => response.json())
    .then((res) => {
      city.innerHTML = res[0].name;
    });

  currentWeatherDescr.innerHTML = data.current.weather[0].description;
  currentTemp.innerHTML = Math.round(data.current.temp) + "°";

  // Hourly weather
  const upcomings = document.querySelectorAll(".upcoming > div");
  let = 1;
  let currentHour = new Date().getHours();

  upcomings.forEach((div) => {
    if (div.dataset.id == "0") {
      document
        .querySelector(`[data-id = "${div.dataset.id}"] img`)
        .setAttribute(
          "src",
          `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
        );

      document.querySelector(
        `[data-id = "${div.dataset.id}"] .percent`
      ).innerHTML = data.current.humidity + "%";
      document.querySelector(
        `[data-id = "${div.dataset.id}"] .degree`
      ).innerHTML = Math.round(data.current.temp) + "°";
    } else {
      let upcomingHour = currentHour + parseInt(div.dataset.id);
      if (upcomingHour > 24) {
        upcomingHour = currentHour + parseInt(div.dataset.id) - 24;
      }

      document.querySelector(
        `[data-id = "${div.dataset.id}"] .time`
      ).innerHTML = upcomingHour == 24 ? "00" : upcomingHour;

      document.querySelector(
        `[data-id = "${div.dataset.id}"] .percent`
      ).innerHTML = data.hourly[parseInt(div.dataset.id) - 1].humidity + "%";
      document.querySelector(
        `[data-id = "${div.dataset.id}"] .degree`
      ).innerHTML =
        Math.round(data.hourly[parseInt(div.dataset.id) - 1].temp) + "°";

      document
        .querySelector(`[data-id = "${div.dataset.id}"] img`)
        .setAttribute(
          "src",
          `http://openweathermap.org/img/wn/${
            data.hourly[parseInt(div.dataset.id) - 1].weather[0].icon
          }@2x.png`
        );
    }
  });

  // Other weather details
  const sunrise = document.querySelector(".sunrise span");
  const sunset = document.querySelector(".sunset span");
  const humidity = document.querySelector(".humidity span");
  const wind = document.querySelector(".wind span");
  const feels = document.querySelector(".feels span");
  const press = document.querySelector(".press span");
  const visibility = document.querySelector(".visibility span");
  const uv = document.querySelector(".uv span");

  sunrise.innerHTML =
    new Date(parseInt(data.current.sunrise) * 1000).getHours() +
    ":" +
    new Date(parseInt(data.current.sunrise) * 1000).getMinutes();
  sunset.innerHTML =
    new Date(parseInt(data.current.sunset) * 1000).getHours() +
    ":" +
    new Date(parseInt(data.current.sunset) * 1000).getMinutes();

  humidity.innerHTML = data.current.humidity + "%";

  wind.innerHTML = "e " + data.current.wind_speed + " km/h";

  feels.innerHTML = Math.round(data.current.feels_like) + "°";

  press.innerHTML = Math.round(data.current.pressure) + " hPa";

  visibility.innerHTML = data.current.visibility / 1000 + " km";

  uv.innerHTML = data.current.uvi;

  // Daily weather
  let currentDay = new Date().getDay();
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const rows = document.querySelectorAll("tr");
  rows.forEach((row) => {
    if (row.dataset.day) {
      let id = parseInt(row.dataset.day);

      const day = document.querySelector(`tr[data-day="${id}"] .day`);
      const img = document.querySelector(`tr[data-day="${id}"] img`);
      const humidity = document.querySelector(`tr[data-day="${id}"] .humidity`);
      const wind = document.querySelector(`tr[data-day="${id}"] .wind`);
      const temp = document.querySelector(`tr[data-day="${id}"] .temp`);

      let upcomingDay = currentDay + id + 1;
      if (upcomingDay >= 7) {
        upcomingDay = currentDay + id + 1 - 7;
      }
      day.innerHTML = weekday[upcomingDay];
      img.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${data.daily[id].weather[0].icon}@2x.png`
      );

      humidity.innerHTML = data.daily[id].humidity + "%";
      wind.innerHTML = "e " + data.daily[id].wind_speed + " km/h";
      temp.innerHTML =
        Math.round(data.daily[id].temp.max) +
        "°  " +
        Math.round(data.daily[id].temp.min) +
        "°";
    }
  });
}
