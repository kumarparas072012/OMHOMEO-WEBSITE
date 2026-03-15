const brandPresence = {
    googleReviewsUrl: 'https://share.google/gBRJJ5kkqNPpsp1VO',
    googleWriteReviewUrl: 'https://www.google.com/maps/search/?api=1&query=Om+Homeo+Centre+Homeopathic+Doctor+Baddi',
    youtubeChannelUrl: 'https://www.youtube.com/@omhomeocentrehomeopathican2281/videos'
};

const youtubeBannerItems = [
    {
        label: 'YouTube Video',
        title: 'Hair fall Causes and Treatment (बालों का झड़ना कारण और उपचार)Dr Amarpali (BHMS, Dietitian)',
        text: 'Om Homeo Centre® Dr  Amarpali ( Homeopath)',
        thumbnailUrl: 'https://i.ytimg.com/vi/PAyu-OCOHLY/hqdefault.jpg',
        linkText: 'Watch Video',
        linkUrl: 'https://www.youtube.com/watch?v=PAyu-OCOHLY'
    },
    {
        label: 'YouTube Video',
        title: 'Which oil is the healthiest ?.......Om Homeo Centre ( Baddi Since 2015) Dr Amarpali',
        text: 'Om Homeo Centre® Dr  Amarpali ( Homeopath)',
        thumbnailUrl: 'https://i.ytimg.com/vi/T56O3NRUK1M/hqdefault.jpg',
        linkText: 'Watch Video',
        linkUrl: 'https://www.youtube.com/watch?v=T56O3NRUK1M'
    },
    {
        label: 'YouTube Video',
        title: 'Why is vitamin B12 important ? विटामिन B12 क्यों जरूरी है?Om homeo Centre Baddi since 2015',
        text: 'Om Homeo Centre® Dr  Amarpali ( Homeopath)',
        thumbnailUrl: 'https://i.ytimg.com/vi/ClK17r3upxY/hqdefault.jpg',
        linkText: 'Watch Video',
        linkUrl: 'https://www.youtube.com/watch?v=ClK17r3upxY'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const toSafeHttpsUrl = (value) => {
        try {
            const url = new URL(value, window.location.origin);
            return url.protocol === 'https:' ? url.toString() : '#';
        } catch (error) {
            return '#';
        }
    };

    const links = {
        reviews: toSafeHttpsUrl(brandPresence.googleReviewsUrl),
        writeReview: toSafeHttpsUrl(brandPresence.googleWriteReviewUrl),
        youtube: toSafeHttpsUrl(brandPresence.youtubeChannelUrl)
    };

    const buildFiveStarReviewItems = () => {
        const manualGoogleReviews = Array.isArray(window.OMHOMEO_GOOGLE_REVIEWS)
            ? window.OMHOMEO_GOOGLE_REVIEWS
            : [];

        const fiveStarItems = manualGoogleReviews
            .filter((review) => Number(review && review.rating) === 5)
            .map((review) => {
                const reviewText = typeof review.text === 'string' ? review.text.trim() : '';
                if (!reviewText) {
                    return null;
                }

                const author = typeof review.author === 'string' && review.author.trim()
                    ? review.author.trim()
                    : 'Patient Feedback';
                const when = typeof review.when === 'string' && review.when.trim()
                    ? review.when.trim()
                    : 'Google Review';

                return {
                    label: '5-Star Review',
                    title: `${author} • ${when}`,
                    text: reviewText,
                    rating: '5.0',
                    linkText: 'Read on Google',
                    linkUrl: toSafeHttpsUrl(review.url || links.reviews)
                };
            })
            .filter(Boolean);

        if (fiveStarItems.length > 0) {
            return fiveStarItems;
        }

        return [
            {
                label: '5-Star Reviews',
                title: 'No 5-star reviews added yet',
                text: 'Run node scripts/sync-google-reviews.mjs to fetch the latest 5-star reviews into this section.',
                rating: '5.0',
                linkText: 'Open Google Reviews',
                linkUrl: links.reviews
            }
        ];
    };

    const reviewBannerItems = buildFiveStarReviewItems();

    const externalLinkMap = [
        { selector: '.google-reviews-link', url: links.reviews },
        { selector: '.google-review-write-link', url: links.writeReview },
        { selector: '.youtube-channel-link', url: links.youtube }
    ];

    externalLinkMap.forEach(({ selector, url }) => {
        document.querySelectorAll(selector).forEach((link) => {
            link.setAttribute('href', url);
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    });

    const renderMarquee = (trackId, items) => {
        const track = document.getElementById(trackId);
        if (!track || !Array.isArray(items) || items.length === 0) {
            return;
        }

        const duplicatedItems = [...items, ...items];
        track.innerHTML = '';

        duplicatedItems.forEach((item) => {
            try {
                const card = document.createElement('article');
                card.className = 'marquee-card';

                const label = document.createElement('span');
                label.className = 'marquee-label';
                label.textContent = item.label || '';

                const title = document.createElement('h4');
                title.textContent = item.title || '';

                if (item.thumbnailUrl) {
                    const thumbnailWrap = document.createElement('a');
                    thumbnailWrap.className = 'marquee-thumb-wrap';

                    const videoHref = toSafeHttpsUrl(item.linkUrl || links[item.linkType] || '#');
                    thumbnailWrap.href = videoHref;
                    thumbnailWrap.target = '_blank';
                    thumbnailWrap.rel = 'noopener noreferrer';

                    const thumbnail = document.createElement('img');
                    thumbnail.className = 'marquee-thumb';
                    thumbnail.src = toSafeHttpsUrl(item.thumbnailUrl);
                    thumbnail.alt = item.title || 'YouTube video thumbnail';
                    thumbnail.loading = 'lazy';

                    thumbnailWrap.appendChild(thumbnail);
                    card.appendChild(thumbnailWrap);
                }

                if (item.rating) {
                    const rating = document.createElement('p');
                    rating.className = 'marquee-rating';

                    const stars = document.createElement('span');
                    stars.className = 'marquee-stars';
                    stars.textContent = '★★★★★';

                    const score = document.createElement('span');
                    score.className = 'marquee-score';
                    score.textContent = item.rating;

                    rating.appendChild(stars);
                    rating.appendChild(score);
                    card.appendChild(rating);
                }

                const text = document.createElement('p');
                text.textContent = item.text || '';

                const link = document.createElement('a');
                link.textContent = item.linkText || 'Open';
                link.href = toSafeHttpsUrl(item.linkUrl || links[item.linkType] || '#');
                link.target = '_blank';
                link.rel = 'noopener noreferrer';

                card.appendChild(label);
                card.appendChild(title);
                card.appendChild(text);
                card.appendChild(link);
                track.appendChild(card);
            } catch (error) {
                console.error('Failed to render banner card:', error);
            }
        });
    };

    renderMarquee('reviews-marquee-track', reviewBannerItems);
    renderMarquee('youtube-marquee-track', youtubeBannerItems);
});
