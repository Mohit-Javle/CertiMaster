import { create } from 'zustand';

// This store holds the shared design assets (background image, logo)
// so that both the Editor and BulkGenerator can use the same uploaded files.
export const useDesignStore = create((set) => ({
  backgroundImage: null,  // base64 data URL of the Canva-exported PNG
  logoImage: null,        // base64 data URL of the college/company logo PNG
  logoLeft: null,         // base64 data URL of the top-left logo PNG
  logoRight: null,        // base64 data URL of the top-right logo PNG
  
  styleData: {
    fontFamily: "'Inter', sans-serif",
    primaryColor: '#3b82f6',
    textColor: '#0f172a',
    
    // Fine-grained font sizes (px)
    titleFontSize: 42,
    issuedByFontSize: 11,
    introFontSize: 17,
    recipientFontSize: 26,
    courseFontSize: 20,
    descriptionFontSize: 15,
    dateFontSize: 14,
    signatureFontSize: 11,
    
    // Fine-grained spacing (margins/padding in px)
    headerTopPadding: 30,
    logosMarginBottom: 25,
    titleMarginBottom: 12,
    issuedByMarginBottom: 15,
    introMarginBottom: 8,
    recipientMarginBottom: 14,
    descriptionMarginBottom: 10,
    courseMarginBottom: 6,
    dateMarginBottom: 25,
    signaturesMarginTop: 10,
  },

  certData: {
    title: "Certificate",
    recipientName: "Mr./Ms. Dipendra Hiteshbhai Patel",
    courseTitle: "Mobile Application Development - Flutter (21130207)",
    date: "September 3, 2025",
    issuedBy: "R. N. G. Patel Institute of Technology",
    introText: "This is to certify that",
    description: "has successfully completed the On-Job Training (OJT) in Semester - 5 of B.Voc. Software Development conducted by Ultron Technologies, Anand during 13th August to 3rd September, 2025. During this period of OJT, candidate has completed his/her work on Flutter Development with almost dedication and sincerity.",
    signature1: "Dr. L. B. Chaudhari",
    signature1Role: "Director",
    signature1Org: "RNGPIT",
    signature2: "V. C. Joshi",
    signature2Role: "Head, IT department",
    signature2Org: "RNGPIT",
    signature3: "Mr. Sumit Chawla",
    signature3Role: "Founder & CEO",
    signature3Org: "Ultron Technologies",
  },

  setBackgroundImage: (img) => set({ backgroundImage: img }),
  setLogoImage: (img) => set({ logoImage: img }),
  setLogoLeft: (img) => set({ logoLeft: img }),
  setLogoRight: (img) => set({ logoRight: img }),
  setStyleData: (style) => set((state) => ({ styleData: { ...state.styleData, ...style } })),
  setCertData: (data) => set((state) => ({ certData: { ...state.certData, ...data } })),
  clearDesign: () => set({ 
    backgroundImage: null, 
    logoImage: null, 
    logoLeft: null, 
    logoRight: null,
    styleData: {
      fontFamily: "'Inter', sans-serif",
      primaryColor: '#3b82f6',
      textColor: '#0f172a',
      titleFontSize: 42,
      issuedByFontSize: 11,
      introFontSize: 17,
      recipientFontSize: 26,
      courseFontSize: 20,
      descriptionFontSize: 15,
      dateFontSize: 14,
      signatureFontSize: 11,
      headerTopPadding: 30,
      logosMarginBottom: 25,
      titleMarginBottom: 12,
      issuedByMarginBottom: 15,
      introMarginBottom: 8,
      recipientMarginBottom: 14,
      descriptionMarginBottom: 10,
      courseMarginBottom: 6,
      dateMarginBottom: 25,
      signaturesMarginTop: 10,
    },
    certData: {
      title: "Certificate",
      recipientName: "Mr./Ms. Dipendra Hiteshbhai Patel",
      courseTitle: "Mobile Application Development - Flutter (21130207)",
      date: "September 3, 2025",
      issuedBy: "R. N. G. Patel Institute of Technology",
      introText: "This is to certify that",
      description: "has successfully completed the On-Job Training (OJT) in Semester - 5 of B.Voc. Software Development conducted by Ultron Technologies, Anand during 13th August to 3rd September, 2025. During this period of OJT, candidate has completed his/her work on Flutter Development with almost dedication and sincerity.",
      signature1: "Dr. L. B. Chaudhari",
      signature1Role: "Director",
      signature1Org: "RNGPIT",
      signature2: "V. C. Joshi",
      signature2Role: "Head, IT department",
      signature2Org: "RNGPIT",
      signature3: "Mr. Sumit Chawla",
      signature3Role: "Founder & CEO",
      signature3Org: "Ultron Technologies",
    }
  }),
}));
