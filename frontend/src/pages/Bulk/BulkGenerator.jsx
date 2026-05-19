import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UploadCloud, CheckCircle2, ChevronRight, FileSpreadsheet, AlertCircle, LayoutTemplate, Download, Image as ImageIcon, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { templates } from "../../data/mockData";
import { useDesignStore } from "../../store/designStore";

const STEPS = ["Upload Data", "Select Template", "Review & Export"];

function formatExcelDate(value) {
  if (!value) return "";
  const num = parseFloat(value);
  if (!isNaN(num) && num > 30000 && num < 60000) {
    const date = new Date(Math.round((num - 25569) * 86400 * 1000));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return String(value);
}

function substituteVariables(text, row) {
  if (!text) return "";
  let result = text;
  Object.keys(row).forEach(key => {
    let value = row[key];
    if (typeof value === 'number' && value > 30000 && value < 60000) {
      value = formatExcelDate(value);
    }
    const strValue = value !== null && value !== undefined ? String(value) : "";
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'gi');
    result = result.replace(regex, strValue);
  });
  return result;
}

// Helper identical to Editor's buildOverlayHTML
function buildOverlayHTML(data, styleData = {}) {
  const textColor = styleData.textColor || '#0f172a';
  const primaryColor = styleData.primaryColor || '#3b82f6';
  
  // Retrieve top left / right logos from store
  const { logoLeft, logoRight } = useDesignStore.getState();
  
  // Decide gold color or adaptive accent color for name and title
  const nameColor = textColor === '#ffffff' ? '#38bdf8' : '#3b82f6'; // Neon blue on tech, adaptive
  const secondaryTextColor = textColor === '#ffffff' ? '#94a3b8' : '#475569';
  const subtextColor = textColor === '#ffffff' ? '#cbd5e1' : '#64748b';
  const sigHandwrittenColor = textColor === '#ffffff' ? '#38bdf8' : '#1e3a8a';

  const rowVariables = { ...data };
  
  const titleText = substituteVariables(data.title || "Certificate", rowVariables);
  const issuedByText = substituteVariables(data.issuedBy || "", rowVariables);
  const introText = substituteVariables(data.introText || "This is to certify that", rowVariables);
  const recipientNameText = substituteVariables(data.recipientName || "", rowVariables);
  const descriptionText = substituteVariables(data.description || "", rowVariables);
  const courseTitleText = substituteVariables(data.courseTitle || "", rowVariables);
  const dateText = substituteVariables(data.date || "", rowVariables);
  
  const signature1Text = substituteVariables(data.signature1 || "", rowVariables);
  const signature1RoleText = substituteVariables(data.signature1Role || "", rowVariables);
  const signature1OrgText = substituteVariables(data.signature1Org || "", rowVariables);
  
  const signature2Text = substituteVariables(data.signature2 || "", rowVariables);
  const signature2RoleText = substituteVariables(data.signature2Role || "", rowVariables);
  const signature2OrgText = substituteVariables(data.signature2Org || "", rowVariables);

  const signature3Text = substituteVariables(data.signature3 || "", rowVariables);
  const signature3RoleText = substituteVariables(data.signature3Role || "", rowVariables);
  const signature3OrgText = substituteVariables(data.signature3Org || "", rowVariables);
  
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Great+Vibes&family=Montserrat:wght@400;500;700&family=Sacramento&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
      .cert-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        width: 100%;
        height: 100%;
        padding: ${styleData.headerTopPadding || 30}px 50px 30px;
        box-sizing: border-box;
      }
      .cert-logos-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-bottom: ${styleData.logosMarginBottom || 25}px;
        padding: 0 20px;
        box-sizing: border-box;
      }
      .cert-logo-left {
        max-height: 80px;
        max-width: 140px;
        object-fit: contain;
      }
      .cert-logo-right {
        max-height: 80px;
        max-width: 180px;
        object-fit: contain;
      }
      .cert-logo-spacer {
        width: 100px;
        height: 1px;
      }
      .cert-header {
        font-family: 'Cinzel', serif;
        font-size: ${styleData.titleFontSize || 42}px;
        font-weight: 800;
        letter-spacing: 6px;
        text-transform: uppercase;
        margin: 0 0 ${styleData.titleMarginBottom || 12}px;
        color: ${textColor};
      }
      .cert-subheader {
        font-family: 'Montserrat', sans-serif;
        font-size: ${styleData.issuedByFontSize || 11}px;
        font-weight: 700;
        letter-spacing: 4px;
        text-transform: uppercase;
        margin: 4px 0 ${styleData.issuedByMarginBottom || 15}px;
        color: ${subtextColor};
      }
      .cert-text-certify {
        font-family: 'Playfair Display', serif;
        font-style: italic;
        font-size: ${styleData.introFontSize || 17}px;
        margin: 0 0 ${styleData.introMarginBottom || 8}px;
        color: ${secondaryTextColor};
      }
      .cert-recipient {
        font-family: 'Playfair Display', serif;
        font-weight: 600;
        font-size: ${styleData.recipientFontSize || 26}px;
        margin: 4px 0 ${styleData.recipientMarginBottom || 14}px;
        color: ${nameColor};
        line-height: 1.2;
      }
      .cert-name-underline {
        width: 440px;
        height: 1.5px;
        background: linear-gradient(90deg, transparent, ${primaryColor}, ${nameColor}, ${primaryColor}, transparent);
        margin: 4px auto 14px;
      }
      .cert-text-completed {
        font-family: 'Playfair Display', serif;
        font-size: ${styleData.descriptionFontSize || 15}px;
        line-height: 1.6;
        margin: 10px auto ${styleData.descriptionMarginBottom || 10}px;
        max-width: 820px;
        color: ${secondaryTextColor};
      }
      .cert-course {
        font-family: 'Montserrat', sans-serif;
        font-size: ${styleData.courseFontSize || 20}px;
        font-weight: 700;
        letter-spacing: 1px;
        margin: 12px 0 ${styleData.courseMarginBottom || 6}px;
        color: ${textColor};
        text-transform: uppercase;
      }
      .cert-date {
        font-family: 'Playfair Display', serif;
        font-size: ${styleData.dateFontSize || 14}px;
        color: ${subtextColor};
        margin: 6px 0 ${styleData.dateMarginBottom || 25}px;
      }
      .cert-signatures {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        width: 90%;
        margin-top: ${styleData.signaturesMarginTop || 10}px;
        gap: 20px;
      }
      .cert-sig-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 220px;
      }
      .cert-sig-handwritten {
        font-family: 'Sacramento', cursive;
        font-size: 32px;
        color: ${sigHandwrittenColor};
        margin: 0;
        line-height: 1;
        height: 34px;
      }
      .cert-sig-line {
        width: 100%;
        height: 1px;
        background: ${subtextColor};
        margin: 4px 0 6px;
        opacity: 0.5;
      }
      .cert-sig-name {
        font-family: 'Montserrat', sans-serif;
        font-size: ${styleData.signatureFontSize || 11}px;
        font-weight: 700;
        color: ${textColor};
        margin: 0 0 2px;
      }
      .cert-sig-title {
        font-family: 'Montserrat', sans-serif;
        font-size: 9px;
        font-weight: 600;
        color: ${secondaryTextColor};
        margin: 0 0 1px;
      }
      .cert-sig-org {
        font-family: 'Montserrat', sans-serif;
        font-size: 8px;
        font-weight: 500;
        text-transform: uppercase;
        color: ${subtextColor};
        margin: 0;
      }
    </style>
    <div class="cert-container">
      <!-- Header Logos Row -->
      <div class="cert-logos-header">
        ${logoLeft ? `<img class="cert-logo-left" src="${logoLeft}" />` : '<div class="cert-logo-spacer"></div>'}
        ${logoRight ? `<img class="cert-logo-right" src="${logoRight}" />` : '<div class="cert-logo-spacer"></div>'}
      </div>

      <h1 class="cert-header">${titleText}</h1>
      <p class="cert-subheader">${issuedByText}</p>
      
      <p class="cert-text-certify">${introText}</p>
      <h2 class="cert-recipient">${recipientNameText}</h2>
      <div class="cert-name-underline"></div>
      
      <p class="cert-text-completed">${descriptionText}</p>
      ${courseTitleText ? `<h3 class="cert-course">${courseTitleText}</h3>` : ''}
      <p class="cert-date">Issued on ${dateText}</p>
      
      <div class="cert-signatures">
        <div class="cert-sig-box">
          <p class="cert-sig-handwritten">${signature1Text}</p>
          <div class="cert-sig-line"></div>
          <p class="cert-sig-name">${signature1Text}</p>
          <p class="cert-sig-title">${signature1RoleText}</p>
          ${signature1OrgText ? `<p class="cert-sig-org">${signature1OrgText}</p>` : ''}
        </div>
        
        <div class="cert-sig-box">
          <p class="cert-sig-handwritten">${signature2Text}</p>
          <div class="cert-sig-line"></div>
          <p class="cert-sig-name">${signature2Text}</p>
          <p class="cert-sig-title">${signature2RoleText}</p>
          ${signature2OrgText ? `<p class="cert-sig-org">${signature2OrgText}</p>` : ''}
        </div>

        ${signature3Text ? `
        <div class="cert-sig-box">
          <p class="cert-sig-handwritten">${signature3Text}</p>
          <div class="cert-sig-line"></div>
          <p class="cert-sig-name">${signature3Text}</p>
          <p class="cert-sig-title">${signature3RoleText}</p>
          ${signature3OrgText ? `<p class="cert-sig-org">${signature3OrgText}</p>` : ''}
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

const BulkGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // Shared design assets from Editor
  const { backgroundImage, logoImage, logoLeft, logoRight, styleData, certData } = useDesignStore();

  // Data State
  const [excelData, setExcelData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  // Mapping State - map template fields to excel columns
  const [fieldMapping, setFieldMapping] = useState({
    recipientName: "",
    courseTitle: "",
    date: ""
  });

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // --- Step 1: File Upload ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      if (data.length > 0) {
        const cols = Object.keys(data[0]);
        setColumns(cols);
        setExcelData(data);

        // Auto-map with high-accuracy heuristic (prevents Company/Institute overriding Name)
        const newMapping = { recipientName: "", courseTitle: "", date: "" };
        
        // 1. Map Recipient Name
        const nameCol = cols.find(col => {
          const lower = col.toLowerCase().replace(/[^a-z0-9]/g, '');
          return (lower === 'name' || lower === 'fullname' || lower === 'studentname' || lower === 'recipientname' || lower === 'student');
        }) || cols.find(col => {
          const lower = col.toLowerCase();
          return (lower.includes('student') || lower.includes('recipient')) && !lower.includes('logo') && !lower.includes('sign');
        }) || cols.find(col => {
          const lower = col.toLowerCase();
          return lower.includes('name') && !lower.includes('institute') && !lower.includes('company') && !lower.includes('signature') && !lower.includes('role') && !lower.includes('logo');
        });
        if (nameCol) newMapping.recipientName = nameCol;

        // 2. Map Course Title
        const courseCol = cols.find(col => {
          const lower = col.toLowerCase().replace(/[^a-z0-9]/g, '');
          return (lower === 'course' || lower === 'coursetitle' || lower === 'coursename' || lower === 'subject' || lower === 'workshop');
        }) || cols.find(col => {
          const lower = col.toLowerCase();
          return lower.includes('course') || lower.includes('title') || lower.includes('award') || lower.includes('subject');
        });
        if (courseCol) newMapping.courseTitle = courseCol;

        // 3. Map Date
        const dateCol = cols.find(col => {
          const lower = col.toLowerCase().replace(/[^a-z0-9]/g, '');
          return (lower === 'date' || lower === 'issuedate' || lower === 'dateofissue' || lower === 'issue');
        }) || cols.find(col => {
          const lower = col.toLowerCase();
          return lower.includes('date');
        });
        if (dateCol) newMapping.date = dateCol;

        setFieldMapping(newMapping);
      }
    };
    reader.readAsBinaryString(file);
  };

  const loadSampleData = () => {
    const sample = [
      { Name: "Dipendra Patel", Enrollment: "230841102012", CourseName: "Mobile Application Development - Flutter", SubjectCode: "21130207", InstituteName: "RNGPIT", CompanyName: "Ultron Technologies", Date: "Sept 3, 2025" },
      { Name: "Mohit Javle", Enrollment: "230841102013", CourseName: "Web Development using AI", SubjectCode: "21130208", InstituteName: "RNGPIT", CompanyName: "Efsouls Technologies", Date: "Oct 12, 2026" },
      { Name: "Aarav Mehta", Enrollment: "230841102014", CourseName: "Cloud Computing & DevOps", SubjectCode: "21130209", InstituteName: "RNGPIT", CompanyName: "AWS Partner Network", Date: "Oct 15, 2026" },
      { Name: "Isha Sharma", Enrollment: "230841102015", CourseName: "Cyber Security Essentials", SubjectCode: "21130210", InstituteName: "RNGPIT", CompanyName: "Securly Solutions", Date: "Nov 1, 2026" },
      { Name: "Karan Patel", Enrollment: "230841102016", CourseName: "Data Science & ML", SubjectCode: "21130211", InstituteName: "RNGPIT", CompanyName: "Analytics Labs", Date: "Nov 5, 2026" },
      { Name: "Pooja Shah", Enrollment: "230841102017", CourseName: "Blockchain Architectures", SubjectCode: "21130212", InstituteName: "RNGPIT", CompanyName: "Crypto Tech", Date: "Nov 12, 2026" },
      { Name: "Rohan Joshi", Enrollment: "230841102018", CourseName: "UI/UX & Product Design", SubjectCode: "21130213", InstituteName: "RNGPIT", CompanyName: "Canva Studio", Date: "Nov 20, 2026" },
      { Name: "Sneha Roy", Enrollment: "230841102019", CourseName: "Full Stack Development", SubjectCode: "21130214", InstituteName: "RNGPIT", CompanyName: "TCS Digital", Date: "Nov 25, 2026" },
      { Name: "Vikram Singh", Enrollment: "230841102020", CourseName: "Embedded Systems & IoT", SubjectCode: "21130215", InstituteName: "RNGPIT", CompanyName: "L&T Tech", Date: "Dec 1, 2026" },
      { Name: "Yash Patel", Enrollment: "230841102021", CourseName: "Digital Marketing", SubjectCode: "21130216", InstituteName: "RNGPIT", CompanyName: "GoViral Agency", Date: "Dec 5, 2026" }
    ];
    setExcelData(sample);
    setColumns(["Name", "Enrollment", "CourseName", "SubjectCode", "InstituteName", "CompanyName", "Date"]);
    setFieldMapping({ recipientName: "Name", courseTitle: "CourseName", date: "Date" });
  };

  const downloadSampleCSV = () => {
    const headers = ["Name", "Enrollment", "CourseName", "SubjectCode", "InstituteName", "CompanyName", "Date"];
    const rows = [
      ["Dipendra Patel", "230841102012", "Mobile Application Development - Flutter", "21130207", "RNGPIT", "Ultron Technologies", "Sept 3, 2025"],
      ["Mohit Javle", "230841102013", "Web Development using AI", "21130208", "RNGPIT", "Efsouls Technologies", "Oct 12, 2026"],
      ["Aarav Mehta", "230841102014", "Cloud Computing & DevOps", "21130209", "RNGPIT", "AWS Partner Network", "Oct 15, 2026"],
      ["Isha Sharma", "230841102015", "Cyber Security Essentials", "21130210", "RNGPIT", "Securly Solutions", "Nov 1, 2026"],
      ["Karan Patel", "230841102016", "Data Science & ML", "21130211", "RNGPIT", "Analytics Labs", "Nov 5, 2026"],
      ["Pooja Shah", "230841102017", "Blockchain Architectures", "21130212", "RNGPIT", "Crypto Tech", "Nov 12, 2026"],
      ["Rohan Joshi", "230841102018", "UI/UX & Product Design", "21130213", "RNGPIT", "Canva Studio", "Nov 20, 2026"],
      ["Sneha Roy", "230841102019", "Full Stack Development", "21130214", "RNGPIT", "TCS Digital", "Nov 25, 2026"],
      ["Vikram Singh", "230841102020", "Embedded Systems & IoT", "21130215", "RNGPIT", "L&T Tech", "Dec 1, 2026"],
      ["Yash Patel", "230841102021", "Digital Marketing", "21130216", "RNGPIT", "GoViral Agency", "Dec 5, 2026"]
    ];
    
    let csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "certimaster_ojt_bulk_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // --- Step 3: Generation & ZIP ---
  // Helper to wait to ensure DOM updates before rendering canvas
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const generateZip = async (format) => {
    if (excelData.length === 0) return;
    setIsExporting(true);
    setProgress({ current: 0, total: excelData.length });

    const zip = new JSZip();
    const folder = zip.folder(`CertiMaster_Batch_${format.toUpperCase()}`);

    const batchSize = 8;
    for (let i = 0; i < excelData.length; i += batchSize) {
      const chunk = excelData.slice(i, i + batchSize);
      
      await Promise.all(chunk.map(async (row, chunkIdx) => {
        const index = i + chunkIdx;
        const rawDate = row[fieldMapping.date];
        const rowData = {
          ...certData,
          ...row,
          recipientName: String(row[fieldMapping.recipientName] || certData.recipientName),
          courseTitle:   String(row[fieldMapping.courseTitle]   || certData.courseTitle),
          date:          rawDate ? formatExcelDate(rawDate) : certData.date,
        };

        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:fixed;left:-9999px;top:0;width:1056px;height:816px;overflow:hidden;z-index:-1;';
        
        const inner = document.createElement('div');
        inner.style.cssText = 'position:relative;width:1056px;height:816px;background:white;';

        if (backgroundImage) {
          // Background layer
          const bg = document.createElement('img');
          bg.crossOrigin = 'anonymous';
          bg.src = backgroundImage;
          bg.style.cssText = 'position:absolute;top:0;left:0;width:1056px;height:816px;object-fit:fill;';
          inner.appendChild(bg);

          // Logo
          if (logoImage) {
            const logo = document.createElement('img');
            logo.crossOrigin = 'anonymous';
            logo.src = logoImage;
            logo.style.cssText = 'position:absolute;bottom:60px;left:50%;transform:translateX(-50%);width:100px;height:100px;object-fit:contain;';
            inner.appendChild(logo);
          }

          // Text overlay
          const overlay = document.createElement('div');
          overlay.style.cssText = 'position:absolute;top:0;left:0;width:1056px;height:816px;';
          overlay.innerHTML = buildOverlayHTML(rowData, styleData);
          inner.appendChild(overlay);
        } else {
          // Fallback: render HTML template
          let html = selectedTemplate.html;
          html = html.replace(/{{recipientName}}/g, rowData.recipientName);
          html = html.replace(/{{courseTitle}}/g,   rowData.courseTitle);
          html = html.replace(/{{date}}/g,          rowData.date);
          html = html.replace(/{{issuedBy}}/g,       rowData.issuedBy);
          html = html.replace(/{{signature1}}/g,     rowData.signature1);
          html = html.replace(/{{signature2}}/g,     rowData.signature2);
          const templateDiv = document.createElement('div');
          templateDiv.style.cssText = 'width:1056px;height:816px;';
          templateDiv.innerHTML = html;
          inner.appendChild(templateDiv);

          if (logoImage) {
            const logo = document.createElement('img');
            logo.crossOrigin = 'anonymous';
            logo.src = logoImage;
            logo.style.cssText = 'position:absolute;bottom:60px;left:50%;transform:translateX(-50%);width:100px;height:100px;object-fit:contain;';
            inner.appendChild(logo);
          }
        }

        wrapper.appendChild(inner);
        document.body.appendChild(wrapper);

        // Wait for images
        const imgs = wrapper.querySelectorAll('img');
        await Promise.all(Array.from(imgs).map(img =>
          img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
        ));
        await wait(40);

        const canvas = await html2canvas(inner, { scale: 1.5, useCORS: true, allowTaint: true, backgroundColor: null });
        document.body.removeChild(wrapper);

        const imgData = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`, 0.90);
        
        // Prevent ZIP overwrite by adding the row index prefix so duplicate recipient names generate separate files
        const namePart = String(row[fieldMapping.recipientName] || `Cert_${index}`).replace(/[^a-z0-9]/gi, '_');
        const fileNameSafe = `${index + 1}_${namePart}`;
        
        const base64Data = imgData.replace(/^data:image\/(png|jpeg);base64,/, '');
        folder.file(`${fileNameSafe}.${format}`, base64Data, { base64: true });

        setProgress(prev => ({ ...prev, current: prev.current + 1 }));
      }));
    }

    // Generate zip file
    zip.generateAsync({ type: "blob" }).then(async function (content) {
      saveAs(content, `Certificates_Batch.zip`);
      setIsExporting(false);

      // Save to database
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const firstRow = excelData[0] || {};
          const course = firstRow[fieldMapping.courseTitle] || "Bulk Cohort";
          await fetch("http://localhost:5000/api/certificates", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token
            },
            body: JSON.stringify({
              recipientName: `${excelData.length} Recipients`,
              courseTitle: course,
              issueDate: new Date().toLocaleDateString('en-CA'),
              templateId: selectedTemplate.id,
              type: "bulk"
            })
          });

          navigate("/my-certificates");
        }
      } catch (err) {
        console.error("Failed to sync bulk batch to DB", err);
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8 items-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bulk Batch Generator</h1>
        <p className="text-slate-500 font-medium mt-1">Generate hundreds of certificates in seconds from an Excel file.</p>
      </div>

      {/* Stepper */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-px before:bg-slate-200 before:z-0">
          {STEPS.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-3 px-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-extrabold border shadow-sm transition-all duration-300 ${idx < currentStep ? 'bg-indigo-600 border-indigo-500 text-white skeuo-raised' :
                idx === currentStep ? 'bg-amber-500 border-amber-400 text-white skeuo-raised scale-110' :
                  'bg-white border-slate-200 text-slate-400'
                }`}>
                {idx < currentStep ? <CheckCircle2 className="h-6 w-6" /> : idx + 1}
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${idx <= currentStep ? 'text-slate-900' : 'text-slate-400'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <Card variant="skeuo" className="p-6 md:p-8 min-h-[400px]">

            {/* STEP 1: UPLOAD */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="border-2 border-dashed border-slate-200 rounded-3xl bg-white/40 p-12 text-center hover:bg-white/60 hover:border-amber-500/50 transition-all relative group overflow-hidden skeuo-pressed">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div className="flex flex-col items-center justify-center pointer-events-none relative z-10">
                    <div className="h-20 w-20 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center skeuo-raised border border-white mb-6 group-hover:scale-110 transition-transform">
                      <FileSpreadsheet className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Upload your data</h3>
                    <p className="text-slate-500 max-w-sm mb-6 font-medium">Drag and drop your Excel (.xlsx) or CSV file here, or click to browse files.</p>
                    <Button variant="skeuo" className="pointer-events-none px-8">Choose File</Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span>OR</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm">
                  <button onClick={loadSampleData} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all border border-slate-200 skeuo-raised">
                    ⚡ Load Premium OJT Sample
                  </button>
                  <button onClick={downloadSampleCSV} className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 font-bold rounded-xl transition-all border border-amber-200 skeuo-raised">
                    📥 Download 10-Row CSV Template
                  </button>
                </div>

                {excelData.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-emerald-900">Data loaded successfully!</p>
                      <p className="text-sm text-emerald-700">Found {excelData.length} rows and {columns.length} columns.</p>
                    </div>
                  </div>
                )}

                {/* Design Assets Status */}
                <div className={`rounded-lg p-4 flex items-start gap-3 border ${backgroundImage ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'}`}>
                  <ImageIcon className={`h-5 w-5 mt-0.5 shrink-0 ${backgroundImage ? 'text-blue-500' : 'text-amber-500'}`} />
                  <div>
                    <p className={`font-medium text-sm ${backgroundImage ? 'text-blue-900' : 'text-amber-900'}`}>
                      {backgroundImage ? '✅ Custom background ready' : '⚠️ No custom background'}
                    </p>
                    <p className={`text-xs mt-0.5 ${backgroundImage ? 'text-blue-700' : 'text-amber-700'}`}>
                      {backgroundImage
                        ? `Logo: ${logoImage ? '✅ Uploaded' : 'Not added'} — Your Canva design will be used for all certificates.`
                        : 'Upload a background from the Certificate Editor page to use your Canva design here.'}
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* STEP 2: TEMPLATE SELECTION */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900">Select Template</h3>
                <div className="grid grid-cols-2 gap-4">
                  {templates.slice(0, 4).map(tpl => (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl)}
                      className={`cursor-pointer border-2 rounded-xl overflow-hidden transition-all ${selectedTemplate.id === tpl.id ? 'border-amber-500 skeuo-raised scale-[1.02]' : 'border-slate-200 hover:border-amber-300'}`}
                    >
                      <div className={`aspect-[4/3] ${tpl.thumbnail}`}></div>
                      <div className="bg-white p-3 text-center border-t border-slate-100">
                        <p className="font-bold text-sm text-slate-900 truncate">{tpl.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: MAPPING & REVIEW */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <LayoutTemplate className="h-5 w-5 text-amber-500" />
                    Map Data Fields
                  </h3>
                  <div className="grid gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <span className="text-sm font-medium text-slate-700">Recipient Name:</span>
                      <select
                        className="h-10 rounded-xl border border-slate-200/50 bg-white/50 px-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 skeuo-input outline-none font-bold"
                        value={fieldMapping.recipientName}
                        onChange={(e) => setFieldMapping({ ...fieldMapping, recipientName: e.target.value })}
                      >
                        <option value="">-- Select Column --</option>
                        {columns.map(col => <option key={col} value={col}>{col}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <span className="text-sm font-medium text-slate-700">Course / Award Title:</span>
                      <select
                        className="h-10 rounded-md border border-slate-300 px-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        value={fieldMapping.courseTitle}
                        onChange={(e) => setFieldMapping({ ...fieldMapping, courseTitle: e.target.value })}
                      >
                        <option value="">-- Select Column --</option>
                        {columns.map(col => <option key={col} value={col}>{col}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <span className="text-sm font-medium text-slate-700">Date:</span>
                      <select
                        className="h-10 rounded-md border border-slate-300 px-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        value={fieldMapping.date}
                        onChange={(e) => setFieldMapping({ ...fieldMapping, date: e.target.value })}
                      >
                        <option value="">-- Select Column --</option>
                        {columns.map(col => <option key={col} value={col}>{col}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                    Data Preview (First 3 rows)
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-600 bg-slate-100 uppercase uppercase">
                        <tr>
                          {columns.map(col => (
                            <th key={col} className="px-4 py-3">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {excelData.slice(0, 3).map((row, i) => (
                          <tr key={i} className="bg-white border-b border-slate-100 last:border-0 hover:bg-slate-50">
                            {columns.map(col => (
                              <td key={col} className="px-4 py-3">{row[col]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0 || isExporting}
              >
                Back
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button
                  variant="skeuoSecondary"
                  onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
                  disabled={currentStep === 0 && excelData.length === 0}
                >
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="skeuoSecondary"
                    className="px-8"
                    onClick={() => generateZip('jpg')}
                    disabled={isExporting}
                    isLoading={isExporting}
                  >
                    <Download className="mr-2 h-4 w-4" /> ZIP (JPGs)
                  </Button>
                </div>
              )}
            </div>

          </Card>
        </div>

        {/* Sidebar Summary Area */}
        <div className="lg:col-span-1">
          <Card variant="skeuo" className="p-6 sticky top-24">
            <h3 className="font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100 tracking-tight uppercase text-xs">Batch Summary</h3>

            <dl className="space-y-6 text-sm">
              <div>
                <dt className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">Rows detected</dt>
                <dd className="font-extrabold text-slate-900 text-3xl tabular-nums">{excelData.length || '-'}</dd>
              </div>

              <div>
                <dt className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">Status</dt>
                <dd>
                  {excelData.length === 0 ? (
                    <Badge variant="warning" className="bg-amber-50 text-amber-600 border-amber-100">Waiting for file</Badge>
                  ) : currentStep < 2 ? (
                    <Badge variant="primary" className="bg-indigo-50 text-indigo-600 border-indigo-100">Config pending</Badge>
                  ) : (
                    <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-emerald-100">Ready</Badge>
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">Selected Template</dt>
                <dd className="font-bold text-slate-900 text-base truncate">{selectedTemplate.name}</dd>
              </div>
            </dl>

            {isExporting && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex justify-between text-[10px] mb-2 uppercase font-bold tracking-widest">
                  <span className="text-indigo-600">Generating Batch...</span>
                  <span className="text-amber-600">{Math.round((progress.current / progress.total) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-indigo-500 to-amber-500 h-1.5 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]" style={{ width: `${(progress.current / progress.total) * 100}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 text-center font-bold">{progress.current} / {progress.total} COMPLETE</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* No hidden container needed — we build off-screen divs dynamically in generateZip */}

    </div>
  );
};

export { BulkGenerator };
