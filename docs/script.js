(() => {
  const form = document.getElementById('grantForm');
  const preview = document.getElementById('preview');

  const STORAGE_KEY = 'grant_app_submissions_v2';

  function parseFormData(formEl) {
    const fd = new FormData(formEl);

    const getFileName = (inputName) => {
      const file = fd.get(inputName);
      return file && file.name ? file.name : null;
    };

    return {
      id: generateId(),
      submittedAt: new Date().toISOString(),
      applicant: {
        name: fd.get('applicantName'),
        email: fd.get('email'),
        phone: fd.get('phone'),
      },
      organization: {
        name: fd.get('organizationName'),
        type: fd.get('organizationType'),
        website: fd.get('organizationWebsite'),
        taxId: fd.get('organizationTaxId'),
      },
      grant: {
        id: fd.get('grantId'),
        title: fd.get('grantTitle'),
        amountRequested: parseFloat(fd.get('amountRequested')),
        matchRequired: fd.get('matchRequired') === 'true',
        startDate: fd.get('startDate') || null,
        endDate: fd.get('endDate') || null,
      },
      project: {
        executiveSummary: fd.get('executiveSummary'),
        statementOfNeed: fd.get('statementOfNeed'),
        goals: fd.get('projectGoals'),
        implementationPlan: fd.get('implementationPlan'),
        evaluationPlan: fd.get('evaluationPlan'),
      },
      budget: {
        total: parseFloat(fd.get('totalBudget')) || null,
        justification: fd.get('budgetJustification'),
      },
      attachments: {
        proposalFile: getFileName('proposalFile'),
        budgetFile: getFileName('budgetFile'),
      },
      certification: {
        certified: fd.get('certify') === 'on',
        signature: fd.get('signature'),
        date: fd.get('signatureDate'),
      },
    };
  }

  function generateId() {
    return 'APP-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 6);
  }

  function readSubmissions() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function writeSubmissions(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function showPreview(data) {
    preview.textContent = JSON.stringify(data, null, 2);
  }

  function sendSuccessMessage(data) {
    const message = {
      status: "success",
      message: "Application submitted successfully.",
      id: data.id,
      timestamp: data.submittedAt,
    };
    window.parent?.postMessage(message, "*");
    console.log("✅ Submission:", message);
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = parseFormData(form);
    const all = readSubmissions();
    all.push(data);
    writeSubmissions(all);
    showPreview(data);
    sendSuccessMessage(data);
    alert('✅ Application submitted and saved locally.');
    form.reset();
  });
})();