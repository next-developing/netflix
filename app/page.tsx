import Link from "next/link";
import SearchBar from "./search/searchbarv3";
import Image from "next/image";

export default function Home() {
    return (
        
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 w-full"> 
    <img src="logo.png"></img>
 <SearchBar />
        <div className="text-center mt-8">
            <Link href="/home" className=" inline-block bg-[rgb(108,221,215)] text-2xl text-white px-6 py-3 rounded-sm hover:bg-[rgb(88,201,195)] transition-colors">
                Enter to Soap2day
            </Link>
        </div>
        <div className="mt-8 flex flex-col items-center text-black">
            <h1 className="text-4xl">Soap2Day</h1>
            <div className="max-w-[1200px] ">
                <p className="text-[14px] mt-4">Soap2day is a free online streaming service offering movies, TV shows, and sports events, available to anyone from anywhere in the world. All content is provided as is and in English or with English subtitles. The official domain for Soap2day in 2025 is soap2day.day. We recommend bookmarking it to avoid stumbling upon fake Soaptoday sites.<br />
<br />
At Soap2day.day, you can watch videos in HD quality, which sets us apart from similar services. Available video qualities include HD720p, HD1080p, and HD4k. Viewing is possible on smartphones, tablets, laptops, desktops, and smart TVs.
<br /><br />
Soap2day is a team of movie and TV show enthusiasts who add new content to the service daily with a passion for the art. We curate new interesting selections of the best movies and thematic collections, while constantly improving the site's usability and fixing bugs and errors. This is a significant effort done entirely for free. If you find a bug on Soaper TV or have a movie suggestion or functional enhancement request, you can reach out to the Soap2day administration through the feedback form.
</p>
</div>
            
        </div>
    </div>
    );
}