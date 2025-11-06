// frontend_github/jschat_fronted/src/components/backend/customer_points/index.js
import React, { useEffect, useState, useCallback } from "react";
import "../../../components/backend/customer_points/puntos.css";
import ProductDataService from "../../../services/products";
import { useSelector } from "react-redux";

const emptyPointForm = {
  points: 0,
  reason: "",
  config: "",
  tags: [],
};

const emptyConfigForm = {
  name: "",
  points_per_amount: 1,
  amount_threshold: 10000,
  multiplier: 1.0,
  start_date: "",
  end_date: "",
  is_active: true,
  is_default: false,
};

export default function PointsManager() {
  const token = useSelector((state) => state.authentication.token);
  const [clients, setClients] = useState([]);
  const [pointConfigs, setPointConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pointsModalOpen, setPointsModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [configFormMode, setConfigFormMode] = useState("create");
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [pointForm, setPointForm] = useState(emptyPointForm);
  const [configForm, setConfigForm] = useState(emptyConfigForm);
  const [pointHistory, setPointHistory] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, type: "" });
  const [availableTags, setAvailableTags] = useState([]); // Para tags

  // === CARGAR TAGS ===
  const fetchTags = useCallback(async () => {
    try {
      const res = await ProductDataService.getAllTags(token);
      setAvailableTags(res.data.results || res.data);
    } catch (err) {
      console.warn("Error cargando tags", err);
    }
  }, [token]);

  // === CARGAR CLIENTES CON PUNTOS ===
  const fetchClients = useCallback(async () => {
    try {
      const response = await ProductDataService.getAllCustomers(token);
      const customers = response.data.results || response.data;

      const customersWithPoints = await Promise.all(
        customers.map(async (c) => {
          try {
            const pointsRes = await ProductDataService.getCustomerPoints(c.id, token);
            const customerPointsEntries = (pointsRes.data.results || []).filter(
              (entry) => entry.customer === c.id
            );
            const totalPoints = customerPointsEntries.reduce((sum, p) => sum + p.points, 0);
            return { ...c, points: totalPoints };
          } catch (err) {
            console.warn(`Error puntos cliente ${c.id}`, err);
            return { ...c, points: 0 };
          }
        })
      );
      setClients(customersWithPoints);
    } catch (error) {
      console.error("Error clientes:", error);
    }
  }, [token]);

  // === CARGAR CONFIGURACIONES ===
  const fetchPointConfigs = useCallback(async () => {
    try {
      const response = await ProductDataService.getAllPointConfigs(token);
      const configs = response.data.results || response.data;
      setPointConfigs(configs);
    } catch (error) {
      console.error("Error al cargar point configs:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // === CARGAR HISTORIAL ===
  const fetchPointHistory = async (customerId) => {
    try {
      const response = await ProductDataService.getPointsHistory(customerId, token);
      setPointHistory(response.data.results || response.data);
    } catch (error) {
      console.error("Error historial:", error);
      setPointHistory([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchClients();
      fetchPointConfigs();
      fetchTags();
    }
  }, [token, fetchClients, fetchPointConfigs, fetchTags]);

  // === FILTRO CLIENTES ===
  const filtered = clients
    .filter((c) =>
      c.name?.toLowerCase().includes(query.toLowerCase()) ||
      c.email?.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  // === ABRIR MODAL DE PUNTOS (con datos precargados si es edición) ===
  const openPointsModal = (client, entry = null) => {
    setSelectedClient(client);
    if (entry) {
      setPointForm({
        points: entry.points,
        reason: entry.reason || "",
        config: entry.config || "",
        tags: entry.tags || [],
        id: entry.id, // Para edición
      });
    } else {
      setPointForm(emptyPointForm);
    }
    setPointsModalOpen(true);
  };

  const openHistoryModal = async (client) => {
    setSelectedClient(client);
    await fetchPointHistory(client.id);
    setHistoryModalOpen(true);
  };

  const openCreateConfig = () => {
    setConfigFormMode("create");
    setSelectedConfig(null);
    setConfigForm(emptyConfigForm);
    setConfigModalOpen(true);
  };

  const openEditConfig = (config) => {
    setConfigFormMode("edit");
    setSelectedConfig(config);
    setConfigForm({
      name: config.name || "",
      points_per_amount: config.points_per_amount || 1,
      amount_threshold: config.amount_threshold || 10000,
      multiplier: config.multiplier || 1.0,
      start_date: config.start_date || "",
      end_date: config.end_date || "",
      is_active: config.is_active ?? true,
      is_default: config.is_default ?? false,
    });
    setConfigModalOpen(true);
  };

  const closeConfigModal = () => {
    setConfigModalOpen(false);
    setSelectedConfig(null);
  };

  // === GESTIÓN DE PUNTOS (AGREGAR / EDITAR) ===
  const handleSubmitPoints = async (e) => {
    e.preventDefault();
    if (!pointForm.points || pointForm.points === 0) return;

    try {
      const payload = {
        points: parseInt(pointForm.points),
        reason: pointForm.reason,
        config: pointForm.config || null,
        tags: pointForm.tags,
      };

      if (pointForm.id) {
        // Editar entrada existente
        await ProductDataService.updateCustomerPoint(pointForm.id, payload, token);
      } else {
        // Crear nueva
        await ProductDataService.addPointsToCustomer(selectedClient.id, payload, token);
      }

      await fetchClients();
      setPointsModalOpen(false);
      alert(pointForm.id ? "Punto actualizado" : "Puntos aplicados correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al guardar puntos: " + (error.response?.data?.detail || "Intenta de nuevo"));
    }
  };

  // === CONFIGURACIONES ===
  const handleSavePointConfig = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: configForm.name,
        points_per_amount: parseInt(configForm.points_per_amount) || 1,
        amount_threshold: parseFloat(configForm.amount_threshold) || 10000,
        multiplier: parseFloat(configForm.multiplier) || 1.0,
        start_date: configForm.start_date || null,
        end_date: configForm.end_date || null,
        is_active: configForm.is_active,
        is_default: configForm.is_default,
      };

      if (configFormMode === "create") {
        await ProductDataService.createPointConfig(payload, token);
      } else {
        await ProductDataService.updatePointConfig(selectedConfig.id, payload, token);
      }
      await fetchPointConfigs();
      closeConfigModal();
      alert("Configuración guardada");
    } catch (error) {
      console.error("Error config:", error.response?.data || error);
      alert("Error: " + (error.response?.data?.detail || "Datos inválidos"));
    }
  };

  // === ELIMINAR ===
  const askDeleteConfig = (id) => setConfirmDelete({ open: true, id, type: "config" });
  const askDeleteClient = (id) => setConfirmDelete({ open: true, id, type: "client" });
  const askDeletePointEntry = (entryId) => setConfirmDelete({ open: true, id: entryId, type: "point" });

  const doDelete = async () => {
    try {
      if (confirmDelete.type === "config") {
        await ProductDataService.deletePointConfig(confirmDelete.id, token);
        await fetchPointConfigs();
      } else if (confirmDelete.type === "client") {
        await ProductDataService.deleteCustomer(confirmDelete.id, token);
        setClients(prev => prev.filter(c => c.id !== confirmDelete.id));
      } else if (confirmDelete.type === "point") {
        await ProductDataService.deleteCustomerPoint(confirmDelete.id, token);
        await fetchClients();
      }
      setConfirmDelete({ open: false, id: null, type: "" });
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  // === TOGGLE ACTIVO / DEFAULT ===
  const toggleActive = async (id, currentActive) => {
    try {
      if (currentActive) {
        await ProductDataService.updatePointConfig(id, { is_active: false }, token);
      } else {
        await ProductDataService.setActivePointConfig(id, token);
      }
      await fetchPointConfigs();
    } catch (error) {
      alert("Error al cambiar estado");
    }
  };

  const setAsDefault = async (id) => {
    try {
      await ProductDataService.setDefaultPointConfig(id, token);
      await fetchPointConfigs();
    } catch (error) {
      alert("Error al establecer predeterminado");
    }
  };

  const removeDefault = async (id) => {
    try {
      await ProductDataService.updatePointConfig(id, { is_default: false }, token);
      await fetchPointConfigs();
    } catch (error) {
      alert("Error al quitar predeterminado");
    }
  };

  if (loading) return <div className="pm-loading">Cargando...</div>;

  return (
    <div className="pm-wrapper">
      {/* HEADER */}
      <header className="pm-header">
        <div className="pm-title">
          <h2>Gestión de Puntos</h2>
          <p className="pm-sub">Fidelización y configuraciones</p>
        </div>
        <div className="pm-actions">
          <div className="pm-search">
            <input
              type="search"
              placeholder="Buscar cliente..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-add" onClick={() => setModalOpen(true)}>
            + Nuevo Cliente
          </button>
          <button className="btn btn-ghost" onClick={openCreateConfig}>
            + Nueva Config
          </button>
        </div>
      </header>

      {/* CONFIGURACIONES */}
      <section className="pm-section">
        <h3>Configuraciones de Puntos</h3>
        <div className="pm-config-grid">
          {pointConfigs.length === 0 ? (
            <p className="text-muted">No hay configuraciones.</p>
          ) : (
            pointConfigs.map((cfg) => (
              <div key={cfg.id} className={`pm-config-card ${cfg.is_active ? "active" : ""}`}>
                <div className="pm-config-header">
                  <h4>{cfg.name}</h4>
                  <div className="pm-badges">
                    {cfg.is_active && <span className="badge badge-success">Activa</span>}
                    {cfg.is_default && <span className="badge badge-primary">Por Defecto</span>}
                  </div>
                </div>
                <div className="pm-config-details">
                  <p><strong>Tasa:</strong> {cfg.points_per_amount} punto(s) por ₡{cfg.amount_threshold}</p>
                  <p><strong>Multiplicador:</strong> {cfg.multiplier}x</p>
                  {cfg.start_date && cfg.end_date && (
                    <p><strong>Vigencia:</strong> {cfg.start_date} → {cfg.end_date}</p>
                  )}
                </div>
                <div className="pm-config-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => openEditConfig(cfg)}>Editar</button>
                  <button
                    className={`btn ${cfg.is_active ? "btn-warning" : "btn-success"} btn-sm`}
                    onClick={() => toggleActive(cfg.id, cfg.is_active)}
                  >
                    {cfg.is_active ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    className={`btn ${cfg.is_default ? "btn-secondary" : "btn-info"} btn-sm`}
                    onClick={() => cfg.is_default ? removeDefault(cfg.id) : setAsDefault(cfg.id)}
                  >
                    {cfg.is_default ? "Quitar Defecto" : "Por Defecto"}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => askDeleteConfig(cfg.id)}>Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CLIENTES */}
      <main className="pm-main">
        <div className="pm-grid">
          {filtered.map((c) => (
            <article className="pm-card" key={c.id}>
              <div className="pm-card-top">
                <div className="avatar">
                  {c.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "NA"}
                </div>
                <div className="client-meta">
                  <h3>{c.name}</h3>
                  <a href={`mailto:${c.email}`} className="client-email">{c.email}</a>
                </div>
              </div>
              <div className="pm-card-body">
                <div className="points-box">
                  <span className="points-number">{c.points || 0}</span>
                  <span className="points-label">Puntos</span>
                </div>
                <div className="quick-actions">
                  <button className="btn-outline" onClick={() => openPointsModal(c)}>+ Puntos</button>
                  <button className="btn-outline btn-outline-secondary" onClick={() => openHistoryModal(c)}>
                    Historial
                  </button>
                </div>
              </div>
              <footer className="pm-card-footer">
                <button className="btn btn-primary" onClick={() => openPointsModal(c)}>Gestionar</button>
                <button className="btn btn-danger" onClick={() => askDeleteClient(c.id)}>Eliminar</button>
              </footer>
            </article>
          ))}
        </div>
      </main>

      {/* MODALES */}
      {modalOpen && <CustomerModal token={token} onClose={() => setModalOpen(false)} onSuccess={fetchClients} />}
      {pointsModalOpen && selectedClient && (
        <PointsModal
          client={selectedClient}
          pointForm={pointForm}
          setPointForm={setPointForm}
          configs={pointConfigs}
          tags={availableTags}
          onSubmit={handleSubmitPoints}
          onClose={() => setPointsModalOpen(false)}
        />
      )}
      {historyModalOpen && selectedClient && (
        <HistoryModal
          client={selectedClient}
          history={pointHistory}
          onClose={() => setHistoryModalOpen(false)}
          onEdit={(entry) => {
            setHistoryModalOpen(false);
            openPointsModal(selectedClient, entry);
          }}
          onDelete={askDeletePointEntry}
        />
      )}
      {configModalOpen && (
        <PointConfigModal
          mode={configFormMode}
          form={configForm}
          setForm={setConfigForm}
          onSubmit={handleSavePointConfig}
          onClose={closeConfigModal}
        />
      )}
      {confirmDelete.open && (
        <ConfirmDeleteModal
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete({ open: false })}
          message={
            confirmDelete.type === "config" ? "esta configuración" :
            confirmDelete.type === "client" ? "este cliente" : "esta entrada de puntos"
          }
        />
      )}
    </div>
  );
}

// === MODAL DE PUNTOS (CORREGIDO) ===
function PointsModal({ client, pointForm, setPointForm, configs, tags, onSubmit, onClose }) {
  return (
    <div className="pm-modal">
      <div className="pm-modal-backdrop" onClick={onClose} />
      <div className="pm-modal-panel">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>{pointForm.id ? "Editar Punto" : "Agregar/Quitar Puntos"}</h3>
        <p><strong>{client.name}</strong> - Total: {client.points} puntos</p>
        <form onSubmit={onSubmit} className="pm-form">
          <label>
            Puntos (+ para sumar, - para restar)
            <input
              type="number"
              value={pointForm.points}
              onChange={e => setPointForm({ ...pointForm, points: e.target.value })}
              required
            />
          </label>

          <label>
            Motivo
            <input
              type="text"
              value={pointForm.reason}
              onChange={e => setPointForm({ ...pointForm, reason: e.target.value })}
              placeholder="Ej: Compra #123, Bono navidad"
              required
            />
          </label>

          {/* <label>
            Configuración (opcional)
            <select
              value={pointForm.config}
              onChange={e => setPointForm({ ...pointForm, config: e.target.value })}
            >
              <option value="">Ninguna</option>
              {configs.map(cfg => (
                <option key={cfg.id} value={cfg.id}>{cfg.name}</option>
              ))}
            </select>
          </label>

          <label>
            Etiquetas (opcional)
            <select
              multiple
              value={pointForm.tags}
              onChange={e => {
                const selected = Array.from(e.target.selectedOptions, o => o.value);
                setPointForm({ ...pointForm, tags: selected });
              }}
            >
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
            <small>Ctrl+Clic para seleccionar múltiples</small>
          </label> */}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              {pointForm.id ? "Actualizar" : "Aplicar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// === HISTORIAL CON EDICIÓN Y ELIMINACIÓN ===
function HistoryModal({ client, history, onClose, onEdit, onDelete }) {
  return (
    <div className="pm-modal">
      <div className="pm-modal-backdrop" onClick={onClose} />
      <div className="pm-modal-panel pm-panel-history">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Historial - {client.name}</h3>
        <div className="history-list">
          {history.length === 0 ? (
            <p className="text-muted">No hay movimientos</p>
          ) : (
            history.map((h) => (
              <div key={h.id} className="history-item">
                <div className={`history-amount ${h.points > 0 ? 'add' : 'remove'}`}>
                  {h.points > 0 ? '+' : ''}{h.points}
                </div>
                <div className="history-details">
                  <strong>{h.reason || "Sin motivo"}</strong>
                  <small>{new Date(h.earned_at).toLocaleString()}</small>
                  {h.config && <p className="tag">Config: {h.config_name || h.config}</p>}
                  {h.tags?.length > 0 && (
                    <p className="tag-list">
                      {h.tags.map(t => t.name || t).join(", ")}
                    </p>
                  )}
                </div>
                <div className="history-actions">
                  <button className="btn btn-sm btn-outline" onClick={() => onEdit(h)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(h.id)}>Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

// === MODALES RESTANTES (sin cambios importantes) ===
function PointConfigModal({ mode, form, setForm, onSubmit, onClose }) {
  return (
    <div className="pm-modal">
      <div className="pm-modal-backdrop" onClick={onClose} />
      <div className="pm-modal-panel">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>{mode === "create" ? "Nueva Configuración" : "Editar Configuración"}</h3>
        <form onSubmit={onSubmit} className="pm-form">
          <label>Nombre <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Puntos por cada ₡ <input type="number" min="1" value={form.points_per_amount} onChange={e => setForm({ ...form, points_per_amount: e.target.value })} required /></label>
          <label>Umbral (₡) <input type="number" step="0.01" min="0" value={form.amount_threshold} onChange={e => setForm({ ...form, amount_threshold: e.target.value })} required /></label>
          <label>Multiplicador <input type="number" step="0.01" min="0.1" value={form.multiplier} onChange={e => setForm({ ...form, multiplier: e.target.value })} required /></label>
          <label>Fecha inicio <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} /></label>
          <label>Fecha fin <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} /></label>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{mode === "create" ? "Crear" : "Guardar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ onConfirm, onCancel, message }) {
  return (
    <div className="pm-modal">
      <div className="pm-modal-backdrop" onClick={onCancel} />
      <div className="pm-modal-panel pm-panel-confirm">
        <h3>Confirmar eliminación</h3>
        <p>¿Eliminar {message}? No se puede deshacer.</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

function CustomerModal({ token, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ProductDataService.createCustomer(form, token);
      onSuccess();
      onClose();
    } catch (error) {
      alert("Error al crear cliente");
    }
  };
  return (
    <div className="pm-modal">
      <div className="pm-modal-backdrop" onClick={onClose} />
      <div className="pm-modal-panel">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Nuevo Cliente</h3>
        <form onSubmit={handleSubmit} className="pm-form">
          <label>Nombre <input name="name" value={form.name} onChange={e => setForm({ ...form, [e.target.name]: e.target.value })} required /></label>
          <label>Email <input name="email" type="email" value={form.email} onChange={e => setForm({ ...form, [e.target.name]: e.target.value })} required /></label>
          <label>Teléfono <input name="phone" value={form.phone} onChange={e => setForm({ ...form, [e.target.name]: e.target.value })} /></label>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Crear</button>
          </div>
        </form>
      </div>
    </div>
  );
}