// JavaScript code for the Age Checker application+
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const birthDateInput = document.getElementById('birth-date');
    const checkBtn = document.getElementById('check-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultContainer = document.getElementById('result');
    const resultMessage = document.getElementById('result-message');
    const errorMessage = document.getElementById('error-message');

    // Set max date to today (can't select future dates)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    birthDateInput.max = `${year}-${month}-${day}`;
    
    // Set min date to 120 years ago (reasonable age limit)
    const minDate = new Date();
    minDate.setFullYear(year - 120);
    const minYear = minDate.getFullYear();
    const minMonth = String(minDate.getMonth() + 1).padStart(2, '0');
    const minDay = String(minDate.getDate()).padStart(2, '0');
    birthDateInput.min = `${minYear}-${minMonth}-${minDay}`;

    // Calculate age from birth date
    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        
        let age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();
        
        // Adjust age if birthday hasn't occurred yet this year
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    };

    // Check age function
    const checkAge = () => {
        // Clear previous results
        resultContainer.className = 'result-container';
        errorMessage.classList.add('hidden');
        
        // Get the input value
        const birthDate = birthDateInput.value;
        
        // Validate input
        if (!birthDate) {
            showError('Please select your birth date');
            return;
        }

        // Validate age is not over 120
        const age = calculateAge(birthDate);
        if (age > 120) {
            showError('YOU ARE ALREADY WITH ME');
            return;
        }
        
        // Determine age category and display result
        if (age >= 65) {
            resultContainer.classList.add('senior');
            resultMessage.textContent = `You are ${age} years old DEATH LOOMS!`;
        } else if (age >= 18) {
            resultContainer.classList.add('adult');
            resultMessage.textContent = `You are ${age} years old BEWARE! I LURK!`;
        } else {
            resultContainer.classList.add('minor');
            resultMessage.textContent = `You are ${age} years old You are safe...for now.`;
        }
    };
    
    // Show error message
    const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        resultMessage.textContent = '';
    };
    
    // Reset function
    const resetForm = () => {
        birthDateInput.value = '';
        resultContainer.className = 'result-container';
        resultMessage.textContent = '';
        errorMessage.classList.add('hidden');
    };
    
    // Event listeners
    checkBtn.addEventListener('click', checkAge);
    resetBtn.addEventListener('click', resetForm);
    
    // Allow Enter key to submit when date field is focused
    birthDateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAge();
        }
    });
});