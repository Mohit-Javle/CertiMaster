import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Settings, Share2, Download, ArrowLeft, RefreshCw, Layers, Check, Edit2, Copy, Trash2, Save, Undo, Image as ImageIcon } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { templates } from "../../data/mockData";

const Editor = () => {
  const { templateId } = useParams();
  const template = templates.find(t => t.id === templateId) || templates[0];
  const certRef = useRef(null);
  const previewContainerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const [activeTab, setActiveTab] = useState("content"); // mobile tab state
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const { clientWidth, clientHeight } = previewContainerRef.current;
        const padding = 32;
        const availableWidth = clientWidth - padding;
        const availableHeight = clientHeight - padding;

        const scaleX = availableWidth / 1056;
        const scaleY = availableHeight / 816;

        setScale(Math.min(scaleX, scaleY, 1));
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    const timeoutId = setTimeout(updateScale, 50);

    return () => {
      window.removeEventListener('resize', updateScale);
      clearTimeout(timeoutId);
    };
  }, [activeTab]);

  const [certData, setCertData] = useState({
    recipientName: "John Doe",
    courseTitle: "Advanced Masterclass",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    issuedBy: "CertiMaster Academy",
    signature1: "Jane Smith",
    signature2: "Robert Johnson"
  });

  const [styleData, setStyleData] = useState({
    fontFamily: template.id.includes('tpl-1') || template.id.includes('tpl-4') || template.id.includes('tpl-5') ? "'Playfair Display', serif" : "'Inter', sans-serif",
    primaryColor: template.id === 'tpl-4' ? '#dc2626' : template.id === 'tpl-5' ? '#f43f5e' : '#d97706',
    textColor: '#0f172a'
  });

  const handleReset = () => {
    setCertData({
      recipientName: "John Doe",
      courseTitle: "Advanced Masterclass",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      issuedBy: "CertiMaster Academy",
      signature1: "Jane Smith",
      signature2: "Robert Johnson"
    });
    setStyleData({
      fontFamily: template.id.includes('tpl-1') || template.id.includes('tpl-4') || template.id.includes('tpl-5') ? "'Playfair Display', serif" : "'Inter', sans-serif",
      primaryColor: template.id === 'tpl-4' ? '#dc2626' : template.id === 'tpl-5' ? '#f43f5e' : '#d97706',
      textColor: '#0f172a'
    });
  };

  // Helper to escape special characters in a string for use in a RegExp
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  };

  // Simple template substitution
  const generatePreviewHtml = () => {
    let html = template.html;
    Object.keys(certData).forEach(key => {
      const regex = new RegExp(`{{${escapeRegExp(key)}}}`, 'g');
      html = html.replace(regex, certData[key]);
    });

    // Apply dynamic styles (rough implementation for MVP)
    html = html.replace(/font-family: [^;]+;/g, `font-family: ${styleData.fontFamily};`);

    // Map of template IDs to their default primary colors
    const baseColorMap = {
      'tpl-1': '#d97706',
      'tpl-2': '#0f172a',
      'tpl-3': '#94a3b8',
      'tpl-4': '#dc2626',
      'tpl-5': '#f43f5e'
    };

    if (baseColorMap[template.id] && styleData.primaryColor !== baseColorMap[template.id]) {
      html = html.replace(new RegExp(baseColorMap[template.id], 'gi'), styleData.primaryColor);
    }

    return html;
  };

  const handleExportPDF = async () => {
    if (!certRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${certData.recipientName.replace(/\s+/g, '_')}_Certificate.pdf`);

      // Auto-save to database upon successful export
      await handleSaveToDB();
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJPEG = async () => {
    if (!certRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `${certData.recipientName.replace(/\s+/g, '_')}_Certificate.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();

      // Auto-save to database upon successful export
      await handleSaveToDB();
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveToDB = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return; // Silent return if not logged in

      const res = await fetch("http://localhost:5000/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        body: JSON.stringify({
          recipientName: certData.recipientName,
          courseTitle: certData.courseTitle,
          issueDate: certData.date,
          templateId: template.id,
          type: "single",
          issuedBy: certData.issuedBy,
          signature1: certData.signature1,
          signature2: certData.signature2,
          styleData: styleData
        })
      });
      // Silently save
    } catch (err) {
      console.error("Failed to sync generated certificate to database:", err);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] -m-4 sm:-m-6 lg:-m-8">
      {/* Editor Toolbar */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/templates" className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="font-bold text-slate-900 hidden sm:block">Editing: {template.name}</h2>
            <p className="text-xs text-slate-500 hidden sm:block">Unsaved changes</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset} className="hidden md:flex">
            <Undo className="h-4 w-4 mr-2" /> Reset
          </Button>
          <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>
          <Button variant="outline" size="sm" onClick={handleExportJPEG} isLoading={isExporting}>
            <ImageIcon className="h-4 w-4 mr-2 hidden sm:block" /> JPG
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" size="sm" onClick={handleExportPDF} isLoading={isExporting}>
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Main Work Area */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">

        {/* Mobile Tabs */}
        <div className="md:hidden flex border-b border-slate-200 bg-white shrink-0">
          <button
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'content' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500'}`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'preview' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500'}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'style' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500'}`}
            onClick={() => setActiveTab('style')}
          >
            Style
          </button>
        </div >

        {/* Left Panel - Content Form */}
        <div className={`w-full md:w-80 bg-white border-r border-slate-200 overflow-y-auto p-6 shrink-0 ${activeTab === 'content' ? 'block' : 'hidden'} md:block`}>
          <h3 className="font-bold text-slate-900 mb-6">Certificate Data</h3>
          <div className="space-y-4">
            <Input
              label="Recipient Name"
              value={certData.recipientName}
              onChange={(e) => setCertData({ ...certData, recipientName: e.target.value })}
            />
            <Input
              label="Course / Award Title"
              value={certData.courseTitle}
              onChange={(e) => setCertData({ ...certData, courseTitle: e.target.value })}
            />
            <Input
              label="Date"
              value={certData.date}
              onChange={(e) => setCertData({ ...certData, date: e.target.value })}
            />
            <Input
              label="Issued By Organization"
              value={certData.issuedBy}
              onChange={(e) => setCertData({ ...certData, issuedBy: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Signature 1 Name"
                value={certData.signature1}
                onChange={(e) => setCertData({ ...certData, signature1: e.target.value })}
              />
              <Input
                label="Signature 2 Name"
                value={certData.signature2}
                onChange={(e) => setCertData({ ...certData, signature2: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Center Panel - Canvas Preview */}
        <div
          ref={previewContainerRef}
          className={`flex-1 bg-slate-100/50 overflow-hidden flex items-center justify-center ${activeTab === 'preview' ? 'flex' : 'hidden'} md:flex`}
        >
          {/* Wrapper to maintain document flow size for the scaled element */}
          <div style={{ width: 1056 * scale, height: 816 * scale }} className="relative flex-shrink-0">
            <div
              className="bg-white shadow-xl transition-all duration-200 absolute top-0 left-0 origin-top-left"
              style={{
                width: '1056px', // Standard 11x8.5in at 96dpi
                height: '816px',
                transform: `scale(${scale})`,
              }}
            >
              {/* The actual HTML being rendered for the preview and export */}
              <div
                ref={certRef}
                style={{ width: '100%', height: '100%' }}
                dangerouslySetInnerHTML={{ __html: generatePreviewHtml() }}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Style Controls (Desktop only to not clutter, simplified for MVP) */}
        <div className={`w-full lg:w-72 bg-white border-l border-slate-200 overflow-y-auto p-6 shrink-0 ${activeTab === 'style' ? 'block' : 'hidden'} lg:block md:hidden`}>
          <h3 className="font-bold text-slate-900 mb-6">Design Elements</h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Typography</label>
              <select
                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:ring-amber-500 focus:border-amber-500"
                value={styleData.fontFamily}
                onChange={(e) => setStyleData({ ...styleData, fontFamily: e.target.value })}
              >
                <option value="'Playfair Display', serif">Playfair Display (Serif)</option>
                <option value="'Inter', sans-serif">Inter (Sans-serif)</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Courier New', monospace">Courier New</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Primary Accent</label>
              <div className="flex gap-2">
                {['#d97706', '#dc2626', '#f43f5e', '#2563eb', '#16a34a', '#475569'].map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${styleData.primaryColor === color ? 'border-slate-900 scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setStyleData({ ...styleData, primaryColor: color })}
                  />
                ))}
              </div>
            </div>
          </div>

          <Card className="p-4 mt-8 bg-amber-50 border-amber-200">
            <p className="text-sm text-amber-800 font-medium mb-1">Live Updates</p>
            <p className="text-xs text-amber-700">Changes made here are instantly reflected on the certificate template on the left. High resolution is maintained for export.</p>
          </Card>
        </div>

      </div>
    </div>
  );
};

export { Editor };
