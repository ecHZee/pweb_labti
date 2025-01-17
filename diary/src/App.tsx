import { useState, useEffect, SetStateAction } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import axios from "axios";
import "./App.css";

function App() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date());
  const [editMode, setEditMode] = useState(false);
  const [currentEntryId, setCurrentEntryId] = useState(null);

  const currentTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
  axios.defaults.baseURL = "http://localhost:5000";
  // Fetch entries on load
  useEffect(() => {
    axios
      .get("/api/entries") // Replace with your actual endpoint
      .then((response) => {
        setEntries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching entries:", error);
      });
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const newEntry = {
      id: editMode ? currentEntryId : Date.now(),
      title,
      content,
      date: date.toISOString(),
    };

    try {
      if (editMode) {
        await axios.put(`/api/entries/${currentEntryId}`, newEntry);
        setEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry.id === currentEntryId ? newEntry : entry
          )
        );
      } else {
        await axios.post("/api/entries", newEntry);
        setEntries([...entries, newEntry]);
      }
      setTitle("");
      setContent("");
      setDate(new Date());
      setEditMode(false);
    } catch (error) {
      console.error("Error saving entry:", error);
    }
  };

  const handleEdit = (id: SetStateAction<null>) => {
    const entryToEdit = entries.find((entry) => entry.id === id);
    if (entryToEdit) {
      setTitle(entryToEdit.title);
      setContent(entryToEdit.content);
      setDate(new Date(entryToEdit.date));
      setEditMode(true);
      setCurrentEntryId(id);
    }
  };

  const handleDelete = async (id: unknown) => {
    try {
      await axios.delete(`/api/entries/${id}`);
      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-10 bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-4xl font-bold text-purple-600 mb-2">
              -My Diary-
            </h1>
            <p className="text-gray-600 text-lg">{currentTime}</p>
          </header>
          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Daftar Catatan
              </h2>
              {entries.length > 0 ? (
                <div className="space-y-6">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-xl font-semibold text-purple-600 mb-2">
                        {entry.title}
                      </h3>
                      <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                        {entry.content}
                      </p>
                      <div className="flex justify-between items-center">
                        <small className="text-gray-500">
                          {moment(entry.date).format("MMMM Do YYYY, h:mm:ss a")}
                        </small>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEdit(entry.id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            Ubah
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Belum ada catatan.
                </p>
              )}
            </section>
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {editMode ? "Edit Catatan" : "Tambah Catatan"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Judul:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Masukkan judul catatan..."
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Isi:</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="5"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Masukkan isi catatan..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Tanggal:</label>
                  <Calendar
                    onChange={(value) => setDate(value)}
                    value={date}
                    minDate={new Date(2020, 0, 1)}
                    maxDate={new Date()}
                    className="rounded-lg border border-blue-300 p-2 w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  {editMode ? "Perbarui Catatan" : "Tambah Catatan"}
                </button>
              </form>
            </section>
          </main>
          <footer className="text-center mt-10 text-gray-600">
            <p>&copy; Tugas Pemrograman Web.</p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
