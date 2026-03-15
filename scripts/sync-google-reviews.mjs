import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const REVIEW_LINKS = [
    'https://maps.app.goo.gl/q39dqdFJxaE5cDFW7',
    'https://maps.app.goo.gl/3noUJzenP2k7Soh96',
    'https://maps.app.goo.gl/De33T4hHs7C7bVfU9',
    'https://maps.app.goo.gl/1AYdumsGjMGFwiC67',
    'https://maps.app.goo.gl/VcxQY7HdGurdQDH78'
];

const STAR_MARKER = '';
const STOP_LINE_PREFIXES = [
    'Like',
    'Share',
    'Response from the owner',
    'Title:',
    'URL Source:',
    'Collapse side panel'
];

function normalizeSpaces(value) {
    return value.replace(/\s+/g, ' ').trim();
}

function buildMirrorUrl(url) {
    const strippedUrl = String(url).replace(/^https?:\/\//i, '');
    return `https://r.jina.ai/http://${strippedUrl}`;
}

function parseReview(markdown, url) {
    const cleanedMarkdown = String(markdown || '');
    const lines = cleanedMarkdown
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    const ratingLineIndex = lines.findIndex((line) => line.includes(STAR_MARKER));
    if (ratingLineIndex === -1) {
        throw new Error('Could not find 5-star marker in response');
    }

    const authorFromPhoto = cleanedMarkdown.match(/Photo of ([^\]]+)\]/)?.[1];
    let author = normalizeSpaces(authorFromPhoto || '');

    if (!author) {
        for (let index = ratingLineIndex - 1; index >= 0; index -= 1) {
            const candidate = lines[index];
            if (!candidate || candidate === '' || candidate.startsWith('![Image')) {
                continue;
            }
            if (candidate.includes('Place details') || candidate === 'baddii' || candidate === 'Homeopath') {
                continue;
            }
            author = normalizeSpaces(candidate);
            break;
        }
    }

    const when = normalizeSpaces(lines[ratingLineIndex].replace(STAR_MARKER, ''));

    const reviewTextLines = [];
    let started = false;

    for (let index = ratingLineIndex + 1; index < lines.length; index += 1) {
        const line = lines[index];

        if (!line || line === '' || line.startsWith('![Image')) {
            continue;
        }

        const shouldStop = STOP_LINE_PREFIXES.some((prefix) => line.startsWith(prefix));
        if (shouldStop) {
            if (started) {
                break;
            }
            continue;
        }

        if (/^https?:\/\//i.test(line)) {
            continue;
        }

        started = true;
        reviewTextLines.push(line);
    }

    const text = normalizeSpaces(reviewTextLines.join(' ')).replace(/\s+([,.;!?])/g, '$1');

    if (!text) {
        throw new Error('Could not extract review text from response');
    }

    return {
        author: author || 'Patient Feedback',
        when: when || 'Google Review',
        rating: 5,
        text,
        url
    };
}

async function fetchReviewFromLink(url) {
    const mirrorUrl = buildMirrorUrl(url);
    const response = await fetch(mirrorUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const markdown = await response.text();
    return parseReview(markdown, url);
}

async function main() {
    const uniqueLinks = [...new Set(REVIEW_LINKS)];
    const reviews = [];

    for (const url of uniqueLinks) {
        try {
            const review = await fetchReviewFromLink(url);
            reviews.push(review);
            console.log(`✓ Synced: ${review.author} (${review.when})`);
        } catch (error) {
            console.error(`✗ Failed: ${url}`);
            console.error(`  ${error.message}`);
        }
    }

    if (reviews.length === 0) {
        throw new Error('No reviews were extracted.');
    }

    const targetPath = resolve(process.cwd(), 'js/google-reviews-data.js');
    const output = `window.OMHOMEO_GOOGLE_REVIEWS = ${JSON.stringify(reviews, null, 4)};\n`;

    await writeFile(targetPath, output, 'utf8');
    console.log(`\nDone. Wrote ${reviews.length} reviews to js/google-reviews-data.js`);
}

main().catch((error) => {
    console.error(`\nSync failed: ${error.message}`);
    process.exit(1);
});
