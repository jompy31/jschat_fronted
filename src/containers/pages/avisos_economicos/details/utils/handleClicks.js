// frontend_abcupon/src/containers/pages/avisos_economicos/utils/handleClicks.js
export const handleCategoriaClick = (
  categoria,
  newsPosts,
  setSelectedCategoria,
  setSelectedSubcategoria,
  setMostrarSubcategorias,
  setMostrarSubsubcategorias,
  setClasificados, // Este es el argumento que debería ser la función setClasificados
  clasificadosPorPagina,
  setSubcategorias
) => {
  setSelectedCategoria(categoria);
  setSelectedSubcategoria(null);
  setMostrarSubcategorias(true);
  setMostrarSubsubcategorias(true);
  const filteredClasificados = newsPosts.filter(post => post.category === categoria);
  setClasificados(filteredClasificados.slice(0, clasificadosPorPagina));
  const uniqueSubcategorias = [...new Set(filteredClasificados.map(post => post.subcategory))];
  const sortedSubcategorias = uniqueSubcategorias.sort();
  setSubcategorias(sortedSubcategorias);
};
  
  export const handleSubcategoriaClick = (
    subcategoria,
    newsPosts,
    selectedCategoria,
    setSelectedSubcategoria,
    setSelectedSubsubcategoria,
    setMostrarSubsubcategorias,
    setPaginaActual,
    setFilteredClasificados,
    setSubsubcategorias,
    setSortedSubsubcategorias,
    setMostrarTodasSubsubcategorias
  ) => {
    setFilteredClasificados([]);
    setSelectedSubcategoria(subcategoria);
    setSelectedSubsubcategoria(null);
    setMostrarSubsubcategorias(true);
  
    const filteredClasificados = newsPosts.filter(post =>
      post.category === selectedCategoria && (subcategoria ? post.subcategory === subcategoria : true)
    );
    setPaginaActual(1);
    setFilteredClasificados(filteredClasificados);
  
    const uniqueSubsubcategorias = [
      ...new Set(filteredClasificados.filter(post => post.subcategory === subcategoria).map(post => post.subsubcategory))
    ];
    const sortedSubsubcategorias = uniqueSubsubcategorias.sort();
    setSubsubcategorias(sortedSubsubcategorias);
    setSelectedSubsubcategoria(sortedSubsubcategorias[0] || null);
    setMostrarTodasSubsubcategorias(true);
    setSortedSubsubcategorias(sortedSubsubcategorias);
  };
  

  export const handleMostrarTodasClick = (
    newsPosts,
    setClasificados,
    clasificadosPorPagina,
    setSubcategorias,
    setSubsubcategorias,
    setSelectedCategoria,
    setSelectedSubcategoria,
    setSelectedSubsubcategoria,
    setFilteredClasificados,
    setSortedSubsubcategorias,
    setMostrarTodasSubcategorias,
    setMostrarTodasSubsubcategorias
  ) => {
    setClasificados(newsPosts); // Set to full newsPosts list, not sliced
    setSubcategorias([]);
    setSubsubcategorias([]);
    setSelectedCategoria(null);
    setSelectedSubcategoria(null);
    setSelectedSubsubcategoria(null);
    setFilteredClasificados([]);
    setSortedSubsubcategorias([]);
    setMostrarTodasSubcategorias(false);
    setMostrarTodasSubsubcategorias(false);
  };
  
  export const handleClasificadoClick = (clasificado, setSelectedClasificado, setModalVisible) => {
    setSelectedClasificado(clasificado);
    setModalVisible(true);
  };
  
  export const closeModal = (setModalVisible) => {
    setModalVisible(false);
  };
  
  export const openWebPage = (url) => {
    window.open(url, "_blank");
  };