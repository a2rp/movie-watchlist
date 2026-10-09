import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../confirmDialog/index.jsx";
import styles from "./styles.module.css";

const starterFilms = [
    { id: 1, title: "The Grand Budapest Hotel", director: "Wes Anderson", year: 2014, runtime: "1h 39m", genre: "Comedy", status: "Want to watch", art: "grandBudapest" },
    { id: 2, title: "In the Mood for Love", director: "Wong Kar-wai", year: 2000, runtime: "1h 38m", genre: "Romance", status: "Watching", art: "moodForLove" },
    { id: 3, title: "Arrival", director: "Denis Villeneuve", year: 2016, runtime: "1h 56m", genre: "Science fiction", status: "Want to watch", art: "arrival" },
    { id: 4, title: "Moonlight", director: "Barry Jenkins", year: 2016, runtime: "1h 51m", genre: "Drama", status: "Watched", art: "moonlight" },
    { id: 5, title: "The Farewell", director: "Lulu Wang", year: 2019, runtime: "1h 40m", genre: "Drama", status: "Want to watch", art: "farewell" },
];
const statuses = ["Want to watch", "Watching", "Watched", "Paused"];
const key = "frame-list-films";

const MovieWatchlist = () => {
    const [films, setFilms] = useState(() => { try { return JSON.parse(localStorage.getItem(key)) ?? starterFilms; } catch { return starterFilms; } });
    const [filter, setFilter] = useState("All films");
    const [search, setSearch] = useState("");
    const [title, setTitle] = useState("");
    const [removing, setRemoving] = useState(null);
    useEffect(() => localStorage.setItem(key, JSON.stringify(films)), [films]);
    const filtered = useMemo(() => films.filter((film) => (filter === "All films" || film.status === filter) && (film.title + " " + film.director + " " + film.genre).toLowerCase().includes(search.toLowerCase())), [films, filter, search]);
    const updateStatus = (id, status) => setFilms((current) => current.map((film) => film.id === id ? { ...film, status } : film));
    const addFilm = (event) => { event.preventDefault(); const clean = title.trim(); if (!clean) return; setFilms((current) => [{ id: Date.now(), title: clean, director: "Your note", year: new Date().getFullYear(), runtime: "Not set", genre: "Added by you", status: "Want to watch", art: "newFilm" }, ...current]); setTitle(""); };
    const confirmDelete = () => { setFilms((current) => current.filter((film) => film.id !== removing.id)); setRemoving(null); };
    const count = (status) => films.filter((film) => film.status === status).length;

    return <div className={styles.page}>
        <section className={styles.heading} id="watchlist"><div><p className={styles.label}>Your personal cinema</p><h1>Save a film for later.</h1><p className={styles.lead}>A neat little place for the movies you mean to watch.</p></div><div className={styles.monthCard}><span>Films finished</span><strong>{count("Watched")}</strong><small>checked off your list</small></div></section>
        <section className={styles.statusRow} id="your-month" aria-label="Watchlist summary"><div><span>Want to watch</span><strong>{count("Want to watch")}</strong></div><div><span>In progress</span><strong>{count("Watching")}</strong></div><div><span>Finished</span><strong>{count("Watched")}</strong></div><div className={styles.quote}>“The right film finds the right evening.”</div></section>
        <section className={styles.collection}>
            <div className={styles.collectionHead}><div><h2>All films</h2><p>{filtered.length} {filtered.length === 1 ? "film" : "films"} on your list</p></div><label className={styles.search}><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a film" aria-label="Search films" /></label></div>
            <div className={styles.tabs} role="group" aria-label="Filter watchlist">{["All films", ...statuses].map((status) => <button key={status} type="button" onClick={() => setFilter(status)} aria-pressed={filter === status} className={filter === status ? styles.selectedTab : ""}>{status}</button>)}</div>
            <div className={styles.filmList}>{filtered.map((film, index) => <article key={film.id} className={styles.filmRow}>
                <div className={styles.poster + " " + styles[film.art]} aria-hidden="true"><span>{film.title}</span><small>{film.year}</small></div>
                <span className={styles.rank}>{String(index + 1).padStart(2, "0")}</span>
                <div className={styles.filmInfo}><h3>{film.title}</h3><p>{film.director} <span>·</span> {film.year} <span>·</span> {film.runtime}</p><span className={styles.genre}>{film.genre}</span></div>
                <label className={styles.statusSelect}><span>Status</span><select value={film.status} onChange={(event) => updateStatus(film.id, event.target.value)} aria-label={"Status for " + film.title}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
                <button type="button" className={styles.deleteButton} onClick={() => setRemoving(film)} aria-label={"Remove " + film.title}><FiTrash2 aria-hidden="true" /></button>
            </article>)}</div>
            {!filtered.length && <p className={styles.empty}>No films here yet. Change the filter or add one below.</p>}
        </section>
        <form className={styles.addFilm} onSubmit={addFilm}><div><h2>Add a film</h2><p>Keep your next movie night in mind.</p></div><label><span>Film title</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="For example, The Apartment" /></label><button type="submit"><FiPlus aria-hidden="true" /> Add to watchlist</button></form>
        {removing && <ConfirmDialog title="Remove this film?" description={removing.title + " will be removed from your watchlist."} confirmLabel="Remove film" onCancel={() => setRemoving(null)} onConfirm={confirmDelete} />}
    </div>;
};

export default MovieWatchlist;
