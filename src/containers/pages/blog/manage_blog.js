import React from "react";
import { Button, Row, Tooltip } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import BlogPostCard from "./components/BlogPostCard.js";
import BlogPostModal from "./components/BlogPostModal";
import CreateEditModal from "./components/CreateEditModal";
import ImageCarousel from "./components/ImageCarousel";
import { useBlogManagement } from "./utils/hooks";
import "./manage_blog.css";

const ManageBlog = () => {
  const {
    blogPosts,
    title,
    setTitle,
    content,
    setContent,
    image,
    setImage,
    selectedBlogId,
    isModalOpen,
    setIsModalOpen,
    selectedImage,
    isImageModalOpen,
    showComments,
    likedParticipants,
    isFullScreen,
    index,
    scrollPosition,
    user,
    handleCreateBlogPost,
    handleUpdateBlogPost,
    handleDeleteBlogPost,
    openEditModal,
    closeEditModal,
    openImageModal,
    closeImageModal,
    toggleComments,
    handleCommentChange,
    handleCreateComment,
    handleDeleteComment, // Added to destructure from hook
    toggleLike,
    toggleFullScreen,
    renderLikesTooltip,
  } = useBlogManagement();

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        overflow: "auto",
        padding: "20px",
      }}
    >
      <br />
      <br />
      <br />
      {user !== null && (
        <div
          className="create-blog-button"
          style={{
            position: "fixed",
            top: "110px", // Adjusted to be below the title
            left: "20px", // Positioned in the top-left corner
            zIndex: 1000, // Ensure it stays above other elements
          }}
        >
          <Tooltip title="Crear nueva publicación">
            <Button
              aria-label="Crear una nueva publicación de blog"
              style={{
                background: "linear-gradient(135deg, #ff416c, #ff4b2b)", // Vibrant gradient
                border: "none",
                borderRadius: "50%",
                width: "56px", // Larger for better touch target
                height: "56px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onClick={() => {
                console.log("Button clicked! Opening create post modal...");
                setIsModalOpen(true);
              }}
              className="create-blog-btn"
            >
              <AiOutlinePlus
                size={28}
                color="white"
                style={{ pointerEvents: "none" }}
              />
            </Button>
          </Tooltip>
        </div>
      )}
      <div style={{ display: "flex" }}>
        <div style={{ width: "100%", marginTop: "5%" }}>
          <br />
          <h2
            className="blog-title"
            style={{
              fontFamily: "'Poppins', sans-serif", // Modern, clean font
              fontSize: "2.0rem", // Larger for prominence
              fontWeight: 700, // Bold for emphasis
              background: "linear-gradient(90deg, #ff416c, #ff4b2b)", // Vibrant gradient
              WebkitBackgroundClip: "text", // Gradient text effect
              WebkitTextFillColor: "transparent", // Required for gradient text
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)", // Subtle shadow
              marginBottom: "20px", // Space below title
              textTransform: "uppercase", // Matches social media aesthetic
              letterSpacing: "0.5px", // Slight spacing for readability
            }}
          >
            Publicaciones del Blog JSport
          </h2>
          <Row>
            {blogPosts.map((blogPost) => (
              <BlogPostCard
                key={blogPost.id}
                blogPost={blogPost}
                user={user}
                likedPosts={likedParticipants}
                showComments={showComments}
                toggleLike={toggleLike}
                toggleComments={toggleComments}
                handleCommentChange={handleCommentChange}
                createComment={handleCreateComment}
                handleDeleteBlogPost={handleDeleteBlogPost}
                openEditModal={openEditModal}
                openImageModal={openImageModal}
                renderLikesTooltip={renderLikesTooltip}
                handleDeleteComment={handleDeleteComment} // Pass the new prop
              />
            ))}
          </Row>
        </div>
        <ImageCarousel index={index} scrollPosition={scrollPosition} />
      </div>
      <CreateEditModal
        isModalOpen={isModalOpen}
        closeEditModal={closeEditModal}
        selectedBlogId={selectedBlogId}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        image={image}
        setImage={setImage}
        createBlogPost={handleCreateBlogPost}
        updateBlogPost={handleUpdateBlogPost}
      />
      <BlogPostModal
        isImageModalOpen={isImageModalOpen}
        closeImageModal={closeImageModal}
        selectedImage={selectedImage}
        isFullScreen={isFullScreen}
        toggleFullScreen={toggleFullScreen}
        user={user}
        likedPosts={likedParticipants}
        showComments={showComments}
        toggleLike={toggleLike}
        toggleComments={toggleComments}
        handleCommentChange={handleCommentChange}
        createComment={handleCreateComment}
        renderLikesTooltip={renderLikesTooltip}
      />
    </div>
  );
};

export default ManageBlog;