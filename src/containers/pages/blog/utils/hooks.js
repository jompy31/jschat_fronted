import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Tooltip } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import {
  fetchBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  createComment,
  deleteComment,
  createLike,
  deleteLike,
} from "./api";

export const useBlogManagement = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showComments, setShowComments] = useState({});
  const [likedParticipants, setLikedParticipants] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [index, setIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const token = useSelector((state) => state.authentication.token);
  const user = useSelector((state) => state.authentication.user);

  useEffect(() => {
    const loadBlogPosts = async () => {
      if (!fetchBlogPosts) {
        console.error("fetchBlogPosts is not defined. Check the import from './api'.");
        return;
      }
      try {
        const posts = await fetchBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    loadBlogPosts();
  }, []);

  // Update selectedImage when blogPosts change
  useEffect(() => {
    if (selectedImage && blogPosts.length > 0) {
      const updatedPost = blogPosts.find((post) => post.id === selectedImage.id);
      if (updatedPost) {
        setSelectedImage(updatedPost);
      }
    }
  }, [blogPosts, selectedImage]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const likedBlogPosts = blogPosts.filter((blogPost) =>
      blogPost.likes.some((like) => like.user === userId)
    );
    setLikedParticipants(likedBlogPosts);
  }, [blogPosts]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % 3); // Assuming 3 images
    }, 10000);

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCreateBlogPost = async () => {
    try {
      const data = new FormData();
      data.append("title", title);
      data.append("content", content);
      data.append("image", image);

      await createBlogPost(data, token);
      const posts = await fetchBlogPosts();
      setBlogPosts(posts);
      setTitle("");
      setContent("");
      setImage(null);
      closeEditModal(); // Close modal after successful creation
      toast.success("¡Publicación creada exitosamente!");
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast.error("Error al crear la publicación. Por favor, intenta de nuevo.");
    }
  };

  const handleUpdateBlogPost = async () => {
    try {
      if (selectedBlogId) {
        const data = new FormData();
        data.append("title", title);
        data.append("content", content);
        if (image && typeof image === "object") {
          data.append("image", image);
        }

        await updateBlogPost(selectedBlogId, data, token);
        const posts = await fetchBlogPosts();
        setBlogPosts(posts);
        closeEditModal(); // Already closes modal
        toast.success("¡Publicación actual  actualizada exitosamente!");
      }
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast.error("Error al actualizar la publicación. Por favor, intenta de nuevo.");
    }
  };

  const handleDeleteBlogPost = async (id) => {
    try {
      await deleteBlogPost(id, token);
      const posts = await fetchBlogPosts();
      setBlogPosts(posts);
      toast.success("¡Publicación eliminada exitosamente!");
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error("Error al eliminar la publicación.");
    }
  };

  const openEditModal = (id) => {
    const selectedBlog = blogPosts.find((blogPost) => blogPost.id === id);
    if (selectedBlog) {
      setSelectedBlogId(id);
      setTitle(selectedBlog.title);
      setContent(selectedBlog.content);
      setImage(null);
      setIsModalOpen(true);
    }
  };

  const closeEditModal = () => {
    setSelectedBlogId(null);
    setTitle("");
    setContent("");
    setImage(null);
    setIsModalOpen(false);
  };

  const openImageModal = (blogPost) => {
    setSelectedImage(blogPost);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsImageModalOpen(false);
  };

  const toggleComments = (blogPostId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [blogPostId]: !prevState[blogPostId],
    }));
  };

  const handleCommentChange = (event, blogPostId) => {
    const { value } = event.target;
    const modifiedBlogPosts = blogPosts.map((blogPost) => {
      if (blogPost.id === blogPostId) {
        return { ...blogPost, comment: value };
      }
      return blogPost;
    });
    setBlogPosts(modifiedBlogPosts);
  };

  const handleCreateComment = async (blogPostId, comment) => {
    if (!token) {
      alert("Necesitas autenticarte para poder comentar en nuestros blogs.");
      return;
    }

    if (!comment || comment.trim() === "") {
      alert("El comentario no puede estar vacío.");
      return;
    }

    const data = {
      blog_post: blogPostId,
      user: localStorage.getItem("userId"),
      content: comment,
    };

    try {
      await createComment(data, token);
      const posts = await fetchBlogPosts();
      setBlogPosts(
        posts.map((post) => ({
          ...post,
          comment: post.id === blogPostId ? "" : post.comment,
        }))
      );
      toast.success("¡Comentario creado exitosamente!");
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("Error al crear el comentario. Por favor, intenta de nuevo.");
    }
  };

  const handleDeleteComment = async (blogPostId, commentId) => {
    try {
      if (!token) {
        throw new Error("User not authenticated");
      }
      await deleteComment(blogPostId, commentId, token);
      setBlogPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === blogPostId
            ? {
                ...post,
                comments: post.comments.filter((comment) => comment.id !== commentId),
              }
            : post
        )
      );
      toast.success("Comentario eliminado correctamente");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Error al eliminar el comentario");
    }
  };

  const toggleLike = async (blogPostId) => {
    if (!token) {
      alert("Necesitas autenticarte para interactuar en nuestros blogs.");
      return;
    }

    const userId = localStorage.getItem("userId");
    const likedBlogPost = blogPosts.find((blogPost) => blogPost.id === blogPostId);

    if (likedBlogPost.likes.some((like) => like.user === userId)) {
      await deleteLike(blogPostId, userId, token);
    } else {
      await createLike(blogPostId, userId, token);
    }
    const posts = await fetchBlogPosts();
    setBlogPosts(posts);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const renderLikesTooltip = (likes) => (
    <Tooltip
      id="likes-tooltip"
      style={{
        fontSize: "12px",
        background: "rgba(255, 255, 255, 1)",
        color: "#000",
        borderRadius: "8px",
      }}
    >
      {likes && likes.length > 0 ? (
        likes.map((like) => (
          <div key={like.user}>{like.author || like.user || "Usuario"}</div>
        ))
      ) : (
        <div>Sin me gusta</div>
      )}
    </Tooltip>
  );

  return {
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
    handleDeleteComment,
    toggleLike,
    toggleFullScreen,
    renderLikesTooltip,
  };
};