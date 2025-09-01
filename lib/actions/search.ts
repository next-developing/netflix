'use server';

const apiKey = process.env.API_KEY;
const apiToken = process.env.API_TOKEN;

export async function getSearchResults(query: string, page: number) {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=${query}&page=${page}&include_adult=false`,
            {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            }
        );
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}