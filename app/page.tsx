'use client';

import { useEffect, useState } from 'react';

interface Entry {
  name: string;
  venue: string;
  floor: number;
  room: string;
}

export default function Home() {
  const [name, setName] = useState('');
  const [venue, setVenue] = useState('UB');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('completedRooms');
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('completedRooms', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (!name || !room || !floor) return;

    setEntries([
      ...entries,
      { name, venue, floor: Number(floor), room }
    ]);

    setName('');
    setRoom('');
    setFloor('');
  };

  const deleteEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const filtered = entries.filter(e =>
    `${e.name} ${e.venue} ${e.floor} ${e.room}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0b0b0b] to-[#020617] text-white px-6 flex flex-col items-center">

      {/* Logo */}
      <div className="mt-12 mb-10">
        <img src="/codenex-logo.webp" alt="CodeNex" className="w-29 mx-auto drop-shadow-lg" />
      </div>

      {/* Main Card */}
      <section className="w-full max-w-5xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
        <h1 className="text-2xl font-semibold mb-1">
          Class Coverage Tracker
        </h1>
        <p className="text-zinc-400 mb-8">
          Track completed rooms with contributor details
        </p>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Field label="Name">
            <input
              type="text"
              placeholder="Volunteer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Venue">
            <select
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="input"
            >
              <option>UB</option>
              <option>TP1</option>
              <option>TP2</option>
            </select>
          </Field>

          <Field label="Floor">
            <input
              type="number"
              placeholder="e.g. 2"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Room No.">
            <input
              type="text"
              placeholder="1 – 9"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="input"
            />
          </Field>

          <button
            onClick={addEntry}
            className="mt-7 h-[44px] rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:scale-[1.02] active:scale-[0.98] transition"
          >
            Mark Completed
          </button>
        </div>
      </section>

      {/* Search */}
      <div className="w-full max-w-5xl mt-10">
        <input
          type="text"
          placeholder="Search by name, venue, floor or room…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
        />
      </div>

      {/* Table */}
      <section className="w-full max-w-5xl mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-zinc-400">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Venue</th>
              <th className="px-6 py-4 text-left">Floor</th>
              <th className="px-6 py-4 text-left">Room</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">
                  No rooms completed yet
                </td>
              </tr>
            )}

            {filtered.map((e, i) => (
              <tr
                key={i}
                className="border-t border-white/10 hover:bg-white/5 transition group"
              >
                <td className="px-6 py-4">{e.name}</td>
                <td className="px-6 py-4">{e.venue}</td>
                <td className="px-6 py-4">{e.floor}</td>
                <td className="px-6 py-4">{e.room}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteEntry(i)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 text-zinc-500 text-sm">
        MADE WITH ❤️ by Aryan Gupta
      </footer>

      {/* Styles */}
      <style jsx>{`
        .input {
          width: 100%;
          height: 44px;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 0 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: rgba(34, 211, 238, 0.6);
          box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.2);
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-400">{label}</label>
      {children}
    </div>
  );
}
