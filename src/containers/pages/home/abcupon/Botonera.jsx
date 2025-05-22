import React, { useState, useEffect } from 'react';
import FileDataService from '../../../../services/files';
import { useMediaQuery } from "react-responsive";
import { useSelector } from 'react-redux';
import Fuse from 'fuse.js';
import { normalizeString } from '../directorio_comercial/utils';
import img1 from '../../../../assets/categorias/1-.webp';
import img2 from '../../../../assets/categorias/2.webp';
import img3 from '../../../../assets/categorias/3.webp';
import img4 from '../../../../assets/categorias/4.webp';
import img5 from '../../../../assets/categorias/5.webp';
import img6 from '../../../../assets/categorias/6.webp';
import img7 from '../../../../assets/categorias/7.webp';
import img8 from '../../../../assets/categorias/8.webp';
import img9 from '../../../../assets/categorias/9.webp';
import img10 from '../../../../assets/categorias/10.webp';
import img11 from '../../../../assets/categorias/11.webp';
import img12 from '../../../../assets/categorias/12.webp';
import img13 from '../../../../assets/categorias/13.webp';
import img14 from '../../../../assets/categorias/14.webp';
import img15 from '../../../../assets/categorias/15.webp';
import img16 from '../../../../assets/categorias/16.webp';
import img17 from '../../../../assets/categorias/17.webp';
import img18 from '../../../../assets/categorias/18.webp';
import img19 from '../../../../assets/categorias/19.webp';
import img20 from '../../../../assets/categorias/20.webp';
import img21 from '../../../../assets/categorias/21.webp';
import img22 from '../../../../assets/categorias/22.webp';
import img23 from '../../../../assets/categorias/23.webp';
import img24 from '../../../../assets/categorias/24.webp';
import ABCupon from '../../../../assets/categorias/logo_huevo.png';
import Category from '../../../../components/json/category.json';

const values = [
  {
    id: 1,
    icon: <img src={img1} alt="Categoría 1. Autos y Accesorios AB" />,
    title: "1. Autos y accesorios AB",
    route: "/vehiculosrepuestosytalleres",
  },
  {
    id: 2,
    icon: <img src={img2} alt="Categoría 2. Bolsa de Empleo AB" />,
    title: "2. Bolsa de empleo AB",
  },
  {
    id: 3,
    icon: <img src={img3} alt="Categoría 3. Casas, Lotes y Boncre" />,
    title: "3. Casas, lotes y boncre",
    route: "/casasylotes",
  },
  {
    id: 4,
    icon: <img src={img4} alt="Categoría 4. Clinica Salud y Estetica" />,
    title: "4. Clinicas, salud y estética",
    route: "/clinicassaludyestetica",
  },
  {
    id: 5,
    icon: <img src={img5} alt="Categoría 5. Comunicación, Tecnología y Energía" />,
    title: "5. Comunicación, tecnología y energía",
    route: "/comunicaciontecnologiayenergia",
  },
  {
    id: 6,
    icon: <img src={img6} alt="Categoría 6. Construcción, Diseño y Supervisión" />,
    title: "6. Construcción, diseño y supervisión",
    route: "/construcciondisenoysupervicion",
  },
  {
    id: 7,
    icon: <img src={img7} alt="Categoría 7. Cupones de Descuento de Inversión e Intercambio" />,
    title: "7. Cupones de descuento de inversión e intercambio",
    route: "/cuponesdedescuento",
  },
  {
    id: 8,
    icon: <img src={img8} alt="Categoría 8. Centros de Educación y Universidades" />,
    title: "8. Centros de educacion y universidades",
    route: "/centroseducativos",
  },
  {
    id: 9,
    icon: <img src={img9} alt="Categoría 9. Entretenimiento, Diversión y Restaurantes" />,
    title: "9. Entretenimiento, diversión y restaurante",
    route: "/entretenimientorestaurantesyturismo",
  },
  {
    id: 10,
    icon: <img src={img10} alt="Categoría 10. Ferretería y Depósito" />,
    title: "10. Ferretería y depósito",
    route: "/ferreteriaydeposito",
  },
  {
    id: 11,
    icon: <img src={img11} alt="Categoría 11. Hogar, Tienda, Electrónica y Supermercados" />,
    title: "11. Hogar, tienda, electronica y supermercado",
    route: "/hogartiendayelectronica",
  },
  {
    id: 12,
    icon: <img src={img12} alt="Categoría 12. Planes de Inversión, Portafolio Inmobiliario" />,
    title: "12. Planes de inversión, portafolio inmobiliario",
    route: "/plataformadeinversiones",
  },
  {
    id: 13,
    icon: <img src={img13} alt="Categoría 13. Legal y Notariado" />,
    title: "13. Legal y notariado",
    route: "/legalynotariado",
  },
  {
    id: 14,
    icon: <img src={img14} alt="Categoría 14. Librería AB" />,
    title: "14. Librería AB",
    route: "/libreriayeditoriales",
  },
  {
    id: 15,
    icon: <img src={img15} alt="Categoría 15. Catálogo, Ofertas y Subastas" />,
    title: "15. Catalogo, ofertas y subastas",
    route: "/ofertasysubastas",
  },
  {
    id: 16,
    icon: <img src={img16} alt="Categoría 16. Noticias AB" />,
    title: "16. Noticias AB",
    route: "/noticiasyavisosclasificados",
  },
  {
    id: 17,
    icon: <img src={img17} alt="Categoría 17. Póliza y Seguros AB" />,
    title: "17. Póliza y seguros AB",
    route: "/polizayseguros",
  },
  {
    id: 18,
    icon: <img src={img18} alt="Categoría 18. Préstamos Privados Sobre Propiedades" />,
    title: "18. Préstamos privados sobre propiedades",
    route: "/prestamosyrescatesobrepropiedades",
  },
  {
    id: 19,
    icon: <img src={img19} alt="Categoría 19. Productos y Servicios Cooperativos" />,
    title: "19. Productos y servicios cooperativos",
    route: "/productosyservicioscooperativos",
  },
  {
    id: 20,
    icon: <img src={img20} alt="Categoría 20. Combos de Publicidad y Páginas Web" />,
    title: "20. Combos de publicidad y paginas web",
    route: "/publicidadypaginasweb",
  },
  {
    id: 21,
    icon: <img src={img21} alt="Categoría 21. Fundación Eslabonescr.com" />,
    title: "21. Fundacion eslabonescr.com",
    route: "/fundacioneslabones",
  },
  {
    id: 22,
    icon: <img src={img22} alt="Categoría 22. Esencial Costa Rica: Hoteles y Turismo" />,
    title: "22. Escencial Costa Rica hoteles y turismo",
    route: "/hotelesturismo",
  },
  {
    id: 23,
    icon: <img src={img23} alt="Categoría 23. Transporte y Mensajería" />,
    title: "23. Transporte y mensajería",
    route: "/transporteymensajeria",
  },
  {
    id: 24,
    icon: <img src={img24} alt="Categoría 24. Directorio Comercial C.R" />,
    title: "24. Directorio comercial abcupon.com",
    route: "/directoriocomercial",
  },
];

