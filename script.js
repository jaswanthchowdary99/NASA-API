const apiKey = 'tCbSbU14xAKAyB6ICzxY9wCndGfLhbFY1dgacSo8';
const currentDate = new Date().toISOString().split("T")[0];
const currentImageContainer = document.getElementById('current-image');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchHistoryList = document.getElementById('search-history');
const pictureTitle = document.getElementById('picture-title');
const pictureDate = document.getElementById('picture-date');

function getCurrentImageOfTheDay() {
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${currentDate}`)
    .then(response => response.json())
    .then(data => {
      displayImage(data, currentDate);
    })
    .catch(error => console.error('Error fetching current image:', error));
}

function displayImage(data, date = currentDate) {
  // Hide the picture title when a search is made
  if (date !== currentDate) {
    pictureTitle.style.display = 'none';
    pictureDate.textContent = `Picture on ${date}`;
  } else {
    pictureTitle.style.display = 'block';
    pictureDate.textContent = `Picture on ${date}`;
  }

  // Display the image and its details
  currentImageContainer.innerHTML = `
    <img src="${data.url}" alt="${data.title}">
    <h3>${data.title}</h3>
    <p>${data.explanation}</p>
  `;
}

function getImageOfTheDay(date) {
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`)
    .then(response => response.json())
    .then(data => {
      displayImage(data, date); // Pass the searched date to displayImage
      saveSearch(date);
      addSearchToHistory(date);
    })
    .catch(error => console.error('Error fetching image:', error));
}

function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem('searches')) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem('searches', JSON.stringify(searches));
  }
}

function addSearchToHistory(date) {
  const li = document.createElement('li');
  li.textContent = date;
  li.addEventListener('click', () => {
    getImageOfTheDay(date);
  });
  searchHistoryList.appendChild(li);
}

function loadSearchHistory() {
  const searches = JSON.parse(localStorage.getItem('searches')) || [];
  searches.forEach(date => {
    addSearchToHistory(date);
  });
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const date = searchInput.value;
  getImageOfTheDay(date);
  searchInput.value = '';
});

document.addEventListener('DOMContentLoaded', () => {
  getCurrentImageOfTheDay();
  loadSearchHistory();
});
