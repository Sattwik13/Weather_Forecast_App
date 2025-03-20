# Weather Forecast App ☀️🌧️❄️

This is a simple and responsive **Weather Forecast App** built using **HTML**, **Tailwind CSS**, and **JavaScript**. It fetches weather data from the OpenWeatherMap API and displays current weather conditions and a 5-day forecast for any searched city.

---
- Github link- https://github.com/Sattwik13/Weather_Forecast_App


- Deploy link- https://weather-forecast-app-sg4m.vercel.app/
## 📂 Folder Structure


---

## 🚀 Features

- Get the current weather and 5-day forecast for any city.
- Option to fetch weather by **current location** using Geolocation API.
- Recent searches saved in local storage.
- Responsive UI with **Tailwind CSS** styling.
- Loading spinners and animated elements (GSAP).
- Toast notifications for errors and actions.

---

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (optional if you want to use Tailwind CLI or npm)
- OpenWeatherMap **API key** (sign up for free [here](https://openweathermap.org/api))

---

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/weather-forecast-app.git

2. **Navigate to the project folder**
   ```bash
   cd weather-forecast-app

3. **Install TailwindCSS (optional for production)**

   ```bash
   npm install -D tailwindcss
   npx tailwindcss init

4. **Generate output.css from input.css**

    ```bash
    npx tailwindcss -i ./src/input.css -o ./src/output.css --watch   

## Usage
- Open src/index.html in your browser.
- Enter a city name and click Search.
- Click Use Current Location to fetch weather data for your current position    
