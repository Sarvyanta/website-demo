Promise.all([
    fetch("config/data.json").then(response => response.json()),
    fetch("config/sarvyanta.json").then(response => response.json())
])
.then(([data, sarvyanta]) => {

    // Business Information
    const businessName = document.getElementById("businessName");
    const tagline = document.getElementById("tagline");
    const description = document.getElementById("description");
    const logoElement = document.getElementById("businessLogo");

    if (data.business && data.business.name) {
        businessName.textContent = data.business.name;
    } else {
        businessName.style.display = "none";
    }

    if (data.business && data.business.tagline) {
        tagline.textContent = data.business.tagline;
    } else {
        tagline.style.display = "none";
    }

    if (data.business && data.business.description) {
        description.textContent = data.business.description;
    } else {
        document.getElementById("about").style.display = "none";
    }

    if (data.business && data.business.logo) {
        logoElement.src = data.business.logo;
        logoElement.alt = data.business.name + " logo";

        logoElement.onerror = () => {
            logoElement.style.display = "none";
        };
    } else {
        logoElement.style.display = "none";
    }


    // Contact
    const phoneElement = document.getElementById("phone");
    const locationElement = document.getElementById("location");

    if (data.contact && data.contact.phone) {
        phoneElement.textContent = "Phone: " + data.contact.phone;
    } else {
        phoneElement.style.display = "none";
    }

    if (data.contact && data.contact.location) {
        locationElement.textContent = "Location: " + data.contact.location;
    } else {
        locationElement.style.display = "none";
    }


    // WhatsApp Recipient
    const whatsappNumber =
        data.whatsapp &&
        data.whatsapp.owner === "business" &&
        data.whatsapp.number
            ? data.whatsapp.number
            : sarvyanta.whatsappNumber;


    // Services
    const servicesSection = document.getElementById("services");
    const servicesList = document.getElementById("servicesList");

    if (data.services && data.services.length > 0) {

        data.services.forEach(service => {

            const listItem = document.createElement("li");

            listItem.textContent = service;

            servicesList.appendChild(listItem);
        });

        const enquireButton = document.createElement("a");

        enquireButton.textContent = "Enquire on WhatsApp";

        enquireButton.href =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(
                "Hi Sarvyanta, I am interested in the services offered by " +
                data.business.name +
                "."
            );

        enquireButton.target = "_blank";
        enquireButton.id = "servicesWhatsappButton";

        servicesSection.appendChild(enquireButton);

    } else {
        servicesSection.style.display = "none";
    }


    // Products
    const productsSection = document.getElementById("products");
    const productsList = document.getElementById("productsList");

    if (data.products && data.products.length > 0) {

        data.products.forEach(product => {

            const listItem = document.createElement("li");

            if (product.image) {

                const image = document.createElement("img");

                image.src = product.image;
                image.alt = product.name;

                listItem.appendChild(image);
            }

            const name = document.createElement("strong");

            name.textContent = product.name;

            listItem.appendChild(name);

            if (product.price !== undefined && product.price !== null) {

                const price = document.createElement("div");

                price.textContent = "₹" + product.price;

                listItem.appendChild(price);
            }

            productsList.appendChild(listItem);
        });

        const orderButton = document.createElement("a");

        orderButton.textContent = "Order on WhatsApp";

        orderButton.href =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(
                "Hi Sarvyanta, I want to order a product from " +
                data.business.name +
                "."
            );

        orderButton.target = "_blank";
        orderButton.id = "productsWhatsappButton";

        productsSection.appendChild(orderButton);

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

            img.alt =
                data.business.name +
                " gallery image";

            galleryList.appendChild(img);
        });

    } else {
        gallerySection.style.display = "none";
    }


    // Social Links
    const socialLinks = document.getElementById("socialLinks");

    const instagramButton =
        document.getElementById("instagramButton");

    const facebookButton =
        document.getElementById("facebookButton");

    let hasSocialLinks = false;

    if (data.social && data.social.instagram) {

        instagramButton.href =
            data.social.instagram;

        hasSocialLinks = true;

    } else {

        instagramButton.style.display = "none";
    }

    if (data.social && data.social.facebook) {

        facebookButton.href =
            data.social.facebook;

        hasSocialLinks = true;

    } else {

        facebookButton.style.display = "none";
    }

    if (!hasSocialLinks) {
        socialLinks.style.display = "none";
    }


    // Contact WhatsApp
    const whatsappButton =
        document.getElementById("whatsappButton");

    if (whatsappNumber) {

        const message =
            "Hi Sarvyanta, I want to enquire about " +
            data.business.name +
            ".";

        whatsappButton.href =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(message);

    } else {

        whatsappButton.style.display = "none";
    }


    // Sarvyanta Branding
    document.querySelector("footer p").textContent =
        sarvyanta.collaborationText;


    // Dynamic Navigation
    const navAbout =
        document.getElementById("navAbout");

    const navServices =
        document.getElementById("navServices");

    const navProducts =
        document.getElementById("navProducts");

    const navGallery =
        document.getElementById("navGallery");


    if (
        navAbout &&
        (!data.business || !data.business.description)
    ) {
        navAbout.style.display = "none";
    }

    if (
        navServices &&
        (!data.services || data.services.length === 0)
    ) {
        navServices.style.display = "none";
    }

    if (
        navProducts &&
        (!data.products || data.products.length === 0)
    ) {
        navProducts.style.display = "none";
    }

    if (
        navGallery &&
        (!data.gallery || data.gallery.length === 0)
    ) {
        navGallery.style.display = "none";
    }

})
.catch(error => {

    console.error(
        "Error loading website data:",
        error
    );

});
