// 5 Hardcoded HTML/CSS templates for the certificates
// We use inline styles heavily to ensure exact rendering when passing to html2canvas

export const templates = [
  {
    id: "tpl-1",
    name: "Classic Gold",
    category: "Academic",
    thumbnail: "bg-slate-50 border-8 border-double border-amber-600", // Tailwind representation for gallery
    html: `
      <div style="width: 100%; height: 100%; padding: 40px; background-color: #ffffff; position: relative; font-family: 'Playfair Display', serif; text-align: center; color: #1e293b; box-sizing: border-box;">
        <div style="width: 100%; height: 100%; border: 12px double #d97706; padding: 40px; box-sizing: border-box; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <h2 style="font-size: 24px; letter-spacing: 4px; color: #d97706; text-transform: uppercase; margin-bottom: 10px;">{{issuedBy}}</h2>
          <h1 style="font-size: 64px; font-weight: 700; margin: 20px 0; color: #0f172a;">Certificate of Completion</h1>
          <p style="font-size: 18px; font-style: italic; margin-bottom: 30px; color: #64748b;">This is to proudly certify that</p>
          <h3 style="font-size: 48px; font-weight: 600; text-decoration: underline; margin-bottom: 20px; color: #d97706;">{{recipientName}}</h3>
          <p style="font-size: 20px; line-height: 1.5; max-width: 80%; margin: 0 auto 50px;">
            Has successfully completed the requirements for the <strong>{{courseTitle}}</strong> program on {{date}}.
          </p>
          <div style="display: flex; justify-content: space-between; width: 80%; margin-top: auto;">
            <div style="text-align: center; border-top: 2px solid #94a3b8; padding-top: 10px; width: 200px;">
              <p style="margin: 0; font-size: 16px;">{{signature1}}</p>
              <p style="margin: 0; font-size: 12px; color: #64748b;">Instructor</p>
            </div>
             <div style="width: 100px; height: 100px; background-color: #fef3c7; border: 4px solid #d97706; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #d97706; font-weight: bold; transform: rotate(-15deg);">SEAL</div>
            <div style="text-align: center; border-top: 2px solid #94a3b8; padding-top: 10px; width: 200px;">
              <p style="margin: 0; font-size: 16px;">{{signature2}}</p>
              <p style="margin: 0; font-size: 12px; color: #64748b;">Director</p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "tpl-2",
    name: "Modern Minimal",
    category: "Corporate",
    thumbnail: "bg-white border-l-8 border-slate-900",
    html: `
      <div style="width: 100%; height: 100%; background-color: #ffffff; position: relative; font-family: 'Inter', sans-serif; display: flex; box-sizing: border-box;">
        <div style="width: 40px; height: 100%; background-color: #0f172a;"></div>
        <div style="flex: 1; padding: 80px; display: flex; flex-direction: column; justify-content: center;">
          <h2 style="font-size: 16px; color: #64748b; letter-spacing: 2px; text-transform: uppercase;">{{issuedBy}}</h2>
          <h1 style="font-size: 56px; font-weight: 800; color: #0f172a; margin: 20px 0 60px;">Certificate<br/>of Achievement</h1>
          <p style="font-size: 18px; color: #64748b; margin-bottom: 10px;">Awarded to</p>
          <h3 style="font-size: 40px; font-weight: 700; color: #1e293b; margin-bottom: 20px;">{{recipientName}}</h3>
          <p style="font-size: 18px; color: #475569; max-width: 600px; line-height: 1.6; margin-bottom: 60px;">
            For outstanding performance and dedication in <strong>{{courseTitle}}</strong>.
          </p>
          <div style="display: flex; gap: 80px; margin-top: auto;">
             <div>
               <p style="font-size: 16px; font-weight: 600; color: #0f172a; border-bottom: 2px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 8px; width: 180px;">{{date}}</p>
               <p style="font-size: 12px; color: #64748b;">Date</p>
             </div>
             <div>
               <p style="font-size: 16px; font-weight: 600; color: #0f172a; border-bottom: 2px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 8px; width: 220px;">{{signature1}}</p>
               <p style="font-size: 12px; color: #64748b;">Authorized Signatory</p>
             </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "tpl-3",
    name: "Corporate Blue",
    category: "Corporate",
    thumbnail: "bg-slate-900 border-b-8 border-slate-300",
    html: `
      <div style="width: 100%; height: 100%; background-color: #0f172a; padding: 40px; box-sizing: border-box; font-family: 'Inter', sans-serif;">
        <div style="width: 100%; height: 100%; border: 2px solid #475569; position: relative; padding: 60px; display: flex; flex-direction: column; align-items: center; text-align: center;">
          <div style="position: absolute; top: 0; left: 0; width: 0; height: 0; border-top: 100px solid #94a3b8; border-right: 100px solid transparent;"></div>
          <div style="position: absolute; bottom: 0; right: 0; width: 0; height: 0; border-bottom: 100px solid #94a3b8; border-left: 100px solid transparent;"></div>
          
          <h2 style="font-size: 20px; color: #cbd5e1; letter-spacing: 5px; text-transform: uppercase;">{{issuedBy}}</h2>
          <h1 style="font-size: 60px; font-weight: 300; color: #ffffff; margin: 30px 0; letter-spacing: 2px;">CERTIFICATE<br/><span style="font-weight: 700; color: #94a3b8;">OF EXCELLENCE</span></h1>
          
          <p style="font-size: 18px; color: #94a3b8; margin: 30px 0 10px;">Presented to</p>
          <h3 style="font-size: 44px; font-weight: 600; color: #ffffff; margin-bottom: 30px;">{{recipientName}}</h3>
          
          <p style="font-size: 18px; color: #cbd5e1; line-height: 1.6; max-width: 700px;">
            In recognition of superior standard of excellence and commitment in completing the <strong>{{courseTitle}}</strong> on {{date}}.
          </p>
          
          <div style="display: flex; justify-content: center; gap: 150px; margin-top: auto; width: 100%;">
            <div style="text-align: center;">
              <div style="border-bottom: 1px solid #94a3b8; width: 200px; padding-bottom: 10px; margin-bottom: 10px;">
                <span style="font-family: 'Playfair Display', cursive; font-size: 24px; color: #e2e8f0;">{{signature1}}</span>
              </div>
              <p style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">President</p>
            </div>
            <div style="text-align: center;">
              <div style="border-bottom: 1px solid #94a3b8; width: 200px; padding-bottom: 10px; margin-bottom: 10px;">
                <span style="font-family: 'Playfair Display', cursive; font-size: 24px; color: #e2e8f0;">{{signature2}}</span>
              </div>
              <p style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Managing Director</p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "tpl-4",
    name: "Achievement Red",
    category: "Achievement",
    thumbnail: "bg-white border-t-8 border-red-600",
    html: `
      <div style="width: 100%; height: 100%; background-color: #ffffff; padding: 20px; box-sizing: border-box; font-family: 'Playfair Display', serif;">
        <div style="width: 100%; height: 100%; border: 4px solid #dc2626; padding: 2px; box-sizing: border-box;">
           <div style="width: 100%; height: 100%; border: 1px solid #dc2626; padding: 50px; text-align: center; position: relative; box-sizing: border-box; display: flex; flex-direction: column; align-items: center;">
             
             <div style="width: 80px; height: 120px; background-color: #dc2626; position: absolute; top: -5px; left: 80px; border-bottom-left-radius: 40px; border-bottom-right-radius: 40px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 20px; color: white;">★</div>
             
             <h2 style="font-size: 18px; color: #1e293b; font-family: 'Inter', sans-serif; letter-spacing: 2px; margin-top: 40px;">{{issuedBy}}</h2>
             <h1 style="font-size: 64px; font-weight: 800; color: #dc2626; margin: 20px 0; text-transform: uppercase;">Certificate</h1>
             <p style="font-size: 24px; color: #475569; font-style: italic; margin-bottom: 40px;">of Achievement</p>
             
             <p style="font-size: 16px; color: #64748b; font-family: 'Inter', sans-serif; text-transform: uppercase;">Awarded To</p>
             <h3 style="font-size: 48px; font-weight: 600; color: #0f172a; margin: 10px 0 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; display: inline-block;">{{recipientName}}</h3>
             
             <p style="font-size: 20px; color: #1e293b; max-width: 80%; line-height: 1.5;">
               For exceptional dedication and successful completion of the <br/><strong>{{courseTitle}}</strong>.
             </p>
             
             <div style="display: flex; justify-content: space-between; width: 100%; margin-top: auto; padding: 0 40px; font-family: 'Inter', sans-serif;">
               <div style="text-align: left;">
                 <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 5px;">{{date}}</p>
                 <p style="font-size: 12px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 5px; width: 150px;">Award Date</p>
               </div>
               <div style="text-align: right;">
                 <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 5px;">{{signature1}}</p>
                 <p style="font-size: 12px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 5px; width: 200px;">Head of Department</p>
               </div>
             </div>
           </div>
        </div>
      </div>
    `
  },
  {
    id: "tpl-5",
    name: "Elegant Floral",
    category: "Participation",
    thumbnail: "bg-rose-50 border border-rose-200",
    html: `
      <div style="width: 100%; height: 100%; background-color: #fff1f2; padding: 60px; box-sizing: border-box; font-family: 'Playfair Display', serif; text-align: center; position: relative;">
        <!-- Faux floral corners via pure CSS elements -->
        <div style="position: absolute; top: 20px; left: 20px; width: 100px; height: 100px; border-top: 4px solid #f43f5e; border-left: 4px solid #f43f5e; border-top-left-radius: 40px;"></div>
        <div style="position: absolute; bottom: 20px; right: 20px; width: 100px; height: 100px; border-bottom: 4px solid #f43f5e; border-right: 4px solid #f43f5e; border-bottom-right-radius: 40px;"></div>
        
        <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 10; position: relative;">
          <p style="font-size: 18px; color: #881337; font-family: 'Inter', sans-serif; letter-spacing: 2px;">{{issuedBy}}</p>
          <h1 style="font-size: 56px; font-weight: 600; color: #4c0519; margin: 30px 0;">Certificate of Participation</h1>
          
          <p style="font-size: 20px; color: #9f1239; font-style: italic; margin-bottom: 20px;">Proudly presented to</p>
          <h3 style="font-size: 52px; font-weight: 700; color: #f43f5e; margin-bottom: 30px; line-height: 1;">{{recipientName}}</h3>
          
          <p style="font-size: 20px; color: #881337; max-width: 700px; line-height: 1.7; margin-bottom: 50px;">
            In grateful acknowledgment of active participation and valuable contribution to the <strong>{{courseTitle}}</strong> held on {{date}}.
          </p>
          
          <div style="display: flex; justify-content: center; gap: 80px; margin-top: auto;">
            <div style="text-align: center; display: flex; flex-direction: column; align-items: center;">
              <span style="font-family: 'Inter', sans-serif; font-weight: 600; font-size: 16px; color: #4c0519; padding-bottom: 10px; border-bottom: 2px solid #f43f5e; width: 250px; display: inline-block;">{{signature1}}</span>
              <span style="font-family: 'Inter', sans-serif; font-size: 12px; color: #9f1239; margin-top: 10px; text-transform: uppercase;">Event Coordinator</span>
            </div>
             <div style="text-align: center; display: flex; flex-direction: column; align-items: center;">
              <span style="font-family: 'Inter', sans-serif; font-weight: 600; font-size: 16px; color: #4c0519; padding-bottom: 10px; border-bottom: 2px solid #f43f5e; width: 250px; display: inline-block;">{{signature2}}</span>
              <span style="font-family: 'Inter', sans-serif; font-size: 12px; color: #9f1239; margin-top: 10px; text-transform: uppercase;">Sponsor</span>
            </div>
          </div>
        </div>
      </div>
    `
  }
];

export const mockCertificates = [
  { id: "c1", recipientName: "Alice Johnson", courseTitle: "Advanced React", issueDate: "2026-02-15", templateId: "tpl-1", type: "single" },
  { id: "c2", recipientName: "Bob Smith", courseTitle: "UI/UX Bootcamp", issueDate: "2026-02-10", templateId: "tpl-2", type: "bulk" },
  { id: "c3", recipientName: "Charlie Brown", courseTitle: "Annual Symposium", issueDate: "2026-01-20", templateId: "tpl-5", type: "single" },
  { id: "c4", recipientName: "Diana Ross", courseTitle: "Web Accessibility", issueDate: "2026-03-01", templateId: "tpl-1", type: "single" },
  { id: "c5", recipientName: "Edward Elric", courseTitle: "Chemistry 101", issueDate: "2026-03-02", templateId: "tpl-4", type: "bulk" },
  { id: "c6", recipientName: "Fiona Gallagher", courseTitle: "Management Training", issueDate: "2025-11-15", templateId: "tpl-3", type: "bulk" },
  { id: "c7", recipientName: "George Lucas", courseTitle: "Directing Masterclass", issueDate: "2025-12-05", templateId: "tpl-4", type: "single" },
  { id: "c8", recipientName: "Hannah Montana", courseTitle: "Stage Presence", issueDate: "2026-01-11", templateId: "tpl-5", type: "single" },
  { id: "c9", recipientName: "Isaac Newton", courseTitle: "Physics Fundamentals", issueDate: "2025-10-22", templateId: "tpl-1", type: "bulk" },
  { id: "c10", recipientName: "Jack Sparrow", courseTitle: "Sailing Safety", issueDate: "2026-02-28", templateId: "tpl-3", type: "single" },
  { id: "c11", recipientName: "Kevin Hart", courseTitle: "Public Speaking", issueDate: "2026-01-08", templateId: "tpl-2", type: "single" },
  { id: "c12", recipientName: "Laura Croft", courseTitle: "Archaeology Seminar", issueDate: "2025-09-15", templateId: "tpl-5", type: "bulk" },
  { id: "c13", recipientName: "Mike Tyson", courseTitle: "Sportsmanship Award", issueDate: "2025-11-20", templateId: "tpl-4", type: "single" },
  { id: "c14", recipientName: "Nancy Drew", courseTitle: "Investigative Journalism", issueDate: "2026-03-03", templateId: "tpl-2", type: "single" },
  { id: "c15", recipientName: "Oliver Twist", courseTitle: "Survival Skills", issueDate: "2025-12-12", templateId: "tpl-1", type: "bulk" },
];
