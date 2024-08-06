import { InitHeader } from "../components/header.js";
import { Similar } from "../components/similar.js";


// url
const HOST = `https://api.themoviedb.org/3`;
const IMG_URL = 'https://image.tmdb.org/t/p/w500'

const form1 = document.getElementById('form1');
const form2 = document.getElementById('form2');

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjN2Y2ZjJlZDNjMzE3YTkzMzUwY2VhZDU2ODE1OTk4NiIsInN1YiI6IjY2MjAxOTdiMjBhZjc3MDEzMTNkMjczZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6vKnOGk_bqVlutSaNknvP3jG2FsGr8zfYTrICX5cZrk'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    InitHeader();

    form1.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchterm = document.getElementById('search').value.trim();
        document.getElementById('search').value = '';

        if (searchterm) {
            window.location.href = `../index.html?query=${searchterm}`;
        } else {
            getMovies(API_URL);
        }
    });

    form2.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchterm = document.getElementById('srch2').value.trim();
        document.getElementById('srch2').value = '';

        if (searchterm) {
            window.location.href = `../index.html?query=${searchterm}`;
        } else {
            getMovies(API_URL);
        }
    });
});


// movie details
async function getMovieDetails(movieId) {
    try {
        showLoader()
        const response = await fetch(`${HOST}/movie/${movieId}`, options);
        hideLoader()
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
}

// movie info
async function getActors(movieId) {
    const actorUrl = `${HOST}/movie/${movieId}/credits`;

    try {
        showLoader()
        const response = await fetch(actorUrl, options);
        hideLoader()
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const text = await response.text();
        if (text.trim() === '') {
            throw new Error('Received an empty response from the server.');
        }
        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            throw new Error('Failed to parse JSON response: ' + parseError.message);
        }

        if (!data.hasOwnProperty('cast') || data.cast.length === 0) {
            throw new Error('No actors found in the response data.');
        }
        return data.cast;
    } catch (err) {
        console.error('Error fetching actors:', err);
        throw err;
    }
}

// video 
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(location.search);
    const movieId = urlParams.get("movieId");
    
    const videoContainer = document.querySelector('.video-container');
    showLoader()  
    fetch(`${HOST}/movie/${movieId}/videos`, options)
        .then(res => res.json())
        .then(data => {
            if (data.results.length !== 0) {
                const key = data.results[0].key;
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${key}`;
                iframe.allowFullscreen = true
                videoContainer.appendChild(iframe);
                hideLoader()
            } else {
                videoContainer.innerHTML = `<h2>This movie doesn't have trailers!</h2>`
                hideLoader()
            }
        })
        .catch(err => {
            console.error('Fetch error:', err);
            hideLoader()
        });

    try {
        const movieRelease = await getMovieDetails(movieId)
        const dataRelease = movieRelease.release_date.split('-').reverse().join(".")
        displayRelease(dataRelease)
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }

    try {
        const movieDetails = await getMovieDetails(movieId);
        displayOverview(movieDetails.overview);
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }

    try {
        const movieRating = await getMovieDetails(movieId);
        displayRating(movieRating.vote_average)
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }

    Similar(movieId);

    try {
        const actorsData = await getActors(movieId);
        displayCast(actorsData);
    } catch (error) {
        console.error('Error fetching actors:', error);
    }
});

function displayCast(cast, index = 0) {
    showLoader()
    const castContainer = document.querySelector('.cast');
    castContainer.innerHTML = '';

    const startIndex = index * 5;
    const endIndex = startIndex + 5;
    const actorsToDisplay = cast.slice(startIndex, endIndex);

    actorsToDisplay.forEach(actor => {
        const { name, profile_path } = actor;
        const actorElement = document.createElement('div');
        actorElement.classList.add('actor');
        actorElement.innerHTML = `
        <img src="${IMG_URL}${profile_path}" alt="${name}">
        <h3>${name}</h3>
        `;
        castContainer.appendChild(actorElement);
        hideLoader()
    });

    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    leftArrow.disabled = (index === 0);
    rightArrow.disabled = (endIndex >= cast.length);

    leftArrow.addEventListener('click', () => displayCast(cast, index - 1));
    rightArrow.addEventListener('click', () => displayCast(cast, index + 1));
}
function displayRelease(release_date) {
    const releaseData = document.querySelector('.release-date')
    releaseData.textContent = release_date
}
function displayOverview(overview) {
    const overviewContainer = document.querySelector('.description');
    overviewContainer.textContent = overview;
}
function displayRating(vote_average) {
    const ratingContent = document.querySelector('.rating')
    ratingContent.textContent = vote_average.toFixed(1)
}


function showLoader() {
    const loader = document.querySelector('.loader-container').style.display = 'flex'
}
function hideLoader() {
    const loader = document.querySelector('.loader-container').style.display = 'none';
}