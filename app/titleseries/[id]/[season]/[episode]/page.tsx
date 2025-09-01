import { getEpisodes } from "@/lib/actions/movies";

export default async function Page({params}: {params: Promise<{ id: number, season: number, episode: number }>}) {
    const id = await params;
    const episode = await getEpisodes(id.id, id.season, id.episode);

    return ( 
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{episode.name}</h1>
            <p className="text-gray-700 mb-4">{episode.overview}</p>
            <p className="text-gray-700 mb-4">{episode.id}</p>
            <p className="text-gray-700 mb-4">{episode.air_date}</p>
            <p className="text-gray-700 mb-4">{episode.episode_number}</p>
            <p className="text-gray-700 mb-4">{episode.poster_path}</p>
            <p className="text-gray-700 mb-4">{episode.season_number}</p>
            <p className="text-gray-700 mb-4">{episode.still_path}</p>
            <p className="text-gray-700 mb-4">{episode.vote_average}</p>
            <p className="text-gray-700 mb-4">{episode.vote_count}</p>
            <iframe src={`https://vidsrc.xyz/embed/tv?tmdb=${id.id}&season=${id.season}&episode=${id.episode}`} allowFullScreen></iframe>
        </div>
    )
}