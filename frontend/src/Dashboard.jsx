import React, { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [tags, setTags] = useState("");

  const [journals, setJournals] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Load user and temporary journals
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }

    const savedJournals = localStorage.getItem("journals");

    if (savedJournals) {
      try {
        setJournals(JSON.parse(savedJournals));
      } catch {
        setJournals([]);
      }
    }
  }, []);

  // Save journal
  const handleSaveJournal = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a journal title");
      return;
    }

    if (!content.trim()) {
      alert("Please write something in your journal");
      return;
    }

    if (editingId !== null) {
      const updatedJournals = journals.map((journal) => {
        if (journal.id === editingId) {
          return {
            ...journal,
            title: title.trim(),
            content: content.trim(),
            mood: mood.trim(),
            tags: tags.trim(),
            updated_at: new Date().toLocaleString(),
          };
        }

        return journal;
      });

      setJournals(updatedJournals);

      localStorage.setItem(
        "journals",
        JSON.stringify(updatedJournals)
      );

      clearForm();

      alert("Journal updated successfully");
      return;
    }

    const newJournal = {
      id: Date.now(),
      user_id: user ? user.id : null,
      title: title.trim(),
      content: content.trim(),
      mood: mood.trim(),
      tags: tags.trim(),
      created_at: new Date().toLocaleString(),
    };

    const updatedJournals = [
      newJournal,
      ...journals,
    ];

    setJournals(updatedJournals);

    localStorage.setItem(
      "journals",
      JSON.stringify(updatedJournals)
    );

    clearForm();

    alert("Journal saved successfully");
  };

  // Clear form
  const clearForm = () => {
    setTitle("");
    setContent("");
    setMood("");
    setTags("");
    setEditingId(null);
  };

  // Edit journal
  const handleEdit = (journal) => {
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

  // Delete journal
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this journal?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedJournals = journals.filter(
      (journal) => journal.id !== id
    );

    setJournals(updatedJournals);

    localStorage.setItem(
      "journals",
      JSON.stringify(updatedJournals)
    );

    if (editingId === id) {
      clearForm();
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // Search
  const filteredJournals = journals.filter((journal) => {
    const searchText = search.toLowerCase();

    return (
      journal.title
        .toLowerCase()
        .includes(searchText) ||
      journal.content
        .toLowerCase()
        .includes(searchText) ||
      (journal.mood || "")
        .toLowerCase()
        .includes(searchText) ||
      (journal.tags || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f1eb",
        fontFamily: "Arial, sans-serif",
        color: "#2d241f",
        paddingBottom: "50px",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: "#ffffff",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            📖 Digital Diary
          </h1>

          {user && (
            <p
              style={{
                margin: "6px 0 0",
                color: "#75685f",
              }}
            >
              Welcome, <strong>{user.name}</strong>
            </p>
          )}
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: "#8b5e3c",
            color: "#ffffff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main
        style={{
          width: "90%",
          maxWidth: "1000px",
          margin: "30px auto",
        }}
      >
        {/* WRITE JOURNAL */}
        <section
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "15px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.08)",
            marginBottom: "35px",
          }}
        >
          <h2>
            {editingId !== null
              ? "✏️ Edit Journal"
              : "📝 Write Your Journal"}
          </h2>

          <form onSubmit={handleSaveJournal}>
            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Journal title"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px",
                marginBottom: "15px",
                border: "1px solid #ddd2c8",
                borderRadius: "8px",
                fontSize: "15px",
              }}
            />

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Write your thoughts here..."
              rows="8"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px",
                marginBottom: "15px",
                border: "1px solid #ddd2c8",
                borderRadius: "8px",
                fontSize: "15px",
                resize: "vertical",
              }}
            />

            <input
              type="text"
              value={mood}
              onChange={(e) =>
                setMood(e.target.value)
              }
              placeholder="Mood"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px",
                marginBottom: "15px",
                border: "1px solid #ddd2c8",
                borderRadius: "8px",
                fontSize: "15px",
              }}
            />

            <input
              type="text"
              value={tags}
              onChange={(e) =>
                setTags(e.target.value)
              }
              placeholder="Tags"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px",
                marginBottom: "15px",
                border: "1px solid #ddd2c8",
                borderRadius: "8px",
                fontSize: "15px",
              }}
            />

            <button
              type="submit"
              style={{
                background: "#8b5e3c",
                color: "#ffffff",
                border: "none",
                padding: "12px 25px",
                borderRadius: "8px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              {editingId !== null
                ? "Update Journal"
                : "Save Journal"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={clearForm}
                style={{
                  background: "#dddddd",
                  color: "#333333",
                  border: "none",
                  padding: "12px 25px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        {/* SAVED JOURNALS */}
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            <h2>📚 Saved Journals</h2>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search journals..."
              style={{
                width: "250px",
                padding: "11px",
                border: "1px solid #ddd2c8",
                borderRadius: "8px",
              }}
            />
          </div>

          {filteredJournals.length === 0 ? (
            <div
              style={{
                background: "#ffffff",
                padding: "45px",
                borderRadius: "15px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "45px" }}>
                📔
              </div>

              <h3>
                {search
                  ? "No journals found"
                  : "No journals yet"}
              </h3>

              <p style={{ color: "#75685f" }}>
                {search
                  ? "Try another search."
                  : "Write your first journal above!"}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {filteredJournals.map(
                (journal) => (
                  <article
                    key={journal.id}
                    style={{
                      background: "#ffffff",
                      padding: "22px",
                      borderRadius: "14px",
                      boxShadow:
                        "0 4px 15px rgba(0,0,0,0.07)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      <h3 style={{ margin: 0 }}>
                        {journal.title}
                      </h3>

                      <div>
                        <button
                          onClick={() =>
                            handleEdit(journal)
                          }
                          style={{
                            marginRight: "8px",
                            padding: "7px 12px",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              journal.id
                            )
                          }
                          style={{
                            padding: "7px 12px",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <p
                      style={{
                        whiteSpace: "pre-wrap",
                        lineHeight: "1.6",
                      }}
                    >
                      {journal.content}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginBottom: "12px",
                      }}
                    >
                      {journal.mood && (
                        <span
                          style={{
                            background: "#f5f1eb",
                            padding: "6px 10px",
                            borderRadius: "20px",
                            fontSize: "13px",
                          }}
                        >
                          😊 {journal.mood}
                        </span>
                      )}

                      {journal.tags && (
                        <span
                          style={{
                            background: "#f5f1eb",
                            padding: "6px 10px",
                            borderRadius: "20px",
                            fontSize: "13px",
                          }}
                        >
                          🏷️ {journal.tags}
                        </span>
                      )}
                    </div>

                    <small
                      style={{
                        color: "#8a7d73",
                      }}
                    >
                      {journal.updated_at
                        ? `Updated: ${journal.updated_at}`
                        : `Created: ${journal.created_at}`}
                    </small>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;