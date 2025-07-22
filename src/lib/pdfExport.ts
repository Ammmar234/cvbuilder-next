// Optimized PDF export with lazy loading and performance improvements

export const exportToPDF = async (
  elementId: string,
  filename: string,
  isFreePlan: boolean
): Promise<boolean> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Lazy load dependencies only when needed
    const html2canvasModule = await import('html2canvas');
    const html2canvas = html2canvasModule.default;

    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default;

    // Temporarily remove any scaling transforms for accurate capture
    const originalTransform = element.style.transform;
    const originalOverflow = document.body.style.overflow;
    element.style.transform = 'none';
    document.body.style.overflow = 'visible';

    // Optimized html2canvas options for better performance and quality
    const canvas = await html2canvas(element, {
      scale: 2, // Balanced resolution for performance
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      logging: false, // Disable logging for performance
      imageTimeout: 15000,
      removeContainer: true,
    });

    // Restore original styles
    element.style.transform = originalTransform;
    document.body.style.overflow = originalOverflow;

    // A4 dimensions in mm (210 x 297)
    const pdfWidth = 210;
    const pdfHeight = 297;
    
    // Calculate dimensions to fit the entire content
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Calculate scale to fit content within A4
    const scaleX = pdfWidth / (canvasWidth / 2); // Divide by 2 because we used scale: 2
    const scaleY = pdfHeight / (canvasHeight / 2);
    const scale = Math.min(scaleX, scaleY);
    
    // Final dimensions
    const imgWidth = (canvasWidth / 2) * scale;
    const imgHeight = (canvasHeight / 2) * scale;
    
    // Center the content on the page
    const xOffset = (pdfWidth - imgWidth) / 2;
    const yOffset = (pdfHeight - imgHeight) / 2;

    // Create PDF with compression
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });
    
    // Convert canvas to optimized image
    const imgData = canvas.toDataURL('image/jpeg', 0.95); // Use JPEG with high quality for smaller file size
    
    // Add the image to PDF
    pdf.addImage(
      imgData,
      'JPEG',
      xOffset, 
      yOffset, 
      imgWidth, 
      imgHeight,
      undefined,
      'FAST'
    );

    // Add watermark for free users
    if (isFreePlan) {
      addWatermark(pdf, 'WASFAK-CV  - النسخة المجانية - للترقية قم بزيارة الموقع');
    }

    // Save the PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};


// Optimized watermark function
export const addWatermark = (pdf: any, text: string = 'منشئ السيرة الذاتية - النسخة المجانية') => {
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setTextColor(200, 200, 200);
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'normal');
    pdf.text(text, 105, 290, { align: 'center' });
  }
};