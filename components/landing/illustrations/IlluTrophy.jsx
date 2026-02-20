import UnsplashImage from "./UnsplashImage";

export default function IlluTrophy({ className = "" }) {
    return (
        <div className={`relative group ${className}`}>
            <div className="border-3 border-black rounded-[20px] overflow-hidden shadow-hard bg-[#f5e642] rotate-[2deg] group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0_#0f0f0f] transition-all duration-700 aspect-square">
                <UnsplashImage
                    src="https://images.unsplash.com/photo-1569728723358-d1a317aa7fba"
                    alt="Trophy and Achievement"
                    className="mix-blend-multiply opacity-90 group-hover:opacity-100 transition-all duration-300"
                    fallbackColor="#f5e642"
                />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white border-2 border-black px-3 py-1 rounded-lg font-bold text-xs uppercase shadow-[3px_3px_0_#0f0f0f] rotate-[-5deg]">
                Juara 1!
            </div>
        </div>
    );
}
