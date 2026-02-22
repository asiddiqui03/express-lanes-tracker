import * as cheerio from 'cheerio';

export async function fetchExpressLanesStatus() {
    try {
        const response = await fetch('https://expresschi.com/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ExpressChi: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        let direction = 'Unknown';
        let travelTime = 'Unknown';
        let speed = 'Unknown';

        // Parse the dl elements for the stats
        $('dl').each((_, element) => {
            const dtText = $(element).find('dt').text().trim();
            const ddText = $(element).find('dd').text().trim();

            if (dtText === 'Direction') {
                direction = ddText;
            } else if (dtText === 'Travel Time') {
                travelTime = ddText;
            } else if (dtText === 'Speed') {
                speed = ddText;
            }
        });

        // Determine status from direction
        let status: 'inbound' | 'outbound' | 'closed' | 'unknown' = 'unknown';

        const dirLower = direction.toLowerCase();
        if (dirLower.includes('inbound')) {
            status = 'inbound';
        } else if (dirLower.includes('outbound')) {
            status = 'outbound';
        } else if (dirLower.includes('closed') || dirLower.includes('unavailable') || dirLower.includes('none')) {
            status = 'closed';
        }

        return {
            status,
            direction,
            travelTime,
            speed,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error fetching express lanes status:', error);
        return {
            status: 'error' as const,
            direction: 'Unavailable',
            travelTime: 'N/A',
            speed: 'N/A'
        };
    }
}
