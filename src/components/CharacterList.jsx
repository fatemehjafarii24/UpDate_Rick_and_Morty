import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Loader from "./Loader";

function CharacterList({
  selectedId,
  characters,
  isLoading,
  onSelectCharacter,
}) {
  if (isLoading)
    return (
      <div className="characters-list">
        <span style={{ color: "green" }}>
          <Loader />
        </span>
      </div>
    );

  return (
    <div className="characters-list">
      {characters.length === 0 ? (
        <div className="empty-state">No characters found.</div>
      ) : (
        characters.map((item) => (
          <Character
            key={item.id}
            item={item}
            onClick={() => onSelectCharacter(item.id)}
          >
            <button
              className="icon red"
              onClick={(e) => {
                e.stopPropagation();
                onSelectCharacter(item.id);
              }}
            >
              {selectedId === item.id ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </Character>
        ))
      )}
    </div>
  );
}
export default CharacterList;

export function Character({ item, children, onClick }) {
  return (
    <div className="list__item" onClick={onClick}>
      <img src={item.image} alt={item.name} />
      <CharacterName item={item} />
      <CharacterInfo item={item} />
      {children}
    </div>
  );
}

function CharacterName({ item }) {
  return (
    <h3 className="name">
      <span>{item.gender === "Male" ? "👱🏻‍♂️" : "👩🏻‍🦳"}</span>
      <span> {item.name}</span>
    </h3>
  );
}

function CharacterInfo({ item }) {
  return (
    <div className="list-item__info info">
      <span className={`status ${item.status === "Dead" ? "red" : ""}`}></span>
      <span> {item.status} </span>
      <span> - {item.species}</span>
    </div>
  );
}
