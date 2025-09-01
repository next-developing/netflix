export default function Footer() {
    return (
        <footer className="w-full bg-black text-white py-6 ">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} MyMovieApp. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <a href="/about" className="text-sm hover:underline">About</a>
                    <a href="/contact" className="text-sm hover:underline">Contact</a>
                    <a href="/privacy" className="text-sm hover:underline">Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
}