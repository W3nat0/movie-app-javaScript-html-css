// import
import { getData } from "./api/script.js";
import { InitHeader } from "./components/header.js";

// url
const HOST = 'https://api.themoviedb.org/3';
const API_URL = `${HOST}/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc`
const searchURL = `${HOST}/search/movie?`

// DOM
export const notFound = document.getElementById('not-found')
export const cards = document.getElementById('cards');
export const pagination = document.getElementById('pagination')

const prevPageBtn = document.getElementById('prev');
const nextPageBtn = document.getElementById('next');
const currentPage = document.getElementById('current');

const form1 = document.querySelector('#form1')
const form2 = document.querySelector('#form2')


document.addEventListener('DOMContentLoaded', () => {
    InitHeader();
    form1.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchterm = document.getElementById('search').value.trim();
        document.getElementById('search').value = '';

        if (searchterm) {
            window.location.href = `../index.html?query=${searchterm}`;
        } else {
            getData(API_URL);
        }
    });

    form2.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchterm = document.getElementById('srch2').value.trim();
        document.getElementById('srch2').value = '';

        if (searchterm) {
            window.location.href = `../index.html?query=${searchterm}`;
        } else {
            getData(API_URL);
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const searchterm = urlParams.get('query');

    if (searchterm) {
        showLoader()
        getData(`${searchURL}&query=${searchterm}`);
        hideLoader()
    } else {
        getData(API_URL);
    }
});

function getUrlParams() {
    const urlParams = new URLSearchParams(location.search);
    return {
        movieId: urlParams.get("movieId"),
        genres: urlParams.get("genres")
    };
}
function fetchMoviesByGenre() {
    const { genres } = getUrlParams();
    if (genres) {
        const genreIds = genres.split(',');
        const genreQuery = genreIds.join(',');
        const genreURL = `${API_URL}&with_genres=${genreQuery}`;
        getData(genreURL);
    }
}
fetchMoviesByGenre()

// pagination
var page = 1;

prevPageBtn.addEventListener('click', () => {
    if (page > 1) {
        page--;
        currentPage.textContent = page;
        showLoader()
        getData(`${API_URL}&page=${page}`);
        hideLoader()
    }
})

nextPageBtn.addEventListener('click', () => {
    showLoader()
    page++;
    currentPage.textContent = page;
    getData(`${API_URL}&page=${page}`);
    hideLoader()
});



function showLoader() {
    const loader = document.querySelector('.loader-container').style.display = 'flex'
}
function hideLoader() {
    const loader = document.querySelector('.loader-container').style.display = 'none';
}

