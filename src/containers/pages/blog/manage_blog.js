import React from "react";
import { Button, Row, Tooltip } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import BlogPostCard from "./components/BlogPostCard";
import BlogPostModal from "./components/BlogPostModal";
import CreateEditModal from "./components/CreateEditModal";
import ImageCarousel from "./components/ImageCarousel";
import { useBlogManagement } from "./utils/hooks";
import "./manage_blog.css";
import { useMediaQuery } from "react-responsive";

const ManageBlog = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });

  const {
    blogPosts,
    title, setTitle,
    content, setContent,
    image, setImage,
    selectedBlogId,
    isModalOpen, setIsModalOpen,
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
    handleDeleteComment,
    toggleLike,
    toggleFullScreen,
    renderLikesTooltip,
  } = useBlogManagement();

  return (
    <div className="manage-blog-container">
      {/* Botón Crear */}
      {user && (
        <div className="flex justify-center mb-8 sm:mb-10 px-3 xs:px-4 sm:px-6 md:px-8">
          <Tooltip title="Crear una nueva publicación">
            <Button
              className="create-blog-btn"
              onClick={() => setIsModalOpen(true)}
            >
              <AiOutlinePlus size={22} />
              <span className="hidden xs:inline">CREAR NUEVA PUBLICACIÓN</span>
              <span className="xs:hidden">CREAR</span>
            </Button>
          </Tooltip>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 sm:gap-8 max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
        {/* Lista de Posts */}
        <div className="w-full md:w-3/5">
          {/* TÍTULO RESPONSIVO */}
          <h2 
            className="blog-title"
            style={{
              fontSize: 'clamp(1.8rem, 6.5vw, 3.5rem)',
              lineHeight: '1.15',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              padding: '0 0.5rem',
              maxWidth: '100%'
            }}
          >
            Publicaciones del Blog JSPORT
          </h2>

          <Row className="grid grid-cols-1 gap-5 sm:gap-6">
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
                handleDeleteComment={handleDeleteComment}
              />
            ))}
          </Row>
        </div>

        {/* Carrusel - Solo escritorio */}
        {!isMobile && (
          <div className="w-full md:w-2/5">
            <ImageCarousel index={index} scrollPosition={scrollPosition} />
          </div>
        )}
      </div>

      {/* Modales */}
      <CreateEditModal
        isModalOpen={isModalOpen}
        closeEditModal={closeEditModal}
        selectedBlogId={selectedBlogId}
        title={title} setTitle={setTitle}
        content={content} setContent={setContent}
        image={image} setImage={setImage}
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
        handleDeleteComment={handleDeleteComment}
      />
    </div>
  );
};

export default ManageBlog;