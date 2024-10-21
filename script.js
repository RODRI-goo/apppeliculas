const apiUrl = 'https://api.themoviedb.org/3';  
const movieList = document.getElementById('movies');  
const movieDetails = document.getElementById('movie-details');  
const detailsContainer = document.getElementById('details');  
const searchButton = document.getElementById('search-button');  
const searchInput = document.getElementById('search-input');  
const favoritesList = document.getElementById('favorites-list');  
const addToFavoritesButton = document.getElementById('add-to-favorites');  
let selectedMovieId = null;  
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];  

// Fetch and display popular movies  
async function fetchPopularMovies() {  
    try {  
        const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}`);  
        const data = await response.json();  
        displayMovies(data.results);  
    } catch (error) {  
        console.error('Error fetching popular movies:', error);  
    }  
}  

// Display movies  
function displayMovies(movies) {  
    movieList.innerHTML = ''; // Limpia la lista de películas  
    movies.forEach(movie => {  
        const li = document.createElement('li');  
        li.innerHTML = `  
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">  
            <span>${movie.title}</span>  
        `;  
        li.addEventListener('click', () => showMovieDetails(movie.id)); // Muestra detalles al hacer clic en la película  
        movieList.appendChild(li);  
    });  
}  

// Show movie details  
async function showMovieDetails(movieId) {  
    try {  
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}`);  
        const movie = await response.json();  
        detailsContainer.innerHTML = `  
            <h3>${movie.title}</h3>  
            <p>${movie.overview}</p>  
            <p>Release Date: ${movie.release_date}</p>  
            <p>Rating: ${movie.vote_average}/10</p>  
        `;  
        selectedMovieId = movie.id;  
        movieDetails.classList.remove('hidden'); // Mostrar la sección de detalles  
    } catch (error) {  
        console.error('Error fetching movie details:', error);  
    }  
}  

// Search movies  
searchButton.addEventListener('click', async () => {  
    const query = searchInput.value;  
    if (query) {  
        try {  
            const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${query}`);  
            const data = await response.json();  
            displayMovies(data.results);  
        } catch (error) {  
            console.error('Error searching movies:', error);  
        }  
    }  
});  

// Add or remove movie from favorites  
addToFavoritesButton.addEventListener('click', () => {  
    if (selectedMovieId) {  
        const favoriteMovie = {  
            id: selectedMovieId,  
            title: document.querySelector('#details h3').textContent  
        };  

        const movieIndex = favoriteMovies.findIndex(movie => movie.id === selectedMovieId);  
        if (movieIndex === -1) { // Si no está en favoritos, lo agrega  
            favoriteMovies.push(favoriteMovie);  
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies));  
        } else { // Si ya está en favoritos, lo elimina  
            favoriteMovies.splice(movieIndex, 1);  
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies));  
        }  
        displayFavorites(); // Muestra la lista actualizada de favoritos  
    }  
});  

// Display favorite movies  
function displayFavorites() {  
    favoritesList.innerHTML = ''; // Limpia la lista de favoritos  
    favoriteMovies.forEach(movie => {  
        const li = document.createElement('li');  
        li.textContent = movie.title;  

        const removeButton = document.createElement('button');  
        removeButton.textContent = 'Eliminar';  
        removeButton.addEventListener('click', () => {  
            favoriteMovies = favoriteMovies.filter(fav => fav.id !== movie.id);  
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies));  
            displayFavorites(); // Actualiza la lista de favoritos  
        });  

        li.appendChild(removeButton);  
        favoritesList.appendChild(li);  
    });  
}  

// Initial fetch of popular movies and display favorites  
fetchPopularMovies(); // Obtiene y muestra las películas populares  
displayFavorites(); // Muestra las películas favoritas guardadas
