const HMD = window.HMD || (window.HMD = {});
HMD.pages = HMD.pages || {};

(function () {
  let allPrescriptions = [];
  let consultationsCache = [];
  let medicinesCache = [];
  let testsCache = [];
  let medicinesByPrescription = {};
  let testsByPrescription = {};
  let currentSearch = '';

  async function loadLookups() {
    const [consultations, medicines, tests, medicineLinks, testLinks] = await Promise.all([
      HMD_API.get('/api/consultations').catch(() => []),
      HMD_API.get('/api/medicines').catch(() => []),
      HMD_API.get('/api/tests').catch(() => []),
      HMD_API.get('/api/prescription-medicines').catch(() => []),
      HMD_API.get('/api/prescription-tests').catch(() => []),
    ]);

    consultationsCache = (Array.isArray(consultations) ? consultations : []).map((c) => ({ ...c, id: c.consultationId }));
    medicinesCache = (Array.isArray(medicines) ? medicines : []).map((m) => ({ ...m, id: m.medicineId }));
    testsCache = (Array.isArray(tests) ? tests : []).map((t) => ({ ...t, id: t.testId }));

    medicinesByPrescription = {};
    (Array.isArray(medicineLinks) ? medicineLinks : []).forEach((row) => {
      const prescriptionId = row.prescription_id ?? row.PRESCRIPTION_ID;
      const medicineId = row.medicine_id ?? row.MEDICINE_ID;
      if (prescriptionId != null && medicineId != null) {
        if (!medicinesByPrescription[prescriptionId]) medicinesByPrescription[prescriptionId] = [];
        medicinesByPrescription[prescriptionId].push(String(medicineId));
      }
    });

    testsByPrescription = {};
    (Array.isArray(testLinks) ? testLinks : []).forEach((row) => {
      const prescriptionId = row.prescription_id ?? row.PRESCRIPTION_ID;
      const testId = row.test_id ?? row.TEST_ID;
      if (prescriptionId != null && testId != null) {
        if (!testsByPrescription[prescriptionId]) testsByPrescription[prescriptionId] = [];
        testsByPrescription[prescriptionId].push(String(testId));
      }
    });
  }

  function consultationLabel(c) {
    return c ? `Consultation #${c.id} — ${formatDate(c.date)}` : '—';
  }
  function medicineLabel(m) {
    return m ? (m.medicineName || `#${m.id}`) : '—';
  }
  function testLabel(t) {
    return t ? (t.testName || `#${t.id}`) : '—';
  }
  function findConsultation(id) { return consultationsCache.find((c) => String(c.id) === String(id)); }
  function findMedicine(id) { return medicinesCache.find((m) => String(m.id) === String(id)); }
  function findTest(id) { return testsCache.find((t) => String(t.id) === String(id)); }

  async function load() {
    setTableState('prescriptions', 'loading');
    try {
      const [data] = await Promise.all([HMD_API.get('/api/prescriptions'), loadLookups()]);
      allPrescriptions = (Array.isArray(data) ? data : []).map((p) => ({ ...p, id: p.prescriptionId }));
      render();
    } catch (err) {
      setTableState('prescriptions', 'error');
      showToast(err.message, 'error');
    }
  }

  function linkedMedicineIds(prescriptionId) {
    return medicinesByPrescription[prescriptionId] || [];
  }

  function linkedTestIds(prescriptionId) {
    return testsByPrescription[prescriptionId] || [];
  }

  function linkedMedicineNames(prescriptionId) {
    return linkedMedicineIds(prescriptionId).map((id) => medicineLabel(findMedicine(id))).filter((x) => x !== '—');
  }

  function linkedTestNames(prescriptionId) {
    return linkedTestIds(prescriptionId).map((id) => testLabel(findTest(id))).filter((x) => x !== '—');
  }

  function render() {
    let rows = allPrescriptions;
    if (currentSearch) {
      rows = rows.filter((p) => {
        const consultation = consultationLabel(findConsultation(p.consultationId));
        const medicines = linkedMedicineNames(p.id).join(' ');
        const tests = linkedTestNames(p.id).join(' ');
        return consultation.toLowerCase().includes(currentSearch) ||
          (p.dosage || '').toLowerCase().includes(currentSearch) ||
          medicines.toLowerCase().includes(currentSearch) ||
          tests.toLowerCase().includes(currentSearch);
      });
    }

    const tbody = document.getElementById('prescriptionsTableBody');
    if (!rows.length) {
      tbody.innerHTML = '';
      setTableState('prescriptions', 'empty');
      return;
    }

    tbody.innerHTML = rows.map((p) => {
      const consultation = findConsultation(p.consultationId);
      const medicines = linkedMedicineNames(p.id);
      const tests = linkedTestNames(p.id);
      return `
        <tr>
          <td>#${escapeHtml(p.id)}</td>
          <td>${escapeHtml(consultationLabel(consultation))}</td>
          <td>${formatDate(p.prescriptionDate)}</td>
          <td>${escapeHtml(p.dosage || '—')}</td>
          <td>${escapeHtml(medicines.length ? medicines.join(', ') : '—')}</td>
          <td>${escapeHtml(tests.length ? tests.join(', ') : '—')}</td>
          <td class="col-actions">
            <div class="row-actions">
              <button data-edit="${p.id}" title="Edit"><i data-lucide="pencil"></i></button>
              <button data-delete="${p.id}" class="danger" title="Delete"><i data-lucide="trash-2"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
    setTableState('prescriptions', 'ready');
    if (window.lucide) lucide.createIcons();

    tbody.querySelectorAll('[data-edit]').forEach((btn) =>
      btn.addEventListener('click', () => openForm(allPrescriptions.find((p) => String(p.id) === btn.dataset.edit))));
    tbody.querySelectorAll('[data-delete]').forEach((btn) =>
      btn.addEventListener('click', () => remove(btn.dataset.delete)));
  }

  function search(term) {
    currentSearch = term;
    render();
  }

  function formFieldsHtml(p = {}) {
    const consultationId = p.consultationId ?? '';
    const medicineIds = new Set(linkedMedicineIds(p.prescriptionId).map(String));
    const testIds = new Set(linkedTestIds(p.prescriptionId).map(String));
    return `
      <div class="form-grid">
        <div class="form-field full"><label>Consultation</label>
          <select class="select-field" id="f-consultationId" required>
            <option value="">Select consultation…</option>
            ${consultationsCache.map((c) => `<option value="${c.id}" ${String(c.id) === String(consultationId) ? 'selected' : ''}>${escapeHtml(consultationLabel(c))}</option>`).join('')}
          </select>
          <span class="field-error">Consultation is required.</span>
        </div>
        <div class="form-field"><label>Prescription Date</label>
          <input type="date" class="input-field" id="f-prescriptionDate" value="${p.prescriptionDate ? String(p.prescriptionDate).slice(0, 10) : ''}" required />
          <span class="field-error">Prescription date is required.</span>
        </div>
        <div class="form-field full"><label>Dosage / Instructions</label>
          <textarea class="input-field" id="f-dosage" rows="3" required>${escapeHtml(p.dosage || '')}</textarea>
          <span class="field-error">Dosage or instructions are required.</span>
        </div>
        <div class="form-field full"><label>Medicines</label>
          <select class="select-field" id="f-medicineIds" multiple size="5">
            ${medicinesCache.map((m) => `<option value="${m.id}" ${medicineIds.has(String(m.id)) ? 'selected' : ''}>${escapeHtml(medicineLabel(m))}</option>`).join('')}
          </select>
        </div>
        <div class="form-field full"><label>Tests</label>
          <select class="select-field" id="f-testIds" multiple size="5">
            ${testsCache.map((t) => `<option value="${t.id}" ${testIds.has(String(t.id)) ? 'selected' : ''}>${escapeHtml(testLabel(t))}</option>`).join('')}
          </select>
        </div>
      </div>
    `;
  }

  function selectedValues(id) {
    return Array.from(document.getElementById(id).selectedOptions).map((option) => option.value);
  }

  function readForm() {
    return {
      consultationId: document.getElementById('f-consultationId').value,
      prescriptionDate: document.getElementById('f-prescriptionDate').value,
      dosage: document.getElementById('f-dosage').value.trim(),
      medicineIds: selectedValues('f-medicineIds'),
      testIds: selectedValues('f-testIds'),
    };
  }

  function validate(body) {
    const errors = [];
    if (!body.consultationId) errors.push('f-consultationId');
    if (!body.prescriptionDate) errors.push('f-prescriptionDate');
    if (!body.dosage) errors.push('f-dosage');
    errors.forEach((id) => document.getElementById(id).closest('.form-field').classList.add('has-error'));
    return errors.length === 0;
  }

  async function deleteMedicineLink(prescriptionId, medicineId) {
    await HMD_API.del(`/api/prescription-medicines?prescriptionId=${encodeURIComponent(prescriptionId)}&medicineId=${encodeURIComponent(medicineId)}`);
  }

  async function deleteTestLink(prescriptionId, testId) {
    await HMD_API.del(`/api/prescription-tests?prescriptionId=${encodeURIComponent(prescriptionId)}&testId=${encodeURIComponent(testId)}`);
  }

  async function syncLinks(prescriptionId, medicineIds, testIds, oldMedicineIds, oldTestIds) {
    const selectedMedicines = new Set(medicineIds.map(String));
    const selectedTests = new Set(testIds.map(String));
    const oldMedicines = new Set(oldMedicineIds.map(String));
    const oldTests = new Set(oldTestIds.map(String));

    await Promise.all(Array.from(oldMedicines).filter((id) => !selectedMedicines.has(id)).map((id) => deleteMedicineLink(prescriptionId, id)));
    await Promise.all(Array.from(oldTests).filter((id) => !selectedTests.has(id)).map((id) => deleteTestLink(prescriptionId, id)));
    await Promise.all(Array.from(selectedMedicines).filter((id) => !oldMedicines.has(id)).map((id) =>
      HMD_API.post('/api/prescription-medicines', { prescription_id: prescriptionId, medicine_id: Number(id) })));
    await Promise.all(Array.from(selectedTests).filter((id) => !oldTests.has(id)).map((id) =>
      HMD_API.post('/api/prescription-tests', { prescription_id: prescriptionId, test_id: Number(id) })));
  }

  function openForm(existing) {
    const isEdit = !!existing;
    HMD_MODAL.open({
      title: isEdit ? `Edit Prescription #${existing.id}` : 'Add Prescription',
      bodyHtml: formFieldsHtml(existing || {}),
      footHtml: `
        <button class="btn btn-ghost" id="cancelBtn">Cancel</button>
        <button class="btn btn-primary" id="saveBtn">${isEdit ? 'Save Changes' : 'Add Prescription'}</button>
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
            const oldMedicineIds = isEdit ? linkedMedicineIds(existing.prescriptionId) : [];
            const oldTestIds = isEdit ? linkedTestIds(existing.prescriptionId) : [];
            let prescriptionId;
            if (isEdit) {
              prescriptionId = existing.prescriptionId;
              await HMD_API.put(`/api/prescriptions/${prescriptionId}`, {
                consultationId: body.consultationId,
                prescriptionDate: body.prescriptionDate,
                dosage: body.dosage,
              });
            } else {
              const created = await HMD_API.post('/api/prescriptions', {
                consultationId: body.consultationId,
                prescriptionDate: body.prescriptionDate,
                dosage: body.dosage,
              });
              prescriptionId = created?.prescriptionId;
              if (!prescriptionId) throw new Error('Prescription was created but no prescription ID was returned.');
            }
            await syncLinks(prescriptionId, body.medicineIds, body.testIds, oldMedicineIds, oldTestIds);
            showToast(isEdit ? 'Prescription updated.' : 'Prescription added.', 'success');
            HMD_MODAL.close();
            load();
          } catch (err) {
            btn.disabled = false;
            btn.textContent = isEdit ? 'Save Changes' : 'Add Prescription';
            showToast(err.message, 'error');
          }
        });
      },
    });
  }

  function remove(id) {
    confirmDialog({
      title: 'Delete prescription?',
      message: `This will permanently remove prescription #${id} and its medicine/test links. This cannot be undone.`,
      onConfirm: async () => {
        await HMD_API.del(`/api/prescriptions/${id}`);
        showToast('Prescription deleted.', 'success');
        load();
      },
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addPrescriptionBtn').addEventListener('click', async () => {
      if (!consultationsCache.length || !medicinesCache.length || !testsCache.length) await loadLookups();
      openForm(null);
    });
    document.querySelector('[data-retry="prescriptions"]').addEventListener('click', load);
  });

  HMD.pages.prescriptions = { load, search };
})();
