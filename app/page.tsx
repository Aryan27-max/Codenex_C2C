'use client';

import { useEffect, useState } from 'react';

interface Entry {
  name: string;
  batch: number;
  venue: string;
  floor: number;
  room: string;
  timestamp: string; // ISO string
}

export default function Home() {
  const [name, setName] = useState('');
  const [batch, setBatch] = useState<number | ''>('');
  const [venue, setVenue] = useState('UB');
  const [floor, setFloor] = useState<number | ''>('');
  const [room, setRoom] = useState('');
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);

  /* Load from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem('completedRooms');
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  /* Save to localStorage */
  useEffect(() => {
    localStorage.setItem('completedRooms', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (!name || !batch || !floor || !room) return;

    const now = new Date();

    setEntries([
      ...entries,
      {
        name,
        batch: Number(batch),
        venue,
        floor: Number(floor),
        room,
        timestamp: now.toISOString(),
      },
    ]);

    setName('');
    setBatch('');
    setFloor('');
    setRoom('');
  };

  const deleteEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filtered = entries.filter(e =>
    `${e.name} batch ${e.batch} ${e.venue} ${e.floor} ${e.room} ${formatDateTime(e.timestamp)}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0b0b0b] to-[#020617] text-white px-4 sm:px-6 flex flex-col items-center">

      {/* Header: Text + Logo */}
      <div className="mt-10 sm:mt-12 mb-8 sm:mb-10 flex items-center gap-4">
        <img
          src="/logo.webp"
          alt="CodeNex Logo"
          className="w-15 sm:w-15 drop-shadow-lg"
        />
        <span className="text-2xl sm:text-3xl font-semibold tracking-tight">
          CodeNex
        </span>
      </div>

      {/* Card */}
      <section className="w-full max-w-6xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold mb-1">
          Class Coverage Tracker
        </h1>
        <p className="text-zinc-400 mb-6 sm:mb-8 text-sm sm:text-base">
          Track completed rooms with contributor, batch & time details
        </p>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
          <Field label="Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Volunteer name"
              className="input"
            />
          </Field>

          <Field label="Batch">
            <select
              value={batch}
              onChange={(e) => setBatch(Number(e.target.value))}
              className="input"
            >
              <option value="">Select</option>
              <option value="1">Batch 1</option>
              <option value="2">Batch 2</option>
            </select>
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
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value))}
              placeholder="e.g. 2"
              className="input"
            />
          </Field>

          <Field label="Room No.">
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="1 – 9"
              className="input"
            />
          </Field>

          <button
            onClick={addEntry}
            className="h-[44px] mt-2 sm:mt-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold active:scale-95 transition"
          >
            Mark Completed
          </button>
        </div>
      </section>

      {/* Search */}
      <div className="w-full max-w-6xl mt-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, batch, venue, room or time…"
          className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
        />
      </div>

      {/* Table */}
      <section className="w-full max-w-6xl mt-6 overflow-x-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="text-zinc-400 bg-white/5">
            <tr>
              <th className="px-5 py-4 text-left">Name</th>
              <th className="px-5 py-4 text-left">Batch</th>
              <th className="px-5 py-4 text-left">Venue</th>
              <th className="px-5 py-4 text-left">Floor</th>
              <th className="px-5 py-4 text-left">Room</th>
              <th className="px-5 py-4 text-left">Date & Time</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-zinc-500">
                  No rooms completed yet
                </td>
              </tr>
            )}

            {filtered.map((e, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="px-5 py-4">{e.name}</td>
                <td className="px-5 py-4">Batch {e.batch}</td>
                <td className="px-5 py-4">{e.venue}</td>
                <td className="px-5 py-4">{e.floor}</td>
                <td className="px-5 py-4">{e.room}</td>
                <td className="px-5 py-4 whitespace-nowrap">
                  {formatDateTime(e.timestamp)}
                </td>
                <td className="px-5 py-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Completed
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => deleteEntry(i)}
                    className="text-red-400 hover:text-red-500 text-sm font-medium"
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
      <footer className="mt-auto py-8 text-zinc-500 text-sm">
        MADE WITH ❤️ by{' '}
        <a
          href="https://github.com/Aryan27-max"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:underline"
        >
          Aryan Gupta
        </a>
      </footer>

      {/* Page-only styles */}
      <style jsx global>{`
        .input {
          width: 100%;
          height: 44px;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 0 0.75rem;
          font-size: 0.875rem;
          color: #f9fafb;
        }

        .input:focus {
          outline: none;
          border-color: rgba(34, 211, 238, 0.6);
          box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.2);
        }

        /* Dropdown option contrast fix */
        select option {
          color: #111827;
          background-color: #ffffff;
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-400">{label}</label>
      {children}
    </div>
  );
}
