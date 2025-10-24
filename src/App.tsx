import { useEffect, useState } from "react";
import PokemonCard from "./components/PokemonCard";
import Modal from "./components/Modal";

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

  //variabile di stato per la vittoria dell'utente
  const [isVictory, setIsVictory] = useState(false);

  //funzione per chiamata all'API Pokemon
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

  //al cambiare della difficoltà, mostro altre cards di Pokemon
  useEffect(() => {
    fetchData();
  }, [difficulty]);

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

  //useEffect per mostrare la modale
  useEffect(() => {
    if (cards.length > 0 && matchedCards.length === cards.length) {
      setIsVictory(true);
    }
  }, [matchedCards, cards]);


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


        {/* modale della vittoria */}
        <Modal isOpen={isVictory} onClose={() => setIsVictory(false)}>
          <h2>Complimenti, hai catturato tutti i Pokèmon!</h2>
          <p>Hai dimostrato di essere un vero allenatore di Pokèmon.</p>

          <button
            onClick={() => {
              setIsVictory(false);
              setFlippedCard([]);
              setMatchedCards([]);
              setCount(0);
              fetchData();
            }}
          >Prova a catturarne altri!</button>
        </Modal>

        <ul className="grid justify-items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.length > 0 && (cards.map(card => {

            return (
              <PokemonCard key={card.id}
                card={card}
                isFlipped={flippedCard.includes(card.id) || matchedCards.includes(card.id)}
                handleFlip={handleFlip}
              />
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
