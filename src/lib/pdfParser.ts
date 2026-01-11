import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - using the exact version installed (4.10.38)
// Must match the pdfjs-dist package version
const PDFJS_VERSION = '4.10.38';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    console.log('Starting PDF extraction for:', file.name, 'Size:', file.size);
    
    const arrayBuffer = await file.arrayBuffer();
    console.log('ArrayBuffer created, size:', arrayBuffer.byteLength);
    
    // Validate it's actually a PDF
    const header = new Uint8Array(arrayBuffer.slice(0, 5));
    const headerString = String.fromCharCode(...header);
    if (!headerString.startsWith('%PDF')) {
      throw new Error('File does not appear to be a valid PDF');
    }
    
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useSystemFonts: true,
      disableFontFace: false,
    });
    
    const pdf = await loadingTask.promise;
    console.log('PDF loaded, pages:', pdf.numPages);
    
    if (pdf.numPages === 0) {
      throw new Error('PDF has no pages');
    }
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Better text reconstruction with proper spacing
        let lastY: number | null = null;
        let pageText = '';
        
        for (const item of textContent.items as any[]) {
          if (item.str) {
            // Add newline if Y position changed significantly
            if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
              pageText += '\n';
            } else if (pageText && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
              pageText += ' ';
            }
            pageText += item.str;
            lastY = item.transform[5];
          }
        }
        
        fullText += pageText + '\n\n';
      } catch (pageError) {
        console.warn(`Error extracting page ${i}:`, pageError);
        // Continue with other pages
      }
    }
    
    const trimmedText = fullText.trim();
    
    if (!trimmedText) {
      throw new Error('No text could be extracted from PDF. The PDF may be scanned or image-based.');
    }
    
    console.log('PDF extraction complete, text length:', trimmedText.length);
    return trimmedText;
    
  } catch (error) {
    console.error('Error parsing PDF:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF')) {
        throw new Error('The file appears to be corrupted or not a valid PDF.');
      }
      if (error.message.includes('Password')) {
        throw new Error('This PDF is password-protected. Please use an unprotected PDF.');
      }
      if (error.message.includes('No text')) {
        throw new Error('This PDF appears to be scanned/image-based. Please paste the text manually.');
      }
      throw error;
    }
    
    throw new Error('Failed to parse PDF file. Please try pasting your resume text instead.');
  }
}
