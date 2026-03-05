import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UploadCloud, CheckCircle2, ChevronRight, FileSpreadsheet, AlertCircle, LayoutTemplate, Download } from "lucide-react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { templates } from "../../data/mockData";

const STEPS = ["Upload Data", "Select Template", "Review & Export"];

const BulkGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

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

  const hiddenRenderRef = useRef(null);

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

        // Auto-map if column names match roughly
        const newMapping = { ...fieldMapping };
        cols.forEach(col => {
          const lower = col.toLowerCase();
          if (lower.includes('name') || lower.includes('student')) newMapping.recipientName = col;
          if (lower.includes('course') || lower.includes('title') || lower.includes('award')) newMapping.courseTitle = col;
          if (lower.includes('date')) newMapping.date = col;
        });
        setFieldMapping(newMapping);
      }
    };
    reader.readAsBinaryString(file);
  };

  const loadSampleData = () => {
    const sample = [
      { FullName: "Alice Johnson", Workshop: "React Advanced", IssueDate: "Oct 12, 2026" },
      { FullName: "Bob Smith", Workshop: "UI/UX Principles", IssueDate: "Oct 12, 2026" },
      { FullName: "Charlie Brown", Workshop: "Node.js Basics", IssueDate: "Oct 13, 2026" }
    ];
    setExcelData(sample);
    setColumns(["FullName", "Workshop", "IssueDate"]);
    setFieldMapping({ recipientName: "FullName", courseTitle: "Workshop", date: "IssueDate" });
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

    // We render each one sequentially in a hidden container to capture it
    for (let i = 0; i < excelData.length; i++) {
      const row = excelData[i];

      // Populate template HTML
      let html = selectedTemplate.html;

      // Map dynamic fields
      html = html.replace(/{{recipientName}}/g, row[fieldMapping.recipientName] || "Unknown");
      html = html.replace(/{{courseTitle}}/g, row[fieldMapping.courseTitle] || "Completion");
      html = html.replace(/{{date}}/g, row[fieldMapping.date] || new Date().toLocaleDateString());

      // Default static fields for bulk
      html = html.replace(/{{issuedBy}}/g, "CertiMaster Org");
      html = html.replace(/{{signature1}}/g, "Manager");
      html = html.replace(/{{signature2}}/g, "Director");

      // Inject into hidden DOM
      if (hiddenRenderRef.current) {
        hiddenRenderRef.current.innerHTML = html;
        // tiny delay to ensure fonts/layout shift
        await wait(50);

        const canvas = await html2canvas(hiddenRenderRef.current, { scale: 2 });
        const imgData = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`, 0.9);

        // Clean filename
        const fileNameSafe = String(row[fieldMapping.recipientName] || `Cert_${i}`).replace(/[^a-z0-9]/gi, '_');

        // Add to zip (strip the data:image prefix)
        const base64Data = imgData.replace(/^data:image\/(png|jpeg);base64,/, "");
        folder.file(`${fileNameSafe}.${format}`, base64Data, { base64: true });

        setProgress({ current: i + 1, total: excelData.length });
      }
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

                <div className="text-center">
                  <button onClick={loadSampleData} className="text-sm font-medium text-amber-500 hover:text-amber-600 underline">
                    Load sample data to test the workflow
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

      {/* Hidden container for canvas rendering in bulk */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div
          ref={hiddenRenderRef}
          style={{ width: '1056px', height: '816px', backgroundColor: 'white' }}
        />
      </div>

    </div>
  );
};

export { BulkGenerator };
