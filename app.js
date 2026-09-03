Promise.all([
    fetch("config/data.json").then(response => response.json()),
    fetch("config/sarvyanta.json").then(response => response.json())
])
.then(([data, sarvyanta]) => {

    // Business information
    document.getElementById("businessName").textContent = data.businessName;
    document.getElementById("tagline").textContent = data.tagline;
    document.getElementById("description").textContent = data.description;
    document.getElementById("phone").textContent = "Phone: " + data.phone;
    document.getElementById("location").textContent = "Location: " + data.location;

    // Services
    const servicesList = document.getElementById("servicesList");

    if (data.services && data.services.length > 0) {
        data.services.forEach(service => {
            const listItem = document.createElement("li");
            listItem.textContent = service;
            servicesList.appendChild(listItem);
        });
    }

    // Sarvyanta branding
    document.querySelector("footer p").textContent =
        sarvyanta.collaborationText;

})
.catch(error => {
    console.error("Error loading website data:", error);
});
