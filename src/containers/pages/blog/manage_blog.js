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
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            zIndex: "1",
          }}
        >
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <AiOutlinePlus size={24} />
          </Button>
        </div>
      )}
      <div style={{ display: "flex" }}>
        <div style={{ width: "100%", marginTop: "5%" }}>
          <br />
          <h2
            style={{
              color: "red",
              fontWeight: "bold",
              textShadow: "2px 2px 4px #000",
              textTransform: "none",
            }}
          >
            Publicaciones del Blog ABCupon
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