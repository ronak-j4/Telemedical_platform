const HMD = window.HMD || (window.HMD = {});
HMD.pages = HMD.pages || {};

(function () {
  let allPatients = [];
  let currentFilter = '';
  let currentSearch = '';

  const GENDER_LABEL = { M: 'Male', F: 'Female', O: 'Other' };

  async function load() {
    setTableState('patients', 'loading');
    try {
      const [data, phoneRows] = await Promise.all([
        HMD_API.get('/api/patients'),
        HMD_API.get('/api/patient-phones').catch(() => []),
      ]);
      const phonesByPatient = {};
      (Array.isArray(phoneRows) ? phoneRows : []).forEach((row) => {
        const patientId = row.patient_id ?? row.PATIENT_ID;
        const phone = row.phone_no ?? row.PHONE_NO;
        if (patientId != null && phone) {
          if (!phonesByPatient[patientId]) phonesByPatient[patientId] = [];
          phonesByPatient[patientId].push(String(phone));
        }
      });
      allPatients = (Array.isArray(data) ? data : []).map((p) => ({
        ...p,
        id: p.patientId,
        phone: (phonesByPatient[p.patientId] || [])[0] || '',
      }));
      render();
    } catch (err) {
      setTableState('patients', 'error');
      showToast(err.message, 'error');
    }
  }

  function render() {
    let rows = allPatients;
    if (currentFilter) rows = rows.filter((p) => p.gender === currentFilter);
    if (currentSearch) {
      rows = rows.filter((p) => fullName(p).toLowerCase().includes(currentSearch) ||
        (p.city || '').toLowerCase().includes(currentSearch));
    }

    const tbody = document.getElementById('patientsTableBody');
    if (!rows.length) {
      tbody.innerHTML = '';
      setTableState('patients', 'empty');
      return;
    }

    tbody.innerHTML = rows.map((p) => `
      <tr>
        <td>#${escapeHtml(p.id)}</td>
        <td>${escapeHtml(fullName(p))}</td>
        <td>${escapeHtml(GENDER_LABEL[p.gender] || p.gender || '—')}</td>
        <td>${formatDate(p.dob)}</td>
        <td>${escapeHtml(p.city || '—')}${p.area ? ', ' + escapeHtml(p.area) : ''}</td>
        <td>${escapeHtml(p.pincode || '—')}</td>
        <td>${escapeHtml(p.phone || '—')}</td>
        <td class="col-actions">
          <div class="row-actions">
            <button data-edit="${p.id}" title="Edit"><i data-lucide="pencil"></i></button>
            <button data-delete="${p.id}" class="danger" title="Delete"><i data-lucide="trash-2"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
    setTableState('patients', 'ready');
    if (window.lucide) lucide.createIcons();

    tbody.querySelectorAll('[data-edit]').forEach((btn) =>
      btn.addEventListener('click', () => openForm(allPatients.find((p) => String(p.id) === btn.dataset.edit))));
    tbody.querySelectorAll('[data-delete]').forEach((btn) =>
      btn.addEventListener('click', () => remove(btn.dataset.delete)));
  }

  function search(term) {
    currentSearch = term;
    render();
  }

  function formFieldsHtml(p = {}) {
    return `
      <div class="form-grid">
        <div class="form-field"><label>First Name</label>
          <input class="input-field" id="f-firstName" value="${escapeHtml(p.firstName || '')}" required />
          <span class="field-error">First name is required.</span>
        </div>
        <div class="form-field"><label>Last Name</label>
          <input class="input-field" id="f-lastName" value="${escapeHtml(p.lastName || '')}" required />
          <span class="field-error">Last name is required.</span>
        </div>
        <div class="form-field"><label>Date of Birth</label>
          <input type="date" class="input-field" id="f-dob" value="${p.dob ? String(p.dob).slice(0, 10) : ''}" required />
          <span class="field-error">Date of birth is required.</span>
        </div>
        <div class="form-field"><label>Gender</label>
          <select class="select-field" id="f-gender" required>
            <option value="">Select…</option>
            <option value="M" ${p.gender === 'M' ? 'selected' : ''}>Male</option>
            <option value="F" ${p.gender === 'F' ? 'selected' : ''}>Female</option>
            <option value="O" ${p.gender === 'O' ? 'selected' : ''}>Other</option>
          </select>
          <span class="field-error">Gender is required.</span>
        </div>
        <div class="form-field"><label>City</label>
          <input class="input-field" id="f-city" value="${escapeHtml(p.city || '')}" />
        </div>
        <div class="form-field"><label>Area</label>
          <input class="input-field" id="f-area" value="${escapeHtml(p.area || '')}" />
        </div>
        <div class="form-field"><label>Pincode</label>
          <input class="input-field" id="f-pincode" value="${escapeHtml(p.pincode || '')}" />
        </div>
        <div class="form-field"><label>Phone Number</label>
          <input class="input-field" id="f-phone" value="${escapeHtml(p.phone || '')}" />
        </div>
      </div>
    `;
  }

  function readForm() {
    return {
      firstName: document.getElementById('f-firstName').value.trim(),
      lastName: document.getElementById('f-lastName').value.trim(),
      dob: document.getElementById('f-dob').value,
      gender: document.getElementById('f-gender').value,
      city: document.getElementById('f-city').value.trim(),
      area: document.getElementById('f-area').value.trim(),
      pincode: document.getElementById('f-pincode').value.trim(),
      phone: document.getElementById('f-phone').value.trim(),
    };
  }

  function validate(body) {
    const errors = [];
    if (!body.firstName) errors.push('f-firstName');
    if (!body.lastName) errors.push('f-lastName');
    if (!body.dob) errors.push('f-dob');
    if (!body.gender) errors.push('f-gender');
    errors.forEach((id) => document.getElementById(id).closest('.form-field').classList.add('has-error'));
    return errors.length === 0;
  }

  async function syncPhone(patientId, oldPhone, newPhone) {
    if (oldPhone && oldPhone !== newPhone) {
      await HMD_API.del(`/api/patient-phones?patientId=${encodeURIComponent(patientId)}&phoneNo=${encodeURIComponent(oldPhone)}`);
    }
    if (newPhone && oldPhone !== newPhone) {
      await HMD_API.post('/api/patient-phones', { patient_id: patientId, phone_no: newPhone });
    }
  }

  function openForm(existing) {
    const isEdit = !!existing;
    HMD_MODAL.open({
      title: isEdit ? `Edit Patient #${existing.id}` : 'Add Patient',
      bodyHtml: formFieldsHtml(existing || {}),
      footHtml: `
        <button class="btn btn-ghost" id="cancelBtn">Cancel</button>
        <button class="btn btn-primary" id="saveBtn">${isEdit ? 'Save Changes' : 'Add Patient'}</button>
      `,
      onMount() {
        document.getElementById('cancelBtn').addEventListener('click', () => HMD_MODAL.close());
        document.getElementById('saveBtn').addEventListener('click', async () => {
          document.querySelectorAll('.form-field').forEach((f) => f.classList.remove('has-error'));
          const body = readForm();
          if (!validate(body)) return;
          const btn = document.getElementById('saveBtn');
          btn.disabled = true;
          btn.textContent = 'Saving…';
          try {
            const oldPhone = existing ? existing.phone : '';
            let patient;
            if (isEdit) {
              patient = await HMD_API.put(`/api/patients/${existing.patientId}`, { ...body, phone: undefined });
              await syncPhone(existing.patientId, oldPhone, body.phone);
              showToast('Patient updated.', 'success');
            } else {
              patient = await HMD_API.post('/api/patients', { ...body, phone: undefined });
              if (body.phone && patient?.patientId) {
                await HMD_API.post('/api/patient-phones', { patient_id: patient.patientId, phone_no: body.phone });
              }
              showToast('Patient added.', 'success');
            }
            HMD_MODAL.close();
            load();
          } catch (err) {
            btn.disabled = false;
            btn.textContent = isEdit ? 'Save Changes' : 'Add Patient';
            showToast(err.message, 'error');
          }
        });
      },
    });
  }

  function remove(id) {
    confirmDialog({
      title: 'Delete patient?',
      message: `This will permanently remove patient #${id}. This cannot be undone.`,
      onConfirm: async () => {
        await HMD_API.del(`/api/patients/${id}`);
        showToast('Patient deleted.', 'success');
        load();
      },
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addPatientBtn').addEventListener('click', () => openForm(null));
    document.getElementById('patientGenderFilter').addEventListener('change', (e) => {
      currentFilter = e.target.value;
      render();
    });
    document.querySelector('[data-retry="patients"]').addEventListener('click', load);
  });

  HMD.pages.patients = { load, search };
})();
