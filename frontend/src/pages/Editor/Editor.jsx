import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Download, ArrowLeft, Undo, Image as ImageIcon, Upload, X, Sparkles, Wand2, RefreshCw, Check, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { templates } from "../../data/mockData";
import { useDesignStore } from "../../store/designStore";

const PRESETS = [
  { name: "Gold & Wave Luxury", prompt: "Premium luxury award certificate background, elegant multi-layered glossy gold borders, majestic black and gold curves and waves in corners, gold ribbon seal on top-right, empty blank cream textured paper" },
  { name: "Modern Tech", prompt: "Modern professional technology certificate background, sharp black and royal blue geometric diagonal shapes in corners, clean white empty central space, premium graphic design frame" },
  { name: "Classic Baroque", prompt: "Elite classic certificate of appreciation background, delicate vintage golden filigree baroque scrolls and intricate floral ornaments in all four corners, clean blank cream paper, premium royal style" },
  { name: "Navy Executive", prompt: "Executive corporate certificate of achievement template, luxury dark royal navy blue frame border with gold line trim, grand golden badge medal seal in the bottom center, repeating geometric watermark texture, empty white space" }
];

const generateCertificateSVG = (styleName, variantIdx) => {
  // Base colors based on style category
  let primaryColor = "#d4af37"; // Gold default
  let secondaryColor = "#aa7c11";
  let bgFill = "#fdfbf7";
  let bgFill2 = "#f5f0e6";

  if (styleName === "Modern Tech") {
    primaryColor = "#3b82f6"; // Flutter blue
    secondaryColor = "#0f172a"; // Tech black
    bgFill = "#ffffff";
    bgFill2 = "#f8fafc";
  } else if (styleName === "Classic Baroque") {
    primaryColor = "#d4af37"; // Elegant Gold
    secondaryColor = "#aa7c11"; 
    bgFill = "#fbfbfb";
    bgFill2 = "#f5f5f4";
  } else if (styleName === "Navy Executive") {
    primaryColor = "#1e3a8a"; // Royal Navy
    secondaryColor = "#d4af37"; // Gold border/badge
    bgFill = "#ffffff";
    bgFill2 = "#f8fafc";
  }

  // Generate SVG markup based on variant index
  let borderMarkup = "";
  let cornerMarkup = "";
  let backgroundPattern = "";

  if (variantIdx === 0) {
    // Variant 1: Elegant Thin Double-Border with Classical Corner Filigrees
    borderMarkup = `
      <rect x="25" y="25" width="1006" height="766" rx="8" fill="none" stroke="${primaryColor}" stroke-width="4" />
      <rect x="35" y="35" width="986" height="746" rx="6" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
      <rect x="42" y="42" width="972" height="732" rx="4" fill="none" stroke="${primaryColor}" stroke-width="1" stroke-dasharray="8,4" opacity="0.6" />
    `;
    cornerMarkup = `
      <!-- Top Left -->
      <g transform="translate(35, 35)">
        <path d="M 0 40 C 0 15, 15 0, 40 0" fill="none" stroke="${primaryColor}" stroke-width="3" />
        <path d="M 5 45 C 5 25, 25 5, 45 5" fill="none" stroke="${secondaryColor}" stroke-width="1" />
        <path d="M 0 25 C 10 25, 25 10, 25 0" fill="none" stroke="${primaryColor}" stroke-width="1.5" />
        <circle cx="20" cy="20" r="4" fill="${primaryColor}" />
        <path d="M 0 60 L 0 0 L 60 0" fill="none" stroke="${primaryColor}" stroke-width="1.5" />
      </g>
      <!-- Top Right -->
      <g transform="translate(1021, 35) scale(-1, 1)">
        <path d="M 0 40 C 0 15, 15 0, 40 0" fill="none" stroke="${primaryColor}" stroke-width="3" />
        <path d="M 5 45 C 5 25, 25 5, 45 5" fill="none" stroke="${secondaryColor}" stroke-width="1" />
        <path d="M 0 25 C 10 25, 25 10, 25 0" fill="none" stroke="${primaryColor}" stroke-width="1.5" />
        <circle cx="20" cy="20" r="4" fill="${primaryColor}" />
        <path d="M 0 60 L 0 0 L 60 0" fill="none" stroke="${primaryColor}" stroke-width="1.5" />
      </g>
      <!-- Bottom Left -->
      <g transform="translate(35, 781) scale(1, -1)">
        <path d="M 0 40 C 0 15, 15 0, 40 0" fill="none" stroke="${primaryColor}" stroke-width="3" />
        <path d="M 5 45 C 5 25, 25 5, 45 5" fill="none" stroke="${secondaryColor}" stroke-width="1" />
        <path d="M 0 25 C 10 25, 25 10, 25 0" fill="none" stroke="${primaryColor}" stroke-width="1.5" />
        <circle cx="20" cy="20" r="4" fill="${primaryColor}" />
        <path d="M 0 60 L 0 0 L 60 0" fill="none" stroke="${primaryColor}" stroke-width="1.5" />
      </g>
      <!-- Bottom Right -->
      <g transform="translate(1021, 781) scale(-1, -1)">
        <path d="M 0 40 C 0 15, 15 0, 40 0" fill="none" stroke="${primaryColor}" stroke-width="3" />
        <path d="M 5 45 C 5 25, 25 5, 45 5" fill="none" stroke="${secondaryColor}" stroke-width="1" />
        <path d="M 0 25 C 10 25, 25 10, 25 0" fill="none" stroke="${primaryColor}" stroke-width="1.5" />
        <circle cx="20" cy="20" r="4" fill="${primaryColor}" />
        <path d="M 0 60 L 0 0 L 60 0" fill="none" stroke="${primaryColor}" stroke-width="1.5" />
      </g>
    `;
  } else if (variantIdx === 1) {
    // Variant 2: Thick Royal Border with Corner Star Accents & Golden Seal Badge
    borderMarkup = `
      <rect x="30" y="30" width="996" height="756" rx="4" fill="none" stroke="${primaryColor}" stroke-width="10" />
      <rect x="48" y="48" width="960" height="720" rx="2" fill="none" stroke="${secondaryColor}" stroke-width="2" />
      <rect x="56" y="56" width="944" height="704" rx="2" fill="none" stroke="${primaryColor}" stroke-width="1" opacity="0.5" />
    `;
    cornerMarkup = `
      <g transform="translate(48, 48)">
        <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="${primaryColor}" />
        <circle cx="0" cy="0" r="16" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
      </g>
      <g transform="translate(1008, 48)">
        <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="${primaryColor}" />
        <circle cx="0" cy="0" r="16" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
      </g>
      <g transform="translate(48, 768)">
        <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="${primaryColor}" />
        <circle cx="0" cy="0" r="16" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
      </g>
      <g transform="translate(1008, 768)">
        <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="${primaryColor}" />
        <circle cx="0" cy="0" r="16" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
      </g>
      
      <!-- Elegant Ribbon Seal -->
      <g transform="translate(160, 650)">
        <path d="M -20 30 L 0 90 L 20 30 L 10 20 L -10 20 Z" fill="${secondaryColor}" opacity="0.85" />
        <path d="M 0 30 L 25 85 L 45 30 L 30 20 L 10 20 Z" fill="${secondaryColor}" transform="rotate(25)" opacity="0.75" />
        <path d="M 0 30 L -25 85 L -45 30 L -30 20 L -10 20 Z" fill="${secondaryColor}" transform="rotate(-25)" opacity="0.75" />
        <circle cx="0" cy="20" r="42" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="2" />
        <circle cx="0" cy="20" r="34" fill="none" stroke="${bgFill}" stroke-width="1.5" stroke-dasharray="4,2" />
        <circle cx="0" cy="20" r="28" fill="none" stroke="${secondaryColor}" stroke-width="1" />
        <polygon points="0,0 6,14 18,6 10,20 22,22 8,24 10,38 0,28 -10,38 -8,24 -22,22 -10,20 -18,6 -6,14" fill="${secondaryColor}" />
      </g>
    `;
  } else if (variantIdx === 2) {
    // Variant 3: Modern Tech - Gorgeous Black & Blue Diagonal Blocks (RNGPIT Style!)
    borderMarkup = `
      <rect x="20" y="20" width="1016" height="776" rx="4" fill="none" stroke="#e2e8f0" stroke-width="2" />
      <rect x="30" y="30" width="996" height="756" rx="2" fill="none" stroke="#cbd5e1" stroke-width="1" />
    `;
    cornerMarkup = `
      <!-- Top Left Black Wedge -->
      <polygon points="0,0 240,0 200,90 0,90" fill="#090d16" />
      <polygon points="0,90 40,90 0,130" fill="#090d16" />
      
      <!-- Top Left Blue Accents -->
      <polygon points="245,0 295,0 315,30 265,30" fill="#3b82f6" />
      <polygon points="268,35 308,35 328,65 288,65" fill="#60a5fa" opacity="0.6" />
      
      <!-- Bottom Right Black Wedge -->
      <polygon points="1056,816 816,816 856,726 1056,726" fill="#090d16" />
      <polygon points="1056,726 1016,726 1056,686" fill="#090d16" />
      
      <!-- Bottom Right Blue Accents -->
      <polygon points="811,816 761,816 741,786 791,786" fill="#3b82f6" />
      <polygon points="788,781 748,781 728,751 768,751" fill="#60a5fa" opacity="0.6" />
    `;
  } else {
    // Variant 4: Floating Frame Border with Baroque Ornamental Swirls
    borderMarkup = `
      <rect x="50" y="50" width="956" height="716" rx="16" fill="none" stroke="${primaryColor}" stroke-width="6" />
      <rect x="62" y="62" width="932" height="692" rx="10" fill="none" stroke="${secondaryColor}" stroke-dasharray="5,5" stroke-width="1.5" />
    `;
    cornerMarkup = `
      <!-- Top Left -->
      <g transform="translate(56, 56)">
        <path d="M 10 40 C 10 20, 20 10, 40 10" fill="none" stroke="${primaryColor}" stroke-width="3" />
        <path d="M 15 45 C 15 25, 25 15, 45 15 M 10 60 C 10 30, 30 10, 60 10" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
        <path d="M 25 25 Q 35 15, 30 5 Q 25 -5, 15 5 Q 5 15, 15 25 Z" fill="${primaryColor}" opacity="0.75" />
      </g>
      <!-- Top Right -->
      <g transform="translate(1000, 56) scale(-1, 1)">
        <path d="M 10 40 C 10 20, 20 10, 40 10" fill="none" stroke="${primaryColor}" stroke-width="3" />
        <path d="M 15 45 C 15 25, 25 15, 45 15 M 10 60 C 10 30, 30 10, 60 10" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
        <path d="M 25 25 Q 35 15, 30 5 Q 25 -5, 15 5 Q 5 15, 15 25 Z" fill="${primaryColor}" opacity="0.75" />
      </g>
      <!-- Bottom Left -->
      <g transform="translate(56, 760) scale(1, -1)">
        <path d="M 10 40 C 10 20, 20 10, 40 10" fill="none" stroke="${primaryColor}" stroke-width="3" />
        <path d="M 15 45 C 15 25, 25 15, 45 15 M 10 60 C 10 30, 30 10, 60 10" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
        <path d="M 25 25 Q 35 15, 30 5 Q 25 -5, 15 5 Q 5 15, 15 25 Z" fill="${primaryColor}" opacity="0.75" />
      </g>
      <!-- Bottom Right -->
      <g transform="translate(1000, 760) scale(-1, -1)">
        <path d="M 10 40 C 10 20, 20 10, 40 10" fill="none" stroke="${primaryColor}" stroke-width="3" />
        <path d="M 15 45 C 15 25, 25 15, 45 15 M 10 60 C 10 30, 30 10, 60 10" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
        <path d="M 25 25 Q 35 15, 30 5 Q 25 -5, 15 5 Q 5 15, 15 25 Z" fill="${primaryColor}" opacity="0.75" />
      </g>
    `;
  }

  // Add a very subtle watermark/guilloche pattern in the background
  backgroundPattern = `
    <g opacity="0.04" stroke="${primaryColor}" stroke-width="1" fill="none">
      <circle cx="528" cy="408" r="360" />
      <circle cx="528" cy="408" r="340" stroke-dasharray="10,5" />
      <circle cx="528" cy="408" r="320" />
      <circle cx="528" cy="408" r="300" stroke-dasharray="2,2" />
      <circle cx="528" cy="408" r="280" />
      <circle cx="528" cy="408" r="260" stroke-dasharray="8,4" />
      <path d="M 528 48 L 528 768 M 168 408 L 888 408 M 274 154 L 782 662 M 274 662 L 782 154" stroke-width="0.5" opacity="0.7" />
      <path d="M 528 408 m -100 0 a 100 100 0 1 0 200 0 a 100 100 0 1 0 -200 0 Z" stroke-dasharray="5,15" stroke-width="2" />
      <path d="M 528 408 m -150 0 a 150 150 0 1 0 300 0 a 150 150 0 1 0 -300 0 Z" stroke-dasharray="12,12" />
    </g>
  `;

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1056" height="816" viewBox="0 0 1056 816">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgFill}" />
          <stop offset="100%" stop-color="${bgFill2}" />
        </linearGradient>
      </defs>
      <rect width="1056" height="816" fill="url(#bgGrad)" />
      ${backgroundPattern}
      ${borderMarkup}
      ${cornerMarkup}
    </svg>
  `.trim();

  // Convert to clean base64 data URL
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
};

const Editor = () => {
  const { templateId } = useParams();
  const template = templates.find(t => t.id === templateId) || templates[0];
  const navigate = useNavigate();

  // Refs
  const previewContainerRef = useRef(null);
  const bgInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // Scale state for fitting preview in screen
  const [scale, setScale] = useState(1);
  const [activeTab, setActiveTab] = useState("content");
  const [isExporting, setIsExporting] = useState(false);

  // AI Generation State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiActivePrompt, setAiActivePrompt] = useState("");
  const [aiActivePreset, setAiActivePreset] = useState("Gold & Wave Luxury");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiChoices, setAiChoices] = useState([]);
  const [aiSeeds, setAiSeeds] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [leftPanelTab, setLeftPanelTab] = useState("data"); // "data" or "ai"

  const handleImageError = (idx) => {
    // If the AI image fails to load, swap it with a gorgeous, high-fidelity offline SVG certificate border template!
    setAiChoices(prev => {
      const updated = [...prev];
      if (updated[idx] && !updated[idx].startsWith("data:image/svg+xml")) {
        updated[idx] = generateCertificateSVG(aiActivePreset, idx);
      }
      return updated;
    });
  };

  // Shared design store (background + logo, shared with BulkGenerator)
  const { 
    backgroundImage, 
    logoImage, 
    logoLeft, 
    logoRight, 
    styleData,
    certData,
    setBackgroundImage, 
    setLogoImage, 
    setLogoLeft, 
    setLogoRight,
    setStyleData,
    setCertData
  } = useDesignStore();

  // Generate background candidates from AI
  const handleAIGenerate = async (customPrompt) => {
    const targetPrompt = customPrompt || aiPrompt;
    if (!targetPrompt.trim()) {
      setAiError("Please select a style preset or write a custom prompt!");
      return;
    }
    
    setIsGeneratingAI(true);
    setAiError(null);
    setSelectedChoiceIdx(null);
    setLoadedImages({}); // Clear previously loaded images
    setAiChoices([]); // Clear old choices
    setAiActivePrompt(targetPrompt); // Store the exact prompt used

    // Detect active style preset based on targetPrompt to use matching premium SVG fallbacks
    const matchedPreset = PRESETS.find(p => targetPrompt.includes(p.name) || p.prompt.includes(targetPrompt))?.name || "Gold & Wave Luxury";
    setAiActivePreset(matchedPreset);

    // Dynamic array of random seeds
    const seeds = [
      Math.floor(Math.random() * 100000) + 1000,
      Math.floor(Math.random() * 100000) + 2000,
      Math.floor(Math.random() * 100000) + 3000,
      Math.floor(Math.random() * 100000) + 4000,
    ];
    setAiSeeds(seeds);

    // Build the super-optimized refined prompt for highly professional layout and blank center
    const refinedPrompt = `${targetPrompt}, high-resolution elegant award certificate background template, empty blank central space, premium graphic design frame, beautiful margins, 4k quality, no text, no watermark, no words`;

    // Construct preview pollinations URL with staggered loading to completely avoid rate limiting
    setIsGeneratingAI(false); // Clear main button loader immediately so user is in interactive control
    
    for (let i = 0; i < 4; i++) {
      // Stagger by 500ms per card to allow parallel HTTP connection queues to flow without rate-limiting
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      const url = `http://localhost:5000/api/ai/generate?prompt=${encodeURIComponent(targetPrompt)}&width=528&height=408&seed=${seeds[i]}`;
      setAiChoices(prev => [...prev, url]);
    }
  };

  // Auto-scale preview to fit container
  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const { clientWidth, clientHeight } = previewContainerRef.current;
        const padding = 32;
        const scaleX = (clientWidth - padding) / 1056;
        const scaleY = (clientHeight - padding) / 816;
        setScale(Math.min(scaleX, scaleY, 1));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    const t = setTimeout(updateScale, 50);
    return () => { window.removeEventListener('resize', updateScale); clearTimeout(t); };
  }, [activeTab]);

  // --- Handlers ---
  const handleReset = () => {
    setCertData({
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
    });
  };

  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBackgroundImage(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = ''; // reset so same file can be re-selected
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoImage(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Template variable substitution (for HTML templates)
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const buildHtml = (overrideData) => {
    const data = overrideData || certData;
    let html = template.html;
    Object.keys(data).forEach(key => {
      html = html.replace(new RegExp(`{{${escapeRegExp(key)}}}`, 'g'), data[key]);
    });
    html = html.replace(/font-family: [^;]+;/g, `font-family: ${styleData.fontFamily};`);
    const baseColorMap = { 'tpl-1': '#d97706', 'tpl-2': '#0f172a', 'tpl-3': '#94a3b8', 'tpl-4': '#dc2626', 'tpl-5': '#f43f5e' };
    if (baseColorMap[template.id] && styleData.primaryColor !== baseColorMap[template.id]) {
      html = html.replace(new RegExp(baseColorMap[template.id], 'gi'), styleData.primaryColor);
    }
    return html;
  };

  // -----------------------------------------------------------------------
  // EXPORT: Build an off-screen element at full 1056x816 (no CSS scale),
  // capture with html2canvas → zero overlap guaranteed.
  // -----------------------------------------------------------------------
  const captureOffScreen = async () => {
    // Create a wrapper div positioned off-screen
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: 1056px;
      height: 816px;
      overflow: hidden;
      z-index: -1;
    `;

    // Inner container: background image OR white
    const inner = document.createElement('div');
    inner.style.cssText = `
      position: relative;
      width: 1056px;
      height: 816px;
      background: white;
    `;

    if (backgroundImage) {
      // Background layer
      const bg = document.createElement('img');
      bg.crossOrigin = 'anonymous';
      bg.src = backgroundImage;
      bg.style.cssText = 'position:absolute;top:0;left:0;width:1056px;height:816px;object-fit:fill;';
      inner.appendChild(bg);

      // Logo layer (bottom-right corner by default, 120x120)
      if (logoImage) {
        const logo = document.createElement('img');
        logo.crossOrigin = 'anonymous';
        logo.src = logoImage;
        logo.style.cssText = 'position:absolute;bottom:60px;left:50%;transform:translateX(-50%);width:100px;height:100px;object-fit:contain;';
        inner.appendChild(logo);
      }

      // Text overlay layer
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width: 1056px; height: 816px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 60px;
        box-sizing: border-box;
        font-family: ${styleData.fontFamily};
        color: ${styleData.textColor};
      `;
      overlay.innerHTML = buildOverlayHTML(certData, styleData);
      inner.appendChild(overlay);
    } else {
      // No custom background → render template HTML as-is (original behaviour)
      const templateDiv = document.createElement('div');
      templateDiv.style.cssText = 'width:1056px;height:816px;';
      templateDiv.innerHTML = buildHtml();
      inner.appendChild(templateDiv);

      // Still render logo if uploaded
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

    // Wait for images to load
    const imgs = wrapper.querySelectorAll('img');
    await Promise.all(Array.from(imgs).map(img =>
      img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
    ));
    await new Promise(r => setTimeout(r, 80));

    const canvas = await html2canvas(inner, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null });
    document.body.removeChild(wrapper);
    return canvas;
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const canvas = await captureOffScreen();
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${certData.recipientName.replace(/\s+/g, '_')}_Certificate.pdf`);
      await handleSaveToDB();
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJPEG = async () => {
    setIsExporting(true);
    try {
      const canvas = await captureOffScreen();
      const link = document.createElement('a');
      link.download = `${certData.recipientName.replace(/\s+/g, '_')}_Certificate.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.92);
      link.click();
      await handleSaveToDB();
    } catch (err) {
      console.error("JPG export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveToDB = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await fetch("http://localhost:5000/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({
          recipientName: certData.recipientName,
          courseTitle: certData.courseTitle,
          issueDate: certData.date,
          templateId: template.id,
          type: "single",
          issuedBy: certData.issuedBy,
          signature1: certData.signature1,
          signature2: certData.signature2,
          styleData,
        }),
      });
    } catch (err) {
      console.error("DB save failed:", err);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] -m-4 sm:-m-6 lg:-m-8">

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 p-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/templates" className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="hidden sm:block">
            <h2 className="font-bold text-slate-900 leading-tight">Editing: {template.name}</h2>
            <p className="text-xs text-slate-400">Fill data → Upload background → Export</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Hidden file inputs */}
          <input ref={bgInputRef}   type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
          <input ref={logoInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={handleLogoUpload} />

          {/* Background upload */}
          <button
            onClick={() => bgInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <Upload className="h-4 w-4 text-amber-500" />
            <span className="hidden sm:inline">{backgroundImage ? 'Change BG' : 'Upload BG'}</span>
          </button>

          {backgroundImage && (
            <button
              onClick={() => setBackgroundImage(null)}
              title="Remove background"
              className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Logo upload */}
          <button
            onClick={() => logoInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <ImageIcon className="h-4 w-4 text-blue-500" />
            <span className="hidden sm:inline">{logoImage ? 'Change Logo' : 'Add Logo'}</span>
          </button>

          {logoImage && (
            <button
              onClick={() => setLogoImage(null)}
              title="Remove logo"
              className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Reset */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors hidden md:flex"
          >
            <Undo className="h-4 w-4" /> Reset
          </button>

          {/* Export */}
          <Button variant="outline" size="sm" onClick={handleExportJPEG} isLoading={isExporting}>JPG</Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" size="sm" onClick={handleExportPDF} isLoading={isExporting}>
            <Download className="h-4 w-4 mr-1" /> PDF
          </Button>
        </div>
      </div>

      {/* ── Mobile Tabs ─────────────────────────────────────────────────── */}
      <div className="md:hidden flex border-b border-slate-200 bg-white shrink-0">
        {['content', 'ai', 'preview', 'style'].map(tab => (
          <button
            key={tab}
            className={`flex-1 py-3 text-sm font-medium border-b-2 capitalize ${activeTab === tab ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500'}`}
            onClick={() => setActiveTab(tab)}
          >{tab === 'ai' ? '✨ AI Designer' : tab}</button>
        ))}
      </div>

      {/* ── Main Area ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">

        {/* LEFT PANEL — Certificate Data & AI Background Generator */}
        <div className={`w-full md:w-96 bg-white border-r border-slate-200 overflow-y-auto shrink-0 ${activeTab === 'content' || activeTab === 'ai' ? 'block' : 'hidden'} md:block flex flex-col h-full`}>
          
          {/* Tabs header for Desktop */}
          <div className="flex border-b border-slate-100 shrink-0 sticky top-0 bg-white z-10">
            <button
              onClick={() => { setLeftPanelTab("data"); setActiveTab("content"); }}
              className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${leftPanelTab === "data" ? "border-amber-500 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}
            >
              📝 Data Fields
            </button>
            <button
              onClick={() => { setLeftPanelTab("ai"); setActiveTab("ai"); }}
              className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-1.5 ${leftPanelTab === "ai" ? "border-amber-500 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" /> Nano Banana AI
            </button>
          </div>

          {/* Tab content wrapper */}
          <div className="p-6 flex-1 overflow-y-auto">
            {/* Show DATA tab if active */}
            {((leftPanelTab === "data" && activeTab !== "ai") || activeTab === "content") && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Certificate Data</h3>
                  <p className="text-xs text-slate-400">Changes appear live in the preview →</p>
                </div>

                <div className="space-y-4">
                  <Input label="Certificate Title"     value={certData.title}         onChange={e => setCertData({ ...certData, title: e.target.value })} />
                  <Input label="Issued By"             value={certData.issuedBy}      onChange={e => setCertData({ ...certData, issuedBy: e.target.value })} />
                  <Input label="Introductory Text"     value={certData.introText}     onChange={e => setCertData({ ...certData, introText: e.target.value })} />
                  <Input label="Recipient Name"        value={certData.recipientName} onChange={e => setCertData({ ...certData, recipientName: e.target.value })} />
                  
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Description Paragraph</label>
                    <textarea
                      value={certData.description}
                      onChange={e => setCertData({ ...certData, description: e.target.value })}
                      className="w-full h-20 p-2.5 rounded-lg border border-slate-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all resize-none font-medium"
                    />
                  </div>

                  <Input label="Course / Award Title"  value={certData.courseTitle}   onChange={e => setCertData({ ...certData, courseTitle: e.target.value })} />
                  <Input label="Date"                  value={certData.date}          onChange={e => setCertData({ ...certData, date: e.target.value })} />
                  
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Logos & Seals</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Top-Left Logo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              const r = new FileReader();
                              r.onload = ev => setLogoLeft(ev.target.result);
                              r.readAsDataURL(file);
                            }
                          }}
                          className="text-xs w-full text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        />
                        {logoLeft && (
                          <button onClick={() => setLogoLeft(null)} className="text-[10px] text-red-500 hover:underline mt-1 block">Remove Left Logo</button>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Top-Right Logo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              const r = new FileReader();
                              r.onload = ev => setLogoRight(ev.target.result);
                              r.readAsDataURL(file);
                            }
                          }}
                          className="text-xs w-full text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        />
                        {logoRight && (
                          <button onClick={() => setLogoRight(null)} className="text-[10px] text-red-500 hover:underline mt-1 block">Remove Right Logo</button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Signatures (Up to 3)</label>
                    
                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Signature 1</p>
                      <Input label="Name" value={certData.signature1} onChange={e => setCertData({ ...certData, signature1: e.target.value })} />
                      <Input label="Role" value={certData.signature1Role} onChange={e => setCertData({ ...certData, signature1Role: e.target.value })} />
                      <Input label="Organisation" value={certData.signature1Org} onChange={e => setCertData({ ...certData, signature1Org: e.target.value })} />
                    </div>

                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Signature 2</p>
                      <Input label="Name" value={certData.signature2} onChange={e => setCertData({ ...certData, signature2: e.target.value })} />
                      <Input label="Role" value={certData.signature2Role} onChange={e => setCertData({ ...certData, signature2Role: e.target.value })} />
                      <Input label="Organisation" value={certData.signature2Org} onChange={e => setCertData({ ...certData, signature2Org: e.target.value })} />
                    </div>

                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Signature 3 (Optional)</p>
                      <Input label="Name" value={certData.signature3} onChange={e => setCertData({ ...certData, signature3: e.target.value })} />
                      <Input label="Role" value={certData.signature3Role} onChange={e => setCertData({ ...certData, signature3Role: e.target.value })} />
                      <Input label="Organisation" value={certData.signature3Org} onChange={e => setCertData({ ...certData, signature3Org: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Upload tips */}
                <Card className="p-4 bg-amber-50 border-amber-200">
                  <p className="text-xs font-semibold text-amber-800 mb-1">💡 Canva Workflow</p>
                  <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
                    <li>Design certificate in Canva</li>
                    <li>Download as <strong>PNG</strong> (Leave name/date area blank)</li>
                    <li>Click <strong>"Upload BG"</strong> above</li>
                    <li>Fill data here → live preview updates</li>
                    <li>Export PDF / JPG — no overlap!</li>
                  </ol>
                </Card>
              </div>
            )}

            {/* Show NANO BANANA AI tab if active */}
            {((leftPanelTab === "ai" || activeTab === "ai")) && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    Nano Banana AI Designer
                  </h3>
                  <p className="text-xs text-slate-400">Generate customizable premium backgrounds instantly</p>
                </div>

                {/* Custom Prompt Box */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Design Prompt</label>
                  <div className="relative">
                    <textarea
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      placeholder="e.g. Elegant luxury gold frame with white marble textured paper..."
                      className="w-full h-24 p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all resize-none skeuo-input font-medium"
                    />
                  </div>
                </div>

                {/* Curated Style Presets */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Quick Styles</label>
                  <div className="flex gap-1.5 flex-wrap animate-fade-in">
                    {PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setAiPrompt(preset.prompt);
                          handleAIGenerate(preset.prompt);
                        }}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-800 transition-colors border border-slate-200/50"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Premium Vector Templates (Direct Selection) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Premium Vector Templates</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { name: "Gold & Wave Luxury", idx: 1 },
                      { name: "Modern Tech", idx: 2 },
                      { name: "Classic Baroque", idx: 3 },
                      { name: "Navy Executive", idx: 0 }
                    ].map((tpl) => (
                      <button
                        key={tpl.name}
                        onClick={() => {
                          const svgBase64 = generateCertificateSVG(tpl.name, tpl.idx);
                          setBackgroundImage(svgBase64);
                          setAiActivePreset(tpl.name);
                        }}
                        className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors border border-amber-200"
                      >
                        ⚡ Apply {tpl.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Banner */}
                {aiError && (
                  <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-lg font-medium">
                    {aiError}
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={() => handleAIGenerate()}
                  disabled={isGeneratingAI}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(245,158,11,0.2)] disabled:opacity-75 disabled:cursor-not-allowed skeuo-raised"
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Designing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Generate Backgrounds
                    </>
                  )}
                </button>

                {/* Choices Gallery */}
                {aiChoices.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Select a Choice</label>
                    <div className="grid grid-cols-2 gap-3">
                      {aiChoices.map((url, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedChoiceIdx(idx);
                            if (url.includes("unsplash.com")) {
                              setBackgroundImage(url);
                            } else {
                              const seed = aiSeeds[idx];
                              const highResUrl = `http://localhost:5000/api/ai/generate?prompt=${encodeURIComponent(aiActivePrompt || 'Elegant certificate background')}&width=1056&height=816&seed=${seed}`;
                              setBackgroundImage(highResUrl);
                            }
                          }}
                          className={`relative cursor-pointer aspect-[1056/816] rounded-xl overflow-hidden border-2 bg-slate-100 hover:scale-[1.03] transition-all group ${selectedChoiceIdx === idx ? 'border-amber-500 ring-2 ring-amber-400' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          {/* Image rendering with dynamic onLoad handler */}
                          <img
                            src={url}
                            alt={`AI Choice ${idx + 1}`}
                            className={`w-full h-full object-cover transition-opacity duration-500 ${loadedImages[idx] ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setLoadedImages(prev => ({ ...prev, [idx]: true }))}
                            onError={() => handleImageError(idx)}
                            loading="lazy"
                          />

                          {/* Dynamic Skeleton Loader Overlay */}
                          {!loadedImages[idx] && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-xs animate-pulse">
                              <Loader2 className="h-6 w-6 text-amber-500 animate-spin" />
                              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-1.5">Designing...</span>
                            </div>
                          )}

                          {/* Selection Overlay */}
                          {loadedImages[idx] && (
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                              {selectedChoiceIdx === idx ? (
                                <div className="bg-emerald-500 p-1.5 rounded-full shadow-lg">
                                  <Check className="h-4 w-4" />
                                </div>
                              ) : (
                                <span>Apply Design</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CENTER PANEL — Live Preview */}
        <div
          ref={previewContainerRef}
          className={`flex-1 bg-slate-100 overflow-hidden flex items-center justify-center ${activeTab === 'preview' ? 'flex' : 'hidden'} md:flex`}
        >
          <div style={{ width: 1056 * scale, height: 816 * scale }} className="relative flex-shrink-0">
            <div
              className="shadow-2xl absolute top-0 left-0 origin-top-left overflow-hidden"
              style={{ width: '1056px', height: '816px', transform: `scale(${scale})` }}
            >
              {backgroundImage ? (
                /* ── Custom Canva background mode ─────────────────── */
                <div className="relative w-full h-full">
                  {/* Background image */}
                  <img
                    crossOrigin="anonymous"
                    src={backgroundImage}
                    alt="certificate background"
                    className="absolute inset-0 w-full h-full"
                    style={{ objectFit: 'fill' }}
                    onError={(e) => {
                      e.target.src = generateCertificateSVG(aiActivePreset || "Classic Gold", 0);
                    }}
                    draggable={false}
                  />

                  {/* Logo (centered bottom) */}
                  {logoImage && (
                    <img
                      src={logoImage}
                      alt="logo"
                      className="absolute"
                      style={{ bottom: '60px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '100px', objectFit: 'contain' }}
                      draggable={false}
                    />
                  )}

                  {/* Text overlay — centered on background */}
                  <div
                    className="absolute inset-0"
                    dangerouslySetInnerHTML={{ __html: buildOverlayHTML(certData, styleData) }}
                  />
                </div>
              ) : (
                /* ── Original HTML template mode (fallback) ──────── */
                <div className="relative w-full h-full bg-white">
                  <div
                    style={{ width: '100%', height: '100%' }}
                    dangerouslySetInnerHTML={{ __html: buildHtml() }}
                  />
                  {logoImage && (
                    <img
                      src={logoImage}
                      alt="logo"
                      className="absolute"
                      style={{ bottom: '60px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '100px', objectFit: 'contain' }}
                      draggable={false}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Style Controls */}
        <div className={`w-full lg:w-72 bg-white border-l border-slate-200 overflow-y-auto p-6 shrink-0 ${activeTab === 'style' ? 'block' : 'hidden'} lg:block md:hidden`}>
          <h3 className="font-bold text-slate-900 mb-5">Design Elements</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Typography</label>
              <select
                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:ring-amber-500 focus:border-amber-500"
                value={styleData.fontFamily}
                onChange={e => setStyleData({ ...styleData, fontFamily: e.target.value })}
              >
                <option value="'Playfair Display', serif">Playfair Display (Serif)</option>
                <option value="'Inter', sans-serif">Inter (Sans-serif)</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="'Georgia', serif">Georgia</option>
                <option value="'Arial', sans-serif">Arial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Text Color (overlay)</label>
              <div className="flex gap-2 flex-wrap">
                {['#0f172a','#ffffff','#d97706','#dc2626','#2563eb','#16a34a','#7c3aed','#475569'].map(color => (
                  <button
                    key={color}
                    title={color}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${styleData.textColor === color ? 'border-slate-900 scale-110' : 'border-slate-200 hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setStyleData({ ...styleData, textColor: color })}
                  />
                ))}
              </div>
            </div>

            {!backgroundImage && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Primary Accent (template)</label>
                <div className="flex gap-2 flex-wrap">
                  {['#d97706','#dc2626','#f43f5e','#2563eb','#16a34a','#475569'].map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${styleData.primaryColor === color ? 'border-slate-900 scale-110' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setStyleData({ ...styleData, primaryColor: color })}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Fine-grained Font Sizes */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Text Sizes (px)</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Title Size</span>
                  <span className="font-semibold">{styleData.titleFontSize}px</span>
                </div>
                <input
                  type="range" min="16" max="72"
                  value={styleData.titleFontSize}
                  onChange={e => setStyleData({ ...styleData, titleFontSize: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Recipient Name</span>
                  <span className="font-semibold">{styleData.recipientFontSize}px</span>
                </div>
                <input
                  type="range" min="16" max="64"
                  value={styleData.recipientFontSize}
                  onChange={e => setStyleData({ ...styleData, recipientFontSize: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Description Paragraph</span>
                  <span className="font-semibold">{styleData.descriptionFontSize}px</span>
                </div>
                <input
                  type="range" min="10" max="32"
                  value={styleData.descriptionFontSize}
                  onChange={e => setStyleData({ ...styleData, descriptionFontSize: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Course / Award</span>
                  <span className="font-semibold">{styleData.courseFontSize}px</span>
                </div>
                <input
                  type="range" min="12" max="48"
                  value={styleData.courseFontSize}
                  onChange={e => setStyleData({ ...styleData, courseFontSize: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Signatures</span>
                  <span className="font-semibold">{styleData.signatureFontSize}px</span>
                </div>
                <input
                  type="range" min="8" max="24"
                  value={styleData.signatureFontSize}
                  onChange={e => setStyleData({ ...styleData, signatureFontSize: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Fine-grained Spacing */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Vertical Spacing (px)</h4>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Top Header Margin</span>
                  <span className="font-semibold">{styleData.headerTopPadding}px</span>
                </div>
                <input
                  type="range" min="10" max="150"
                  value={styleData.headerTopPadding}
                  onChange={e => setStyleData({ ...styleData, headerTopPadding: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Title to Name Spacing</span>
                  <span className="font-semibold">{styleData.titleMarginBottom}px</span>
                </div>
                <input
                  type="range" min="0" max="80"
                  value={styleData.titleMarginBottom}
                  onChange={e => setStyleData({ ...styleData, titleMarginBottom: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Name to Body Spacing</span>
                  <span className="font-semibold">{styleData.recipientMarginBottom}px</span>
                </div>
                <input
                  type="range" min="0" max="80"
                  value={styleData.recipientMarginBottom}
                  onChange={e => setStyleData({ ...styleData, recipientMarginBottom: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Signatures Top Spacing</span>
                  <span className="font-semibold">{styleData.signaturesMarginTop}px</span>
                </div>
                <input
                  type="range" min="0" max="150"
                  value={styleData.signaturesMarginTop}
                  onChange={e => setStyleData({ ...styleData, signaturesMarginTop: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <Card className="p-4 mt-8 bg-blue-50 border-blue-200">
            <p className="text-xs font-semibold text-blue-800 mb-1">Bulk Generation</p>
            <p className="text-xs text-blue-700">
              The background & logo you upload here are automatically used in Bulk Generation too — just upload your Excel/CSV there!
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
};

// ── Helper: Build overlay HTML for custom background mode ───────────────────
function substituteVariables(text, row) {
  if (!text) return "";
  let result = text;
  Object.keys(row).forEach(key => {
    const value = row[key] || "";
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'gi');
    result = result.replace(regex, value);
  });
  return result;
}

// This renders cleanly because it's absolutely positioned (no flex scaling issues)
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

export { Editor };
