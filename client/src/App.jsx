import { useState, useRef, useEffect } from "react";
import "./App.css";
import Splash from "./Splash.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const STORAGE_CHATS = "kindred.chats";
const STORAGE_THEME = "kindred.theme";

const STARTERS = [
  "My roommate never cleans up after himself",
  "How do I tell my partner I need more space?",
  "My in-laws keep overstepping in our marriage",
  "A close friend has gone distant and I don’t know why",
];

function loadChats() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_CHATS) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_THEME);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [chats, setChats] = useState(loadChats);
  const [activeId, setActiveId] = useState(null);
  const [theme, setTheme] = useState(loadTheme);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeId);
  const messages = activeChat ? activeChat.messages : [];
  const sortedChats = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
  const busy = loadingId !== null;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_THEME, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHATS, JSON.stringify(chats));
    } catch {
      /* ignore */
    }
  }, [chats]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, loadingId, activeId]);

  function updateChat(id, patch) {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  async function send(text) {
    const content = text.trim();
    if (!content || busy) return;

    const history = messages;
    const next = [...history, { role: "user", content }];
    let chatId = activeId;

    if (!chatId) {
      chatId = newId();
      const title = content.length > 40 ? content.slice(0, 40) + "…" : content;
      setChats((prev) => [{ id: chatId, title, messages: next, updatedAt: Date.now() }, ...prev]);
      setActiveId(chatId);
    } else {
      updateChat(chatId, { messages: next, updatedAt: Date.now() });
    }

    setInput("");
    setError("");
    setLoadingId(chatId);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok || !data.reply) throw new Error(data.error || "Something went wrong.");
      updateChat(chatId, {
        messages: [...next, { role: "assistant", content: data.reply }],
        updatedAt: Date.now(),
      });
    } catch (err) {
      setError(err.message || "Couldn’t reach the server. Check your connection.");
      setInput(content);
      if (history.length === 0) {
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        setActiveId(null);
      } else {
        updateChat(chatId, { messages: history });
      }
    } finally {
      setLoadingId(null);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function newChat() {
    setActiveId(null);
    setError("");
    setInput("");
    setSidebarOpen(false);
    inputRef.current?.focus();
  }

  function openChat(id) {
    setActiveId(id);
    setError("");
    setSidebarOpen(false);
  }

  function deleteChat(id) {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (id === activeId) setActiveId(null);
  }

  function deleteAll() {
    if (window.confirm("Delete all your saved chats on this device?")) {
      setChats([]);
      setActiveId(null);
      setSettingsOpen(false);
    }
  }

  return (
    <>
      {showSplash && <Splash onStart={() => setShowSplash(false)} />}

      <div className="shell">
        {sidebarOpen && <div className="backdrop" onClick={() => setSidebarOpen(false)} />}

        <aside className={`sidebar${sidebarOpen ? " open" : ""}`} aria-label="Chat history">
          <div className="brand">Kindred</div>
          <button className="new-chat" onClick={newChat}>
            New chat
          </button>

          <ul className="chat-list">
            {sortedChats.length === 0 && (
              <li className="empty-list">Your conversations will appear here.</li>
            )}
            {sortedChats.map((c) => (
              <li key={c.id} className={`chat-item${c.id === activeId ? " active" : ""}`}>
                <button className="open" onClick={() => openChat(c.id)} title={c.title}>
                  {c.title}
                </button>
                <button
                  className="del"
                  onClick={() => deleteChat(c.id)}
                  aria-label={`Delete chat: ${c.title}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          {settingsOpen && (
            <div className="settings-panel">
              <span className="settings-label">Appearance</span>
              <div className="seg">
                <button aria-pressed={theme === "light"} onClick={() => setTheme("light")}>
                  Light
                </button>
                <button aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>
                  Dark
                </button>
              </div>
              <button className="danger-link" onClick={deleteAll}>
                Delete all chats
              </button>
            </div>
          )}
          <button
            className="settings-btn"
            onClick={() => setSettingsOpen((o) => !o)}
            aria-expanded={settingsOpen}
          >
            Settings
          </button>
        </aside>

        <div className="main">
          <header className="topbar">
            <button className="menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open chat history">
              Menu
            </button>
            <h2>{activeChat ? activeChat.title : "New conversation"}</h2>
          </header>

          <main className="thread" aria-live="polite">
            {messages.length === 0 && (
              <section className="empty">
                <h3>What’s on your mind?</h3>
                <p>Start with your own words, or pick one of these.</p>
                <div className="starters">
                  {STARTERS.map((s) => (
                    <button key={s} onClick={() => send(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.role}`}>
                {m.content}
              </div>
            ))}

            {loadingId !== null && loadingId === activeId && (
              <div className="bubble assistant typing" aria-label="Kindred is typing">
                <span />
                <span />
                <span />
              </div>
            )}

            {error && (
              <div className="error" role="alert">
                {error}
              </div>
            )}
            <div ref={bottomRef} />
          </main>

          <footer className="composer">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell Kindred what’s happening…"
              rows={1}
              maxLength={1000}
              aria-label="Your message"
            />
            <button onClick={() => send(input)} disabled={busy || !input.trim()}>
              Send
            </button>
            <p className="note">
              Kindred is an AI, not a counsellor. In an emergency, contact local emergency services.
              Chats are saved only on this device.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}