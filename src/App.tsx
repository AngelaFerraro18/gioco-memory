import { useEffect, useState } from "react";

//type alias per i Pokemon
type Pokemon = {
  readonly id: number,
  name: string,
  image: string | null
}

function App() {

  const [cards, setCards] = useState<Pokemon[]>([]);

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


  return (
    <>
      <h1 className="text-xl my-10 text-center">Metti alla prova la tua memoria!</h1>

      <section className="container mx-auto px-4 mb-10">
        <h4 className="mb-10">Seleziona una carta:</h4>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cards.length > 0 && (cards.map(card => <li className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center hover:scale-105 transition-transform" key={card.id}>
            <img src={card.image || ''} alt={card.name} />
            <p>{card.name.charAt(0).toUpperCase() + card.name.slice(1)}</p>
          </li>))}
        </ul>
      </section>
    </>
  )
}

export default App
