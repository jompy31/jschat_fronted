// PointsManager.jsx
import React, { useEffect, useState } from "react";
import "../../../components/backend/customer_points/puntos.css"; // Asegúrate de la ruta según tu estructura

const sampleData = [
  { id: 1, name: "Juan Pérez", email: "juan@example.com", points: 120 },
  { id: 2, name: "Ana Gómez", email: "ana@example.com", points: 340 },
  { id: 3, name: "Carlos López", email: "carlos@example.com", points: 75 },
];

const emptyForm = { id: null, name: "", email: "", points: 0 };

export default function PointsManager() {
  const [clients, setClients] = useState(() => {
    // Intenta recuperar de localStorage si quieres persistencia
    const saved = localStorage.getItem("jsport_clients_v1");
    return saved ? JSON.parse(saved) : sampleData;
  });
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  useEffect(() => {
    localStorage.setItem("jsport_clients_v1", JSON.stringify(clients));
  }, [clients]);

  // Handlers
  const openAdd = () => {
    setForm(emptyForm);
    setEditing(false);
    setModalOpen(true);
  };

  const openEdit = (client) => {
    setForm({ ...client });
    setEditing(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "points" ? Math.max(0, Number(value || 0)) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación simple
    if (!form.name.trim() || !form.email.trim()) {
      alert("Por favor completa nombre y correo.");
      return;
    }
    if (editing) {
      setClients((prev) => prev.map((c) => (c.id === form.id ? { ...form } : c)));
    } else {
      const nextId = clients.length ? Math.max(...clients.map((c) => c.id)) + 1 : 1;
      setClients((prev) => [{ ...form, id: nextId }, ...prev]);
    }
    closeModal();
  };

  const askDelete = (id) => setConfirmDelete({ open: true, id });
  const cancelDelete = () => setConfirmDelete({ open: false, id: null });

  const doDelete = () => {
    setClients((prev) => prev.filter((c) => c.id !== confirmDelete.id));
    cancelDelete();
  };

  const addPoints = (id, delta) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, points: Math.max(0, c.points + delta) } : c)));
  };

  // Filtering & sorting
  const filtered = clients
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.points - a.points);

  return (
    <div className="pm-wrapper">
      <header className="pm-header">
        <div className="pm-title">
          <h2>Gestión de Puntos — Clientes</h2>
          <p className="pm-sub">Control de puntos</p>
        </div>

        <div className="pm-actions">
          <div className="pm-search">
            <input
              type="search"
              placeholder="Buscar por nombre o correo..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar clientes"
            />
          </div>
          <button className="btn btn-add" onClick={openAdd}>+ Nuevo Cliente</button>
        </div>
      </header>

      <main className="pm-main">
        <div className="pm-grid">
          {filtered.length === 0 ? (
            <div className="pm-empty">
              <strong>No hay clientes</strong>
              <p>Agrega nuevos clientes o limpia el filtro de búsqueda.</p>
              <button className="btn btn-ghost" onClick={() => { setQuery(""); }}>Limpiar filtro</button>
            </div>
          ) : (
            filtered.map((c) => (
              <article className="pm-card" key={c.id} role="region" aria-labelledby={`client-${c.id}`}>
                <div className="pm-card-top">
                  <div className="avatar" aria-hidden>
                    {c.name.split(" ").map((n) => n[0]).slice(0,2).join("").toUpperCase()}
                  </div>
                  <div className="client-meta">
                    <h3 id={`client-${c.id}`}>{c.name}</h3>
                    <a href={`mailto:${c.email}`} className="client-email">{c.email}</a>
                  </div>
                </div>

                <div className="pm-card-body">
                  <div className="points-box">
                    <span className="points-number">{c.points}</span>
                    <span className="points-label">Puntos</span>
                  </div>

                  <div className="quick-actions">
                    <button className="small btn-outline" onClick={() => addPoints(c.id, 10)}>+10</button>
                    <button className="small btn-outline" onClick={() => addPoints(c.id, -10)}>-10</button>
                  </div>
                </div>

                <footer className="pm-card-footer">
                  <div className="btn-row">
                    <button className="btn btn-edit" onClick={() => openEdit(c)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => askDelete(c.id)}>Eliminar</button>
                  </div>
                </footer>
              </article>
            ))
          )}
        </div>
      </main>

      {/* Modal (Add / Edit) */}
      {modalOpen && (
        <div className="pm-modal" role="dialog" aria-modal="true" aria-label={editing ? "Editar cliente" : "Añadir cliente"}>
          <div className="pm-modal-backdrop" onClick={closeModal} />
          <div className="pm-modal-panel" role="document">
            <button className="modal-close" onClick={closeModal} aria-label="Cerrar">✕</button>
            <h3>{editing ? "Editar Cliente" : "Nuevo Cliente"}</h3>
            <form onSubmit={handleSubmit} className="pm-form">
              <label>
                Nombre
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>

              <label>
                Correo
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </label>

              <label>
                Puntos
                <input name="points" type="number" min="0" value={form.points} onChange={handleChange} />
              </label>

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editing ? "Guardar cambios" : "Crear cliente"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete.open && (
        <div className="pm-modal" role="alertdialog" aria-modal="true">
          <div className="pm-modal-backdrop" onClick={cancelDelete} />
          <div className="pm-modal-panel pm-panel-confirm">
            <h3>Confirmar eliminación</h3>
            <p>¿Eliminar este cliente y sus puntos? Esta acción no se puede deshacer.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={cancelDelete}>Cancelar</button>
              <button className="btn btn-danger" onClick={doDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
