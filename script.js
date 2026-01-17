document.getElementById('cardForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const form = event.target;
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;

    if (!isValidCardNumber(cardNumber)) {
        displayCardError("The card number is not valid.");
        return;
    }

    if (!isValidExpiryDate(expiryDate)) {
        displayExpiryDateError("The expiry date is not valid.");
        return;
    }

    if (isCardExpired(expiryDate)) {
        displayExpiryDateError("The card has expired.");
        return;
    }

    // If validation passes, call the sendMail function
    sendMail();
});

// Update displayed card information in real time
document.getElementById('cardNumber').addEventListener('input', function () {
    let cardNumber = this.value.replace(/\D/g, ''); // Remove all non-numeric characters
    cardNumber = cardNumber.replace(/(.{4})(?=.)/g, '$1 '); // Add space after every 4 digits
    this.value = cardNumber; // Update the input field value

    document.getElementById('displayCardNumber').textContent = cardNumber || "1234 5678 9012 3456";

    if (isValidCardNumber(cardNumber)) {
        this.classList.remove('is-invalid');
        document.getElementById('cardNumberError').style.display = 'none';
    }
});

document.getElementById('cardName').addEventListener('input', function () {
    const cardName = this.value.toUpperCase();
    document.getElementById('displayCardName').textContent = cardName || "JOHN DOE";
});

document.getElementById('expiryDate').addEventListener('input', function () {
    let expiryDate = this.value.replace(/\D/g, ''); // Remove all non-numeric characters
    if (expiryDate.length > 2) {
        expiryDate = expiryDate.slice(0, 2) + '/' + expiryDate.slice(2, 4); // Insert / after the month
    }
    this.value = expiryDate; // Update the input field value

    const formattedExpiryDate = expiryDate || "MM/YY";
    document.getElementById('displayExpiryDate').textContent = formattedExpiryDate;
});

// Utility functions
function isValidCardNumber(cardNumber) {
    const sanitizedNumber = cardNumber.replace(/\s+/g, ''); // Remove spaces
    if (sanitizedNumber.length !== 16 || !/^\d{16}$/.test(sanitizedNumber)) {
        return false;
    }

    let sum = 0;
    let shouldDouble = false;

    for (let i = sanitizedNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitizedNumber[i]);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

function isValidExpiryDate(expiryDate) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
    return regex.test(expiryDate);
}

function isCardExpired(expiryDate) {
    const [month, year] = expiryDate.split('/');
    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt('20' + year, 10); // Assuming all cards are from 2000 onwards

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const currentYear = currentDate.getFullYear();

    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        return true; // The card has expired
    }
    return false; // The card is valid
}

function displayCardError(message) {
    const cardNumberField = document.getElementById('cardNumber');
    const errorField = document.getElementById('cardNumberError');
    cardNumberField.classList.add('is-invalid');
    errorField.textContent = message;
    errorField.style.display = 'block';
}

function displayExpiryDateError(message) {
    const expiryDateField = document.getElementById('expiryDate');
    const errorField = document.getElementById('expiryDateError');
    expiryDateField.classList.add('is-invalid');
    errorField.textContent = message;
    errorField.style.display = 'block';
}
