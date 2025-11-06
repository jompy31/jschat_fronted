import React from "react";
import "./CreateEditModal.css";
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
      backdrop="static"
      keyboard={false}
      dialogClassName="create-edit-modal-dialog"
      contentClassName="create-edit-modal-content"
      className="create-edit-modal"
      style={{ zIndex: 2000 }}
    >
      {/* Backdrop oscuro con blur */}
      <div className="modal-backdrop-full" onClick={closeEditModal} />

      <div className="modal-full-container">
        <Modal.Header className="modal-header-custom border-0 px-6 py-4 flex justify-between items-center">
          <Modal.Title className="modal-title-custom">
            {selectedBlogId ? "Editar Publicación" : "Crear Nueva Publicación"}
          </Modal.Title>
          <button
            type="button"
            className="close-button-custom"
            onClick={closeEditModal}
            aria-label="Cerrar"
          >
            ×
          </button>
        </Modal.Header>

        <Modal.Body className="modal-body-custom p-0 flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-0 h-full">
            {/* Lado izquierdo: Formulario (oscuro) */}
            <div className="form-panel-custom p-8">
              <Form>
                <Form.Group className="mb-6">
                  <Form.Label className="form-label-custom text-white">Título</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input-custom bg-white text-gray-900"
                  />
                </Form.Group>

                <Form.Group className="mb-6">
                  <Form.Label className="form-label-custom text-white">Contenido</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    placeholder="Escribe el contenido de tu publicación..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="form-input-custom bg-white text-gray-900 resize-none"
                  />
                </Form.Group>

                <Form.Group className="mb-6">
                  <Form.Label className="form-label-custom text-white">Imagen</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="form-file-custom text-white"
                  />
                </Form.Group>
              </Form>
            </div>

            {/* Lado derecho: Vista previa */}
            <div className="p-8 bg-gray-50">
              <h4 className="preview-title mb-5 text-xl font-bold text-gray-800">Vista Previa</h4>
              <Card className="preview-card-custom shadow-xl border-0 overflow-hidden h-full">
                {image ? (
                  <div className="preview-image-container">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt="Vista previa"
                      className="preview-image"
                    />
                  </div>
                ) : (
                  <div className="preview-placeholder bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-48 flex items-center justify-center text-gray-400 text-lg">
                    Sin imagen
                  </div>
                )}
                <Card.Body className="p-6">
                  <Card.Title className="preview-post-title text-xl">
                    {title || "Título de la publicación"}
                  </Card.Title>
                  <p className="preview-post-content text-gray-600">
                    {content || "Aquí aparecerá el contenido de tu publicación..."}
                  </p>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="modal-footer-custom border-0 px-6 py-4 bg-white justify-end gap-4">
          <Button
            variant="light"
            onClick={closeEditModal}
            className="btn-cancel-custom text-gray-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={selectedBlogId ? updateBlogPost : createBlogPost}
            className="btn-submit-custom"
          >
            {selectedBlogId ? "Actualizar" : "Publicar"}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default CreateEditModal;