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
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=8');
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

        setCards(results);

      } catch (error) {
        throw new Error(`Non è stato possibile recuperare i dati del fetch dei Pokemon:${error}`);
      }
    }

    fetchData();
  }, []);


  return (
    <>
      <h1>Metti alla prova la tua memoria</h1>

      <section>
        <h4>Seleziona un elemento:</h4>
        <ul>
          {cards.length > 0 && (cards.map(card => <li key={card.id}>
            <img src={card.image || ''} alt={card.name} />
            <p>{card.name}</p>
          </li>))}
        </ul>
      </section>
    </>
  )
}

export default App
