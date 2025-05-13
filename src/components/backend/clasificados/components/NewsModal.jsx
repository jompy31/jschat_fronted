import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';
import PropTypes from 'prop-types';

const NewsModal = ({
  show,
  onHide,
  editMode,
  formData,
  setFormData,
  categories,
  handleSubmit,
}) => {
  const generateOptions = (items) => {
    return items.map((item) => (
      <option key={item.nombre || item} value={item.nombre || item}>
        {item.nombre || item}
      </option>
    ));
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="modal-dialog-scrollable max-w-lg mx-auto"
      backdropClassName="bg-black bg-opacity-90 fixed inset-0 z-40"
      className="z-50"
      aria-labelledby="news-modal-title"
      backdrop="static"
    >
      <div className="bg-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto relative z-50">
        <Modal.Header className="border-b-0 px-6 pt-6 sticky top-0 bg-white z-10">
          <Modal.Title
            id="news-modal-title"
            className="text-2xl font-semibold text-gray-800"
          >
            {editMode ? 'Editar Clasificado' : 'Crear Clasificado'}
          </Modal.Title>
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-2"
            onClick={onHide}
            aria-label="Cerrar modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </Modal.Header>
        <Modal.Body className="p-6 bg-white">
          <Form>
            <Form.Group className="mb-4" controlId="title">
              <Form.Label className="font-medium text-gray-700">
                Título *
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="category">
              <Form.Label className="font-medium text-gray-700">
                Categoría *
              </Form.Label>
              <Form.Control
                as="select"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar Categoría</option>
                {generateOptions(categories)}
              </Form.Control>
            </Form.Group>
            {formData.category && (
              <Form.Group className="mb-4" controlId="subcategory">
                <Form.Label className="font-medium text-gray-700">
                  Subcategoría
                </Form.Label>
                <Form.Control
                  as="select"
                  value={formData.subcategory}
                  onChange={(e) =>
                    setFormData({ ...formData, subcategory: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar Subcategoría</option>
                  {categories
                    .find((cat) => cat.nombre === formData.category)
                    ?.subcategorias.map((subcat) => (
                      <option key={subcat.nombre} value={subcat.nombre}>
                        {subcat.nombre}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            )}
            {formData.subcategory && (
              <Form.Group className="mb-4" controlId="subsubcategory">
                <Form.Label className="font-medium text-gray-700">
                  Subsubcategoría
                </Form.Label>
                <Form.Control
                  as="select"
                  value={formData.subsubcategory}
                  onChange={(e) =>
                    setFormData({ ...formData, subsubcategory: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar Subsubcategoría</option>
                  {categories
                    .find((cat) => cat.nombre === formData.category)
                    ?.subcategorias.find(
                      (subcat) => subcat.nombre === formData.subcategory
                    )
                    ?.subsubcategorias.map((subsubcat) => (
                      <option key={subsubcat} value={subsubcat}>
                        {subsubcat}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            )}
            <Form.Group className="mb-4" controlId="country">
              <Form.Label className="font-medium text-gray-700">País</Form.Label>
              <Form.Control
                type="text"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="province">
              <Form.Label className="font-medium text-gray-700">
                Provincia
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.province}
                onChange={(e) =>
                  setFormData({ ...formData, province: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="phone_number">
              <Form.Label className="font-medium text-gray-700">
                Número de teléfono
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="whatsapp">
              <Form.Label className="font-medium text-gray-700">
                WhatsApp
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="url">
              <Form.Label className="font-medium text-gray-700">URL</Form.Label>
              <Form.Control
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="maxWords">
              <Form.Label className="font-medium text-gray-700">
                Cantidad de Palabras
              </Form.Label>
              <Form.Control
                as="select"
                value={formData.maxWords}
                onChange={(e) =>
                  setFormData({ ...formData, maxWords: parseInt(e.target.value) })
                }
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={20}>20</option>
                <option value={40}>40</option>
                <option value={60}>60</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-4" controlId="description">
              <Form.Label className="font-medium text-gray-700">
                Descripción *
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.description}
                onChange={(e) => {
                  const input = e.target.value;
                  const words = input.split(/\s+/).filter(word => word.length > 0);
                  if (words.length <= formData.maxWords) {
                    setFormData({ ...formData, description: input });
                  }
                }}
                placeholder={`Máximo ${formData.maxWords} palabras`}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <Form.Text className="text-gray-500">
                {formData.description.split(/\s+/).filter(word => word.length > 0).length}/{formData.maxWords} palabras
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-4" controlId="contentType">
              <Form.Label className="font-medium text-gray-700">
                Tipo de contenido
              </Form.Label>
              <Form.Control
                as="select"
                value={formData.contentType}
                onChange={(e) =>
                  setFormData({ ...formData, contentType: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="clasificado">Clasificado</option>
                <option value="clasificado_imagen">Clasificado con Imagen</option>
              </Form.Control>
            </Form.Group>
            <Form.Group
              className="mb-4"
              controlId="content"
              style={{
                display: formData.contentType === 'clasificado' ? 'none' : 'block',
              }}
            >
              <Form.Label className="font-medium text-gray-700">
                Contenido
              </Form.Label>
              <Form.Control
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, contentFile: e.target.files[0] })
                }
                className="p-2 border border-gray-300 rounded-lg"
              />
            </Form.Group>
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full justify-center"
            >
              <FaSave size={16} />
              {editMode ? 'Guardar Cambios' : 'Crear Clasificado'}
            </Button>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

NewsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default NewsModal;