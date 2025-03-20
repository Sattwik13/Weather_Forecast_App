const API_KEY = 'f4aec554b67f124bef26544528ddea46';


//----------------------------- DOM Element References -----------------------
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const cityInput = document.getElementById('cityInput');
const recentSearches = document.getElementById('recentSearches');
const recentSearchesContainer = document.getElementById('recentSearchesContainer');


//----------------------------- Event Listeners -------------------------------
searchBtn.addEventListener('click', () => {
    fetchWeather(cityInput.value.trim()); 
    cityInput.value = ''; // -- reset the input
});
currentLocationBtn.addEventListener('click',() => { 
    getCurrentLocation();
    cityInput.value = ''; // -- reset the input
});
recentSearches.addEventListener('change', () => fetchWeather(recentSearches.value));


//------------------------------  Fetch weather data for a given city name ----------------------------
async function fetchWeather(city) {
  if (!city) {
    // alert('Please enter a valid city name.');
    showToast('Please enter a valid city name.', 'error');
    return;
  }

  setLoadingState(true);

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('City not found!');
    }

    const data = await response.json();
    displayCurrentWeather(data);
    displayForecast(data);
    saveRecentSearch(city);

  } catch (error) {
    // alert(error.message);
    showToast(error.message, 'error');
  } finally {
    setLoadingState(false);
  }
}


//---------------------- Set loading state for buttons with spinner-------------------------
function setLoadingState(isLoading) {
    if (isLoading) {
        if(searchBtn.disabled === true){
                searchBtn.innerHTML = `<svg class="animate-spin h-5 w-5 mr-2 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8z"></path>
                </svg> Searching...`;
        }
              currentLocationBtn.innerHTML = `<svg class="animate-spin h-5 w-5 mr-2 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8z"></path>
              </svg> Loading...`;   
    } else {
      searchBtn.innerHTML = 'Search';
      currentLocationBtn.innerHTML = 'Use Current Location';
    }
  
    searchBtn.disabled = isLoading;
    currentLocationBtn.disabled = isLoading;    
  }
  
  //-------------------- Toast notification system-----------------------------------
  function showToast(message, type = 'error') {
    const toastContainer = document.getElementById('toastContainer');
  
    const toast = document.createElement('div');
    toast.className = `flex items-center max-w-xs w-full bg-${type === 'error' ? 'red' : 'green'}-500 text-black text-sm font-medium px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 opacity-0 translate-y-2`;
  
    toast.innerHTML = `
      <div class="mr-3">${type === 'error' ? '❗' : '✅'}</div>
      <div class="flex-1">${message}</div>
      <button class="ml-3 focus:outline-none text-white" onclick="this.parentElement.remove()">✖️</button>
    `;
  
    toastContainer.appendChild(toast);
  
    //---- Alert Animation arise
    requestAnimationFrame(() => {
      toast.classList.remove('opacity-0', 'translate-y-2');
    });
  
    //---- Remove after 5 seconds
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 2000);
  }


//-------------------------------  Display the current weather from fetched data -----------------------
function displayCurrentWeather(data) {
  const cityDate = document.getElementById('cityDate');
  const descriptionText = document.getElementById('descriptionText');
  const weatherIcon = document.getElementById('weatherIcon');
  const temperature = document.getElementById('temperature');
  const wind = document.getElementById('wind');
  const humidity = document.getElementById('humidity');

  const current = data.list[0];

  cityDate.textContent = `${data.city.name} (${current.dt_txt.split(' ')[0]})`;
  descriptionText.textContent = capitalize(current.weather[0].description);
  weatherIcon.innerHTML = getWeatherIcon(current.weather[0].main);
  temperature.textContent = `🌡️ Temperature: ${current.main.temp}°C`;
  wind.textContent = `💨 Wind: ${current.wind.speed} M/S`;
  humidity.textContent = `💦 Humidity: ${current.main.humidity}%`;

  document.getElementById('currentWeather').classList.remove('hidden');

   // ---- Call function to change background dynamically
  changeBackground(current.weather[0].main);
}

