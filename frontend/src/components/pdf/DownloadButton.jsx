// import React from 'react';
// import { PDFDownloadLink } from '@react-pdf/renderer';
// import { ResumePDF } from './ResumePDF';
// import { useResumeStore } from '../../store/useResumeStore';
// import { Download } from 'lucide-react';

// export const DownloadButton = () => {
//   const { activeResume } = useResumeStore();
  
//   if (!activeResume || !activeResume.resumeData) return null;

//   const data = activeResume.resumeData;
//   const templateName = activeResume.templateName || 'jakes-resume';

//   return (
//     <PDFDownloadLink
//       document={<ResumePDF data={data} templateName={templateName} />}
//       fileName={`${data.personalDetails?.firstName || 'Resume'}_${data.personalDetails?.lastName || 'Document'}.pdf`}
//       className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
//     >
//       {({ loading }) =>
//         loading ? 'Generating PDF...' : (
//           <>
//             <Download size={18} />
//             Download PDF
//           </>
//         )
//       }
//     </PDFDownloadLink>
//   );
// };









import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumePDF } from './ResumePDF';
import { useResumeStore } from '../../store/useResumeStore';
import { Download } from 'lucide-react';

export const DownloadButton = () => {
  // 🚀 CTO FIX: Pull documentStyle from the store so the button builds the right PDF
  const { activeResume, documentStyle } = useResumeStore();
  
  if (!activeResume || !activeResume.resumeData) return null;

  const data = activeResume.resumeData;
  const templateName = activeResume.templateName || 'jakes-resume';
  const name = data.personalDetails?.firstName || data.personalInfo?.firstName || 'My';
  const lastName = data.personalDetails?.lastName || data.personalInfo?.lastName || 'Resume';

  return (
    <PDFDownloadLink
      document={<ResumePDF data={data} templateName={templateName} documentStyle={documentStyle} />}
      fileName={`${name}_${lastName}.pdf`}
      className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
    >
      {({ loading }) =>
        loading ? (
          <span className="animate-pulse">Building PDF...</span>
        ) : (
          <>
            <Download size={16} />
            Download PDF
          </>
        )
      }
    </PDFDownloadLink>
  );
};