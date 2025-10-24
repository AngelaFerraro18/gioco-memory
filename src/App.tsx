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

  //variabile di stato per il match delle cards
  const [matchedCards, setMatchedCards] = useState<number[]>([]);

  //variabile di stato per la difficoltà, inizialmente 6 Pokemon
  const [difficulty, setDifficulty] = useState(6);

  //variabile di stato per contatore dei Pokemon
  const [count, setCount] = useState(0);

  //chiamata API
  useEffect(() => {
    async function fetchData() {
      try {

        //variabile con il numero totale dei pokemon
        const totalPokemons = 1010;

        //prendo quanti Pokemon voglio
        const limit = difficulty;

        //raccolgo i set di Pokemon in modo randomico per non avere sempre gli stessi
        const offsetPokemon = Math.floor(Math.random() * (totalPokemons - limit));

        //prendo la lista dei Pokemon
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offsetPokemon}`);
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
  }, [difficulty]); //al cambiare della difficoltà, mostro altre cards di Pokemon


  //funzione per girare le cards
  function handleFlip(id: number) {

    //se la carta è già cliccata allora non fa nulla, altrimenti la gira
    if (flippedCard.includes(id) || disabled) return;

    //aggiorno le carte già girate con quella che è stata cliccata
    const newFlippedCard = [...flippedCard, id];
    setFlippedCard(newFlippedCard);

    //se l'utente ha già scoperto due carte, faccio in modo che non si scoprano altre carte mentre fa il confronto
    if (newFlippedCard.length === 2) {
      setDisabled(true);

      const [firstId, secondId] = newFlippedCard;

      const firstCard = cards.find(c => c.id === firstId);

      const secondCard = cards.find(c => c.id === secondId);


      //confronto le carte scoperte dall'utente
      if (firstCard && secondCard && firstCard.name === secondCard.name) {
        setMatchedCards(prev => [...prev, firstId, secondId]);
        setFlippedCard([]);
        setDisabled(false);
        setCount(prev => prev + 1);
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

      <section className="container mx-auto px-4 mb-10 max-w-[60rem] lg:max-w-[70rem] xl:max-w-[80rem]">
        <h4 className="mb-10">Trova le coppie di Pokèmon!</h4>

        {/* select per la difficoltà */}
        <div>
          <label htmlFor="difficulty">Seleziona la difficoltà:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={e => setDifficulty(Number(e.target.value))}
          >
            <option value={4}>Facile</option>
            <option value={6}>Medio</option>
            <option value={8}>Difficile</option>
          </select>
        </div>

        {/* contatore Pokemon catturati/indovinati */}
        <div>
          <h5>Pokèmon catturati: {count}</h5>
        </div>


        <ul className="grid justify-items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.length > 0 && (cards.map(card => {

            const isFlipped = flippedCard.includes(card.id) || matchedCards.includes(card.id);

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
          ))

          }
        </ul>
      </section>
    </>
  )
}

export default App
