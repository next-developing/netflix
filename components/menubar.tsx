'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";

import SearchBar from "@/app/search/searchbar";

interface NavItem {
  label: string;
  id: string;
}

interface IndicatorStyle {
  left: number;
  width: number;
  opacity: number;
  transform: string;
}
export default function SideBar() {
 const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<Partial<IndicatorStyle>>({});
  const navRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const navItems: NavItem[] = [
    { label: 'Home', id: 'home' },
    { label: 'Shows', id: 'shows' },
    { label: 'Movies', id: 'movies' },
    { label: 'My Netflix', id: 'my-netflix' }
  ];


  const updateIndicator = (index: number): void => {
    const item = itemsRef.current[index];
    const nav = navRef.current;
    
    if (item && nav) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      
      setIndicatorStyle({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
        opacity: 1,
        transform: 'translateZ(0)' // Принудительное аппаратное ускорение
      });
    }
  };

  useEffect(() => {
    updateIndicator(activeIndex);
  }, [activeIndex]);

  const handleMouseEnter = (index: number): void => {
    setHoverIndex(index);
    updateIndicator(index);
  };

  const handleMouseLeave = (): void => {
    setHoverIndex(null);
    updateIndicator(activeIndex);
  };

  const handleClick = (index: number): void => {
    setActiveIndex(index);
  };

    return (
        <>
        <div>
        {isOpen && (
          <div className="fixed inset-0 z-30 bg-black bg-opacity-80 backdrop-blur-md flex flex-col p-6 space-y-8">
            <div className="flex justify-end">
              <button onClick={toggleMenu} className="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#ffffff"><path d="M249-207 207-249l246-246-246-246 42-42 246 246 246-246 42 42-246 246 246 246-42 42-246-246-246 246Z"/></svg>
              </button>
            </div>
            <div className="flex flex-col gap-8 items-center justify-center flex-grow">
              <Link href="/movies" onClick={toggleMenu} className="text-white text-2xl font-semibold"> Movies</Link>
              <Link href="/shows"  onClick={toggleMenu} className="text-white text-2xl font-semibold"> TV Shows</Link>
              <Link href="/shows"  onClick={toggleMenu} className="text-white text-2xl font-semibold"> TV Shows</Link>
              <Link href="/my-netflix"  onClick={toggleMenu} className="text-white text-2xl font-semibold"> My Netflix</Link>
             
            </div>

            </div>
        )}
        </div>
        <div className="w-full fixed top-0 z-25 hidden md:block p-7">
<div className="flex flex-row  items-center   w-full justify-center" >
<div className="relative flex flex-row justify-center items-center backdrop-blur-xs rounded-2xl p-2 bg-gray-800/50 border border-gray-700 px-15">

<div className="flex flex-row gap-4 items-center w-full justify-center ">
   <div className="">
    <SearchBar />
   </div>
        
        <nav 
          ref={navRef}
          className="relative flex items-center w-full justify-center  "
          onMouseLeave={handleMouseLeave}
        >
          {/* Анимированный индикатор фона */}
         
          <div
            className="absolute bg-gray-500/50 rounded-3xl h-full transition-all duration-300 ease-out"
            style={{
              left: indicatorStyle.left || 0,
              width: indicatorStyle.width || 0,
              opacity: indicatorStyle.opacity || 0,
              transform: indicatorStyle.transform || 'translateZ(0)'
            }}
          />
          
          {navItems.map((item: NavItem, index: number) => (
            <Link
                href={`/${item.id}`}
              key={item.id}
              ref={(el: HTMLButtonElement | null) => {
                itemsRef.current[index] = el;
              }}
              className={`
                relative z-10 py-2 px-4 rounded-3xl transition-colors cursor-pointer duration-200
                ${activeIndex === index || hoverIndex === index 
                  ? 'text-white' 
                  : 'text-neutral-300 hover:text-white'
                }
              `}
              onMouseEnter={() => handleMouseEnter(index)}
              onClick={() => handleClick(index)}
            >
              <h1 className="font-semibold text-lg whitespace-nowrap">
                {item.label}
              </h1>
            </Link>
            
          ))}
          
        </nav>
      </div>
</div>


</div>
        </div>
        <div className="md:hidden fixed top-0 z-25 py-7 px-6 w-full flex justify-between items-center ">
          <div className="flex bg-gray-700/30 backdrop-blur-md rounded-full border border-gray-600 w-full py-5 relative ">
            <SearchBar />
         <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
          <button onClick={toggleMenu}><svg xmlns="http://www.w3.org/2000/svg" height="27px" viewBox="0 -960 960 960" width="27px" fill="#ffffff"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg></button>
         </div>
         </div>
        </div>
        {/* <div className=" h-screen p-6 flex justify-center pt-30 bg-transparent fixed z-12 ">
            <div className=" flex flex-col gap-6">
            <Link href="/search">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff" ><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
            </Link>
               <Link href="/home"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg></Link>
               <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>
            
           <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M240-120v-80l40-40H160q-33 0-56.5-23.5T80-320v-440q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v440q0 33-23.5 56.5T800-240H680l40 40v80H240Zm-80-200h640v-440H160v440Zm0 0v-440 440Z"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800l240 240H160v320h560l80 80H160Zm711-44-71-71v-285H514L274-800h66l67 133 27 27h106l-80-160h100l80 160h120l-80-160h120q33 0 56.5 23.5T880-720v480q0 10-2 19t-7 17ZM791-55 55-791l57-57 736 736-57 57ZM446-400Zm211-18Z"/></svg>
           <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
           </div>

        </div>
        */}
          </>
    );
}