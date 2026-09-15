import { useEffect, useState } from "react";
import API from "./api";

function Dashboard({ user, logout }) {
    const [journals, setJournals] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [mood, setMood] = useState("");
    const [tags, setTags] = useState("");
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadJournals = async () => {
        try {
            const response = await API.get(`/journals/${user.id}`);
            setJournals(response.data);
        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "Unable to load journals."
            );
        }
    };

    useEffect(() => {
        loadJournals();
    }, [user.id]);

    const clearForm = () => {
        setTitle("");
        setContent("");
        setMood("");
        setTags("");
        setEditingId(null);
    };

    const saveJournal = async (event) => {
        event.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert("Please enter title and content");
            return;
        }

        try {
            setLoading(true);

            if (editingId) {
                await API.put(`/journals/${editingId}`, {
                    title,
                    content,
                    mood,
                    tags,
                });
                alert("Journal updated successfully!");
            } else {
                await API.post("/journals", {
                    user_id: user.id,
                    title,
                    content,
                    mood,
                    tags,
                });
                alert("Journal saved successfully!");
            }

            clearForm();
            await loadJournals();
        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "Unable to save journal."
            );
        } finally {
            setLoading(false);
        }
    };

    const editJournal = (journal) => {
        setEditingId(journal.id);
        setTitle(journal.title);
        setContent(journal.content);
        setMood(journal.mood || "");
        setTags(journal.tags || "");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const deleteJournal = async (id) => {
        if (!window.confirm("Delete this journal?")) {
            return;
        }

        try {
            await API.delete(`/journals/${id}`);
            await loadJournals();
        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "Unable to delete journal."
            );
        }
    };

    const filteredJournals = journals.filter((journal) => {
        const term = search.toLowerCase();

        return (
            journal.title.toLowerCase().includes(term) ||
            journal.content.toLowerCase().includes(term) ||
            (journal.tags || "").toLowerCase().includes(term)
        );
    });

    return (
        <div className="dashboard-page">
            <header className="topbar">
                <div>
                    <h1>📔 My Digital Diary</h1>
                    <p>Welcome, {user.name}! 👋</p>
                </div>

                <button className="logout-btn" onClick={logout}>
                    Logout
                </button>
            </header>

            <main className="dashboard-content">
                <section className="journal-editor">
                    <div className="section-title">
                        <div>
                            <span className="small-label">
                                YOUR PERSONAL SPACE
                            </span>
                            <h2>
                                {editingId
                                    ? "✏️ Edit Journal"
                                    : "📝 Write Today's Journal"}
                            </h2>
                        </div>
                    </div>

                    <form onSubmit={saveJournal}>
                        <input
                            type="text"
                            placeholder="Journal title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <div className="form-row">
                            <select
                                value={mood}
                                onChange={(e) => setMood(e.target.value)}
                            >
                                <option value="">Select your mood</option>
                                <option value="😊 Happy">😊 Happy</option>
                                <option value="😍 Excited">😍 Excited</option>
                                <option value="😌 Calm">😌 Calm</option>
                                <option value="😢 Sad">😢 Sad</option>
                                <option value="😡 Angry">😡 Angry</option>
                                <option value="😴 Tired">😴 Tired</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Tags: college, friends"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </div>

                        <textarea
                            placeholder="Write your thoughts here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <div className="editor-buttons">
                            <button type="submit" disabled={loading}>
                                {loading
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Journal"
                                        : "Save Journal"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={clearForm}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="journal-list">
                    <div className="list-header">
                        <div>
                            <span className="small-label">
                                YOUR MEMORIES
                            </span>
                            <h2>📚 My Journals</h2>
                        </div>

                        <input
                            className="search"
                            type="text"
                            placeholder="🔍 Search journals..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {filteredJournals.length === 0 ? (
                        <div className="empty">
                            <div>📖</div>
                            <h3>
                                {search
                                    ? "No matching journals"
                                    : "No journals yet"}
                            </h3>
                            <p>
                                {search
                                    ? "Try a different search."
                                    : "Start writing your first memory!"}
                            </p>
                        </div>
                    ) : (
                        <div className="journal-grid">
                            {filteredJournals.map((journal) => (
                                <article
                                    className="journal-card"
                                    key={journal.id}
                                >
                                    <div className="card-top">
                                        <h3>{journal.title}</h3>
                                        {journal.mood && (
                                            <span className="mood">
                                                {journal.mood}
                                            </span>
                                        )}
                                    </div>

                                    <div className="date">
                                        📅 {journal.created_at}
                                    </div>

                                    <p>{journal.content}</p>

                                    {journal.tags && (
                                        <div className="tags">
                                            🏷️ {journal.tags}
                                        </div>
                                    )}

                                    <div className="card-buttons">
                                        <button
                                            onClick={() =>
                                                editJournal(journal)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                deleteJournal(journal.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Dashboard;
