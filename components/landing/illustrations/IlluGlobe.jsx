import UnsplashImage from "./UnsplashImage";

export default function IlluGlobe({ className = "" }) {
    return (
        <div className={`relative group ${className}`}>
            <div className="border-3 border-black rounded-[24px] overflow-hidden shadow-hard bg-[#b5f0c0] rotate-[3deg] group-hover:rotate-0 transition-transform duration-300 aspect-square">
                <UnsplashImage
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa"
                    alt="Globe and Nature"
                    className="mix-blend-overlay opacity-80 group-hover:opacity-100"
                    fallbackColor="#b5f0c0"
                />
            </div>
            <div className="absolute -top-3 -right-3 bg-white border-2 border-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg shadow-[2px_2px_0_#0f0f0f]">
                🌍
            </div>
        </div>
    );
}
