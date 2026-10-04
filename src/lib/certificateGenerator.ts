import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';

export async function generateQrCodeDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 240,
      margin: 1,
      color: {
        dark: '#082032',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    return '';
  }
}

export async function downloadCertificatePdf(elementId: string, certificateId: string, fullName: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Certificate element not found');
  }

  // Ensure document fonts have finished rendering
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Fallback gracefully
    }
  }

  // Use skipFonts: true and fontEmbedCSS: '' to prevent html-to-image from inspecting
  // cross-origin stylesheets (which triggers CSSStyleSheet.cssRules security errors)
  const imgData = await htmlToImage.toPng(element, {
    pixelRatio: 2.5,
    backgroundColor: '#ffffff',
    cacheBust: false,
    skipFonts: true,
    fontEmbedCSS: ''
  });

  // A4 Landscape is 297mm width by 210mm height
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = 297;
  const pdfHeight = 210;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  
  const cleanName = fullName.replace(/[^a-zA-Z0-9]/g, '_');
  pdf.save(`Yamuna_Pledge_Certificate_${certificateId}_${cleanName}.pdf`);
}

export async function downloadCertificateImage(elementId: string, certificateId: string, fullName: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Certificate element not found');
  }

  // Ensure document fonts have finished rendering
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Fallback gracefully
    }
  }

  // Use skipFonts: true and fontEmbedCSS: '' to prevent html-to-image from inspecting
  // cross-origin stylesheets (which triggers CSSStyleSheet.cssRules security errors)
  const dataUrl = await htmlToImage.toPng(element, {
    pixelRatio: 3,
    backgroundColor: '#ffffff',
    cacheBust: false,
    skipFonts: true,
    fontEmbedCSS: ''
  });

  const link = document.createElement('a');
  const cleanName = fullName.replace(/[^a-zA-Z0-9]/g, '_');
  link.download = `Yamuna_Pledge_Certificate_${certificateId}_${cleanName}.png`;
  link.href = dataUrl;
  link.click();
}
