"use strict";

const myAPIKey = '6e1158d3e7934cd5a6b73738221205';
const baseUrl = 'https://api.weatherapi.com/v1/forecast.json';

let data = [];
let locationInput = document.getElementById("locationInput");
const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

async function searchByCoordinates(latitude, longitude) {
    let weatherApi = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=6c4b854f8b4b4f7eb42214015230608&q=${latitude},${longitude}&days=3`
    );
    let apiResponse = await weatherApi.json();
    data = apiResponse;
    displayWeatherToday();
    displayWeatherNext();
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                searchByCoordinates(latitude, longitude);
            },
            function(error) {
                console.error("Error getting user location:", error);
                searchByCoordinates(30.0444, 31.2357);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
        searchByCoordinates(30.0444, 31.2357);
    }
}

getUserLocation();

async function searchCity(cityName) {
    let weatherApi = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=6c4b854f8b4b4f7eb42214015230608&q=${cityName}&days=3`
    );
    let apiResponse = await weatherApi.json();
    if (!apiResponse.error) {
        data = apiResponse;
        displayWeatherToday(cityName);
        displayWeatherNext(cityName);
    }
}

locationInput.addEventListener("change", function() {
    let city = locationInput.value;
    if (city.length >= 3) {
        searchCity(city);
    } else {
        return;
    }
});

function displayWeatherToday() {
    const today = data.forecast.forecastday[0];
    const todayDate = new Date(today.date);
    let dayOfWeek = daysOfWeek[todayDate.getDay()];
    let dayNumber = todayDate.getDate();
    let month = monthNames[todayDate.getMonth()];

    let weatherData = "";
    weatherData += `
         <div class="col" >
            <div class="card bg-dark text-white ">
              <div class="card-header d-flex justify-content-between">
                <span class="day">${dayOfWeek}</span
                ><span class="date">${dayNumber} ${month}</span>
              </div>
              <div class="card-body p-4 text-center d-flex flex-column justify-content-center gap-2">
                <h5 class="location" title="City">${data.location.name}</h5>
                <div class="degree d-flex gap-2 justify-content-center align-items-center">
                  <h4 class="h1 mb-0" title="Max-Temperature">${today.day.maxtemp_c}°C</h4>
                  <img src="${today.day.condition.icon}" alt="" />
                </div>
                  <h6 class=" mb-0 text-white-50" title="Min-Temperature">${today.day.mintemp_c}°C</h6>
                <p class="status">${today.day.condition.text}</p>
                <div class="info d-flex gap-4 justify-content-center">
                  <span title="Chance of rain"><i class="fa-solid fa-umbrella pe-1"></i>${today.day.daily_chance_of_rain}%</span
                  ><span title="Wind speed"><i class="fa-solid fa-wind pe-1"></i>${today.day.maxwind_kph}km/h</span
                  ><span title="Average Humidity"><i class="fa-solid fa-droplet pe-1"></i>${today.day.avghumidity}%</span>
                </div>
              </div>
            </div>
            </div>
            
  `;

    document.getElementById("todayData").innerHTML = weatherData;
}

// Next Day
function displayWeatherNext() {
    let weatherData = "";
    for (let i = 1; i < data.forecast.forecastday.length; i++) {
        const day = data.forecast.forecastday[i];
        const dayOfWeek = daysOfWeek[new Date(day.date).getDay()];

        weatherData += `
        <div class="col-lg-6">
            <div class="card bg-dark text-white text-center">
              <div class="card-header">
                <span class="day">${dayOfWeek}</span>
              </div>
              <div class="card-body p-4 d-flex flex-column justify-content-center gap-2 ">
                <div class="degree mt-3">
                <img src="${day.day.condition.icon}" alt="" />
                  <h4 class="h3" title="Max-Temperature">${day.day.maxtemp_c}°C</h4>
                  <h6 class="text-white-50" title="Min-Temperature">${day.day.mintemp_c}°C</h6>
                </div>
                <p class="status">${day.day.condition.text}</p>
              </div>
            </div>
          </div>
    `;
    }

    document.getElementById("nextData").innerHTML = weatherData;
}