import FileDataService from "../../../../services/files";
import axios from "axios";
import config from "../../../../config/enviroments.ts";
import logo from "../../../../assets/categorias/25.webp";
import image1 from "../../../../assets/categorias/1.webp";
import image2 from "../../../../assets/categorias/2.webp";
import image3 from "../../../../assets/categorias/3.webp";
import image4 from "../../../../assets/categorias/4.webp";
import image5 from "../../../../assets/categorias/5.webp";
import image6 from "../../../../assets/categorias/6.webp";
import image7 from "../../../../assets/categorias/7.webp";
import image8 from "../../../../assets/categorias/8.webp";
import image9 from "../../../../assets/categorias/9.webp";
import image10 from "../../../../assets/categorias/10.webp";
import image11 from "../../../../assets/categorias/11.webp";
import image12 from "../../../../assets/categorias/12.webp";
import image13 from "../../../../assets/categorias/13.webp";
import image14 from "../../../../assets/categorias/14.webp";
import image15 from "../../../../assets/categorias/15.webp";
import image16 from "../../../../assets/categorias/16.webp";
import image17 from "../../../../assets/categorias/17.webp";
import image18 from "../../../../assets/categorias/18.webp";
import image19 from "../../../../assets/categorias/19.webp";
import image20 from "../../../../assets/categorias/20.webp";
import image21 from "../../../../assets/categorias/21.webp";
import image22 from "../../../../assets/categorias/22.webp";
import image23 from "../../../../assets/categorias/23.webp";
import image24 from "../../../../assets/categorias/24.webp";

const images = [
  { src: image1, category: "1. Autos y accesorios AB" },
  { src: image2, category: "2. Bolsa de empleo AB" },
  { src: image3, category: "3. Casas, lotes y boncre" },
  { src: image4, category: "4. Clinicas, salud y estética" },
  { src: image5, category: "5. Comunicación, tecnología y energía" },
  { src: image6, category: "6. Construcción, diseño y supervisión" },
  { src: image7, category: "7. Cupones de descuento de inversión e intercambio" },
  { src: image8, category: "8. Centros de educacion y universidades" },
  { src: image9, category: "9. Entretenimiento, diversión y restaurante" },
  { src: image10, category: "10. Ferretería y depósito" },
  { src: image11, category: "11. Hogar, tienda, electronica y supermercado" },
  { src: image12, category: "12. Planes de inversión, portafolio inmobiliario" },
  { src: image13, category: "13. Legal y notariado" },
  { src: image14, category: "14. Librería AB" },
  { src: image15, category: "15. Catalogo, ofertas y subastas" },
  { src: image16, category: "16. Noticias AB" },
  { src: image17, category: "17. Póliza y seguros AB" },
  { src: image18, category: "18. Préstamos privados sobre propiedades" },
  { src: image19, category: "19. Productos y servicios cooperativos" },
  { src: image20, category: "20. Combos de publicidad y paginas web" },
  { src: image21, category: "21. Fundacion eslabonescr.com" },
  { src: image22, category: "22. Escencial Costa Rica hoteles y turismo" },
  { src: image23, category: "23. Transporte y mensajería" },
  { src: image24, category: "24. Directorio comercial abcupon.com" },
];

export const fetchNewsPosts = async (
  email,
  setNewsPosts,
  setClasificados,
  setClasificadosConImagen,
  setClasificadosSinImagen,
  setClasificadosSinContenido,
  setCategorias,
  setTotalClasificados,
  setCategoriaImages,
  setImagenesPorCategoria,
  clasificadosPorPagina
) => {
  try {
    let allPosts = [];
    let nextUrl = `${config.API_URL}/files/news/?page_size=100`;

    while (nextUrl) {
      const response = await FileDataService.getAllPost(null, 1, 100);
      const data = response.data;
      allPosts = [...allPosts, ...data.results];
      console.log("[Server Classifieds] Raw Posts from Server:", allPosts);
      nextUrl = data.next;
      if (nextUrl) {
        FileDataService.getAllPost = (token, page, pageSize) =>
          axios.get(nextUrl, {
            headers: token ? { Authorization: `Token ${token}` } : {},
          });
      }
    }

    // Filter posts by email
    const postsConEmail = allPosts.filter((post) => post.url.includes(email));

    // Validate categories and assign images
    const validCategories = images.map((img) => img.category);
    const validatedPosts = postsConEmail.map((post) => {
      if (!validCategories.includes(post.category)) {
        console.warn(
          `Category "${post.category}" for post ID ${post.id} is not valid. Assigning default image.`
        );
        return { ...post, categoryImage: logo };
      }
      const matchingImage = images.find((img) => img.category === post.category);
      return { ...post, categoryImage: matchingImage ? matchingImage.src : logo };
    });

    // Sort posts by category number
    const sortedPosts = validatedPosts.sort((a, b) => {
      const numA = parseInt(a.category.split(".")[0]);
      const numB = parseInt(b.category.split(".")[0]);
      return numA === numB ? a.category.localeCompare(b.category) : numA - numB;
    });

    // Update state with sorted and validated posts
    setNewsPosts(sortedPosts);
    setClasificados(sortedPosts);
    setClasificadosConImagen(
      sortedPosts.filter((post) => post.content && post.content_type === "clasificado")
    );
    setClasificadosSinImagen(
      sortedPosts.filter((post) => !post.content || post.content_type !== "clasificado")
    );
    setClasificadosSinContenido(sortedPosts.filter((post) => !post.content));

    // Extract and sort unique categories
    const uniqueCategories = [...new Set(sortedPosts.map((post) => post.category))];
    const sortedCategories = uniqueCategories.sort((a, b) => {
      const numA = parseInt(a.split(".")[0]);
      const numB = parseInt(b.split(".")[0]);
      return numA - numB;
    });

    // Create category images mapping
    const categoriaImagesObj = {};
    sortedCategories.forEach((categoria) => {
      const matchingImage = images.find((img) => img.category === categoria);
      categoriaImagesObj[categoria] = matchingImage ? matchingImage.src : logo;
    });

    setCategoriaImages(categoriaImagesObj);
    setCategorias(sortedCategories);
    setTotalClasificados(sortedPosts.length);
    setImagenesPorCategoria(categoriaImagesObj);
  } catch (error) {
    console.error("Error fetching news posts:", error);
  }
};