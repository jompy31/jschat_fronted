import React from "react";
import { Modal, Form, Button, Card, Image } from "react-bootstrap";

const CreateEditModal = ({
  isModalOpen,
  closeEditModal,
  selectedBlogId,
  title,
  setTitle,
  content,
  setContent,
  image,
  setImage,
  createBlogPost,
  updateBlogPost,
}) => {
  return (
    <Modal
      show={isModalOpen}
      onHide={closeEditModal}
      centered
      dialogClassName="modal-80w"
      backdrop="static"
      style={{ zIndex: 1500 }}
      animation
    >
      <Modal.Header
        closeButton
        style={{
          backgroundColor: "#fff", // Ensure white background
          borderBottom: "1px solid #e0e0e0", // Match footer border
          padding: "15px 20px",
        }}
      >
        <Modal.Title style={{ fontSize: "1.5rem", color: "#1c2526" }}>
          {selectedBlogId ? "Editar Publicación" : "Crear Nueva Publicación"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px 8px 0 0", // Rounded top corners
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
          {/* Form Section */}
          <div style={{ flex: 1 }}>
            <Form>
              <Form.Group controlId="formTitle" style={{ marginBottom: "15px" }}>
                <Form.Label style={{ fontWeight: "500", color: "#1c2526" }}>
                  Título
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el título"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    borderRadius: "8px",
                    padding: "10px",
                    fontSize: "15px",
                    border: "1px solid #ced0d4",
                  }}
                />
              </Form.Group>
              <Form.Group
                controlId="formContent"
                style={{ marginBottom: "15px" }}
              >
                <Form.Label style={{ fontWeight: "500", color: "#1c2526" }}>
                  Contenido
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Ingresa el contenido"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{
                    borderRadius: "8px",
                    padding: "10px",
                    fontSize: "15px",
                    border: "1px solid #ced0d4",
                  }}
                />
              </Form.Group>
              <Form.Group
                controlId="formImage"
                style={{ marginBottom: "15px" }}
              >
                <Form.Label style={{ fontWeight: "500", color: "#1c2526" }}>
                  Imagen
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  style={{
                    borderRadius: "8px",
                    padding: "10px",
                    fontSize: "15px",
                    border: "1px solid #ced0d4",
                  }}
                />
              </Form.Group>
            </Form>
          </div>
          {/* Live Preview Section */}
          <div style={{ flex: 1, maxWidth: "400px" }}>
            <h4
              style={{
                fontSize: "16px",
                color: "#1c2526",
                marginBottom: "15px",
                fontWeight: "500",
              }}
            >
              Vista Previa
            </h4>
            <Card
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
              }}
            >
              {image && (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "150px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    fluid
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <Card.Body style={{ padding: "15px" }}>
                <Card.Title
                  style={{
                    fontWeight: "600",
                    fontSize: "1.2rem",
                    color: "#1c2526",
                    marginBottom: "10px",
                  }}
                >
                  {title || "Título de la publicación"}
                </Card.Title>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#606770",
                    whiteSpace: "pre-wrap",
                    marginBottom: "10px",
                  }}
                >
                  {content || "Contenido de la publicación"}
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer
        style={{
          backgroundColor: "#fff", // Ensure white background
          borderTop: "1px solid #e0e0e0",
          padding: "15px 20px",
          borderRadius: "0 0 8px 8px", // Rounded bottom corners
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
        }}
      >
        <Button
          variant="secondary"
          onClick={closeEditModal}
          style={{
            borderRadius: "8px",
            padding: "8px 20px",
            fontSize: "14px",
            backgroundColor: "#6c757d", // Consistent secondary color
            border: "none",
            marginRight: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Button shadow
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={selectedBlogId ? updateBlogPost : createBlogPost}
          style={{
            borderRadius: "8px",
            padding: "8px 20px",
            fontSize: "14px",
            backgroundColor: "#007bff", // Consistent primary color
            border: "none",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Button shadow
          }}
        >
          {selectedBlogId ? "Actualizar" : "Crear"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateEditModal;