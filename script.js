// Function to update the current time every second
function updateTime() {
  const timeElement = document.getElementById("time");
  const now = new Date();
  const formattedTime = now.toLocaleTimeString('en-US', { hour12: false });
  timeElement.textContent = formattedTime;
}
setInterval(updateTime, 1000); // Update time every second

// Function to fetch weather data
async function getWeather(city) {
  const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("City not found");
      const data = await response.json();
      displayWeather(data);
      saveRecentSearch(city); // Save the searched city
      displayRecentSearches(); // Update the recent searches display
  } catch (error) {
      document.getElementById("weather-info").textContent = error.message;
  }
}

// Display the weather information
function displayWeather(data) {
  const weatherElement = document.getElementById("weather-info");
  const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherElement.innerHTML = `
      <h2>${data.name}</h2>
      <img src="${iconUrl}" alt="${data.weather[0].description}">
      <p>Temperature: ${data.main.temp}°C</p>
      <p>Weather: ${data.weather[0].description}</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

// Function to save recent search in localStorage
function saveRecentSearch(city) {
  let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

  if (!recentSearches.includes(city)) {
      recentSearches.unshift(city); // Add new city to the beginning of the array
      if (recentSearches.length > 5) recentSearches.pop(); // Limit to 5 recent searches
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }
}

// Function to clear recent searches
function clearSearchHistory() {
  localStorage.removeItem("recentSearches"); // Clear from localStorage
  displayRecentSearches(); // Update the displayed recent searches
}

// Event listener for clear history button
document.getElementById("clear-history-button").addEventListener("click", clearSearchHistory);

// Function to display recent searches
function displayRecentSearches() {
  const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  const recentSearchElement = document.getElementById("recent-searches");

  recentSearchElement.innerHTML = ""; // Clear previous items
  recentSearches.forEach(city => {
      const cityElement = document.createElement("button");
      cityElement.textContent = city;
      cityElement.classList.add("recent-search-item");
      cityElement.addEventListener("click", () => {
          document.getElementById("city-input").value = city; // Update input field
          getWeather(city); // Fetch weather for the selected city
      });
      recentSearchElement.appendChild(cityElement);
  });
}

// Event listener for search button
document.getElementById("search-button").addEventListener("click", () => {
  const city = document.getElementById("city-input").value;
  if (city) {
      getWeather(city);
  }
});

// Display recent searches on page load
document.addEventListener("DOMContentLoaded", displayRecentSearches);
