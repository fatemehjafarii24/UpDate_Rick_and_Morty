import { useState } from "react";
import "./App.css";
import CharacterDetail from "./components/CharacterDetail";
import CharacterList from "./components/CharacterList";
import Navbar, { Favourites, Search, SearchResult } from "./components/Navbar";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function App() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("FAVOURITES")) || [];
    } catch {
      return [];
    }
  });
  const [count, setCount] = useState(0);

  //?  1.  async await. ???
  //?  2.  axios  Error ?
  //?  3.  dependency array: role ? when to run effect function
  //  useEffect(() =>{})  => on every renders
  //  useEffect(() =>{}, [])  => on mount
  //  useEffect(() =>{}, [state, props]) => dep. array changes
  //* Query function

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character?name=${query}`,
          { signal }
        );
        setCharacters(data.results.slice(0, 6));
      } catch (err) {
        // axios => axios.isCancel()
        if (!axios.isCancel()) {
          setCharacters([]);
          // FOR REAL PROJECT : err.response.data.message or response
          toast.error(err.response.data.error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    // if(query.length < 3){
    //   setCharacters([]);
    //   return;
    // }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [query]);

  // clean up function:  what?  why to use?
  // when to use? :
  // 1. unmount component
  // 2. befor  the next re-render (between re-render)
  // where to use?
  // effect => after unmount or while re-render
  //  example:
  // fetch API, timer, eventListener , ...
  useEffect(() => {
    const interval = setInterval(() => setCount((c) => c + 1), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);


  useEffect(() => {
    localStorage.setItem("FAVOURITES", JSON.stringify(favourites));
  }, [favourites]);


  const onSelectCharacter = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };


  const handleAddFavourite = (char) => {
    setFavourites((prevFav) => {
      if (prevFav.some((item) => item.id === char.id)) return prevFav;
      return [...prevFav, char];
    });
  };

  const handleDeleteFavourite = (id) => {
    setFavourites((preFav) => preFav.filter((fav) => fav.id !== id));
  };

  const isAddToFavourite = favourites.map((fav) => fav.id).includes(selectedId);

  return (
    <div className="app">
      <Toaster />
      <Navbar>
        <div className="navbar__left">
          <div className="Count" style={{ color: "var(--slate-300)" }}>
            {count}s
          </div>
          <div className="navbar__group">
            <Search query={query} setQuery={setQuery} />
            <SearchResult numOfResult={characters.length} />
          </div>
        </div>
        <div className="navbar__actions">
          <Favourites
            favourites={favourites}
            onDeleteFavourites={handleDeleteFavourite}
          />
        </div>
      </Navbar>
      <Main>
        <CharacterList
          selectedId={selectedId}
          characters={characters}
          isLoading={isLoading}
          onSelectCharacter={onSelectCharacter}
        />
        <CharacterDetail
          selectedId={selectedId}
          onAddFavourite={handleAddFavourite}
          isAddToFavourite={isAddToFavourite}
        />
      </Main>
    </div>
  );
}
export default App;

function Main({ children }) {
  return <div className="main">{children}</div>;
}
//  props drilling: A, B, C, D, E
//  characters => App => Main => CharacterList
//  characters => App => CharacterList
