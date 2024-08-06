import { Movies} from "./movies.js";

const HOST = `https://api.themoviedb.org/3`;

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjN2Y2ZjJlZDNjMzE3YTkzMzUwY2VhZDU2ODE1OTk4NiIsInN1YiI6IjY2MjAxOTdiMjBhZjc3MDEzMTNkMjczZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6vKnOGk_bqVlutSaNknvP3jG2FsGr8zfYTrICX5cZrk'
    }
};

export async function Similar(movieId) {
    try {
        const response = await fetch(`${HOST}/movie/${movieId}/similar`, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }else{
            const data = await response.json();
            Movies(data.results, 5)
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}