import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import logoABCupon from "../../../../assets/categorias/25.webp";

export const downloadPDF = (modalLead) => {
  const input = document.getElementById("modal-content");
  if (!input) {
    console.error("Modal content not found");
    return;
  }

  // Temporarily adjust styles for PDF rendering
  input.style.padding = "20px";
  input.style.backgroundColor = "#ffffff";
  input.style.color = "#000000";
  input.style.fontSize = "12px";
  input.style.width = "100%";
  input.style.overflow = "visible";

  const paragraphs = input.getElementsByTagName("p");
  const headings = input.getElementsByTagName("h6");
  for (let p of paragraphs) p.style.fontSize = "10px";
  for (let h6 of headings) h6.style.fontSize = "14px";

  html2canvas(input, { scale: 2, useCORS: true, scrollX: 0, scrollY: -window.scrollY })
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth() - 20;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Add company logo if available
      if (modalLead.company_logo) {
        const logoImg = new Image();
        logoImg.crossOrigin = "Anonymous";
        logoImg.src = modalLead.company_logo;
        logoImg.onload = () => {
          pdf.addImage(logoImg, "JPEG", 10, 10, 40, 40);
          addContentToPDF(pdf, imgData, imgWidth, imgHeight, pageHeight, modalLead);
        };
        logoImg.onerror = () => {
          addContentToPDF(pdf, imgData, imgWidth, imgHeight, pageHeight, modalLead);
        };
      } else {
        addContentToPDF(pdf, imgData, imgWidth, imgHeight, pageHeight, modalLead);
      }
    })
    .catch((error) => {
      console.error("Error generating PDF:", error);
    })
    .finally(() => {
      // Reset styles
      input.style.padding = "";
      input.style.backgroundColor = "";
      input.style.color = "";
      input.style.fontSize = "";
      input.style.width = "";
      input.style.overflow = "";
      for (let p of paragraphs) p.style.fontSize = "";
      for (let h6 of headings) h6.style.fontSize = "";
    });
};

const addContentToPDF = (pdf, imgData, imgWidth, imgHeight, pageHeight, modalLead) => {
  let position = 60; // Start below logo
  pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
  let heightLeft = imgHeight;

  while (heightLeft >= pageHeight) {
    pdf.addPage();
    position = -heightLeft;
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Add footer
  pdf.setFontSize(8);
  pdf.text(
    "Confidencial - ABCupon",
    pdf.internal.pageSize.getWidth() / 2,
    pdf.internal.pageSize.getHeight() - 10,
    { align: "center" }
  );

  pdf.save(`detalles_cliente_${modalLead.name}.pdf`);
};

export const downloadLeadPDF = (lead) => {
  const doc = new jsPDF();

  const logoWidth = 40;
  const logoHeight = 20;
  const logoX = 160;
  const logoY = 10;
  doc.addImage(logoABCupon, "JPEG", logoX, logoY, logoWidth, logoHeight);

  doc.setFontSize(18);
  doc.text("Información de Cliente ABCupon", 15, 20);

  doc.setFontSize(12);
  doc.text(`Cliente ID: ${lead.id || "No disponible"}`, 15, 30);
  doc.text(`Número de Empresa: 22202290`, 15, 38);
  doc.text(`Email de Soporte: soporte@abcupon.com`, 15, 46);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const textX = logoX - 144;
  const textY = logoY + 50;
  doc.text(`Cliente: ${lead.name || "No disponible"}`, textX, textY);

  if (lead.company_logo) {
    const image = new Image();
    image.src = lead.company_logo;
    image.onload = () => {
      doc.addImage(image, "JPEG", 160, 35, 40, 40);
      finalizePDF(doc, lead);
    };
  } else {
    finalizePDF(doc, lead);
  }
};

const finalizePDF = (doc, lead) => {
  const tableColumn = ["Campo", "Valor"];
  const tableRows = [
    ["Nombre del Cliente", lead.name],
    ["Email", lead.email],
    ["Descripción", lead.description],
    ["Número de Teléfono", lead.number],
    ["Prioridad", lead.priority],
    ["Estado", lead.status],
    ["Actividad Comercial", lead.commercial_activity],
    ["Dirección de la Empresa", lead.company_address],
    ["Categoría de Marca", lead.brand_category],
    ["Descripción de Marca", lead.brand_description],
    ["Diferenciación de Marca", lead.brand_differentiation],
    ["Necesidad de la Marca", lead.brand_necessity],
    ["Percepción de Marca", lead.brand_perception_keywords],
    ["Personalidad de Marca", lead.brand_personality],
    ["Slogan o Motto", lead.brand_slogan_or_motto],
    ["Preferencia de Estilo", lead.brand_style_preference],
    ["Valores de Marca", lead.brand_values],
    ["Virtudes de Marca", lead.brand_virtues],
    ["Duración de Experiencia", lead.business_experience_duration],
    ["Tipo de Negocio", lead.business_type],
    ["Colores de Preferencia", lead.colors],
    ["Detalles Comerciales", lead.commercial_information_details],
    ["Nombre de la Empresa", lead.company_name],
    ["Website/Redes Sociales", lead.company_website_or_social_media],
    ["Nombre del Contacto", lead.contact_person_name],
    ["Teléfono del Contacto", lead.contact_person_phone],
    ["Posición del Contacto", lead.contact_person_position],
    ["Razón del Contacto", lead.contact_reason],
    ["Metas Actuales del Negocio", lead.current_business_goals],
    ["Principales Competidores", lead.main_competitors],
    ["Horario y Ubicación", lead.opening_hours_location_maps],
    ["Información de Pago", lead.payment_information],
    ["Método de Pago", lead.payment_method],
    ["Rango de Edad Objetivo", lead.target_age_range],
    ["Género Objetivo", lead.target_gender],
    ["Intereses Objetivo", lead.target_interests],
    ["Etapa del Ciclo de Vida", lead.target_lifecycle_stage],
    ["Nivel Socioeconómico", lead.target_socioeconomic_level],
    ["Comentario", lead.comment],
  ].map((item) => [item[0], item[1] || "No disponible"]);

  doc.autoTable({
    startY: 100,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    styles: { fontSize: 10 },
    columnStyles: { 0: { fontStyle: "bold" } },
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.text(
    "Este documento es confidencial y está destinado únicamente para uso interno de ABCupon.",
    15,
    finalY
  );

  doc.save(`informacion_cliente_${lead.name}.pdf`);
  downloadLogo(lead);
};

const downloadLogo = (lead) => {
  if (!lead.company_logo) return;
  fetch(lead.company_logo)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "logo.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    })
    .catch((error) => console.error("Error al descargar el logo:", error));
};