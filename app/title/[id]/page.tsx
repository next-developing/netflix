import { getMovieById } from "@/lib/actions/movies";

export default async function Page({params}: {params: Promise<{ id: number }>}) {
    const id = await params; 
    const movie = await getMovieById(id.id);
    return (
        <div className="w-full h-screen bg-black">
            
            <iframe src={`https://vidsrc.xyz/embed/movie?tmdb=${movie.id}`} allowFullScreen className="w-full h-screen"></iframe>
        </div>
    );
}