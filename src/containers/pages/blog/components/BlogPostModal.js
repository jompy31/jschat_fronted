import React, { useState, useRef } from "react";
import { Modal, Image, Button, OverlayTrigger, Form, Tooltip, FormControl } from "react-bootstrap";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsFillChatFill } from "react-icons/bs";
import { useMediaQuery } from "react-responsive";

const BlogPostModal = ({
  isImageModalOpen,
  closeImageModal,
  selectedImage,
  isFullScreen,
  toggleFullScreen,
  user,
  likedPosts,
  showComments,
  toggleLike,
  toggleComments,
  handleCommentChange,
  createComment,
  renderLikesTooltip,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [commentText, setCommentText] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  if (!selectedImage) return null;

  const defaultRenderLikesTooltip = (likes) => (
    <Tooltip id={`likes-tooltip-${selectedImage.id}`}>
      {likes && likes.length > 0 ? (
        likes.map((like, index) => (
          <div key={index}>{like.author || like.user || "Usuario"}</div>
        ))
      ) : (
        <div>Sin me gusta</div>
      )}
    </Tooltip>
  );

  const effectiveRenderLikesTooltip = renderLikesTooltip || defaultRenderLikesTooltip;

  const renderCommentsTooltip = (comments) => (
    <Tooltip id={`comments-tooltip-${selectedImage.id}`}>
      {comments && comments.length > 0 ? (
        comments.map((comment, index) => (
          <div key={index}>{comment.author || comment.user || "Usuario"}</div>
        ))
      ) : (
        <div>Sin comentarios</div>
      )}
    </Tooltip>
  );

  const isLiked = likedPosts.some((post) => post.id === selectedImage.id);

  const handleCommentInputChange = (event) => {
    const newComment = event.target.value;
    setCommentText(newComment);
    handleCommentChange(event, selectedImage.id);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim() === "") {
      alert("No puedes crear un comentario en blanco");
      return;
    }
    createComment(selectedImage.id, commentText);
    setCommentText("");
  };

  const handleZoomChange = (event) => {
    const newZoom = parseFloat(event.target.value);
    setZoomLevel(newZoom);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (event) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: event.clientX - panPosition.x, y: event.clientY - panPosition.y });
    }
  };

  const handleMouseMove = (event) => {
    if (isDragging && zoomLevel > 1) {
      const newX = event.clientX - dragStart.x;
      const newY = event.clientY - dragStart.y;
      setPanPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      closeImageModal();
    }
  };

  return (
    <Modal
      show={isImageModalOpen}
      onHide={closeImageModal}
      centered
      dialogClassName={isMobile ? "modal-90w" : "modal-80w"}
      backdrop="static"
      style={{ zIndex: 1200, marginTop:"8%" }}
      animation
      onClick={handleBackdropClick}
    >
      <Modal.Body
        style={{
          maxHeight: isFullScreen ? "100vh" : "80vh",
          overflowY: "auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: isMobile ? "15px" : "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ position: "relative", flex: "0 0 auto" }}>
          <Button
            variant="link"
            onClick={closeImageModal}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "#606770",
              fontSize: "24px",
              zIndex: 1210,
              textDecoration: "none",
            }}
          >
            ✕
          </Button>
          <Button
            variant="link"
            onClick={toggleFullScreen}
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              color: "#606770",
              fontSize: "24px",
              zIndex: 1210,
              textDecoration: "none",
            }}
          >
            {isFullScreen ? "↙" : "↗"}
          </Button>
          <div
            style={{
              overflow: "hidden",
              width: "100%",
              height: isFullScreen ? "100vh" : isMobile ? "300px" : "500px",
              position: "relative",
              borderRadius: "8px",
              marginBottom: isFullScreen ? "0" : "15px",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <Image
              ref={imageRef}
              src={selectedImage.image}
              alt="Blog Post Image"
              fluid
              style={{
                width: `${100 * zoomLevel}%`,
                height: `${100 * zoomLevel}%`,
                objectFit: "cover",
                transform: `translate(${panPosition.x}px, ${panPosition.y}px)`,
                cursor: zoomLevel > 1 ? "move" : "pointer",
                transition: isDragging ? "none" : "transform 0.2s",
              }}
              onClick={toggleFullScreen}
            />
          </div>
          <Form.Group style={{ marginBottom: "15px" }}>
            <Form.Label>Zoom: {Math.round(zoomLevel * 100)}%</Form.Label>
            <FormControl
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoomLevel}
              onChange={handleZoomChange}
              style={{ width: "100%" }}
            />
          </Form.Group>
        </div>
        {!isFullScreen && (
          <div style={{ flex: "1 0 auto", padding: "15px" }}>
            <h3
              style={{
                fontWeight: "600",
                color: "#1c2526",
                fontSize: "1.8rem",
                marginBottom: "10px",
              }}
            >
              {selectedImage.title}
            </h3>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                color: "#1c2526",
                fontSize: "15px",
                marginBottom: "15px",
                fontFamily: "'Arial', sans-serif",
              }}
            >
              {selectedImage.content}
            </pre>
            <p style={{ color: "#606770", fontSize: "14px", marginBottom: "15px" }}>
              Autor: {selectedImage.author}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <OverlayTrigger placement="top" overlay={effectiveRenderLikesTooltip(selectedImage.likes)}>
                <span style={{ fontSize: "14px", color: "#606770", cursor: "pointer" }}>
                  <AiFillHeart size={16} style={{ marginRight: "5px", color: "#4267B2" }} />
                  {selectedImage.likes?.length || 0} Me gusta
                </span>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={renderCommentsTooltip(selectedImage.comments)}>
                <span
                  style={{ fontSize: "14px", color: "#606770", cursor: "pointer" }}
                  onClick={() => toggleComments(selectedImage.id)}
                >
                  {selectedImage.comments?.length || 0} Comentarios
                </span>
              </OverlayTrigger>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid #e0e0e0" }}>
              <Button
                variant="link"
                onClick={() => toggleLike(selectedImage.id)}
                style={{
                  color: isLiked ? "#4267B2" : "#606770",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                {isLiked ? (
                  <AiFillHeart size={20} style={{ marginRight: "5px", color: "#4267B2" }} />
                ) : (
                  <AiOutlineHeart size={20} style={{ marginRight: "5px" }} />
                )}
                Me gusta
              </Button>
              <Button
                variant="link"
                onClick={() => toggleComments(selectedImage.id)}
                style={{
                  color: "#606770",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                <BsFillChatFill size={18} style={{ marginRight: "5px" }} />
                Comentar
              </Button>
            </div>
            {showComments[selectedImage.id] && (
              <div style={{ marginTop: "15px", paddingTop: "10px", borderTop: "1px solid #e0e0e0" }}>
                {selectedImage.comments && selectedImage.comments.length > 0 && (
                  <div style={{ marginBottom: "15px" }}>
                    {selectedImage.comments.map((comment, index) => (
                      <div key={index} style={{ fontSize: "14px", marginBottom: "8px", display: "flex" }}>
                        <div style={{ fontWeight: "600", marginRight: "5px" }}>
                          {comment.author || comment.user || "Usuario"}:
                        </div>
                        <div>{comment.content || comment.text || "Comentario no disponible"}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Control
                    as="textarea"
                    value={commentText}
                    onChange={handleCommentInputChange}
                    style={{
                      width: "100%",
                      marginRight: "10px",
                      fontSize: "14px",
                      borderRadius: "20px",
                      padding: "8px 12px",
                      border: "1px solid #ced0d4",
                    }}
                    placeholder="Escribe un comentario..."
                    rows={2}
                  />
                  <Button
                    variant="primary"
                    onClick={handleCommentSubmit}
                    style={{ borderRadius: "20px", padding: "8px 15px", fontSize: "14px" }}
                  >
                    Enviar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BlogPostModal;