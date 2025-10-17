(() => {
  const form = document.getElementById('grantForm');
  const preview = document.getElementById('preview');
  const saveLocalBtn = document.getElementById('saveLocal');
  const exportAllBtn = document.getElementById('exportAll');

  const STORAGE_KEY = 'grant_app_submissions_v1';

  function formToObject(formEl) {
    const fd = new FormData(formEl);
    return {
      id: generateId(),
      submittedAt: new Date().toISOString(),
      applicant: {
        name: fd.get('applicantName') || null,
        email: fd.get('email') || null,
        organization: fd.get('organization') || null
      },
      grant: {
        id: fd.get('grantId') || null,
        title: fd.get('grantTitle') || null,
        amountRequested: fd.get('amountRequested') ? Number(fd.get('amountRequested')) : null,
        matchRequired: fd.get('matchRequired') === 'true'
      },
      proposal: {
        summary: fd.get('proposalSummary') || null,
        categories: parseCommaList(fd.get('categories'))
      }
    };
  }

  function parseCommaList(s) {
    if (!s) return [];
    return s.split(',').map(x => x.trim()).filter(Boolean);
  }

  function generateId() {
    return 'SUB-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function showPreview(obj) {
    preview.textContent = JSON.stringify(obj, null, 2);
  }

  function readSubmissions() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function writeSubmissions(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function downloadObjectAsJson(obj, filename) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", filename);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  }

  function sendSuccessMessage(obj) {
    const successMessage = {
      status: "success",
      message: "Grant application submitted successfully.",
      id: obj.id,
      timestamp: obj.submittedAt
    };

    // For AI agents listening to postMessage
    window.parent?.postMessage(successMessage, "*");

    // Also log to console
    console.log("✅ Submission Success:", successMessage);
  }

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const obj = formToObject(form);
    showPreview(obj);

    // Save to localStorage
    const all = readSubmissions();
    all.push(obj);
    writeSubmissions(all);

    // Trigger download
    downloadObjectAsJson(obj, `${obj.id}.json`);

    // Send agent message
    sendSuccessMessage(obj);

    alert('✅ Application submitted. Downloaded JSON and saved to browser.');
    form.reset();
  });

  saveLocalBtn.addEventListener('click', () => {
    const obj = formToObject(form);
    const all = readSubmissions();
    all.push(obj);
    writeSubmissions(all);
    showPreview(obj);
    sendSuccessMessage(obj);
    alert('💾 Saved to browser (localStorage).');
    form.reset();
  });

  exportAllBtn.addEventListener('click', () => {
    const all = readSubmissions();
    if (!all.length) return alert('No saved submissions.');
    downloadObjectAsJson(all, `grant_submissions_export.json`);
  });
})();