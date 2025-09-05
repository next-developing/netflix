import styles from "./page.module.css"; // проверьте реальные пути и имена
import SearchBar from "../search/searchbarv3";
import Link from "next/link";
export default function Section1() {
    return ( 
       
       <div className="flex flex-col bg-black text-white h-screen  relative "> 
       <div className="absolute z-21  w-full h-full   overflow-hidden">
          <img
            src="/bg.jpg"
            alt="Фоновое изображение"
            className="w-full h-full blur-xs inset-0 object-cover opacity-50 "
          />
        </div>
        <div className="absolute z-22  w-full h-full   overflow-hidden bg-gradient-to-t from-black/99 via-transparent to-black"></div>
       <div className="absolute z-23  w-full h-full  rounded-2xl overflow-hidden">
          <div className={`${styles["grain-layer"]} h-full w-full`}></div>
        </div>

<div className="flex flex-col relative z-23 px-10 pt-50 md:pt-60 md:justify-center md:items-center gap-5  "> 
      <div className="flex flex-col gap-3">
    <h1 className="text-3xl font-bold text-center "
     > 
       Unlimited movies, TV shows, and more.
    </h1>
    <h2 className="text-md text-center "
    >
      Watch anywhere. Cancel anytime.
    </h2>
    
    </div>  
    <SearchBar  />
  <div className="flex justify-center">  
    <Link href="/home" className="backdrop-blur-sm border flex flex-row bg-gray-800/40 border-gray-600 text-white font-semibold py-3 px-4 rounded-sm transition duration-300 text-xl"> 
Enter Home <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#ffffff"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
    </Link></div>
    </div>
        </div>
    );
}