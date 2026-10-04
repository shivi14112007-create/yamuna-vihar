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

const isTouchDevice = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;

// Render the certificate node to a PNG data URL (works reliably on mobile Safari/Chrome)
async function renderCertificate(elementId: string): Promise<string> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Certificate element not found');
  }

  try {
    await document.fonts.ready;
  } catch {
    // ignore
  }

  const options = {
    pixelRatio: 2, // 2000x1414 px: sharp, and safe for mobile canvas memory limits
    backgroundColor: '#ffffff',
    cacheBust: false,
    skipFonts: true,
    fontEmbedCSS: ''
  };

  // Warm-up render: Safari often drops images (QR code) on the very first render
  await htmlToImage.toPng(element, options);
  return htmlToImage.toPng(element, options);
}

// Save a file. On phones: open the share sheet ("Save to Files/Photos/WhatsApp").
// Everywhere else (or if sharing fails): normal download.
async function saveBlob(blob: Blob, filename: string): Promise<void> {
  const file = new File([blob], filename, { type: blob.type });

  if (isTouchDevice() && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Clean Yamuna Pledge Certificate' });
      return;
    } catch (err: any) {
      if (err?.name === 'AbortError') return; // user closed the share sheet
      // otherwise fall through to normal download
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link); // must be in the DOM for iOS/Firefox
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function downloadCertificatePdf(elementId: string, certificateId: string, fullName: string): Promise<void> {
  try {
    const imgData = await renderCertificate(elementId);

    // A4 Landscape is 297mm x 210mm
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');

    const cleanName = fullName.replace(/[^a-zA-Z0-9]/g, '_');
    await saveBlob(pdf.output('blob'), `Yamuna_Pledge_Certificate_${certificateId}_${cleanName}.pdf`);
  } catch (err) {
    console.error('PDF download failed:', err);
    alert('Could not create the PDF. Please try "Save Image" instead, or open this page in Chrome/Safari.');
  }
}

export async function downloadCertificateImage(elementId: string, certificateId: string, fullName: string): Promise<void> {
  try {
    const dataUrl = await renderCertificate(elementId);
    const blob = await (await fetch(dataUrl)).blob();

    const cleanName = fullName.replace(/[^a-zA-Z0-9]/g, '_');
    await saveBlob(blob, `Yamuna_Pledge_Certificate_${certificateId}_${cleanName}.png`);
  } catch (err) {
    console.error('Image download failed:', err);
    alert('Could not save the image. Please open this page in Chrome/Safari and try again.');
  }
}
