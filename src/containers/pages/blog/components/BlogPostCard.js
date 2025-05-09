import React from "react";
import { Card, Button, OverlayTrigger, Form, Image, Col, Tooltip } from "react-bootstrap";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsFillChatFill, BsShareFill, BsTrash } from "react-icons/bs";
import { useMediaQuery } from "react-responsive";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlogPostCard = ({
  blogPost,
  user,
  likedPosts,
  showComments,
  toggleLike,
  toggleComments,
  handleCommentChange,
  createComment,
  handleDeleteBlogPost,
  openEditModal,
  openImageModal,
  renderLikesTooltip,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // Función para copiar el URL al portapapeles y mostrar un toast
  const handleShare = () => {
    const postUrl = `${window.location.origin}/blog?postId=${blogPost.id}`;
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

  // Tooltip para comentarios
  const renderCommentsTooltip = (comments) => (
    <Tooltip id={`comments-tooltip-${blogPost.id}`}>
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
    <Col key={blogPost.id} md={12} style={{ marginBottom: "20px" }}>
      <Card style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', marginBottom: '20px', minWidth: isMobile ? '' : '100vh', minHeight: isMobile ? '' : '70vh' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', overflow: 'hidden' }}>
          <Card.Img
            variant="top"
            as={Image}
            src={blogPost.image}
            alt="Blog Post Image"
            fluid
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: isMobile ? '150px' : '200px',
              objectFit: 'contain',
              cursor: 'default',
              display: 'block',
            }}
          />
        </div>
        <Card.Body>
          <Card.Title
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
              color: 'red',
              fontSize: '1.8rem',
              textShadow: '2px 2px 4px #000',
            }}
          >
            {blogPost.title}
          </Card.Title>
          <div style={{ marginBottom: '10px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <p style={{ fontSize: '16px', color: 'black', whiteSpace: 'pre-wrap', marginBottom: '5px' }}>
              {blogPost.content}
            </p>
            <p style={{ fontSize: '10px', color: 'black', fontWeight: 'bold', marginBottom: '5px' }}>
              Autor: {blogPost.author}
            </p>
          </div>

          {user !== null && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="primary" onClick={() => openEditModal(blogPost.id)}>
                Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteBlogPost(blogPost.id)}
                style={{ fontSize: '10px', transform: 'scale(0.5)' }}
              >
                <BsTrash size={14} style={{ verticalAlign: 'middle' }} />
              </Button>
            </div>
          )}
        </Card.Body>
        <Card.Footer style={{ backgroundColor: '#f8f9fa', padding: '10px' }}>
          {/* Like and Comment Counts */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <OverlayTrigger placement="top" overlay={renderLikesTooltip(blogPost.likes)}>
              <span style={{ cursor: 'pointer', fontSize: '14px', color: '#606770' }}>
                <AiFillHeart size={16} style={{ marginRight: '5px', color: '#4267B2' }} />
                {blogPost.likes?.length || 0} Me gusta
              </span>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={renderCommentsTooltip(blogPost.comments)}>
              <span style={{ cursor: 'pointer', fontSize: '14px', color: '#606770' }} onClick={() => toggleComments(blogPost.id)}>
                {blogPost.comments?.length || 0} Comentarios
              </span>
            </OverlayTrigger>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e0e0e0', paddingTop: '5px' }}>
            <Button
              variant="link"
              onClick={() => toggleLike(blogPost.id)}
              style={{ color: '#606770', fontWeight: '500', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              {likedPosts.some((post) => post.id === blogPost.id) ? (
                <AiFillHeart size={20} style={{ marginRight: '5px', color: '#4267B2' }} />
              ) : (
                <AiOutlineHeart size={20} style={{ marginRight: '5px' }} />
              )}
              Me gusta
            </Button>
            <Button
              variant="link"
              onClick={() => toggleComments(blogPost.id)}
              style={{ color: '#606770', fontWeight: '500', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <BsFillChatFill size={20} style={{ marginRight: '5px' }} />
              Comentar
            </Button>
            <Button
              variant="link"
              onClick={handleShare}
              style={{ color: '#606770', fontWeight: '500', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <BsShareFill size={20} style={{ marginRight: '5px' }} />
              Compartir
            </Button>
          </div>

          {/* Comments Section */}
          {showComments[blogPost.id] && (
            <div style={{ marginTop: '10px', borderTop: '1px solid #e0e0e0', paddingTop: '10px' }}>
              {/* Display existing comments */}
              {blogPost.comments && blogPost.comments.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  {blogPost.comments.map((comment, index) => (
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
                  value={blogPost.comment || ""}
                  onChange={(event) => handleCommentChange(event, blogPost.id)}
                  style={{ width: "100%", marginRight: '10px', fontSize: '14px', borderRadius: '20px', padding: '8px' }}
                  placeholder="Escribe un comentario..."
                />
                <Button variant="primary" onClick={() => createComment(blogPost.id, blogPost.comment)} style={{ borderRadius: '20px' }}>
                  Enviar
                </Button>
              </div>
            </div>
          )}
        </Card.Footer>
      </Card>
      <ToastContainer />
    </Col>
  );
};

export default BlogPostCard;