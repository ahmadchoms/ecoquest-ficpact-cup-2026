import UnsplashImage from "./UnsplashImage";

export default function IlluLeaf({ className = "" }) {
    return (
        <div className={`relative group ${className}`}>
            <div className="border-3 border-black rounded-tl-[40px] rounded-br-[40px] rounded-tr-lg rounded-bl-lg overflow-hidden shadow-hard bg-[#d4fce8] -rotate-[3deg] group-hover:rotate-0 transition-transform duration-300 aspect-square">
                <UnsplashImage
                    src="https://images.unsplash.com/photo-1525087740718-9e0f2c58c7ef"
                    alt="Tropical Leaf"
                    fallbackColor="#d4fce8"
                />
            </div>
        </div>
    );
}
