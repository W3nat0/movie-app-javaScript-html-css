import { Movies } from "../components/movies.js";
import { notFound } from "../script.js";
import { cards } from "../script.js";
import { pagination } from "../script.js";

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjN2Y2ZjJlZDNjMzE3YTkzMzUwY2VhZDU2ODE1OTk4NiIsInN1YiI6IjY2MjAxOTdiMjBhZjc3MDEzMTNkMjczZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6vKnOGk_bqVlutSaNknvP3jG2FsGr8zfYTrICX5cZrk'
    }
};
export async function getData(url) {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            cards.style.display = 'none';
            pagination.style.display = 'none';
            notFound.style.display = 'flex';
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            notFound.style.display = 'none';
            cards.style.display = 'grid';
            pagination.style.display = 'flex';
            Movies(data.results); 
        } else {
            cards.style.display = 'none';
            pagination.style.display = 'none';
            notFound.style.display = 'flex'; 
        }
    } catch (err) {
        cards.style.display = 'none';
        pagination.style.display = 'none';
        notFound.style.display = 'flex'; 
        console.error('Fetch error:', err);
    }
}

