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
  handleDeleteComment,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 480px)" }); // Para iPhone 5/SE, Galaxy Fold

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

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
    <Col key={blogPost.id} xs={12} md={12} className="mb-4">
      <Card className="blog-post-card rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-100 d-flex flex-column">
        {/* Imagen: 100% responsiva, sin recortes, con aspect-ratio */}
        <div 
          className="position-relative w-100 bg-light d-flex align-items-center justify-content-center overflow-hidden"
          style={{
            aspectRatio: isSmallScreen ? "4 / 3" : isMobile ? "16 / 10" : "16 / 9",
            borderTopLeftRadius: "0.75rem",
            borderTopRightRadius: "0.75rem",
          }}
        >
          <Image
            src={blogPost.image}
            alt={`${blogPost.title} Image`}
            fluid
            className="w-100 h-100 object-contain p-2 hover-scale cursor-pointer"
            onClick={() => openImageModal(blogPost)}
            style={{
              objectPosition: "center",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          />
        </div>

        <Card.Body className="p-3 p-md-4 flex-grow-1 d-flex flex-column">
          <Card.Title
            className="font-['Playfair_Display'] font-semibold text-lg md:text-xl lg:text-2xl text-[var(--gray)] mb-2 line-clamp-2 cursor-pointer hover:text-[var(--primary-blue)] transition-colors duration-200"
            onClick={() => openImageModal(blogPost)}
            style={{ lineHeight: "1.3" }}
          >
            {blogPost.title}
          </Card.Title>

          <div
            className="font-['Open_Sans'] text-sm md:text-base text-[var(--gray)] mb-3 flex-grow-1 line-clamp-3 cursor-pointer"
            onClick={() => openImageModal(blogPost)}
            style={{ lineHeight: "1.5" }}
          >
            {truncateText(blogPost.content, isSmallScreen ? 80 : isMobile ? 120 : 200)}
          </div>

          <div className="font-['Open_Sans'] text-xs md:text-sm font-medium text-[var(--gray)] mb-2">
            Autor: {blogPost.author}
          </div>

          {user !== null && (
            <div className="d-flex justify-content-between mt-3 gap-2">
              <Button
                variant="outline-primary"
                size={isSmallScreen ? "sm" : "md"}
                onClick={() => openEditModal(blogPost.id)}
                className="flex-grow-1 font-['Open_Sans'] text-xs md:text-sm px-3 py-1 border-[var(--primary-blue)] text-[var(--primary-blue)] rounded-lg hover:bg-[var(--primary-blue)] hover:text-white transition-all duration-200"
              >
                Editar
              </Button>
              <Button
                variant="outline-danger"
                size={isSmallScreen ? "sm" : "md"}
                onClick={() => handleDeleteBlogPost(blogPost.id)}
                className="flex-grow-1 font-['Open_Sans'] text-xs md:text-sm px-3 py-1 border-[var(--yellow)] text-[var(--yellow)] rounded-lg hover:bg-[var(--yellow)] hover:text-[var(--gray)] transition-all duration-200"
              >
                <BsTrash size={14} className="me-1" />
              </Button>
            </div>
          )}
        </Card.Body>

        <Card.Footer className="p-3 border-top bg-[var(--white)]">
          <div className="d-flex justify-content-between align-items-center mb-2 text-xs md:text-sm">
            <OverlayTrigger placement="top" overlay={renderLikesTooltip(blogPost.likes)}>
              <span className="text-[var(--gray)] d-flex align-items-center cursor-pointer">
                <AiFillHeart
                  size={14}
                  className={isLiked ? "text-[var(--yellow)]" : "text-[var(--primary-blue)]"}
                  style={{ marginRight: "4px" }}
                />
                {blogPost.likes?.length || 0} Me gusta
              </span>
            </OverlayTrigger>
            {/* <OverlayTrigger placement="top" overlay={renderCommentsTooltip(blogPost.comments)}>
              <span
                className="text-[var(--gray)] cursor-pointer"
                onClick={() => toggleComments(blogPost.id)}
              >
                {blogPost.comments?.length || 0} Comentarios
              </span>
            </OverlayTrigger> */}
          </div>

          <div className="d-flex justify-content-between pt-2 border-top gap-1">
            <Button
              variant="link"
              size="sm"
              onClick={() => toggleLike(blogPost.id)}
              className={`p-0 text-decoration-none text-[var(--gray)] hover:text-[var(--primary-blue)] d-flex align-items-center ${isLiked ? "text-[var(--yellow)]" : ""}`}
            >
              {isLiked ? <AiFillHeart size={18} className="me-1" /> : <AiOutlineHeart size={18} className="me-1" />}
              <span className="font-['Open_Sans'] text-xs">Me gusta</span>
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={() => toggleComments(blogPost.id)}
              className="p-0 text-decoration-none text-[var(--gray)] hover:text-[var(--primary-blue)] d-flex align-items-center"
            >
              <BsFillChatFill size={16} className="me-1" />
              <span className="font-['Open_Sans'] text-xs">Comentar</span>
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={handleShare}
              className="p-0 text-decoration-none text-[var(--gray)] hover:text-[var(--primary-blue)] d-flex align-items-center"
            >
              <BsShareFill size={16} className="me-1" />
              <span className="font-['Open_Sans'] text-xs">Compartir</span>
            </Button>
          </div>

          {showComments[blogPost.id] && (
            <div className="mt-3 pt-3 border-top">
              {blogPost.comments && blogPost.comments.length > 0 && (
                <div className="mb-3 max-h-40 overflow-auto">
                  {blogPost.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-start mb-2 text-xs text-[var(--gray)]"
                    >
                      <div className="flex-grow-1">
                        <strong className="me-1">{comment.author || comment.user || "Usuario"}:</strong>
                        <span>{comment.content || comment.text || "Sin texto"}</span>
                      </div>
                      {user !== null && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleDeleteComment(blogPost.id, comment.id)}
                          className="p-0 text-[var(--yellow)] hover:text-red-600"
                        >
                          <BsTrash size={12} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="d-flex gap-2">
                <Form.Control
                  as="textarea"
                  value={blogPost.comment || ""}
                  onChange={(e) => handleCommentChange(e, blogPost.id)}
                  placeholder="Escribe un comentario..."
                  rows={2}
                  className="flex-grow-1 font-['Open_Sans'] text-xs rounded-full p-2 border focus:border-[var(--primary-blue)]"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => createComment(blogPost.id, blogPost.comment)}
                  className="rounded-full px-3 font-['Open_Sans'] text-xs"
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