const Botonera = ({
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedSubsubcategory,
  setSelectedSubsubcategory
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [fuse, setFuse] = useState(null);
  const token = useSelector(state => state.authentication.token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });

  useEffect(() => {
    fetchImage();
    // Initialize Fuse.js for categories
    const fuseOptions = {
      keys: ['nombre'],
      threshold: 0.3, // Adjust for sensitivity (0.0 = exact match, 1.0 = very loose)
      includeScore: true,
      getFn: (obj, path) => normalizeString(obj[path]),
    };
    setFuse(new Fuse(Category.categorias, fuseOptions));
  }, []);

  const fetchImage = () => {
    FileDataService.getAll(token)
      .then(response => {
        const chipsImage = response.data.find(file => file.name === 'Chips');
        if (chipsImage) {
          setImageUrl(chipsImage.file);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const findBestMatch = (input, items, key = 'nombre') => {
    if (!fuse || !input || !items) return null;
    const normalizedInput = normalizeString(input);
    const tempFuse = new Fuse(items, {
      keys: [key],
      threshold: 0.3,
      includeScore: true,
      getFn: (obj, path) => normalizeString(obj[path]),
    });
    const results = tempFuse.search(normalizedInput);
    return results.length > 0 ? results[0].item : null;
  };

  const openModal = (categoryTitle) => {
    const normalizedTitle = normalizeString(categoryTitle);
    const matchedCategory = fuse.search(normalizedTitle)[0]?.item || Category.categorias.find(cat => normalizeString(cat.nombre) === normalizedTitle);
    if (matchedCategory) {
      setCurrentCategory(matchedCategory);
      setExpandedSubcategories({});
      setIsModalOpen(true);
      setSelectedCategory(matchedCategory.nombre);
      setSelectedSubcategory(null);
      setSelectedSubsubcategory(null);
      console.log("Categoría seleccionada:", matchedCategory.nombre);
    } else {
      console.warn("No se encontró la categoría:", categoryTitle);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
    setExpandedSubcategories({});
  };

  const toggleSubcategory = (subcatName) => {
    const normalizedSubcat = normalizeString(subcatName);
    const matchedSubcat = findBestMatch(normalizedSubcat, currentCategory?.subcategorias || []);
    if (matchedSubcat) {
      setExpandedSubcategories(prev => ({
        ...prev,
        [matchedSubcat.nombre]: !prev[matchedSubcat.nombre]
      }));
      setSelectedSubcategory(matchedSubcat.nombre);
      setSelectedSubsubcategory(null);
      console.log("Subcategoría seleccionada:", matchedSubcat.nombre);
    } else {
      console.warn("No se encontró la subcategoría:", subcatName);
    }
  };

  const selectSubsubcategory = (subsubcat) => {
    const normalizedSubsubcat = normalizeString(subsubcat);
    const subcatWithSubsubcats = currentCategory?.subcategorias.find(subcat => 
      subcat.subsubcategorias?.some(ssc => normalizeString(ssc) === normalizedSubsubcat)
    );
    if (subcatWithSubsubcats) {
      const matchedSubsubcat = subcatWithSubsubcats.subsubcategorias.find(ssc => 
        normalizeString(ssc) === normalizedSubsubcat
      );
      if (matchedSubsubcat) {
        setSelectedSubsubcategory(matchedSubsubcat);
        console.log("Subsubcategoría seleccionada:", matchedSubsubcat);
        closeModal();
      } else {
        console.warn("No se encontró la subsubcategoría:", subsubcat);
      }
    } else {
      console.warn("No se encontró la subsubcategoría:", subsubcat);
    }
  };

  const handleMouseEnter = (event) => {
    const element = event.currentTarget;
    element.style.position = 'relative';

    let overlay = element.querySelector('.green-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'green-overlay';
      overlay.style.position = 'absolute';
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(13, 255, 0, 0.5)';
      overlay.style.pointerEvents = 'none';
      element.appendChild(overlay);
    }
  };

  const handleMouseLeave = (event) => {
    const element = event.currentTarget;
    const overlay = element.querySelector('.green-overlay');
    if (overlay) {
      element.removeChild(overlay);
    }
  };

  return (
    <section>
      <div />
      <div style={{ zoom: isMini ? "50%" : isMobile ? "70%" : "100%", width: '100%' }}>
        <div className="values__right text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'center' }}>
          <h2 style={{ color: 'black', textShadow: '2px 2px 4px black', marginTop: isMini ? "-8%" : isMobile ? "5%" : '3%' }}>
            Botonera de categorías, presionar para ver subcategorías
          </h2>
          <div className="values__wrapper">
            {values.slice(0, 12).map(({ id, icon, title, route }) => (
              <span
                key={id}
                onClick={() => openModal(title)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="values__span"
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  cursor: 'pointer',
                  border: selectedCategory === title ? '2px solid green' : 'none',
                }}
              >
                {React.cloneElement(icon, {
                  style: { width: isMini ? "40vh" : isMobile ? "20vh" : '40vh', height: 'auto', objectFit: 'cover' },
                })}
              </span>
            ))}
          </div>

          <div style={{ width: '100%', textAlign: 'center', margin: '10px 0' }}>
            <img src={ABCupon} alt="ABCupon" style={{ width: isMini ? "40%" : isMobile ? "20%" : '40%', height: 'auto', marginLeft: "30%" }} loading="lazy" />
          </div>
          <div className="values__wrapper">
            {values.slice(12, 24).map(({ id, icon, title, route }) => (
              <span
                key={id}
                onClick={() => openModal(title)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="values__span"
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  cursor: 'pointer',
                  border: selectedCategory === title ? '2px solid green' : 'none',
                }}
              >
                {React.cloneElement(icon, {
                  style: { width: isMini ? "40vh" : isMobile ? "20vh" : '40vh', height: 'auto', objectFit: 'cover' },
                })}
              </span>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
              onClick={closeModal}
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {currentCategory?.nombre}
            </h3>
            <div className="space-y-3">
              {currentCategory?.subcategorias.map((subcat, index) => (
                <div key={index} className="border-b border-gray-200">
                  <button
                    className={`w-full text-left py-3 px-4 flex justify-between items-center hover:bg-gray-100 transition-colors duration-200 ${
                      selectedSubcategory === subcat.nombre ? 'text-green-600 font-semibold' : 'text-gray-700'
                    }`}
                    onClick={() => toggleSubcategory(subcat.nombre)}
                  >
                    <span className="text-lg">{subcat.nombre}</span>
                    <span className="text-gray-500">
                      {expandedSubcategories[subcat.nombre] ? '▲' : '▼'}
                    </span>
                  </button>
                  {expandedSubcategories[subcat.nombre] && subcat.subsubcategorias && (
                    <div className="py-2 bg-gray-50">
                      {subcat.subsubcategorias.map((subsubcat, subIndex) => (
                        <div
                          key={subIndex}
                          className={`py-2 px-6 text-left hover:bg-gray-100 rounded transition-colors duration-200 cursor-pointer ${
                            selectedSubsubcategory === subsubcat ? 'text-green-600 font-semibold' : 'text-gray-600'
                          }`}
                          onClick={() => selectSubsubcategory(subsubcat)}
                        >
                          {subsubcat}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Botonera;