import React, { useState } from "react";
import { Modal, Form, Button, Image, OverlayTrigger } from "react-bootstrap";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsFillChatFill, BsShareFill, BsTrash } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";

const BlogPostModal = ({
  isImageModalOpen,
  closeImageModal,
  selectedImage,
  user,
  likedPosts,
  showComments,
  toggleLike,
  toggleComments,
  handleCommentChange,
  createComment,
  renderLikesTooltip,
  handleDeleteComment,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  const handleShare = () => {
    if (!selectedImage) return;
    const postUrl = `${window.location.origin}/blog?postId=${selectedImage.id}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      toast.success("Link copiado al portapapeles", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }).catch((err) => {
      console.error("Error al copiar el enlace: ", err);
      toast.error("Error al copiar el enlace", {
        position: "top-right",
        autoClose: 3000,
      });
    });
  };

  const isLiked = selectedImage && likedPosts.some((post) => post.id === selectedImage.id);

  const getImageSrc = () => {
    if (!selectedImage?.image) {
      return "https://via.placeholder.com/400x300?text=Imagen+no+disponible";
    }
    if (selectedImage.image instanceof File) {
      return URL.createObjectURL(selectedImage.image);
    }
    return selectedImage.image;
  };

  const handleMouseMove = (e) => {
    const img = e.currentTarget.querySelector("img");
    if (!img || !selectedImage?.image) {
      setZoomStyle({ display: "none" });
      return;
    }

    const { left, top, width, height } = img.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const zoomFactor = isMobile ? 3 : 2;
    const zoomWidth = width * zoomFactor;
    const zoomHeight = height * zoomFactor;

    setZoomStyle({
      backgroundImage: `url(${getImageSrc()})`,
      backgroundSize: `${zoomWidth}px ${zoomHeight}px`,
      backgroundPosition: `${-x * zoomFactor}px ${-y * zoomFactor}px`,
      backgroundRepeat: "no-repeat",
      display: isMobile ? "none" : "block", // Ocultar en móvil
      position: "absolute",
      width: isMobile ? "200px" : "300px",
      height: isMobile ? "200px" : "300px",
      border: "2px solid #ef4444",
      borderRadius: "8px",
      zIndex: 50,
      pointerEvents: "none",
      right: isMobile ? "10px" : "-320px",
      top: "10px",
    });
  };

  const handleMouseEnter = () => {
    if (!isMobile && selectedImage?.image) {
      setZoomStyle((prev) => ({ ...prev, display: "block" }));
    }
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  return (
    <Modal
      show={isImageModalOpen}
      onHide={closeImageModal}
      centered
      dialogClassName="modal-80w"
      backdrop="static"
      animation
      className="blog-post-modal bg-white dark:bg-gray-800 rounded-2xl shadow-2xl animate-fadeInScale border border-gray-200 dark:border-gray-700"
      style={{ zIndex: 2000 }}
    >
      <style>
        {`
          .blog-post-modal .modal-content {
            border: none;
            border-radius: 16px;
            overflow-y: auto;
            max-height: 90vh;
            background: white;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          }
          .blog-post-modal .modal-header {
            border-bottom: none;
            padding: 1rem;
            background: white;
            justify-content: flex-end;
            position: sticky;
            top: 0;
            zIndex: 10;
          }
          .blog-post-modal .modal-title {
            color: #333;
            font-family: 'Playfair Display', serif;
            font-size: clamp(1.25rem, 4vw, 2.25rem);
            font-weight: 700;
            text-align: center;
            margin: 0 auto;
          }
          .blog-post-modal .close-button {
            color: #FFD700;
            font-size: 1.5rem;
            transition: transform 0.3s ease, color 0.3s ease;
          }
          .blog-post-modal .close-button:hover {
            color: #333;
            transform: rotate(90deg);
            filter: drop-shadow(0 0 8px #FFD700);
          }
          .blog-post-modal .modal-body {
            padding: 1.5rem;
            background: transparent;
          }
          .blog-post-modal .post-image-container {
            overflow: hidden;
            border-radius: 12px;
            margin-bottom: 1rem;
            max-width: 100%;
            position: relative;
          }
          .blog-post-modal .post-image {
            width: 100%;
            max-height: 400px;
            object-fit: contain;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .blog-post-modal .modal-footer {
            border-top: none;
            padding: 1rem 1.5rem;
            background: white;
            position: sticky;
            bottom: 0;
            zIndex: 10;
          }
          .blog-post-modal .action-button {
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .blog-post-modal .action-button:hover {
            transform: scale(1.1);
            box-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
          }
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @media (max-width: 768px) {
            .blog-post-modal .modal-body {
              padding: 1rem;
            }
            .blog-post-modal .post-image {
              max-height: 300px;
            }
            .blog-post-modal .modal-title {
              font-size: clamp(1rem, 3.5vw, 1.75rem);
            }
          }
        `}
      </style>
      <Modal.Header className="flex justify-end items-center p-2">
        <span
          className="close-button cursor-pointer"
          onClick={closeImageModal}
          aria-label="Cerrar modal"
        >
          ×
        </span>
      </Modal.Header>
      <Modal.Body className="flex flex-col gap-4">
        <div
          className="post-image-container w-full flex justify-center"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={getImageSrc()}
            alt={`${selectedImage?.title || "Publicación"} Image`}
            className="post-image"
          />
          <div style={zoomStyle}></div>
        </div>
        <h2 className="modal-title">
          {selectedImage?.title || "Publicación"}
        </h2>
        <div className="font-['Open_Sans'] text-base text-[#333] whitespace-pre-wrap leading-relaxed">
          {selectedImage?.content || "Contenido no disponible"}
        </div>
        <div className="font-['Open_Sans'] text-sm font-medium text-gray-600">
          Autor: {selectedImage?.author || "Usuario"}
        </div>
        <div className="flex justify-between items-center mt-4">
          <OverlayTrigger placement="top" overlay={renderLikesTooltip(selectedImage?.likes || [])}>
            <span className="font-['Open_Sans'] text-sm cursor-pointer text-gray-600 flex items-center">
              <AiFillHeart
                size={16}
                className={isLiked ? "text-[#FFD700]" : "text-[#036]"}
                style={{ marginRight: "5px" }}
              />
              {selectedImage?.likes?.length || 0} Me gusta
            </span>
          </OverlayTrigger>
          <span
            className="font-['Open_Sans'] text-sm cursor-pointer text-gray-600"
            onClick={() => toggleComments(selectedImage?.id)}
          >
            {selectedImage?.comments?.length || 0} Comentarios
          </span>
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-200">
          <Button
            variant="link"
            onClick={() => toggleLike(selectedImage?.id)}
            className={`action-button ${isLiked ? "liked" : ""} font-['Open_Sans'] font-medium text-sm flex items-center text-decoration-none text-[#036]`}
          >
            {isLiked ? (
              <AiFillHeart size={20} className="mr-2 text-[#FFD700]" />
            ) : (
              <AiOutlineHeart size={20} className="mr-2" />
            )}
            Me gusta
          </Button>
          <Button
            variant="link"
            onClick={() => toggleComments(selectedImage?.id)}
            className="action-button font-['Open_Sans'] font-medium text-sm flex items-center text-decoration-none text-[#036]"
          >
            <BsFillChatFill size={18} className="mr-2" />
            Comentar
          </Button>
          <Button
            variant="link"
            onClick={handleShare}
            className="action-button font-['Open_Sans'] font-medium text-sm flex items-center text-decoration-none text-[#036]"
          >
            <BsShareFill size={18} className="mr-2" />
            Compartir
          </Button>
        </div>
        {showComments[selectedImage?.id] && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            {selectedImage?.comments && selectedImage.comments.length > 0 && (
              <div className="mb-4">
                {selectedImage.comments.map((comment, index) => (
                  <div
                    key={index}
                    className="font-['Open_Sans'] text-sm mb-2 flex justify-between items-center text-gray-700"
                  >
                    <div className="flex">
                      <div className="font-semibold mr-2">
                        {comment.author || comment.user || "Usuario"}:
                      </div>
                      <div>{comment.content || comment.text || "Comentario no disponible"}</div>
                    </div>
                    {user !== null && (
                      <Button
                        variant="link"
                        onClick={() => handleDeleteComment(selectedImage.id, comment.id)}
                        className="p-0 ml-2 text-[#FFD700] hover:text-[#036]"
                      >
                        <BsTrash size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center">
              <Form.Control
                as="textarea"
                value={selectedImage?.comment || ""}
                onChange={(event) => handleCommentChange(event, selectedImage.id)}
                className="w-full mr-3 font-['Open_Sans'] text-sm rounded-full p-2 border-gray-300 bg-white text-gray-700 focus:border-[#036] focus:ring-2 focus:ring-[#036]"
                placeholder="Escribe un comentario..."
                rows={2}
              />
              <Button
                variant="primary"
                onClick={() => createComment(selectedImage.id, selectedImage.comment)}
                className="rounded-full px-4 py-2 font-['Open_Sans'] text-sm bg-[#036] text-white hover:bg-[#048] hover:shadow-[0_0_12px_rgba(0,51,102,0.5)] transition-all duration-200"
              >
                Enviar
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-2 bg-transparent border-t-0">
        <Button
          variant="primary"
          onClick={closeImageModal}
          className="rounded-lg px-4 py-2 font-['Open_Sans'] text-sm bg-gradient-to-r from-[#036] to-[#048] text-white shadow-md hover:scale-105 hover:shadow-[0_0_12px_rgba(0,51,102,0.5)] transition-all duration-200"
        >
          Cerrar
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
};

export default BlogPostModal;