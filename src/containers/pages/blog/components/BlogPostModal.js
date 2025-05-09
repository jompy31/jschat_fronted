import React from "react";
import { Modal, Image, Button, OverlayTrigger, Form, Tooltip } from "react-bootstrap";
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

  if (!selectedImage) return null;

  // Fallback renderLikesTooltip if not provided
  const defaultRenderLikesTooltip = (likes) => (
    <Tooltip id={`likes-tooltip-${selectedImage.id}`}>
      {likes && likes.length > 0 ? (
        likes.map((like, index) => (
          <div key={index}>{like.author || "Anónimo"}</div>
        ))
      ) : (
        <div>Sin me gusta</div>
      )}
    </Tooltip>
  );

  // Use provided renderLikesTooltip or fallback
  const effectiveRenderLikesTooltip = renderLikesTooltip || defaultRenderLikesTooltip;

  // Tooltip for comments
  const renderCommentsTooltip = (comments) => (
    <Tooltip id={`comments-tooltip-${selectedImage.id}`}>
      {comments && comments.length > 0 ? (
        comments.map((comment, index) => (
          <div key={index}>{comment.author || "Anónimo"}</div>
        ))
      ) : (
        <div>Sin comentarios</div>
      )}
    </Tooltip>
  );

  return (
    <Modal
      show={isImageModalOpen}
      onHide={closeImageModal}
      centered
      dialogClassName={isMobile ? "modal-90w" : "modal-80w"}
      style={{
        zIndex: 1100, // Higher z-index to ensure modal is above carousel
        marginTop:"2%"
      }}
      backdropStyle={{
        backgroundColor: 'rgba(255, 255, 255, 0.4)', // White backdrop with 40% opacity
        zIndex: 1199, // Ensure backdrop is just below the modal
      }}
    >
      <Modal.Body
        style={{
          maxHeight: "60vh", // 80% of viewport height
          maxWidth: "60vw", // 90% of viewport width
          marginRight:"30%",
          margin: "auto",
          overflowY: "auto",
          backgroundColor: '#fff',
          borderRadius: '10px',
          padding: isMobile ? '10px' : '20px',
        }}
      >
        <div style={{ position: "relative" }}>
          {/* Close Button */}
          <Button
            variant="link"
            onClick={closeImageModal}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "#606770",
              fontSize: "20px",
              zIndex: 1110, // Higher than modal content
              textDecoration: "none",
            }}
          >
            ✕
          </Button>
          {/* Full-Screen Toggle */}
          <Button
            variant="link"
            onClick={toggleFullScreen}
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              color: "#606770",
              fontSize: "20px",
              zIndex: 1110, // Higher than modal content
              textDecoration: "none",
            }}
          >
            {isFullScreen ? "↙" : "↗"}
          </Button>

          {/* Image */}
          <Image
            src={selectedImage.image}
            alt="Blog Post Image"
            fluid
            style={{
              width: '100%',
              height: isFullScreen ? '100vh' : 'auto',
              maxHeight: isFullScreen ? '100vh' : isMobile ? '400px' : '600px',
              objectFit: isFullScreen ? 'contain' : 'contain',
              display: 'block',
              marginBottom: isFullScreen ? '0' : '20px',
              cursor: "pointer",
            }}
            onClick={toggleFullScreen}
          />

          {!isFullScreen && (
            <div style={{ padding: '10px' }}>
              {/* Title */}
              <h3
                style={{
                  fontWeight: 'bold',
                  color: '#1c2526',
                  fontSize: '1.5rem',
                  marginBottom: '10px',
                }}
              >
                {selectedImage.title}
              </h3>
              {/* Content */}
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  color: '#1c2526',
                  fontSize: '16px',
                  marginBottom: '10px',
                }}
              >
                {selectedImage.content}
              </pre>
              {/* Author */}
              <p style={{ color: '#606770', fontSize: '14px', marginBottom: '10px' }}>
                Autor: {selectedImage.author}
              </p>

              {/* Like and Comment Counts */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <OverlayTrigger placement="top" overlay={effectiveRenderLikesTooltip(selectedImage.likes)}>
                  <span style={{ cursor: 'pointer', fontSize: '14px', color: '#606770' }}>
                    <AiFillHeart size={16} style={{ marginRight: '5px', color: '#4267B2' }} />
                    {selectedImage.likes?.length || 0} Me gusta
                  </span>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={renderCommentsTooltip(selectedImage.comments)}>
                  <span style={{ cursor: 'pointer', fontSize: '14px', color: '#606770' }} onClick={() => toggleComments(selectedImage.id)}>
                    {selectedImage.comments?.length || 0} Comentarios
                  </span>
                </OverlayTrigger>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e0e0e0', paddingTop: '5px', marginBottom: '10px' }}>
                <Button
                  variant="link"
                  onClick={() => toggleLike(selectedImage.id)}
                  style={{ color: '#606770', fontWeight: '500', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                >
                  {likedPosts.some((post) => post.id === selectedImage.id) ? (
                    <AiFillHeart size={20} style={{ marginRight: '5px', color: '#4267B2' }} />
                  ) : (
                    <AiOutlineHeart size={20} style={{ marginRight: '5px' }} />
                  )}
                  Me gusta
                </Button>
                <Button
                  variant="link"
                  onClick={() => toggleComments(selectedImage.id)}
                  style={{ color: '#606770', fontWeight: '500', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                >
                  <BsFillChatFill size={20} style={{ marginRight: '5px' }} />
                  Comentar
                </Button>
              </div>

              {/* Comments Section */}
              {showComments[selectedImage.id] && (
                <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '10px' }}>
                  {/* Display existing comments */}
                  {selectedImage.comments && selectedImage.comments.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      {selectedImage.comments.map((comment, index) => (
                        <div key={index} style={{ fontSize: '14px', marginBottom: '5px' }}>
                          <strong>{comment.author || "Anónimo"}:</strong> {comment.text}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Comment Input */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Control
                      as="textarea"
                      value={selectedImage.comment || ""}
                      onChange={(event) => handleCommentChange(event, selectedImage.id)}
                      style={{ width: "100%", marginRight: '10px', fontSize: '14px', borderRadius: '20px', padding: '8px' }}
                      placeholder="Escribe un comentario..."
                    />
                    <Button
                      variant="primary"
                      onClick={() => createComment(selectedImage.id, selectedImage.comment)}
                      style={{ borderRadius: '20px' }}
                    >
                      Enviar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BlogPostModal;