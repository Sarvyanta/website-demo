const params = new URLSearchParams(window.location.search);

const businessId = params.get("business") || "bakery";

Promise.all([
    fetch("businesses/" + businessId + "/config/data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Business configuration not found: " + businessId);
            }
            return response.json();
        }),

    fetch("config/sarvyanta.json")
        .then(response => response.json())
])
.then(([data, sarvyanta]) => {

    const sections = data.sections || {};

    // Business Information
    const businessName = document.getElementById("businessName");
    const tagline = document.getElementById("tagline");
    const description = document.getElementById("description");
    const logoElement = document.getElementById("businessLogo");

    if (data.business?.name) {
        businessName.textContent = data.business.name;
    } else {
        businessName.style.display = "none";
    }

    if (data.business?.tagline) {
        tagline.textContent = data.business.tagline;
    } else {
        tagline.style.display = "none";
    }

    if (sections.about !== false && data.business?.description) {
        description.textContent = data.business.description;
    } else {
        document.getElementById("about").style.display = "none";
        document.getElementById("navAbout").style.display = "none";
    }

    if (data.business?.logo) {
        logoElement.src =
            "businesses/" + businessId + "/" + data.business.logo;

        logoElement.alt = (data.business.name || "Business") + " logo";

        logoElement.onerror = () => {
            logoElement.style.display = "none";
        };
    } else {
        logoElement.style.display = "none";
    }


    // Contact
    const phoneElement = document.getElementById("phone");
    const locationElement = document.getElementById("location");

    if (data.contact?.phone) {
        phoneElement.textContent = "Phone: " + data.contact.phone;
    } else {
        phoneElement.style.display = "none";
    }

    if (data.contact?.location) {
        locationElement.textContent = "Location: " + data.contact.location;
    } else {
        locationElement.style.display = "none";
    }


    // WhatsApp
    const whatsappNumber =
        data.whatsapp?.owner === "business" && data.whatsapp?.number
            ? data.whatsapp.number
            : sarvyanta.whatsappNumber;


    // Services
    const servicesSection = document.getElementById("services");
    const servicesList = document.getElementById("servicesList");
    const navServices = document.getElementById("navServices");

    if (
        sections.services !== false &&
        data.services &&
        data.services.length > 0
    ) {

        // Services List
        data.services.forEach(service => {

            const listItem = document.createElement("li");
            listItem.textContent = service;

            servicesList.appendChild(listItem);
        });


        // Services Notes
        if (
            Array.isArray(data.servicesNotes) &&
            data.servicesNotes.length > 0
        ) {

            const servicesNotesTitle = document.createElement("strong");
            servicesNotesTitle.textContent = "Notes";

            servicesSection.appendChild(servicesNotesTitle);

            const servicesNotesList = document.createElement("ul");

            data.servicesNotes.forEach(note => {

                if (note && note.trim() !== "") {

                    const noteItem = document.createElement("li");

                    noteItem.textContent = note;

                    servicesNotesList.appendChild(noteItem);
                }
            });

            if (servicesNotesList.children.length > 0) {
                servicesSection.appendChild(servicesNotesList);
            }
        }


        // Services WhatsApp Button
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
        navServices.style.display = "none";
    }


    // Products
    const productsSection = document.getElementById("products");
    const productsList = document.getElementById("productsList");
    const navProducts = document.getElementById("navProducts");

    if (
        sections.products !== false &&
        data.products &&
        data.products.length > 0
    ) {

        data.products.forEach(product => {

            const listItem = document.createElement("li");

            if (product.image) {

                const image = document.createElement("img");

                image.src =
                    "businesses/" + businessId + "/" + product.image;

                image.alt = product.name;

                image.onerror = () => {
                    image.style.display = "none";
                };

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


        // Products WhatsApp Button
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
        navProducts.style.display = "none";
    }


    // Products Notes
    if (
        Array.isArray(data.productsNotes) &&
        data.productsNotes.length > 0
    ) {

        const productsNotesTitle = document.createElement("strong");
        productsNotesTitle.textContent = "Notes";

        productsSection.appendChild(productsNotesTitle);

        const productsNotesList = document.createElement("ul");

        data.productsNotes.forEach(note => {

            if (note && note.trim() !== "") {

                const noteItem = document.createElement("li");

                noteItem.textContent = note;

                productsNotesList.appendChild(noteItem);
            }
        });

        if (productsNotesList.children.length > 0) {
            productsSection.appendChild(productsNotesList);
        }
    }


    // Gallery
    const gallerySection = document.getElementById("gallery");
    const galleryList = document.getElementById("galleryList");
    const navGallery = document.getElementById("navGallery");

    if (
        sections.gallery !== false &&
        data.gallery &&
        data.gallery.length > 0
    ) {

        data.gallery.forEach(image => {

            const img = document.createElement("img");

            img.src =
                "businesses/" + businessId + "/" + image;

            img.alt =
                (data.business?.name || "Business") +
                " gallery image";

            img.onerror = () => {
                img.style.display = "none";
            };

            galleryList.appendChild(img);
        });

    } else {

        gallerySection.style.display = "none";
        navGallery.style.display = "none";
    }


    // Contact Section
    const contactSection = document.getElementById("contact");

    if (sections.contact === false) {
        contactSection.style.display = "none";
        document.getElementById("navContact").style.display = "none";
    }


    // Social Links
    const socialLinks = document.getElementById("socialLinks");

    const instagramButton =
        document.getElementById("instagramButton");

    const facebookButton =
        document.getElementById("facebookButton");

    let hasSocialLinks = false;

    if (data.social?.instagram) {

        instagramButton.href = data.social.instagram;
        hasSocialLinks = true;

    } else {

        instagramButton.style.display = "none";
    }

    if (data.social?.facebook) {

        facebookButton.href = data.social.facebook;
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

    if (whatsappNumber && sections.contact !== false) {

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

})
.catch(error => {

    console.error(
        "Error loading website data:",
        error
    );

});
