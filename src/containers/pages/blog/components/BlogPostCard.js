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
  handleDeleteComment, // New prop for deleting comments
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

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

  const renderCommentsTooltip = (comments) => (
    <Tooltip id={`comments-tooltip-${blogPost.id}`}>
      {comments && comments.length > 0 ? (
        comments.map((comment, index) => (
          <div key={index}>{comment.author || comment.user || "Usuario"}</div>
        ))
      ) : (
        <div>Sin comentarios</div>
      )}
    </Tooltip>
  );

  const isLiked = likedPosts.some((post) => post.id === blogPost.id);

  return (
    <Col key={blogPost.id} md={12} style={{ marginBottom: "20px" }}>
      <Card style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff" }}>
        <div style={{ position: "relative", width: "100%", height: isMobile ? "200px" : "300px", overflow: "hidden" }}>
          <Card.Img
            variant="top"
            as={Image}
            src={blogPost.image}
            alt="Blog Post Image"
            fluid
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => openImageModal(blogPost)}
          />
        </div>
        <Card.Body style={{ padding: "15px" }}>
          <Card.Title
            style={{
              fontWeight: "600",
              fontSize: "1.5rem",
              color: "#1c2526",
              marginBottom: "10px",
            }}
          >
            {blogPost.title}
          </Card.Title>
          <div style={{ fontSize: "15px", color: "#606770", whiteSpace: "pre-wrap", marginBottom: "10px" }}>
            {blogPost.content}
          </div>
          <div style={{ fontSize: "13px", color: "#90949c", fontWeight: "500" }}>
            Autor: {blogPost.author}
          </div>
          {user !== null && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <Button
                variant="outline-primary"
                onClick={() => openEditModal(blogPost.id)}
                style={{ fontSize: "14px", padding: "5px 15px" }}
              >
                Editar
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => handleDeleteBlogPost(blogPost.id)}
                style={{ fontSize: "14px", padding: "5px 15px" }}
              >
                <BsTrash size={16} style={{ verticalAlign: "middle" }} />
              </Button>
            </div>
          )}
        </Card.Body>
        <Card.Footer style={{ backgroundColor: "#fff", padding: "10px 15px", borderTop: "1px solid #e0e0e0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <OverlayTrigger placement="top" overlay={renderLikesTooltip(blogPost.likes)}>
              <span style={{ fontSize: "14px", color: "#606770", cursor: "pointer" }}>
                <AiFillHeart size={16} style={{ marginRight: "5px", color: "#4267B2" }} />
                {blogPost.likes?.length || 0} Me gusta
              </span>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={renderCommentsTooltip(blogPost.comments)}>
              <span
                style={{ fontSize: "14px", color: "#606770", cursor: "pointer" }}
                onClick={() => toggleComments(blogPost.id)}
              >
                {blogPost.comments?.length || 0} Comentarios
              </span>
            </OverlayTrigger>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #e0e0e0" }}>
            <Button
              variant="link"
              onClick={() => toggleLike(blogPost.id)}
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
              onClick={() => toggleComments(blogPost.id)}
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
            <Button
              variant="link"
              onClick={handleShare}
              style={{
                color: "#606770",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              <BsShareFill size={18} style={{ marginRight: "5px" }} />
              Compartir
            </Button>
          </div>
          {showComments[blogPost.id] && (
            <div style={{ marginTop: "15px", paddingTop: "10px", borderTop: "1px solid #e0e0e0" }}>
              {blogPost.comments && blogPost.comments.length > 0 && (
                <div style={{ marginBottom: "15px" }}>
                  {blogPost.comments.map((comment, index) => (
                    <div
                      key={index}
                      style={{
                        fontSize: "14px",
                        marginBottom: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        <div style={{ fontWeight: "600", marginRight: "5px" }}>
                          {comment.author || comment.user || "Usuario"}:
                        </div>
                        <div>{comment.content || comment.text || "Comentario no disponible"}</div>
                      </div>
                      {user !== null && (
                        <Button
                          variant="link"
                          onClick={() => handleDeleteComment(blogPost.id, comment.id)}
                          style={{
                            color: "#dc3545",
                            padding: "0",
                            marginLeft: "10px",
                          }}
                        >
                          <BsTrash size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center" }}>
                <Form.Control
                  as="textarea"
                  value={blogPost.comment || ""}
                  onChange={(event) => handleCommentChange(event, blogPost.id)}
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
                  onClick={() => createComment(blogPost.id, blogPost.comment)}
                  style={{ borderRadius: "20px", padding: "8px 15px", fontSize: "14px" }}
                >
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