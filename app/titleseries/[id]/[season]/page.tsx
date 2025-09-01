import { getSeasons } from "@/lib/actions/movies";
import Link from "next/link";

export default async function Page({params}: {params: Promise<{ id: number, season: number }>}) {
    const id = await params;
    const season = await getSeasons(id.id, id.season);
    console.log(season);
    const episodes = season.episodes || [];
    return ( 
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{season.name}</h1>
            <p className="text-gray-700 mb-4">{season.overview}</p>
            <p className="text-gray-700 mb-4">{season.id}</p>
            <p className="text-gray-700 mb-4">{season.air_date}</p>
            <p className="text-gray-700 mb-4">{season.episode_count}</p>
            <p className="text-gray-700 mb-4">{season.poster_path}</p>
            <p className="text-gray-700 mb-4">{season.season_number}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
                {episodes.map((episode) => (
                <Link key={episode.id} href={`/titleseries/${id.id}/${id.season}/${episode.episode_number}`}>
                    <h2 className="text-lg font-semibold">Episode {episode.episode_number}</h2>
                    
                </Link>
            ))}
            </div>
        </div>
    )
}