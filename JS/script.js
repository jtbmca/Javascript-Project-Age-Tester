// User-first, accessible Age Tester logic

document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const birthDateInput = document.getElementById('birth-date');
  const checkBtn = document.getElementById('check-btn');
  const resetBtn = document.getElementById('reset-btn');
  const resultContainer = document.getElementById('result');
  const errorMessage = document.getElementById('error-message');
  const reaperBg = document.querySelector('.reaper-bg');
  const reaperObject = document.getElementById('reaper-svg');
  const ageForm = document.getElementById('age-form');

  // Set min/max date
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  birthDateInput.max = `${yyyy}-${mm}-${dd}`;
  const minDate = new Date(yyyy - 120, today.getMonth(), today.getDate());
  birthDateInput.min = `${minDate.getFullYear()}-${String(minDate.getMonth()+1).padStart(2,'0')}-${String(minDate.getDate()).padStart(2,'0')}`;

  // Helper: Calculate age
  function calculateAge(birthDate) {
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  // Helper: Get SVG doc and run callback
  function getReaperSVGDoc(callback) {
    if (!reaperObject) return;
    if (reaperObject.contentDocument) {
      callback(reaperObject.contentDocument);
    } else {
      reaperObject.addEventListener('load', () => {
        callback(reaperObject.contentDocument);
      }, { once: true });
    }
  }

  // Helper: Set eye color
  function setReaperEyes(color) {
    getReaperSVGDoc(svgDoc => {
      if (!svgDoc) return;
      const leftEye = svgDoc.getElementById('eye-left');
      const rightEye = svgDoc.getElementById('eye-right');
      if (leftEye) leftEye.setAttribute('fill', color);
      if (rightEye) rightEye.setAttribute('fill', color);
    });
  }
  // Helper: Reset eyes to default
  function resetReaperEyes() {
    setReaperEyes('#ffffff');
  }

  // Show error
  function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
    resultContainer.textContent = '';
    resultContainer.className = 'result-container';
  }

  // Show result
  function showResult(age, group) {
    let msg = '';
    if (group === 'senior') {
      msg = `You are ${age} years old. DEATH LOOMS!`;
      setReaperEyes('#ff5252');
    } else if (group === 'adult') {
      msg = `You are ${age} years old. BEWARE! I LURK!`;
      setReaperEyes('#FCCB26');
    } else {
      msg = `You are ${age} years old. You are safe... for now.`;
      setReaperEyes('#69f0ae');
    }
    resultContainer.textContent = msg;
    resultContainer.className = `result-container ${group}`;
    errorMessage.classList.add('hidden');
  }

  // Animate reaper rising
  function riseReaper() {
    reaperBg.classList.add('risen');
  }
  function resetReaper() {
    reaperBg.classList.remove('risen');
    resetReaperEyes();
  }

  // Main check
  function checkAge(e) {
    if (e) e.preventDefault();
    resetReaper();
    const birthDate = birthDateInput.value;
    if (!birthDate) {
      showError('Please select your birth date.');
      return;
    }
    const age = calculateAge(birthDate);
    if (age < 0 || age > 120) {
      showError('Please enter a valid birth date (age 0-120).');
      return;
    }
    setTimeout(riseReaper, 120);
    if (age >= 65) {
      showResult(age, 'senior');
    } else if (age >= 18) {
      showResult(age, 'adult');
    } else {
      showResult(age, 'minor');
    }
  }

  // Reset form
  function resetForm() {
    ageForm.reset();
    resultContainer.textContent = '';
    resultContainer.className = 'result-container';
    errorMessage.classList.add('hidden');
    resetReaper();
  }

  // Event listeners
  ageForm.addEventListener('submit', checkAge);
  resetBtn.addEventListener('click', resetForm);
  birthDateInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') checkAge(e);
  });

  // On load, reset everything
  resetForm();
});