import React, { useState, useRef, useEffect } from "react";
import "./App.css";

export default function App() {
  const [ileInput, setIleInput] = useState("1-10");
  const [words, setWords] = useState([]);
  const [defs, setDefs] = useState([]);
  const [message, setMessage] = useState("");
  const [rightBg, setRightBg] = useState("");
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);
  const timeoutsRef = useRef([]);

  function handleIleKeyDown(e) {
    if (e.key !== "Enter") return;
    const n = parseInt(ileInput);
    setMessage("");
    if (!isNaN(n) && n >= 1 && n <= 10) {
      setWords(Array.from({ length: n }, () => ""));
      setDefs(Array.from({ length: n }, () => ""));
    } else {
      setWords([]);
      setDefs([]);
      setMessage("Wpisz liczbę od 1 do 10.");
    }
  }

  function zmiana_koloru(kolor) {
    setRightBg(kolor.toLowerCase());
  }

  function startTimer() {
    if (timerRef.current === null) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function start() {
    start_game();
    startTimer();
  }

  function start_game() {
    const pairs = [];
    for (let i = 0; i < words.length; i++) {
      pairs.push({
        word: words[i] ? words[i].trim() : "",
        definition: defs[i] ? defs[i].trim() : "",
      });
    }

    const allItems = [];
    pairs.forEach((pair, idx) => {
      allItems.push({
        id: `w-${idx}-${Math.random()}`,
        text: pair.word,
        type: "word",
        match: pair.definition,
        removed: false,
        bg: "",
        opacity: 1,
      });
      allItems.push({
        id: `d-${idx}-${Math.random()}`,
        text: pair.definition,
        type: "definition",
        match: pair.word,
        removed: false,
        bg: "",
        opacity: 1,
      });
    });

    for (let i = allItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
    }

    setItems(allItems);
    setSelectedId(null);
    setWords([]);
    setDefs([]);
    setMessage("");
    setSeconds(0);
  }

  function handleItemClick(clickedId) {
    const clicked = items.find((it) => it.id === clickedId);
    if (!clicked || clicked.removed) return;

    if (!selectedId) {
      setSelectedId(clickedId);
      setItems((prev) =>
        prev.map((it) =>
          it.id === clickedId ? { ...it, bg: "", selected: true } : it
        )
      );
      return;
    }

    if (selectedId === clickedId) return;

    const selected = items.find((it) => it.id === selectedId);
    if (!selected) {
      setSelectedId(null);
      return;
    }

    if (selected.text === clicked.match) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === selectedId || it.id === clickedId
            ? { ...it, bg: "green" }
            : it
        )
      );

      const t1 = setTimeout(() => {
        setItems((prev) =>
          prev.map((it) =>
            it.id === selectedId || it.id === clickedId
              ? { ...it, opacity: 0, removed: true }
              : it
          )
        );

        setTimeout(() => {
          setItems((prev) => {
            const remaining = prev.filter((p) => !p.removed);
            if (remaining.length === 0) stopTimer();
            return prev;
          });
        }, 10);
      }, 1000);

      timeoutsRef.current.push(t1);
    } else {
      setItems((prev) =>
        prev.map((it) =>
          it.id === selectedId || it.id === clickedId
            ? { ...it, bg: "red" }
            : it
        )
      );
      const t2 = setTimeout(() => {
        setItems((prev) =>
          prev.map((it) =>
            it.id === selectedId || it.id === clickedId
              ? { ...it, bg: "", selected: false }
              : it
          )
        );
      }, 500);
      timeoutsRef.current.push(t2);
    }

    setSelectedId(null);
  }

  return (
    <div className="kontener">
      <div className="lewy">
        <h1>Ustawienia</h1>
        <p>
          Ile fiszek?
          <input
            type="text"
            id="ile"
            value={ileInput}
            onChange={(e) => setIleInput(e.target.value)}
            onKeyDown={handleIleKeyDown}
          />
        </p>
        <p id="druk">
          {words.map((w, i) => (
            <p key={`w-${i}`} className="inline-p">
              Słówko nr {i + 1}:{" "}
              <input
                type="text"
                value={w}
                onChange={(e) => {
                  const copy = [...words];
                  copy[i] = e.target.value;
                  setWords(copy);
                }}
              />
            </p>
          ))}
        </p>
        <p id="druk2">
          {defs.map((d, i) => (
            <p key={`d-${i}`} className="inline-p">
              Definicja nr {i + 1}:{" "}
              <input
                type="text"
                value={d}
                onChange={(e) => {
                  const copy = [...defs];
                  copy[i] = e.target.value;
                  setDefs(copy);
                }}
              />
            </p>
          ))}
        </p>

        {message && <p className="error">{message}</p>}

        <h2>Zmień kolor bloku z fiszkami:</h2>
        <div className="przyciski">
          <button onClick={() => zmiana_koloru("Indigo")} className="przycisk2">
            Indigo
          </button>
          <button onClick={() => zmiana_koloru("Aqua")} className="przycisk2">
            Aqua
          </button>
          <button onClick={() => zmiana_koloru("Yellow")} className="przycisk2">
            Green
          </button>
        </div>

        <div className="Timer">
          <h1>
            Czas: <span id="czas">{seconds}</span> s
          </h1>
        </div>

        <button className="start" onClick={start}>
          Start
        </button>
      </div>

      <div className="prawy" style={{ backgroundColor: rightBg }}>
        {items.map((it) => (
          <div
            key={it.id}
            className="fiszka"
            onClick={() => handleItemClick(it.id)}
            style={{
              backgroundColor:
                it.bg === "green"
                  ? "green"
                  : it.bg === "red"
                  ? "red"
                  : "white",
              opacity: it.opacity,
              borderColor: it.bg === "green" ? "green" : "blue",
            }}
          >
            {it.text}
          </div>
        ))}
      </div>
    </div>
  );
}
