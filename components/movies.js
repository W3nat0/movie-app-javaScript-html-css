const IMG_URL = 'https://image.tmdb.org/t/p/w500'


export async function Movies(data, limit = data.length) {
    const cards = document.getElementById('cards');
    cards.innerHTML = '';

    data.slice(0, limit).forEach(movie => {
        const { title, poster_path, vote_average, id } = movie;
        // creat elements
        const movieEl = document.createElement('div');
        const img = document.createElement('img');
        const cardContent = document.createElement('div');
        const cardInfo = document.createElement('div');
        const voteDiv = document.createElement('div');
        const moreLink = document.createElement('a');

        // add class
        movieEl.classList.add('card');
        img.classList.add('card_image');
        cardContent.classList.add('card_content');
        cardInfo.classList.add('card_info');
        moreLink.classList.add('card_link');

        // content
        img.src = `${IMG_URL}${poster_path}`;
        img.alt = title;
        cardContent.innerHTML = `<h4>${title}</h4>`;
        voteDiv.style.background = 'none';
        moreLink.textContent = 'More';
        voteDiv.innerHTML = `
            <svg width="18" height="15" viewBox="0 0 18 17" fill="#E60000" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.38086 0L12.4967 4.7114L17.9404 6.21885L14.4224 10.6381L14.6709 16.2812L9.38086 14.301L4.09079 16.2812L4.33931 10.6381L0.821351 6.21885L6.26501 4.7114L9.38086 0Z"/>
            </svg>
            <span>${vote_average.toFixed(1)}/10</span>`;

        // append
        cardInfo.appendChild(voteDiv);
        cardInfo.appendChild(moreLink);

        movieEl.appendChild(img);
        movieEl.appendChild(cardContent);
        movieEl.appendChild(cardInfo);

        moreLink.addEventListener('click', () => {
            const movieId = movie.id;
            location.href = `/watch-video/index.html?movieId=${movieId}`;
        });

        cards.appendChild(movieEl);
    });
}