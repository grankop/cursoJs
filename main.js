const store = {
  packages: JSON.parse(localStorage.getItem('packages')) || []
};

const btnMail = document.getElementById('btn-mail');
const btnClient = document.getElementById('btn-client');
const screenMail = document.getElementById('screen-mail');
const screenClient = document.getElementById('screen-client');

const formAddPackage = document.getElementById('form-add-package');
const inputTracking = document.getElementById('input-tracking');
const mailControls = document.getElementById('mail-controls');
const selectedTrackingEl = document.getElementById('selected-tracking');
const selectBranch = document.getElementById('select-branch');
const selectMovement = document.getElementById('select-movement');
const btnAddMovement = document.getElementById('btn-add-movement');
const listPackages = document.getElementById('list-packages');

const formTrackQuery = document.getElementById('form-track-query');
const inputQuery = document.getElementById('input-query');
const queryResult = document.getElementById('query-result');
const queryStatus = document.getElementById('query-status');
const queryMovements = document.getElementById('query-movements');

function findPackage(tracking) {
  return store.packages.find(p => p.tracking === tracking) || null;
}

function createPackage(tracking) {
  const existing = findPackage(tracking);
  if (existing) return existing;
  const pkg = { tracking, movements: [], status: 'Registrada' };
  store.packages.push(pkg);
  saveStore();
  return pkg;
}

function addMovementToPackage(tracking, branch, movement) {
  const pkg = findPackage(tracking);
  if (!pkg) return null;
  const entry = `${branch} - ${movement}`;
  pkg.movements.push(entry);
  pkg.status = movement;
  saveStore();
  return pkg;
}

function saveStore() {
  localStorage.setItem('packages', JSON.stringify(store.packages));
}

function renderPackagesList() {
  listPackages.innerHTML = '';
  store.packages.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.tracking} — ${p.status}`;
    listPackages.appendChild(li);
  });
}

function showMailControlsFor(tracking) {
  mailControls.classList.remove('hidden');
  selectedTrackingEl.textContent = tracking;
}

function showQueryResult(pkg) {
  if (!pkg) {
    queryResult.classList.add('hidden');
    alert('Guía no encontrada');
    return;
  }
  queryResult.classList.remove('hidden');
  queryStatus.textContent = pkg.status;
  queryMovements.innerHTML = '';
  pkg.movements.forEach(m => {
    const li = document.createElement('li');
    li.textContent = m;
    queryMovements.appendChild(li);
  });
}

btnMail.addEventListener('click', () => {
  screenMail.classList.remove('hidden');
  screenClient.classList.add('hidden');
});

btnClient.addEventListener('click', () => {
  screenClient.classList.remove('hidden');
  screenMail.classList.add('hidden');
});

formAddPackage.addEventListener('submit', (e) => {
  e.preventDefault();
  const tracking = inputTracking.value.trim();
  if (!tracking) return alert('Ingresá un número de guía válido');
  createPackage(tracking);
  renderPackagesList();
  showMailControlsFor(tracking);
});

btnAddMovement.addEventListener('click', () => {
  const tracking = selectedTrackingEl.textContent;
  const branch = selectBranch.value;
  const movement = selectMovement.value;
  if (!branch || !movement) return alert('Seleccioná sucursal y movimiento');
  addMovementToPackage(tracking, branch, movement);
  renderPackagesList();
  selectBranch.value = '';
  selectMovement.value = '';
});

formTrackQuery.addEventListener('submit', (e) => {
  e.preventDefault();
  const tracking = inputQuery.value.trim();
  if (!tracking) return alert('Ingresá un número de guía');
  const pkg = findPackage(tracking);
  showQueryResult(pkg);
});

renderPackagesList();