import { useEffect, useState } from "react";

//type alias per i Pokemon
type Pokemon = {
  readonly id: number,
  name: string,
  image: string | null
}

function App() {

  //variabile di stato per le cards
  const [cards, setCards] = useState<Pokemon[]>([]);

  //variabile di stato per le cards scoperte
  const [flippedCard, setFlippedCard] = useState<number[]>([]);

  //variabile di stato per bloccare i click durante il check
  const [disabled, setDisabled] = useState(false);

  const [matchedCards, setMatchedCards] = useState<number[]>([]);

  //chiamata API
  useEffect(() => {
    async function fetchData() {
      try {
        //prendo la lista dei Pokemon
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=6');
        const data = await response.json();

        //recuper i dettagli per ogni Pokemon
        const results = await Promise.all(
          data.results.map(async (pokemon: { name: string; url: string }) => {
            const res = await fetch(pokemon.url);
            const info = await res.json();
            return {
              id: info.id,
              name: pokemon.name,
              image: info.sprites.other["official-artwork"].front_default
            }
          })
        );

        //creo le coppie duplicate
        const duplicatedCards = [...results, ...results.map(item => ({ ...item, id: item.id + 10000 }))];

        //mischio le cards dei pokemon
        const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5);

        //aggiorno lo stato delle cards
        setCards(shuffledCards);

      } catch (error) {
        throw new Error(`Non è stato possibile recuperare i dati del fetch dei Pokemon:${error}`);
      }
    }

    fetchData();
  }, []);


  //funzione per girare le cards
  function handleFlip(id: number) {
    if (flippedCard.includes(id) || disabled) return;

    const newFlippedCard = [...flippedCard, id];

    setFlippedCard(newFlippedCard);

    if (newFlippedCard.length === 2) {
      setDisabled(true);

      const [firstId, secondId] = newFlippedCard;

      const firstCard = cards.find(c => c.id === firstId);

      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.name === secondCard.name) {
        setMatchedCards(prev => [...prev, firstId, secondId]);
        setFlippedCard([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlippedCard([]);
          setDisabled(false);
        }, 1000)
      }

    }
  }


  return (
    <>
      <h1 className="text-xl my-10 text-center">Metti alla prova la tua memoria!</h1>

      <section className="container mx-auto px-4 mb-10">
        <h4 className="mb-10">Trova le coppie di Pokèmon!</h4>


        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cards.length > 0 && (cards.map(card => {

            const isFlipped = flippedCard.includes(card.id) || matchedCards.includes(card.id);

            return (
              <li key={card.id}
                className="relative w-32 h-44 cursor-pointer perspective"
                onClick={() => handleFlip(card.id)}
              >

                <div className={`relative w-full h-full duration-500 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}>


                  {/* Retro della card */}
                  <div className="absolute w-full h-full rounded-xl bg-gray-100 shadow-lg backface-hidden flex items-center justify-center">

                    <img src="/back-card.webp" alt="back card" className="w-24 h-24 object-contain" />

                  </div>

                  {/* Fronte della card  */}

                  <div className="absolute w-full h-full rotate-y-180 rounded-xl bg-white shadow-lg backface-hidden flex flex-col items-center justify-center p-2">

                    <img src={card.image || ''} alt={card.name} className="w-24 h-24 object-contain" />

                    <p className="capitalize text-sm mt-2">
                      {card.name.charAt(0).toUpperCase() + card.name.slice(1)}
                    </p>
                  </div>
                </div>

              </li>
            )
          }
          ))

          }
        </ul>
      </section>
    </>
  )
}

export default App