function changeBackground(condition) {
    const body = document.body;
  
    // Reset classes
    body.className = '';
  
    // Add weather-specific class
    switch (condition.toLowerCase()) {
      case 'clear':
        body.classList.add('clear-bg');
        break;
      case 'clouds':
        body.classList.add('cloudy-bg');
        break;
      case 'rain':
        body.classList.add('rainy-bg');
        break;
      case 'snow':
        body.classList.add('snowy-bg');
        break;
      case 'thunderstorm':
        body.classList.add('stormy-bg');
        break;
      default:
        body.classList.add('default-bg');
    }
  }
  

//-------------------------------  Display a 5-day forecast from the fetched data -----------------------
function displayForecast(data) {
  const forecastContainer = document.getElementById('forecastContainer');
  forecastContainer.innerHTML = '';

  const forecastDays = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!forecastDays[date]) {
      forecastDays[date] = item;
    }
  });

  Object.keys(forecastDays).slice(1, 6).forEach(date => {
    const day = forecastDays[date];
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow-lg p-4 text-center hover:scale-105 transition transform';

    card.innerHTML = `
      <h4 class="font-semibold mb-2">${date}</h4>
      <div class="text-4xl mb-2">${getWeatherIcon(day.weather[0].main)}</div>
      <p class="text-gray-700">🌡️ ${day.main.temp}°C</p>
      <p class="text-gray-700">💨 ${day.wind.speed} M/S</p>
      <p class="text-gray-700">💦 ${day.main.humidity}%</p>
    `;

    forecastContainer.appendChild(card);
  });
}


//--------------------------------  Get a weather emoji/icon based on the condition ---------------------
function getWeatherIcon(condition) {
  switch (condition.toLowerCase()) {
    case 'clear':
      return '☀️';
    case 'clouds':
      return '🌤️';
    case 'rain':
      return '🌧️';
    case 'snow':
      return '❄️';
    case 'thunderstorm':
      return '⛈️';
    case 'drizzle':
      return '🌦️';
    default:
      return '🌈';
  }
}

//--------------------------------  Save a city to recent searches in localStorage ---------------------
function saveRecentSearch(city) {
  let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];

  if (!searches.includes(city)) {
    searches.push(city);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
  }

  loadRecentSearches();
}

//-------------------------------- Load recent searches and populate the dropdown ----------------------
function loadRecentSearches() {
    // Converts that string back into an array.
    //  If there’s nothing saved yet, it defaults to an empty array
  let searches = JSON.parse(localStorage.getItem('recentSearches')) || []; 

  if (searches.length === 0) {
    recentSearchesContainer.classList.add('hidden'); // Hides it by adding the hidden class(display: none in Tailwind)
    return; // Stops the function here if there are no items to show.
  }

  recentSearchesContainer.classList.remove('hidden');
  // Loops over each city in the searches array and creates an <option> element with: value="${city}"-> The value passed when selected. and Displays the city name inside the option and .join('') → Combines all those option strings into one big string to set as innerHTML.
  recentSearches.innerHTML = searches.map((city, index) => {
    // If it's the last added city, mark it as selected
    const selected = index === searches.length - 1 ? 'selected' : '';
    return `<option value="${city}" ${selected}>${city}</option>`;
  }).join('');
}

//-------------------------------- Get current location using Geolocation API and fetch weather data ---------------------
async function getCurrentLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  setLoadingState(true);

  navigator.geolocation.getCurrentPosition(async position => {
    const { latitude, longitude } = position.coords;

    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Location data not found!');
      }

      const data = await response.json();
      displayCurrentWeather(data);
      displayForecast(data);
      saveRecentSearch(data.city.name);

    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingState(false);
    }
  }, error => {
    alert('Unable to retrieve your location.');
    setLoadingState(false);
  });
}




//  Set loading state for buttons
// function setLoadingState(isLoading) {
//   searchBtn.textContent = isLoading ? 'Loading...' : 'Search';
//   currentLocationBtn.textContent = isLoading ? 'Loading...' : 'Use Current Location';
//   searchBtn.disabled = isLoading;
//   currentLocationBtn.disabled = isLoading;
// }


//---------------------------  Capitalize the first letter of a string ---------------------------
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//----------------------------  Load recent searches on page load ------------------------------
window.addEventListener('load', loadRecentSearches);
