import TodoDataService from "../../../../services/todos";

export const fetchBlogPosts = async () => {
  try {
    const response = await TodoDataService.getAllBlogPosts();
    return response.data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
};

export const createBlogPost = async (data, token) => {
  try {
    await TodoDataService.createBlogPost(data, token);
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
};

export const updateBlogPost = async (id, data, token) => {
  try {
    await TodoDataService.updateBlogPost(id, data, token);
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
};

export const deleteBlogPost = async (id, token) => {
  try {
    await TodoDataService.deleteBlogPost(id, token);
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
};

export const createComment = async (data, token) => {
  try {
    await TodoDataService.createComment(data, token);
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const deleteComment = async (blogPostId, commentId, token) => {
  try {
    await TodoDataService.deleteComment(blogPostId, commentId, token);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export const createLike = async (blogPostId, userId, token) => {
  try {
    await TodoDataService.createLike(blogPostId, userId, token);
  } catch (error) {
    console.error("Error creating like:", error);
    throw error;
  }
};

export const deleteLike = async (blogPostId, userId, token) => {
  try {
    await TodoDataService.deleteLike(blogPostId, userId, token);
  } catch (error) {
    console.error("Error deleting like:", error);
    throw error;
  }
};