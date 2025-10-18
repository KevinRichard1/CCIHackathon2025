let orgs = [];
let currentOrgId = null;

async function loadOrgs() {
  const res = await fetch("orgs.json");
  orgs = await res.json();
  if (orgs.length > 0) {
    currentOrgId = orgs[0].id;
  }
}

function createInputField(field) {
  const wrapper = document.createElement("div");
  wrapper.className = "form-group";

  const label = document.createElement("label");
  label.htmlFor = field.name;
  label.textContent = field.label + (field.required ? " *" : "");
  wrapper.appendChild(label);

  let input;

  switch(field.type) {
    case "text":
    case "email":
    case "number":
    case "date":
      input = document.createElement("input");
      input.type = field.type;
      input.id = field.name;
      input.name = field.name;
      input.required = field.required || false;
      break;
    case "textarea":
      input = document.createElement("textarea");
      input.id = field.name;
      input.name = field.name;
      input.required = field.required || false;
      break;
    case "select":
      input = document.createElement("select");
      input.id = field.name;
      input.name = field.name;
      input.required = field.required || false;
      field.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        input.appendChild(option);
      });
      break;
    case "radio":
      input = document.createElement("div");
      field.options.forEach(opt => {
        const radioWrapper = document.createElement("label");
        radioWrapper.style.marginRight = "1rem";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = field.name;
        radio.value = opt;
        radio.required = field.required || false;
        radioWrapper.appendChild(radio);
        radioWrapper.appendChild(document.createTextNode(opt));
        input.appendChild(radioWrapper);
      });
      break;
    default:
      input = document.createElement("input");
      input.type = "text";
      input.id = field.name;
      input.name = field.name;
  }

  wrapper.appendChild(input);
  return wrapper;
}

function renderOrgHeader(org) {
  const container = document.getElementById("org-info");

  // Extract initials for placeholder logo
  const initials = org.name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);

  const logoHtml = org.logo
    ? `<img src="${org.logo}" alt="${org.name} logo" class="org-logo" style="width:60px; height:60px; object-fit: contain; margin-right:1rem; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />`
    : '';

  const placeholderLogo = `
    <div class="logo-placeholder" style="
      width: 60px; height: 60px;
      background-color: ${org.color};
      border-radius: 50%;
      color: white;
      display: ${org.logo ? "none" : "flex"};
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 24px;
      margin-right: 1rem;
      user-select:none;
    ">
      ${initials}
    </div>
  `;

  container.innerHTML = `
    <div class="org-banner" style="background-color:${org.color}; color:#fff; padding:1rem; border-radius:6px; display:flex; align-items:center;">
      ${logoHtml}${placeholderLogo}
      <div>
        <h2>${org.name}</h2>
        <p>${org.description}</p>
      </div>
    </div>
  `;
  document.body.style.setProperty('--primary-color', org.color);
}

function renderForm(org) {
  const form = document.getElementById("grantApplicationForm");
  form.innerHTML = ""; // Clear existing fields

  // Common base fields
  const baseFields = [
    { label: "Project Title", name: "title", type: "text", required: true },
    { label: "Applicant Name", name: "applicantName", type: "text", required: true },
    { label: "Email Address", name: "email", type: "email", required: true },
    { label: "Funding Amount Requested", name: "fundingAmount", type: "number", required: true },
    { label: "Project Summary", name: "projectSummary", type: "textarea", required: true },
    { label: "Project Start Date", name: "startDate", type: "date", required: true },
    { label: "Project End Date", name: "endDate", type: "date", required: true },
  ];

  baseFields.forEach(field => {
    form.appendChild(createInputField(field));
  });

  // Org-specific custom fields
  if (org.customFields && org.customFields.length > 0) {
    const hr = document.createElement("hr");
    form.appendChild(hr);

    const heading = document.createElement("h3");
    heading.textContent = `Additional Questions for ${org.name}`;
    form.appendChild(heading);

    org.customFields.forEach(field => {
      form.appendChild(createInputField(field));
    });
  }

  // Hidden input for orgId
  const hiddenOrgId = document.createElement("input");
  hiddenOrgId.type = "hidden";
  hiddenOrgId.name = "orgId";
  hiddenOrgId.value = org.id;
  form.appendChild(hiddenOrgId);

  // Submit button
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Submit Application";
  form.appendChild(submitBtn);
}

function populateOrgSelector() {
  const select = document.getElementById("orgSelect");
  orgs.forEach(org => {
    const option = document.createElement("option");
    option.value = org.id;
    option.textContent = org.name;
    select.appendChild(option);
  });
  select.value = currentOrgId;
  select.addEventListener("change", (e) => {
    currentOrgId = e.target.value;
    const org = orgs.find(o => o.id === currentOrgId);
    renderForm(org);
    renderOrgHeader(org);
    document.getElementById("formMessage").textContent = "";
  });
}

function saveApplication(data) {
  let storedApps = JSON.parse(localStorage.getItem("applications") || "[]");
  storedApps.push(data);
  localStorage.setItem("applications", JSON.stringify(storedApps));
}

function collectFormData(form) {
  const formData = new FormData(form);
  const data = {};
  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      // Handle multiple values (e.g. checkboxes)
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  }
  return data;
}

async function init() {
  await loadOrgs();
  populateOrgSelector();
  const org = orgs.find(o => o.id === currentOrgId);
  renderForm(org);
  renderOrgHeader(org);

  document.getElementById("grantApplicationForm").addEventListener("submit", e => {
    e.preventDefault();
    const form = e.target;
    const data = collectFormData(form);

    // Add timestamp as ID
    data.id = Date.now();
    data.orgId = org.id;

    saveApplication(data);

    document.getElementById("formMessage").innerHTML = `
      <div class="success-message">
        <strong>✅ Application submitted successfully!</strong><br>
        <a href="viewer.html?orgId=${org.id}" target="_blank">
          → View submitted applications for ${org.name}
        </a>
      </div>
    `;

    form.reset();
  });
}

window.addEventListener("DOMContentLoaded", init);