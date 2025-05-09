import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import ProductDataService from "../../../../services/products";
import Publicidad from "../../../../assets/catalogo/webp/visibilidad.webp";
import Portada from "../../../../assets/catalogo/webp/portada.webp";
import Contraportada from "../../../../assets/catalogo/webp/contraportada.webp";
import Quienessomos from "../../../../assets/catalogo/webp/quienessomos.webp";
import { useMediaQuery } from "react-responsive";
import Modal from "react-modal";
import "./SubproductDetails.css";
import Avisoseconomicos from "../../avisos_economicos/details/Avisos_clasificados_individual";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import config from "../../../../config/enviroments.ts";

Modal.setAppElement("#root");

const SubproductDetails = () => {
  const location = useLocation();
  const { subproductId } = useParams(); // subproductId is the email
  const [subproductData, setSubproductData] = useState(null);
  const [subCombos, setCombos] = useState([]);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [consulta, setConsulta] = useState("");
  const [services, setServices] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [comboQuantities, setComboQuantities] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [businessHours, setBusinessHours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const componentRef = useRef();
  const componentRef1 = useRef();
  const [carouselPosition, setCarouselPosition] = useState(0);
  const carouselRef = useRef(null);

   // Helper function to prepend API URL to media paths
   const getMediaUrl = (path) => {
    if (!path) return Publicidad;
    if (path.startsWith("http")) return path;
    return `${config.API_URL}${path}`;
  };
// Effect for carousel animation
useEffect(() => {
  if (coupons.length <= 3) {
    // For 3 or fewer coupons, loop them to create a continuous effect
    const interval = setInterval(() => {
      setCarouselPosition((prev) => {
        const maxPosition = -(coupons.length * 33.33); // Each coupon takes ~33.33% width
        if (prev <= maxPosition) {
          return 0; // Reset to start
        }
        return prev - 0.1; // Move slowly (adjust speed by changing this value)
      });
    }, 50); // Adjust interval for smoother/slower animation
    return () => clearInterval(interval);
  } else {
    // For more than 3 coupons, slide until the end and reset
    const interval = setInterval(() => {
      setCarouselPosition((prev) => {
        const maxPosition = -((coupons.length - 3) * 33.33);
        if (prev <= maxPosition) {
          return 0;
        }
        return prev - 0.1;
      });
    }, 50);
    return () => clearInterval(interval);
  }
}, [coupons.length]);
  // Fetch subproduct data by email
  useEffect(() => {
    const fetchSubproductData = async () => {
      if (!subproductId) return;

      setIsLoading(true);
      try {
        const response = await ProductDataService.getSubProductByEmail(subproductId);
        console.log("subproducto123", response);
        const { subproduct, services, combos, team_members, coupons, business_hours } = response.data;

        // Prepend API URL to media paths
        const updatedSubproduct = {
          ...subproduct,
          logo: subproduct.logo ? getMediaUrl(subproduct.logo) : null,
          file: subproduct.file ? getMediaUrl(subproduct.file) : null,
        };
        const updatedCoupons = coupons.map(coupon => ({
          ...coupon,
          image: coupon.image ? getMediaUrl(coupon.image) : Publicidad,
        }));
        const updatedTeamMembers = team_members.map(member => ({
          ...member,
          photo: member.photo ? getMediaUrl(member.photo) : Publicidad,
        }));

        setSubproductData(updatedSubproduct);
        setServices(services || []);
        setCombos(combos || []);
        setTeamMembers(updatedTeamMembers || []);
        setCoupons(updatedCoupons || []);
        setBusinessHours(business_hours || []);
      } catch (error) {
        console.error("Error fetching subproduct data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubproductData();
  }, [subproductId]);

  // Funciones memoizadas
  const handleInputChange = useCallback(
    (e) => setSearchTerm(e.target.value),
    []
  );
  const handleSearch = useCallback(() => setQuery(searchTerm), [searchTerm]);

  const filteredServices = useMemo(() => {
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [services, query]);

  const calculateSubtotal = useCallback(
    (price, serviceId) => (quantities[serviceId] || 0) * price,
    [quantities]
  );
  const calculateTotal = useCallback(
    () =>
      services.reduce(
        (total, service) =>
          total + calculateSubtotal(service.price, service.id),
        0
      ),
    [services, calculateSubtotal]
  );
  const calculateComboSubtotal = useCallback(
    (combo) => (comboQuantities[combo.id] || 0) * combo.price,
    [comboQuantities]
  );
  const calculateTotalCombos = useCallback(
    () =>
      subCombos.reduce(
        (total, combo) => total + calculateComboSubtotal(combo),
        0
      ),
    [subCombos, calculateComboSubtotal]
  );

  const openWhatsAppModal = () => setShowWhatsAppModal(true);
  const closeWhatsAppModal = () => setShowWhatsAppModal(false);

  const sendWhatsAppMessage = () => {
    if (!subproductData || !subproductData.phone) return;
    const selectedServices = services.filter(
      (service) => quantities[service.id] > 0
    );
    const selectedCombos = subCombos.filter(
      (combo) => comboQuantities[combo.id] > 0
    );

    if (selectedServices.length > 0 || selectedCombos.length > 0) {
      const message = `Nombre: ${name}\nApellido: ${lastName}\nCorreo: ${email}\nConsulta: ${consulta}\n\n`;
      const servicesMessage = selectedServices.map(
        (service) =>
          `${quantities[service.id]}x ${service.name} - ₡${
            service.price
          } c/u = ₡${calculateSubtotal(service.price, service.id)}`
      );
      const combosMessage = selectedCombos.map(
        (combo) =>
          `${comboQuantities[combo.id]}x ${combo.name} - ₡${
            combo.price
          } c/u = ₡${calculateComboSubtotal(combo)}`
      );
      const totalPrice = calculateTotal() + calculateTotalCombos();
      const finalMessage = `${message}${servicesMessage.join(
        "\n"
      )}\n${combosMessage.join("\n")}\nTotal: ₡${totalPrice.toLocaleString(
        "es-CR"
      )}`;
      const whatsappLink = `https://api.whatsapp.com/send?phone=506${
        subproductData.phone_number
      }&text=${encodeURIComponent(finalMessage)}`;
      window.open(whatsappLink, "_blank");
      closeWhatsAppModal();
    } else {
      alert("No hay servicios o combos seleccionados para enviar el mensaje.");
    }
  };

  const openURL = () =>
    subproductData?.url && window.open(subproductData.url, "_blank");

  const getImageType = (image) =>
    image.startsWith("data:image/")
      ? image.split(";")[0].split(":")[1]
      : "image/jpeg";

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Cotización", 10, 10);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 255);
    doc.text(`Nombre: ${subproductData.name}`, 10, 20);
    doc.text(`Teléfono: ${subproductData.phone}`, 10, 30);
    doc.text(`Correo: ${subproductData.email}`, 10, 40);

    if (subproductData.logo) {
      try {
        doc.addImage(
          subproductData.logo,
          getImageType(subproductData.logo).split("/")[1].toUpperCase(),
          150,
          10,
          50,
          20
        );
      } catch (error) {
        console.error("Error al agregar la imagen:", error);
      }
    }

    doc.setFontSize(14);
    doc.setTextColor(255, 0, 0);
    doc.text("Servicios", 10, 50);
    doc.setTextColor(0, 0, 0);

    let yPosition = 60;
    doc.text("Descripción", 10, yPosition);
    doc.text("Precio", 100, yPosition);
    doc.text("Cantidad", 140, yPosition);
    doc.text("Subtotal", 180, yPosition);
    yPosition += 10;

    services.forEach((service, index) => {
      const subtotal = calculateSubtotal(service.price, service.id);
      const serviceName = `${index + 1}. ${service.name}`;
      const nameLines = doc.splitTextToSize(serviceName, 90);
      nameLines.forEach((line, lineIndex) =>
        doc.text(line, 10, yPosition + lineIndex * 10)
      );
      yPosition += nameLines.length * 5;
      doc.text(`(CR) ${service.price.toLocaleString("es-CR")}`, 100, yPosition);
      doc.text(`${quantities[service.id] || 0}`, 140, yPosition);
      doc.text(`${subtotal.toLocaleString("es-CR")}`, 180, yPosition);
      yPosition += 10;
    });

    const totalPrice = calculateTotal();
    doc.text(
      `Total: (CR) ${totalPrice.toLocaleString("es-CR")}`,
      10,
      yPosition + 10
    );
    doc.setFontSize(10);
    doc.text("Cotización realizada desde ABCupon 2024", 100, yPosition + 30, {
      align: "center",
    });
    doc.save(`Cotizacion-${subproductData.name}.pdf`);
  };

  const generatePDF1 = () => {
    const input = componentRef.current;
    const originalWidth = input.style.width;
    const originalFontSize = input.style.fontSize;
    const originalTransform = input.style.transform;
    const categoriaElement = input.querySelector(".categoria-upper");
    const originalMarginTop = categoriaElement.style.marginTop;
    const originalMarginBottom = categoriaElement.style.marginBottom;

    categoriaElement.style.marginTop = "5px";
    categoriaElement.style.marginBottom = "5px";
    const clasificado1Elements = input.querySelectorAll(".clasificado1");
    clasificado1Elements.forEach((element) =>
      element.classList.remove("clasificado1")
    );

    input.style.width = "1920px";
    input.style.fontSize = "100%";
    input.style.transform = "scale(1)";

    html2canvas(input, { useCORS: true, scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const footerText = "Clasificados económicos realizado en ABCupon.com";
        pdf.setFontSize(10);
        const footerWidth =
          (pdf.getStringUnitWidth(footerText) * pdf.internal.getFontSize()) /
          pdf.internal.scaleFactor;
        const footerX = (pdf.internal.pageSize.getWidth() - footerWidth) / 2;
        const footerY = pdf.internal.pageSize.getHeight() - 10;
        pdf.text(footerText, footerX, footerY);
        pdf.save(`Clasificados-${subproductData.name}.pdf`);
      })
      .finally(() => {
        input.style.width = originalWidth;
        input.style.fontSize = originalFontSize;
        input.style.transform = originalTransform;
        categoriaElement.style.marginTop = originalMarginTop;
        categoriaElement.style.marginBottom = originalMarginBottom;
        clasificado1Elements.forEach((element) =>
          element.classList.add("clasificado1")
        );
      });
  };

  const generatePDF2 = () => {
    const input = componentRef1.current;
    const originalStyles = {
      width: input.style.width,
      fontSize: input.style.fontSize,
      letterSpacing: input.style.letterSpacing,
      wordSpacing: input.style.wordSpacing,
      lineHeight: input.style.lineHeight,
      padding: [],
      borders: [],
      buttonStyles: [],
    };

    const textSliders = input.querySelectorAll(".text-slider-class");
    textSliders.forEach((textSlider) => (textSlider.style.display = "none"));

    input.style.width = "1920px";
    input.style.fontSize = "80%";
    input.style.letterSpacing = "10px";
    input.style.wordSpacing = "1px";

    const h2Elements = input.querySelectorAll("h2");
    const h3Elements = input.querySelectorAll("h3");
    const h4Elements = input.querySelectorAll("h4");
    const tdElements = input.querySelectorAll("td");
    const buttonElements = input.querySelectorAll("button");

    buttonElements.forEach((element, index) => {
      originalStyles.buttonStyles[index] = {
        marginTop: element.style.marginTop,
        lineHeight: element.style.lineHeight,
        letterSpacing: element.style.letterSpacing,
        wordSpacing: element.style.wordSpacing,
      };
      element.style.marginTop = "40px";
      element.style.lineHeight = "3";
      element.style.letterSpacing = "15px";
      element.style.wordSpacing = "5px";
    });

    h2Elements.forEach((element) => {
      element.style.marginTop = "10px";
      element.style.lineHeight = "3";
    });
    h3Elements.forEach((element) => {
      element.style.marginTop = "-30px";
      element.style.lineHeight = "5";
    });
    h4Elements.forEach((element) => {
      element.style.marginTop = "-35px";
      element.style.lineHeight = "2";
      element.style.marginBottom = "10px";
    });
    tdElements.forEach((element, index) => {
      originalStyles.padding[index] = element.style.padding;
      originalStyles.borders[index] = element.style.borderBottom;
      element.style.lineHeight = "2.7";
      element.style.borderBottom = "none";
    });

    html2canvas(input, { useCORS: true, scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width + 50;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(
          imgData,
          "PNG",
          (pdf.internal.pageSize.getWidth() - imgWidth) / 2,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(
            imgData,
            "PNG",
            (pdf.internal.pageSize.getWidth() - imgWidth) / 2,
            position,
            imgWidth,
            imgHeight
          );
          heightLeft -= pageHeight;
        }

        const footerText = "Catálogo digital realizado en ABCupon.com";
        pdf.setFontSize(10);
        const footerWidth =
          (pdf.getStringUnitWidth(footerText) * pdf.internal.getFontSize()) /
          pdf.internal.scaleFactor;
        const footerX = (pdf.internal.pageSize.getWidth() - footerWidth) / 2;
        const footerY = pdf.internal.pageSize.getHeight() - 10;
        pdf.text(footerText, footerX, footerY);
        pdf.save(`Productos-${subproductData.name}.pdf`);
      })
      .finally(() => {
        input.style.width = originalStyles.width;
        input.style.fontSize = originalStyles.fontSize;
        input.style.letterSpacing = originalStyles.letterSpacing;
        input.style.wordSpacing = originalStyles.wordSpacing;
        h2Elements.forEach((element) => (element.style.marginTop = "0"));
        h3Elements.forEach((element) => (element.style.marginTop = "0"));
        h4Elements.forEach((element) => (element.style.marginBottom = "0"));
        tdElements.forEach((element, index) => {
          element.style.padding = originalStyles.padding[index];
          element.style.borderBottom = originalStyles.borders[index];
        });
        buttonElements.forEach((element, index) => {
          element.style.marginTop =
            originalStyles.buttonStyles[index].marginTop;
          element.style.lineHeight =
            originalStyles.buttonStyles[index].lineHeight;
          element.style.letterSpacing =
            originalStyles.buttonStyles[index].letterSpacing;
          element.style.wordSpacing =
            originalStyles.buttonStyles[index].wordSpacing;
        });
        textSliders.forEach(
          (textSlider) => (textSlider.style.display = "block")
        );
      });
  };

  const generatePDF3 = async () => {
    const input1 = componentRef.current;
    if (!input1) {
      const pdf = new jsPDF("p", "mm", "a4");
      const imagePaths = [Portada, Quienessomos, Contraportada];
      const imgWidth = 190;
      const pageHeight = 295;
      const pageWidth = 210;
      const marginLeft = pageWidth * 0.05;
      const marginTop = pageHeight * 0.05;
      const footerText = "Catalogo generado por ABCupon";
      const footerFontSize = 8;
      const footerPositionY = pageHeight - 10;
      let pageNumber = 1;

      for (const path of imagePaths) {
        const img = new Image();
        img.src = path;
        await new Promise((resolve) => {
          img.onload = () => {
            const imgHeight = (img.height * imgWidth) / img.width;
            pdf.addImage(
              img.src,
              "PNG",
              marginLeft,
              marginTop,
              imgWidth - marginLeft,
              imgHeight
            );
            pdf.setFontSize(footerFontSize);
            pdf.text(footerText, pageWidth / 2, footerPositionY, {
              align: "center",
            });
            pdf.text(`Página ${pageNumber}`, pageWidth - 20, footerPositionY, {
              align: "right",
            });
            pageNumber++;
            resolve();
          };
        });
        if (path !== imagePaths[imagePaths.length - 1]) pdf.addPage();
      }
      pdf.save(`Catalogo predeterminado.pdf`);
      return;
    }

    const originalStyles1 = {
      width: input1.style.width,
      fontSize: input1.style.fontSize,
      transform: input1.style.transform,
    };
    const clasificado1Elements = input1.querySelectorAll(".clasificado1");
    clasificado1Elements.forEach((element) =>
      element.classList.remove("clasificado1")
    );

    input1.style.width = "1920px";
    input1.style.fontSize = "100%";
    input1.style.transform = "scale(1)";

    const canvas1 = await html2canvas(input1, { useCORS: true, scale: 2 });
    const imgData1 = canvas1.toDataURL("image/jpeg", 1.5);

    Object.keys(originalStyles1).forEach(
      (style) => (input1.style[style] = originalStyles1[style])
    );
    clasificado1Elements.forEach((element) =>
      element.classList.add("clasificado1")
    );

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const pageHeight = 295;
    const pageWidth = 210;
    const marginLeft = pageWidth * 0.05;
    const marginTop = pageHeight * 0.05;
    const footerText = "Catalogo generado por ABCupon";
    const footerFontSize = 8;
    const footerPositionY = pageHeight - 10;
    let pageNumber = 1;

    const imagePaths = [Portada, Quienessomos];
    for (const path of imagePaths) {
      const img = new Image();
      img.src = path;
      await new Promise((resolve) => {
        img.onload = () => {
          const imgHeight = (img.height * imgWidth) / img.width;
          pdf.addImage(
            img.src,
            "PNG",
            marginLeft,
            marginTop,
            imgWidth - marginLeft,
            imgHeight
          );
          pdf.setFontSize(footerFontSize);
          pdf.text(footerText, pageWidth / 2, footerPositionY, {
            align: "center",
          });
          pdf.text(`Página ${pageNumber}`, pageWidth - 20, footerPositionY, {
            align: "right",
          });
          pageNumber++;
          resolve();
        };
      });
      pdf.addPage();
    }

    const imgHeight1 = (canvas1.height * imgWidth) / canvas1.width;
    const adjustedHeight = imgHeight1 * 1.27;
    pdf.addImage(
      imgData1,
      "PNG",
      marginLeft,
      10,
      imgWidth - marginLeft,
      adjustedHeight
    );
    pdf.setFontSize(footerFontSize);
    pdf.text(`Página ${pageNumber}`, pageWidth - 20, footerPositionY);
    pageNumber++;

    let heightLeft = adjustedHeight - pageHeight;
    const adjustedHeight1 = imgHeight1 * 1.23;
    while (heightLeft > 0) {
      const position = heightLeft - adjustedHeight + 20;
      pdf.addPage();
      pdf.addImage(
        imgData1,
        "PNG",
        marginLeft,
        position,
        imgWidth - marginLeft,
        adjustedHeight1
      );
      pdf.text(`Página ${pageNumber}`, pageWidth - 20, footerPositionY);
      pageNumber++;
    }

    const ContraportadaImage = new Image();
    ContraportadaImage.src = Contraportada;
    await new Promise((resolve) => {
      ContraportadaImage.onload = () => {
        const imgHeight =
          (ContraportadaImage.height * imgWidth) / ContraportadaImage.width;
        pdf.addPage();
        pdf.addImage(
          ContraportadaImage.src,
          "PNG",
          marginLeft,
          marginTop,
          imgWidth - marginLeft,
          imgHeight
        );
        pdf.text(footerText, pageWidth / 2, footerPositionY, {
          align: "center",
        });
        pdf.text(`Página ${pageNumber}`, pageWidth - 20, footerPositionY);
        resolve();
      };
    });

    pdf.save(`Catalogo de ${subproductData.name}.pdf`);
  };

  const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(":");
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const period = hour >= 12 ? "PM" : "AM";
    return `${formattedHour}:${minute} ${period}`;
  };

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", fontSize: "2em", marginTop: "20%" }}>
        Cargando pagina de presentación...
      </div>
    );
  }

  // Prepare SEO meta description (truncate to 160 characters)
  const metaDescription = subproductData?.description
    ? subproductData.description.length > 160
      ? `${subproductData.description.substring(0, 157)}...`
      : subproductData.description
    : `Descubre ${subproductData?.name} en ABCupon, tu directorio de comercios.`;

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>
          {subproductData?.name
            ? `${subproductData.name} | ABCupon Directorio de Comercios`
            : "Directorio de Comercios ABCupon"}
        </title>
        <meta name="description" content={metaDescription} />
        <meta
          name="keywords"
          content={`${subproductData?.name}, ABCupon, directorio de comercios, ${subproductData?.comercial_activity}, servicios locales`}
        />
        <meta
          property="og:title"
          content={
            subproductData?.name
              ? `${subproductData.name} | ABCupon`
              : "Directorio de Comercios ABCupon"
          }
        />
        <meta property="og:description" content={metaDescription} />
        <meta
          property="og:image"
          content={subproductData?.logo || Publicidad}
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div
        style={{
          zoom: isMini ? "60%" : "100%",
          marginTop: isMini ? "20%" : "0%",
        }}
      >
        <br />
        <br />
        <br />
        <br />
        {subproductData && (
          <div>
            <div
              style={{
                border: "2px solid #ccc",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "5px 5px 10px #888888",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                marginBottom: "20px",
                lineHeight: "1.5",
              }}
            >
              {subproductData.logo ? (
                <img
                  src={subproductData.logo}
                  alt={`Logo de ${subproductData.name}`}
                  style={{
                    maxWidth: "80vh",
                    maxHeight: "80vh",
                    border: "2px solid red",
                    boxShadow: "0 0 10px black",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <img
                  src={Publicidad}
                  alt={`Publicidad de ${subproductData.name} en ABCupon`}
                  style={{
                    maxWidth: "50%",
                    maxHeight: "80vh",
                    border: "2px solid red",
                    boxShadow: "0 0 10px black",
                    borderRadius: "10px",
                  }}
                />
              )}

              <h1
                style={{
                  fontSize: "3em",
                  color: "red",
                  textShadow: "2px 2px 4px #000",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  marginTop: "10px",
                  textAlign: "left",
                }}
              >
                {subproductData.name}
              </h1>
              <h3
                style={{
                  fontSize: "2em",
                  color: "red",
                  textShadow: "2px 2px 2px #000",
                  fontWeight: "bold",
                  marginTop: "0px",
                  marginBottom: "20px",
                  textAlign: "left",
                }}
              >
                {subproductData.comercial_activity}
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  padding: "2rem",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  maxWidth: isMobile ? "100%" : "80%",
                  margin: "0 auto",
                  lineHeight: "1.5",
                }}
              >
                {coupons?.length > 0 && (
  <div style={{ width: "100%", overflow: "hidden" }}>
    <strong style={{ fontSize: "1.2em" }}>Promociones:</strong>
    <div
      ref={carouselRef}
      style={{
        display: "flex",
        flexWrap: "nowrap", // Prevent wrapping to ensure horizontal sliding
        marginTop: "1rem",
        transform: `translateX(${carouselPosition}%)`,
        transition: "transform 0.05s linear", // Smooth sliding
        width: `${coupons.length * 33.33}%`, // Total width based on number of coupons
      }}
    >
      {coupons.concat(coupons.length <= 3 ? coupons : []).map((coupon, index) => {
        const discountedPrice = (
          coupon.price *
          (1 - coupon.discount / 100)
        ).toFixed(2);

        return (
          <div
            key={`${coupon.id}-${index}`} // Unique key for duplicated coupons
            style={{
              width: "30%", // Maintain original width
              marginBottom: "1rem",
              padding: "1rem",
              textAlign: "left",
              border: "1px solid #ddd",
              borderRadius: "8px",
              transition: "transform 0.2s ease, background-color 0.3s ease",
              boxSizing: "border-box",
              backgroundColor: "#fff",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              position: "relative",
              flexShrink: 0, // Prevent shrinking
              marginRight: "3.33%", // Space between coupons
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f9f9f9")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "white")
            }
          >
            <div
              style={{
                height: "200px",
                overflow: "hidden",
                borderRadius: "8px",
              }}
            >
              <img
                src={coupon.image}
                alt={`Cupón ${coupon.name} de ${subproductData.name}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                  transition: "transform 0.2s ease",
                }}
              />
            </div>
            <h3
              style={{
                fontSize: "1.2em",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                height: "50px",
              }}
            >
              {coupon.name}
            </h3>
            <p
              style={{
                fontSize: "0.9em",
                marginTop: "0.5rem",
                color: "#666",
                flex: 1,
              }}
            >
              {coupon.description.split(" ").length > 40
                ? `${coupon.description
                    .split(" ")
                    .slice(0, 40)
                    .join(" ")}...`
                : coupon.description}
            </p>
            <div style={{ marginTop: "1rem" }}>
              <p
                style={{
                  fontSize: "1.1em",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Ahorra hasta{" "}
                <span style={{ color: "#e74c3c" }}>
                  {coupon.discount}%
                </span>
              </p>
              <p
                style={{ fontSize: "1.2em", marginTop: "0.5rem" }}
              >
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "red",
                    marginRight: "8px",
                  }}
                >
                  Desde ₡{coupon.price}
                </span>
                <span
                  style={{
                    fontSize: "1.2em",
                    fontWeight: "bold",
                    color: "#28a745",
                  }}
                >
                  ₡{discountedPrice}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

                <p
                  style={{
                    fontSize: "1.2em",
                    marginBottom: "1rem",
                    color: "#333",
                  }}
                >
                  <strong>Correo:</strong>{" "}
                  {isMobile && subproductData.email.length > 50
                    ? subproductData.email
                        .match(/.{1,50}/g)
                        .map((line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))
                    : subproductData.email}
                </p>

                <p
                  style={{
                    fontSize: "1.2em",
                    marginBottom: "1rem",
                    color: "#333",
                  }}
                >
                  <strong>Teléfono:</strong>{" "}
                  {subproductData.phone
                    ?.replace(/\s+/g, "")
                    .replace(/^(\d{4})(\d{0,4})$/, "$1-$2") || "N/A"}
                </p>

                <div
                  style={{
                    fontSize: "1.2em",
                    marginBottom: "1rem",
                    color: "#333",
                    textAlign: "justify",
                  }}
                >
                  <strong>Descripción:</strong>
                  <ul
                    style={{
                      paddingLeft: "1.2em",
                      marginTop: "0.5rem",
                      listStyleType: "disc",
                      lineHeight: "1.6",
                    }}
                  >
                    {subproductData.description ? (
                      subproductData.description
                        .split(/\n+/)
                        .map((sentence, index) => {
                          if (
                            sentence.includes("Paquete Básico") ||
                            sentence.includes("¿Cómo contratar?") ||
                            sentence.includes("¿Cómo funciona?") ||
                            sentence.includes("Condiciones:") ||
                            sentence.includes(
                              "Las 24 Categorías para Anunciarte:"
                            ) ||
                            sentence.includes("¡Anúnciate hoy!")
                          ) {
                            return (
                              <li
                                key={index}
                                style={{
                                  marginBottom: "0.5rem",
                                  listStyleType: "none",
                                }}
                              >
                                <strong>{sentence.trim()}</strong>
                              </li>
                            );
                          } else if (sentence.trim() === "") {
                            return null;
                          } else {
                            return (
                              <li key={index} style={{ marginBottom: "0.5rem" }}>
                                {sentence.trim()}
                              </li>
                            );
                          }
                        })
                    ) : (
                      <li>
                        ¿Deseas rellenar con la información de su negocio?
                        Contacténos al 8687-6767
                      </li>
                    )}
                  </ul>
                </div>

                <div
                  style={{
                    fontSize: "1.2em",
                    marginBottom: "1rem",
                    color: "#333",
                    marginRight: "32%",
                    lineHeight: "1.5",
                  }}
                >
                  <p>
                    <strong>Contacto:</strong> {subproductData.contact_name}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: "1.2em",
                    marginBottom: "1rem",
                    color: "#333",
                    lineHeight: "1.5",
                  }}
                >
                  <strong>País:</strong> {subproductData.country}
                </p>

                <p
                  style={{
                    fontSize: "1.2em",
                    marginBottom: "1rem",
                    color: "#333",
                    marginRight: "24%",
                  }}
                >
                  <strong>Método de Pago:</strong> {subproductData.pay_method}
                </p>

                <p
                  style={{
                    fontSize: isMobile ? "1.0em" : "1.2em",
                    cursor: "pointer",
                    marginRight: "40%",
                    color: "#007bff",
                    textDecoration: "underline",
                    wordBreak: "break-word",
                    maxWidth: isMobile ? "90%" : "100%",
                    whiteSpace: "normal",
                  }}
                  onClick={openURL}
                >
                  <strong>URL: </strong>
                  {subproductData.url}
                </p>

                <p
                  style={{
                    fontSize: "1.2em",
                    marginBottom: "1rem",
                    color: "#333",
                    marginRight: "24%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <strong>Certificado y con depósito de garantía: </strong>
                  {subproductData.certified ? (
                    <span
                      style={{
                        marginLeft: "10px",
                        width: "20px",
                        height: "20px",
                        border: "2px solid #4CAF50",
                        borderRadius: "4px",
                        display: "inline-block",
                        backgroundColor: "#4CAF50",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "white",
                          fontSize: "14px",
                        }}
                      >
                        ✔
                      </span>
                    </span>
                  ) : (
                    <span
                      style={{
                        marginLeft: "10px",
                        width: "20px",
                        height: "20px",
                        border: "2px solid #ccc",
                        borderRadius: "4px",
                        display: "inline-block",
                      }}
                    />
                  )}
                  {!subproductData.certified && (
                    <p style={{ marginTop: "1rem", color: "#333" }}>
                      ¿Quieres ser un proveedor certificado? Consulta al{" "}
                      <strong>8788-6767</strong> cómo ser proveedor certificado de
                      ABCupon.
                    </p>
                  )}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "2rem",
                    textAlign: "center",
                  }}
                >
                  {businessHours?.length > 0 && (
                    <div style={{ flex: 1, marginRight: "1rem" }}>
                      <strong style={{ fontSize: "1.2em" }}>
                        Horarios de Negocio
                      </strong>
                      <table
                        style={{
                          width: "100%",
                          marginTop: "1rem",
                          borderCollapse: "collapse",
                          border: "1px solid #ddd",
                          fontSize: "1.2em",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                padding: "10px",
                                textAlign: "center",
                                backgroundColor: "#f4f4f4",
                                fontSize: "1.2em",
                                color: "#333",
                              }}
                            >
                              Día
                            </th>
                            <th
                              style={{
                                padding: "10px",
                                textAlign: "center",
                                backgroundColor: "#f4f4f4",
                                fontSize: "1.2em",
                                color: "#333",
                              }}
                            >
                              Horario
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {businessHours.map((hours) => {
                            const startTime = convertTo12HourFormat(
                              hours.start_time
                            );
                            const endTime = convertTo12HourFormat(hours.end_time);
                            return (
                              <tr key={hours.id}>
                                <td
                                  style={{
                                    padding: "8px",
                                    textAlign: "center",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  {capitalizeFirstLetter(hours.day)}
                                </td>
                                <td
                                  style={{
                                    padding: "8px",
                                    textAlign: "center",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  {startTime} - {endTime}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {teamMembers?.length > 0 && (
                    <div style={{ flex: 1, marginLeft: "1rem" }}>
                      <strong style={{ fontSize: "1.2em" }}>
                        Miembros del Equipo
                      </strong>
                      <table
                        style={{
                          width: "100%",
                          marginTop: "1rem",
                          borderCollapse: "collapse",
                          border: "1px solid #ddd",
                          fontSize: "1.2em",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                padding: "10px",
                                textAlign: "center",
                                backgroundColor: "#f4f4f4",
                                fontSize: "1.2em",
                                color: "#333",
                              }}
                            >
                              Foto
                            </th>
                            <th
                              style={{
                                padding: "10px",
                                textAlign: "center",
                                backgroundColor: "#f4f4f4",
                                fontSize: "1.2em",
                                color: "#333",
                              }}
                            >
                              Nombre y Posición
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamMembers.map((member) => (
                            <tr key={member.id}>
                              <td
                                style={{
                                  padding: "8px",
                                  textAlign: "center",
                                  border: "1px solid #ddd",
                                }}
                              >
                                <img
                                  src={member.photo}
                                  alt={`Foto de ${member.name} en ${subproductData.name}`}
                                  style={{
                                    width: "300px",
                                    height: "200px",
                                    borderRadius: "50%",
                                  }}
                                />
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  textAlign: "center",
                                  border: "1px solid #ddd",
                                }}
                              >
                                <strong>{member.name}</strong>
                                <p>{member.position}</p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <h2
                style={{
                  fontSize: "2em",
                  color: "red",
                  textShadow: "2px 2px 2px #000",
                  fontWeight: "bold",
                  marginTop: "10px",
                  marginBottom: "20px",
                  textAlign: "center",
                  lineHeight: "1.5",
                }}
              >
                Servicios Ofrecidos
              </h2>

              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Escriba el nombre del servicio que esta interesado"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  fontWeight: "bold",
                  border: "1px solid black",
                  padding: "10px 20px",
                  cursor: "pointer",
                  width: "50%",
                  transition: "background-color 0.3s, color 0.3s",
                  borderRadius: "10px",
                  marginBottom: "2%",
                }}
              />

              <button
                onClick={handleSearch}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  fontWeight: "bold",
                  border: "1px solid black",
                  padding: "10px 20px",
                  cursor: "pointer",
                  width: "50vh",
                  transition: "background-color 0.3s, color 0.3s",
                  borderRadius: "10px",
                  marginBottom: "2%",
                  lineHeight: "1.5",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "green";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "white";
                  e.target.style.color = "black";
                }}
              >
                Presione para buscar
              </button>
              {!(isMini || isMobile) && (
                <button
                  onClick={generatePDF}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    borderColor: "black",
                    borderWidth: "0.4px",
                    borderStyle: "solid",
                    fontSize: "1.2em",
                    marginBottom: "2%",
                    lineHeight: "1.5",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "green";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "black";
                  }}
                >
                  Descargar Cotización de servicios ofrecidos en PDF
                </button>
              )}
              <div
                style={{
                  width: "80%",
                  height: "75vh",
                  margin: "0 auto",
                  backgroundColor: "white",
                  border: "2px solid black",
                  borderRadius: "10px",
                  boxShadow: "5px 5px 10px #888888",
                  padding: "20px",
                  overflowY: "auto",
                  zoom: isMini ? "35%" : "100%",
                }}
              >
                <table style={{ width: "100%" }}>
                  <thead
                    style={{
                      background: "#ddd",
                      color: "white",
                      fontWeight: "bold",
                      borderBottom: "2px solid black",
                    }}
                  >
                    <tr>
                      <th
                        style={{
                          padding: "10px",
                          borderRight: "2px solid black",
                          color: "black",
                        }}
                      >
                        Cantidad
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          borderRight: "2px solid black",
                          color: "black",
                        }}
                      >
                        Nombre
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          borderRight: "2px solid black",
                          color: "black",
                        }}
                      >
                        Descripción
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          borderRight: "2px solid black",
                          color: "black",
                        }}
                      >
                        Precio Unitario
                      </th>
                      <th style={{ padding: "10px", color: "black" }}>
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.length > 0 ? (
                      filteredServices.map((service) => (
                        <tr
                          key={service.id}
                          style={{ borderBottom: "1px solid green" }}
                        >
                          <td
                            style={{
                              padding: "10px",
                              borderRight: "2px solid black",
                            }}
                          >
                            <div style={{ position: "relative", zIndex: 2 }}>
                              <input
                                type="number"
                                value={quantities[service.id] || 0}
                                onChange={(e) => {
                                  const newQuantity = parseInt(
                                    e.target.value,
                                    10
                                  );
                                  if (newQuantity >= 0) {
                                    const newQuantities = {
                                      ...quantities,
                                      [service.id]: newQuantity,
                                    };
                                    setQuantities(newQuantities);
                                  }
                                }}
                                style={{ width: "50px" }}
                              />
                            </div>
                          </td>
                          <td style={{ padding: "10px", fontWeight: "bold" }}>
                            {service.name}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              borderRight: "2px solid black",
                            }}
                          >
                            {service.description}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              borderRight: "2px solid black",
                            }}
                          >
                            ₡{service.price}
                          </td>
                          <td style={{ padding: "10px" }}>
                            ₡{calculateSubtotal(service.price, service.id)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            lineHeight: "1.5",
                          }}
                        >
                          <h3>No hay servicios disponibles.</h3>
                          <p>Mostrando datos predeterminados.</p>
                        </td>
                      </tr>
                    )}

                    {services.length === 0 && subCombos.length > 0 && (
                      <tr>
                        <td colSpan="5">
                          <div
                            style={{
                              margin: "20px 0",
                              backgroundColor: "#f9f9f9",
                              border: "1px solid #ccc",
                              borderRadius: "5px",
                              padding: "10px",
                            }}
                          >
                            <h4>Combos Disponibles:</h4>
                            <table style={{ width: "100%" }}>
                              <thead
                                style={{
                                  background: "#000000",
                                  color: "white",
                                  fontWeight: "bold",
                                  borderBottom: "2px solid black",
                                }}
                              >
                                <tr>
                                  <th
                                    style={{ color: "black", padding: "10px" }}
                                  >
                                    Cantidad
                                  </th>
                                  <th
                                    style={{
                                      color: "black",
                                      padding: "10px",
                                      borderRight: "2px solid black",
                                    }}
                                  >
                                    Nombre
                                  </th>
                                  <th
                                    style={{
                                      color: "black",
                                      padding: "10px",
                                      borderRight: "2px solid black",
                                    }}
                                  >
                                    Descripción
                                  </th>
                                  <th
                                    style={{
                                      color: "black",
                                      padding: "10px",
                                      borderRight: "2px solid black",
                                    }}
                                  >
                                    Servicios
                                  </th>
                                  <th
                                    style={{
                                      color: "black",
                                      padding: "10px",
                                      borderRight: "2px solid black",
                                    }}
                                  >
                                    Precio
                                  </th>
                                  <th
                                    style={{ color: "black", padding: "10px" }}
                                  >
                                    Subtotal
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {subCombos.map((combo, index) => (
                                  <tr
                                    key={index}
                                    style={{ borderBottom: "1px solid green" }}
                                  >
                                    <td style={{ padding: "10px" }}>
                                      <input
                                        type="number"
                                        value={comboQuantities[combo.id] || 0}
                                        onChange={(e) => {
                                          const newQuantity = parseInt(
                                            e.target.value,
                                            10
                                          );
                                          if (
                                            !isNaN(newQuantity) &&
                                            newQuantity >= 0
                                          ) {
                                            const newQuantities = {
                                              ...comboQuantities,
                                              [combo.id]: newQuantity,
                                            };
                                            setComboQuantities(newQuantities);
                                          }
                                        }}
                                        style={{ width: "50px" }}
                                      />
                                    </td>
                                    <td
                                      style={{
                                        padding: "10px",
                                        borderRight: "2px solid black",
                                      }}
                                    >
                                      {combo.name}
                                    </td>
                                    <td
                                      style={{
                                        padding: "10px",
                                        borderRight: "2px solid black",
                                      }}
                                    >
                                      {combo.description}
                                    </td>
                                    <td
                                      style={{
                                        padding: "10px",
                                        borderRight: "2px solid black",
                                      }}
                                    >
                                      <ul>
                                        {combo.services.map(
                                          (service, serviceIndex) => (
                                            <li key={serviceIndex}>
                                              <strong
                                                style={{
                                                  color: "green",
                                                  fontSize: "1em",
                                                }}
                                              >
                                                *
                                              </strong>{" "}
                                              {service.name} = ₡{service.price}
                                              <br />
                                            </li>
                                          )
                                        )}
                                      </ul>
                                      <p
                                        style={{
                                          color: "black",
                                          marginTop: "10px",
                                        }}
                                      >
                                        <strong>Total Servicios:</strong> ₡
                                        {combo.services
                                          .reduce(
                                            (total, service) =>
                                              total + parseFloat(service.price),
                                            0
                                          )
                                          .toLocaleString("es-CR")}
                                      </p>
                                    </td>
                                    <td
                                      style={{
                                        padding: "10px",
                                        borderRight: "2px solid black",
                                      }}
                                    >
                                      ₡{combo.price}
                                    </td>
                                    <td style={{ padding: "10px" }}>
                                      {calculateComboSubtotal(combo)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td
                                    colSpan="5"
                                    style={{
                                      textAlign: "right",
                                      fontWeight: "bold",
                                      borderTop: "2px solid black",
                                    }}
                                  >
                                    Total
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px",
                                      borderTop: "2px solid black",
                                    }}
                                  >
                                    ₡{calculateTotalCombos()}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          textAlign: "right",
                          fontWeight: "bold",
                          borderTop: "2px solid black",
                        }}
                      >
                        Total
                      </td>
                      <td
                        style={{ padding: "10px", borderTop: "2px solid black" }}
                      >
                        ₡{calculateTotal()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <h2
                style={{
                  fontSize: "2em",
                  color: "red",
                  textShadow: "2px 2px 2px #000",
                  fontWeight: "bold",
                  marginTop: "20px",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                Combos Disponibles
              </h2>

              <div
                style={{
                  width: "80%",
                  height: "75vh",
                  margin: "0 auto",
                  backgroundColor: "white",
                  border: "2px solid black",
                  borderRadius: "10px",
                  boxShadow: "5px 5px 10px #888888",
                  padding: "20px",
                  overflowY: "auto",
                  zoom: isMini ? "35%" : "100%",
                }}
              >
                <table style={{ width: "100%" }}>
                  <thead
                    style={{
                      background: "#ddd",
                      color: "white",
                      fontWeight: "bold",
                      borderBottom: "2px solid black",
                    }}
                  >
                    <tr>
                      <th
                        style={{
                          color: "black",
                          padding: "10px",
                          borderRight: "2px solid black",
                        }}
                      >
                        Cantidad
                      </th>
                      <th
                        style={{
                          color: "black",
                          padding: "10px",
                          borderRight: "2px solid black",
                        }}
                      >
                        Nombre
                      </th>
                      <th
                        style={{
                          color: "black",
                          padding: "10px",
                          borderRight: "2px solid black",
                        }}
                      >
                        Descripción
                      </th>
                      <th
                        style={{
                          color: "black",
                          padding: "10px",
                          borderRight: "2px solid black",
                        }}
                      >
                        Servicios
                      </th>
                      <th
                        style={{
                          color: "black",
                          padding: "10px",
                          borderRight: "2px solid black",
                        }}
                      >
                        Precio
                      </th>
                      <th style={{ color: "black", padding: "10px" }}>
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subCombos.map((combo) => (
                      <tr
                        key={combo.id}
                        style={{ borderBottom: "1px solid green" }}
                      >
                        <td style={{ padding: "10px" }}>
                          <input
                            type="number"
                            value={comboQuantities[combo.id] || 0}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value, 10);
                              if (!isNaN(newQuantity) && newQuantity >= 0) {
                                const newQuantities = {
                                  ...comboQuantities,
                                  [combo.id]: newQuantity,
                                };
                                setComboQuantities(newQuantities);
                              }
                            }}
                            style={{ width: "50px" }}
                          />
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderRight: "2px solid black",
                          }}
                        >
                          {combo.name}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderRight: "2px solid black",
                          }}
                        >
                          {combo.description}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderRight: "2px solid black",
                          }}
                        >
                          <ul>
                            {combo.services ? (
                              combo.services.map((service, serviceIndex) => (
                                <li key={serviceIndex}>
                                  <strong
                                    style={{ color: "green", fontSize: "1em" }}
                                  >
                                    *
                                  </strong>{" "}
                                  {service.name} = ₡{service.price}
                                </li>
                              ))
                            ) : (
                              <li>No hay servicios disponibles</li>
                            )}
                          </ul>
                          <p style={{ marginTop: "10px" }}>
                            <strong>Total Servicios:</strong> ₡
                            {combo.services
                              ? combo.services
                                  .reduce(
                                    (total, service) =>
                                      total + parseFloat(service.price),
                                    0
                                  )
                                  .toLocaleString("es-CR")
                              : "0"}
                          </p>
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderRight: "2px solid black",
                          }}
                        >
                          ₡{combo.price}
                        </td>
                        <td style={{ padding: "10px" }}>
                          ₡{calculateComboSubtotal(combo)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          textAlign: "right",
                          fontWeight: "bold",
                          borderTop: "2px solid black",
                        }}
                      >
                        Total
                      </td>
                      <td
                        style={{ padding: "10px", borderTop: "2px solid black" }}
                      >
                        ₡{calculateTotalCombos()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            {subproductData.file && (
              <div
                style={{
                  border: "2px solid #ccc",
                  borderRadius: "10px",
                  padding: "20px",
                  boxShadow: "5px 5px 10px #888888",
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <div
                  style={{
                    flex: isMobile ? "none" : "50%",
                    marginBottom: isMobile ? "20px" : "0",
                  }}
                >
                  {subproductData.file.toLowerCase().endsWith(".pdf") ? (
                    <iframe
                      src={`https://docs.google.com/viewer?url=${subproductData.file}&embedded=true`}
                      width="100%"
                      height="400"
                      title={`PDF de ${subproductData.name}`}
                    ></iframe>
                  ) : subproductData.file
                      .toLowerCase()
                      .match(/\.(jpeg|jpg|gif|png)$/) ? (
                    <img
                      src={subproductData.file}
                      alt={`Archivo de imagen de ${subproductData.name}`}
                      style={{ width: "100%" }}
                    />
                  ) : subproductData.file
                      .toLowerCase()
                      .match(/\.(mp4|avi|mkv)$/) ? (
                    <video width="100%" height="400" controls>
                      <source src={subproductData.file} type="video/mp4" />
                      Tu navegador no soporta el elemento de video.
                    </video>
                  ) : subproductData.file
                      .toLowerCase()
                      .match(/\.(doc|docx|xls|xlsx)$/) ? (
                    <iframe
                      src={`https://view.officeapps.live.com/op/embed.aspx?src=${subproductData.file}`}
                      width="100%"
                      height="400"
                      title={`Documento de ${subproductData.name}`}
                    ></iframe>
                  ) : (
                    <p>No se puede mostrar el archivo</p>
                  )}
                </div>
                <div style={{ flex: "50%" }}>
                  {subproductData.addressmap && (
                    <div>
                      <iframe
                        src={subproductData.addressmap}
                        width="100%"
                        height="400"
                        title={`Ubicación de ${subproductData.name} en el mapa`}
                      ></iframe>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              <button
                style={{
                  backgroundColor: "green",
                  color: "white",
                  fontSize: "3.5em",
                  padding: "10px 20px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={openWhatsAppModal}
              >
                <i
                  className="fab fa-whatsapp"
                  style={{ marginRight: "5px", lineHeight: "1.5" }}
                ></i>{" "}
                Cotizar por WhatsApp
              </button>
            </div>
            <br />
            <br />

            <div ref={componentRef}>
              <Avisoseconomicos
                email={subproductData.email}
                name={subproductData.name}
              />
            </div>
            <div ref={componentRef1}>
              {/* <Reviews
                email={subproductData.email}
                name={subproductData.name}
              /> */}
            </div>
          </div>
        )}

        <Modal
          isOpen={showWhatsAppModal}
          onRequestClose={closeWhatsAppModal}
          contentLabel="Enviar mensaje por WhatsApp"
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "5px 5px 10px #888888",
              width: "80%",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <span
            className="whatsapp-modal-close"
            onClick={closeWhatsAppModal}
            style={{
              color: "red",
              fontSize: "3em",
              position: "absolute",
              top: "10px",
              right: "10px",
              cursor: "pointer",
            }}
          >
            ×
          </span>
          <h2>Enviar mensaje por WhatsApp</h2>
          <div style={{ marginBottom: "10px" }}>
            <label>Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                border: "2px solid red",
                boxShadow: "0 0 5px black",
                width: "100%",
                padding: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Apellido:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{
                border: "2px solid red",
                boxShadow: "0 0 5px black",
                width: "100%",
                padding: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Correo:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                border: "2px solid red",
                boxShadow: "0 0 5px black",
                width: "100%",
                padding: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Consulta:</label>
            <textarea
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              style={{
                border: "2px solid red",
                boxShadow: "0 0 5px black",
                width: "100%",
                padding: "5px",
                minHeight: "100px",
              }}
            />
          </div>
          <button
            style={{
              backgroundColor: "green",
              color: "white",
              fontSize: "1.2em",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}
            onClick={sendWhatsAppMessage}
          >
            Enviar
          </button>
        </Modal>
      </div>
    </>
  );
};

export default SubproductDetails;