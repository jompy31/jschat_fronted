import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Portada from "../../../../../assets/catalogo/webp/portada.webp";
import Quienessomos from "../../../../../assets/catalogo/webp/quienessomos.webp";
import Contraportada from "../../../../../assets/catalogo/webp/contraportada.webp";

export const generatePDF = (subproductData, services, quantities) => {
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
      const getImageType = (image) =>
        image.startsWith("data:image/")
          ? image.split(";")[0].split(":")[1]
          : "image/jpeg";
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

  const calculateSubtotal = (price, serviceId) => (quantities[serviceId] || 0) * price;

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

  const totalPrice = services.reduce(
    (total, service) => total + calculateSubtotal(service.price, service.id),
    0
  );
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

export const generatePDF1 = (componentRef, subproductData) => {
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
  clasificado1Elements.forEach((element) => element.classList.remove("clasificado1"));

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
      clasificado1Elements.forEach((element) => element.classList.add("clasificado1"));
    });
};

export const generatePDF2 = (componentRef1, subproductData) => {
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
        element.style.marginTop = originalStyles.buttonStyles[index].marginTop;
        element.style.lineHeight = originalStyles.buttonStyles[index].lineHeight;
        element.style.letterSpacing = originalStyles.buttonStyles[index].letterSpacing;
        element.style.wordSpacing = originalStyles.buttonStyles[index].wordSpacing;
      });
      textSliders.forEach((textSlider) => (textSlider.style.display = "block"));
    });
};

export const generatePDF3 = async (componentRef, subproductData) => {
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
  clasificado1Elements.forEach((element) => element.classList.remove("clasificado1"));

  input1.style.width = "1920px";
  input1.style.fontSize = "100%";
  input1.style.transform = "scale(1)";

  const canvas1 = await html2canvas(input1, { useCORS: true, scale: 2 });
  const imgData1 = canvas1.toDataURL("image/jpeg", 1.5);

  Object.keys(originalStyles1).forEach(
    (style) => (input1.style[style] = originalStyles1[style])
  );
  clasificado1Elements.forEach((element) => element.classList.add("clasificado1"));

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
  pdf.addImage(imgData1, "PNG", marginLeft, 10, imgWidth - marginLeft, adjustedHeight);
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
