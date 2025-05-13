import { useState, useCallback } from 'react';
import FileDataService from '../../../../services/files';

// Utility to debounce a function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const useNewsManagement = (token) => {
  const [newsPosts, setNewsPosts] = useState([]);
  const [selectedNews, setSelectedNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editNewsId, setEditNewsId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    subsubcategory: '',
    country: '',
    province: '',
    phone_number: '',
    whatsapp: '',
    url: '',
    description: '',
    contentType: 'clasificado',
    contentFile: null,
    maxWords: 20, // Added maxWords with default value
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [subsubcategoryFilter, setSubsubcategoryFilter] = useState('');

  // Fetch all news posts with retry and debounce
  const fetchNewsPosts = useCallback(
    debounce(async (retryCount = 0) => {
      try {
        const response = await FileDataService.getAllPost();
        setNewsPosts(response.data);
      } catch (error) {
        console.error('Error fetching news posts:', error);
        if (retryCount < 3) {
          setTimeout(() => fetchNewsPosts(retryCount + 1), Math.pow(2, retryCount) * 1000);
        }
      }
    }, 500),
    []
  );

  // Toggle modal and set form data for create/edit
  const toggleModal = (editMode = false, postId = null) => {
    if (editMode && postId) {
      const selectedPost = newsPosts.find((post) => post.id === postId);
      if (selectedPost) {
        setFormData({
          title: selectedPost.title,
          category: selectedPost.category,
          subcategory: selectedPost.subcategory,
          subsubcategory: selectedPost.subsubcategory,
          country: selectedPost.country,
          province: selectedPost.province,
          phone_number: selectedPost.phone_number,
          whatsapp: selectedPost.whatsapp,
          url: selectedPost.url,
          description: selectedPost.description,
          contentType: selectedPost.content_type,
          contentFile: null,
          maxWords: 20, // Default to 20 when editing
        });
        setEditMode(true);
        setEditNewsId(postId);
      }
    } else {
      setFormData({
        title: '',
        category: '',
        subcategory: '',
        subsubcategory: '',
        country: '',
        province: '',
        phone_number: '',
        whatsapp: '',
        url: '',
        description: '',
        contentType: 'clasificado',
        contentFile: null,
        maxWords: 20, // Default to 20 when creating
      });
      setEditMode(false);
      setEditNewsId(null);
    }
    setShowModal(!showModal);
  };

  // Create a new news post
  const handleCreateNews = async () => {
    if (!formData.title || !formData.category || !formData.description) {
      alert('Por favor, complete los campos obligatorios.');
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== 'contentFile' && key !== 'maxWords' && formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });
    if (formData.contentFile) {
      formDataToSend.append('content', formData.contentFile);
    }

    try {
      const response = await FileDataService.createNewsPost(formDataToSend, token);
      setNewsPosts((prev) => [...prev, response.data]);
      toggleModal();
    } catch (error) {
      console.error('Error creating news post:', error);
      fetchNewsPosts();
    }
  };

  // Edit an existing news post
  const handleEditNews = async () => {
    if (!formData.title || !formData.category || !formData.description || !editNewsId) {
      alert('Por favor, complete los campos obligatorios y seleccione un clasificado para editar.');
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== 'contentFile' && key !== 'maxWords') {
        formDataToSend.append(key, formData[key]);
      }
    });
    if (formData.contentType !== 'clasificado') {
      formDataToSend.append('content', formData.contentFile || '');
    }

    try {
      const response = await FileDataService.updateNewsPost(editNewsId, formDataToSend, token);
      setNewsPosts((prev) =>
        prev.map((post) =>
          post.id === editNewsId ? { ...post, ...response.data } : post
        )
      );
      toggleModal();
    } catch (error) {
      console.error('Error updating news post:', error);
      fetchNewsPosts();
    }
  };

  // Delete selected news posts
  const handleDeleteSelected = async () => {
    try {
      await FileDataService.deleteNewsPost(selectedNews, token);
      setNewsPosts((prev) => prev.filter((post) => !selectedNews.includes(post.id)));
      setSelectedNews([]);
      setCurrentPage(1); // Reset to first page after deletion
    } catch (error) {
      console.error('Error deleting news posts:', error);
      fetchNewsPosts();
    }
  };

  // Toggle selection of a news post
  const toggleSelectNews = (postId) => {
    setSelectedNews((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  return {
    newsPosts,
    selectedNews,
    searchTerm,
    showModal,
    editMode,
    editNewsId,
    formData,
    setSearchTerm,
    toggleModal,
    handleCreateNews,
    handleEditNews,
    handleDeleteSelected,
    toggleSelectNews,
    fetchNewsPosts,
    setFormData,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    categoryFilter,
    setCategoryFilter,
    subcategoryFilter,
    setSubcategoryFilter,
    subsubcategoryFilter,
    setSubsubcategoryFilter,
  };
};

export default useNewsManagement;