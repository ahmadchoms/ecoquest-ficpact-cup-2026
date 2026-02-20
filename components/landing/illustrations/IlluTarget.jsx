import UnsplashImage from "./UnsplashImage";

export default function IlluTarget({ className = "" }) {
    return (
        <div className={`relative group ${className}`}>
            <div className="border-3 border-black rounded-full overflow-hidden shadow-hard -rotate-[4deg] group-hover:rotate-0 transition-transform duration-700 aspect-square p-2">
                <div className="border-3 border-black rounded-full overflow-hidden w-full h-full">
                    <UnsplashImage
                        src="https://images.unsplash.com/photo-1516321497487-e288fb19713f"
                        alt="Target and Goals"
                        className="grayscale hover:grayscale-0 transition-all duration-300"
                        fallbackColor="#ffcc80"
                    />
                </div>
            </div>
        </div>
    );
}
