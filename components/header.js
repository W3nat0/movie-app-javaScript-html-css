import { Movies } from "./movies.js";

const HOST = `https://api.themoviedb.org/3`;
const API_URL = `${HOST}/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc`;
const popularAPI_URL = `${HOST}/movie/popular`;
const SEARCH_URL = `${HOST}/search/movie`;

const tagsEl = document.getElementById('tags');

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjN2Y2ZjJlZDNjMzE3YTkzMzUwY2VhZDU2ODE1OTk4NiIsInN1YiI6IjY2MjAxOTdiMjBhZjc3MDEzMTNkMjczZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6vKnOGk_bqVlutSaNknvP3jG2FsGr8zfYTrICX5cZrk'
    }
};

export function InitHeader() {
    const searchbtn = document.querySelector('.search-btn');
    const closebtn = document.querySelector('.close-btn');
    const menu = document.querySelector('.menu');
    const searchbox = document.querySelector('.searchbox');
    const header = document.querySelector('header');
    const movieInput = document.querySelector("#search");
    const hintDiv = document.querySelector(".hint-div");
    const ulDiv = document.querySelector(".hint-div ul");

    searchbtn.onclick = function () {
        searchbox.classList.add('active');
        header.classList.remove('open');
    };

    closebtn.onclick = function () {
        searchbox.classList.remove('active');
    };

    menu.onclick = function () {
        header.classList.toggle('open');
        searchbox.classList.remove('active');
    };

    document.querySelector('.popular').addEventListener('click', () => {
        location.href = '../index.html';
        getMovies(popularAPI_URL);
    });

    document.querySelector('.home').addEventListener('click', () => {
        location.href = '../index.html';
        getMovies(API_URL);
    });

    setGenre();
    getMovies(API_URL);

    movieInput.addEventListener("input", () => {
        const movieName = movieInput.value.trim();
        if (movieName === "") {
            hintDiv.style.display = "none";
        } else {
            hintDiv.style.display = "flex";
            hintMovies(movieName, hintDiv, ulDiv);
        }
    });
}
const genres = [
    { "id": 28, "name": "Action" },
    { "id": 12, "name": "Adventure" },
    { "id": 16, "name": "Animation" },
    { "id": 35, "name": "Comedy" },
    { "id": 18, "name": "Drama" },
    { "id": 10751, "name": "Family" },
    { "id": 14, "name": "Fantasy" },
    { "id": 36, "name": "History" },
    { "id": 27, "name": "Horror" },
    { "id": 9648, "name": "Mystery" },
    { "id": 10749, "name": "Romance" },
    { "id": 878, "name": "Science Fiction" },
    { "id": 53, "name": "Thriller" },
    { "id": 10752, "name": "War" }
];

var selectedgenre = [];
setGenre();

function setGenre() {
    tagsEl.innerHTML = '';
    genres.forEach(genre => {
        const t = document.createElement('a');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            const index = selectedgenre.indexOf(genre.id);
            if (index === -1) {
                selectedgenre.push(genre.id);
            } else {
                selectedgenre.splice(index, 1);
            }
            const genreQuery = selectedgenre.join(',');
            location.href = `../index.html?genres=${genreQuery}`;
        });
        tagsEl.append(t);
    });
}

async function getMovies(url) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch movies from ${url}`);
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            Movies(data.results, 5);
        } else {
            console.log('No results found');
        }
    } catch (error) {
        console.error(`Error fetching movies: ${error.message}`);
    }
}
async function hintMovies(inputText, parentDiv, ulDiv) {
    try {
        const response = await fetch(`${SEARCH_URL}?query=${inputText}`, options);
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        const moviesArr = data.results;

        if (moviesArr.length !== 0) {
            ulDiv.textContent = "";
            for (let i = 0; i < Math.min(5, moviesArr.length); i++) {
                const movie = moviesArr[i];
                const liTagMovie = document.createElement("li");
                liTagMovie.textContent = movie.title;

                liTagMovie.addEventListener("click", () => {
                    location.href = `/watch-video/index.html?movieId=${movie.id}`;
                });

                ulDiv.appendChild(liTagMovie);
            }
        } else {
            parentDiv.style.display = "none";
        }
    } catch (error) {
        console.error(`Error fetching movies: ${error.message}`);
    }
}



