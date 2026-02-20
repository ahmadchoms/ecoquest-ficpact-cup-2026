import UnsplashImage from "./UnsplashImage";

export default function IlluMap({ className = "" }) {
    return (
        <div className={`relative group ${className}`}>
            <div className="border-3 border-black rounded-[32px] overflow-hidden shadow-hard bg-[#b5f0c0] rotate-[-1deg] group-hover:rotate-0 transition-all duration-700 aspect-video w-full">
                <UnsplashImage
                    src="https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272"
                    alt="Pelajar berdampak di alam Indonesia"
                    className="opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    fallbackColor="#b5f0c0"
                />
                <div className="absolute inset-0 bg-green/20 mix-blend-color pointer-events-none"></div>
            </div>

            {/* Pins */}
            <div className="absolute top-6 left-10 bg-yellow border-2 border-black w-4 h-4 rounded-full shadow-[2px_2px_0_#0f0f0f] animate-bounce"></div>
            <div className="absolute bottom-10 right-16 bg-red-400 border-2 border-black w-4 h-4 rounded-full shadow-[2px_2px_0_#0f0f0f]"></div>
            <div className="absolute top-1/2 left-1/2 bg-purple border-2 border-black w-5 h-5 rounded-full shadow-[2px_2px_0_#0f0f0f] -translate-x-1/2 -translate-y-1/2"></div>

            {/* Stars */}
            <div className="absolute top-4 right-6 text-2xl font-black text-black opacity-80 rotate-12">★</div>
            <div className="absolute bottom-4 left-6 text-xl font-black text-black opacity-80 -rotate-12">★</div>
        </div>
    );
}
