import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const downloadPDF = async (componentRef) => {
  const input = componentRef.current;
  const buttons = input.querySelectorAll("button");
  buttons.forEach((button) => {
    button.style.display = "none";
  });

  const tables = input.querySelectorAll("table");
  tables.forEach((table) => {
    const headers = table.querySelectorAll("th");
    const cells = table.querySelectorAll("td");
    headers.forEach((header) => {
      header.style.fontSize = "1.2em";
    });
    cells.forEach((cell) => {
      cell.style.fontSize = "1.2em";
    });
  });

  const canvas = await html2canvas(input, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  tables.forEach((table) => {
    const headers = table.querySelectorAll("th");
    const cells = table.querySelectorAll("td");
    headers.forEach((header) => {
      header.style.fontSize = "";
    });
    cells.forEach((cell) => {
      cell.style.fontSize = "";
    });
  });

  buttons.forEach((button) => {
    button.style.display = "inline-block";
  });

  pdf.save("perfil.pdf");
};