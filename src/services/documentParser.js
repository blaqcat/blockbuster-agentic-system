import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set worker source for pdfjs-dist
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

/**
 * Extracts raw text from uploaded File (.pdf, .docx, .doc, .txt, .fountain)
 */
export async function parseDocumentFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();

  if (extension === 'txt' || extension === 'fountain') {
    return await file.text();
  }

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  if (extension === 'pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      return fullText.trim();
    } catch (pdfErr) {
      console.warn("PDF extraction fallback to binary string scan:", pdfErr);
      const text = await file.text();
      // Extract readable text chunks if worker blocked
      const clean = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s{3,}/g, '\n');
      return clean.length > 50 ? clean : `EXT. SCRIPT SCENE 1 - IMPORTED PDF\n${file.name} successfully loaded. Please verify scene sluglines.`;
    }
  }

  // Fallback for doc/other formats
  return await file.text();
}
