//props
type PokemonCardProps = {
    card: Pokemon;
    isFlipped: boolean;
    handleFlip: (id: number) => void;
};


function PokemonCard({ card, isFlipped, handleFlip }: PokemonCardProps) {

    return (
        <li key={card.id}
            className="relative w-60 h-80 cursor-pointer perspective"
            onClick={() => handleFlip(card.id)}
        >

            <div className={`relative w-full h-full duration-500 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}>


                {/* Retro della card */}
                <div className="absolute w-full h-full rounded-xl shadow-lg backface-hidden flex items-center justify-center overflow-hidden bg-[#023272]">

                    <img src="/back-card.png" alt="back card" className="w-full h-full object-contain" />

                </div>

                {/* Fronte della card  */}

                <div className="absolute w-full h-full rotate-y-180 rounded-xl bg-white shadow-lg backface-hidden flex flex-col items-center justify-center p-2">

                    <img src={card.image || ''} alt={card.name} className="w-60 h-80 object-contain" />

                    <p className="text-lg mt-2">
                        {card.name.charAt(0).toUpperCase() + card.name.slice(1)}
                    </p>
                </div>
            </div>

        </li>

    )
}

export default PokemonCard;