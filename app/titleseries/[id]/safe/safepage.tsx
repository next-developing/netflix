import { getSeriesById } from "@/lib/actions/movies";
import Link from "next/link";
import Image from "next/image";
import type { Season } from "@/lib/types/datatypes";

export default async function Page({params}: {params: Promise<{ id: number }>}) {
    const id = await params;
    const series = await getSeriesById(id.id);

    
    // Используем seasons вместо number_of_seasons
    const seasons = series.seasons || [];
    
    return (
        <div className="   w-full  ">
            <div className="flex flex-col gap-6">
                <div className="w-full px-10 pt-30 bg-gradient-to-tr from-gray-900 via-black to-gray-700">
                <div className="md:w-full relative overflow-hidden   h-[70vh] rounded-3xl shadow-lg">
                    <div className=" absolute z-10 bottom-1 px-10 text-lg py-4 flex flex-col gap-3.5 ">
                        <h1 className="font-semibold text-white text-3xl">{series.name || series.title}</h1>
                        <div className="flex flex-row gap-4 ">
                           <p className="font-semibold  text-white"><span className="">{series.number_of_seasons}</span> seasons </p>
                           <p className="font-semibold  text-white"><span className="">{series.first_air_date}</span>  </p>
 <p className="font-semibold  text-white"><span className="">{series.vote_average?.toFixed(1)}</span>  </p>
 </div>
                    </div>
                    <Image 
                        width={1920}
                        height={1080}
                        quality={80}
                        src={`https://image.tmdb.org/t/p/w1920/${series.backdrop_path}`} 
                        alt={series.name || series.title} 
                        className="w-full rounded-3xl shadow-lg object-center  object-cover h-full"
                    />
                    
                </div>
                </div>
               
            </div>
            
            {/* Список сезонов */}
            <div className="mt-8">
                {seasons.length > 0 ? (
                    <div className="flex flex-row  gap-4">
                        {seasons.map((season: Season) => (
                            <Link key={season.id} className="bg-white rounded-lg shadow-md p-4"
                                href={`/titleseries/${series.id}/${season.season_number}`}>
                                {season.poster_path && (
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w300/${season.poster_path}`}
                                        alt={season.name}
                                        className="w-full h-40 object-cover rounded mb-3"
                                    />
                                )}
                                <h3 className="font-semibold text-lg mb-2">{season.name}</h3>
                                <p><span className="font-medium">Episodes</span> {season.episode_count}</p>
                                {season.air_date && (
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Дата выхода:</span> {season.air_date}
                                    </p>
                                )}
                                {season.overview && (
                                    <p className="text-gray-700 text-sm line-clamp-3">
                                        {season.overview}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">Информация о сезонах недоступна</p>
                )}
            </div>
        </div>
    );
}