Promise.all([
    fetch("config/data.json").then(response => response.json()),
    fetch("config/sarvyanta.json").then(response => response.json())
])
.then(([data, sarvyanta]) => {

    // Business information
    document.getElementById("businessName").textContent = data.businessName;
    document.getElementById("tagline").textContent = data.tagline;
    document.getElementById("description").textContent = data.description;
// Business logo
const logoElement = document.getElementById("businessLogo");

if (data.logo) {
    logoElement.src = data.logo;
    logoElement.alt = data.businessName + " logo";

    logoElement.onerror = () => {
        logoElement.style.display = "none";
    };
} else {
    logoElement.style.display = "none";
}
    // Phone
    const phoneElement = document.getElementById("phone");

    if (data.phone) {
        phoneElement.textContent = "Phone: " + data.phone;
    } else {
        phoneElement.style.display = "none";
    }

    // Location
    const locationElement = document.getElementById("location");

    if (data.location) {
        locationElement.textContent = "Location: " + data.location;
    } else {
        locationElement.style.display = "none";
    }

    // Services
    const servicesSection = document.getElementById("services");
    const servicesList = document.getElementById("servicesList");

    if (data.services && data.services.length > 0) {

        data.services.forEach(service => {
            const listItem = document.createElement("li");
            listItem.textContent = service;
            servicesList.appendChild(listItem);
        });

    } else {
        servicesSection.style.display = "none";
    }

    // Products
    const productsSection = document.getElementById("products");
    const productsList = document.getElementById("productsList");

    if (data.products && data.products.length > 0) {

        data.products.forEach(product => {
            const listItem = document.createElement("li");
            listItem.textContent = product;
            productsList.appendChild(listItem);
        });

    } else {
        productsSection.style.display = "none";
    }
// Gallery
const gallerySection = document.getElementById("gallery");
const galleryList = document.getElementById("galleryList");

if (data.gallery && data.gallery.length > 0) {

    data.gallery.forEach(image => {
        const img = document.createElement("img");

        img.src = image;
        img.alt = data.businessName + " gallery image";

        galleryList.appendChild(img);
    });

} else {
    gallerySection.style.display = "none";
}
    // Sarvyanta branding
    document.querySelector("footer p").textContent =
        sarvyanta.collaborationText;

    // WhatsApp enquiry
    const whatsappButton = document.getElementById("whatsappButton");

    const message =
        "Hi Sarvyanta, I want to enquire about " +
        data.businessName + ".";

    whatsappButton.href =
        "https://wa.me/" +
        sarvyanta.whatsappNumber +
        "?text=" +
        encodeURIComponent(message);

})
.catch(error => {
    console.error("Error loading website data:", error);
});
