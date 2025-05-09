import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

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
    <Modal show={isModalOpen} onHide={closeEditModal} centered>
      <Modal.Title>
        {selectedBlogId ? "Editar publicacion del publicacion" : "Crear publicacion del blog"}
      </Modal.Title>
      <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Titulo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formContent">
            <Form.Label>Contenido</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formImage">
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
            {image && (
              <div>
                <h4>Preview:</h4>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  style={{ width: "100%", marginBottom: "10px" }}
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {selectedBlogId ? (
          <Button variant="primary" onClick={updateBlogPost}>
            Actualizar
          </Button>
        ) : (
          <Button variant="primary" onClick={createBlogPost}>
            Crear
          </Button>
        )}
        <Button variant="secondary" onClick={closeEditModal}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateEditModal;