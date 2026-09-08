document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);

    const businessId =
        params.get("business") || "realisticportraitartist";

    const businessFolder =
        "businesses/" + businessId + "/";

    const businessConfigUrl =
        businessFolder + "config/data.json";


    /* =========================
       HELPERS
    ========================= */

    function resolvePath(path) {

        if (!path) {
            return "";
        }

        path = String(path);

        // Full external URL
        if (
            path.startsWith("http://") ||
            path.startsWith("https://") ||
            path.startsWith("//")
        ) {
            return path;
        }

        // Absolute path
        if (path.startsWith("/")) {
            return path;
        }

        // Business assets
        return businessFolder + path;
    }


    function formatPrice(price) {

        if (price === undefined || price === null || price === "") {
            return "";
        }

        if (typeof price === "number") {
            return "₹" + price.toLocaleString("en-IN");
        }

        return String(price);
    }


    function getElement(id) {
        return document.getElementById(id);
    }


    /* =========================
       LOAD BUSINESS DATA
    ========================= */

    fetch(businessConfigUrl)

        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Business JSON not found: " +
                    businessConfigUrl
                );
            }

            return response.json();
        })

        .then(function (data) {

            renderBusiness(data);

        })

        .catch(function (error) {

            console.error(error);

            getElement("businessName").textContent =
                "Unable to load business";

            getElement("tagline").textContent =
                "Please check the business configuration.";

            getElement("description").textContent =
                error.message;
        });


    /* =========================
       RENDER BUSINESS
    ========================= */

    function renderBusiness(data) {

        const business =
            data.business || data;

        const sections =
            data.sections || {};


        /* NAME */

        if (business.name) {
            getElement("businessName").textContent =
                business.name;

            document.title =
                business.name;
        }


        /* TAGLINE */

        if (business.tagline) {
            getElement("tagline").textContent =
                business.tagline;
        }


        /* DESCRIPTION */

        if (business.description) {
            getElement("description").textContent =
                business.description;
        }


        /* LOGO */

        if (business.logo) {

            const logo =
                getElement("businessLogo");

            logo.src =
                resolvePath(business.logo);

            logo.style.display =
                "block";
        }


        /* SERVICES */

        renderServices(
            sections.services ||
            business.services ||
            []
        );


        /* PRODUCTS */

        renderProducts(
            sections.products ||
            business.products ||
            []
        );


        /* NOTES */

        renderNotes(
            sections.productsNotes ||
            business.productsNotes ||
            []
        );


        /* GALLERY */

        renderGallery(
            sections.gallery ||
            business.gallery ||
            []
        );


        /* CONTACT */

        renderContact(
            data.contact ||
            business.contact ||
            {}
        );


        /* SOCIAL */

        renderSocial(
            data.social ||
            business.social ||
            {}
        );
    }


    /* =========================
       SERVICES
    ========================= */

    function renderServices(services) {

        const container =
            getElement("servicesList");

        container.innerHTML = "";

        if (!Array.isArray(services) ||
            services.length === 0) {

            const item =
                document.createElement("div");

            item.className =
                "service-item";

            item.textContent =
                "Services information coming soon.";

            container.appendChild(item);

            return;
        }


        services.forEach(function (service) {

            const item =
                document.createElement("div");

            item.className =
                "service-item";


            if (typeof service === "string") {

                item.textContent =
                    service;

            } else {

                const title =
                    service.name ||
                    service.title ||
                    "Service";

                item.textContent =
                    title;
            }


            container.appendChild(item);

        });
    }


    /* =========================
       PRODUCTS
    ========================= */

    function renderProducts(products) {

        const container =
            getElement("productsList");

        container.innerHTML = "";


        if (!Array.isArray(products) ||
            products.length === 0) {

            container.textContent =
                "Products information coming soon.";

            return;
        }


        products.forEach(function (product) {

            const card =
                document.createElement("div");

            card.className =
                "product-card";


            const title =
                document.createElement("h3");

            title.textContent =
                product.name ||
                product.title ||
                "Product";


            card.appendChild(title);


            if (
                product.price !== undefined &&
                product.price !== null
            ) {

                const price =
                    document.createElement("div");

                price.className =
                    "product-price";

                price.textContent =
                    formatPrice(product.price);

                card.appendChild(price);
            }


            /*
             * WhatsApp order button
             */

            const whatsappNumber =
                getWhatsAppNumber();


            if (whatsappNumber) {

                const order =
                    document.createElement("a");

                order.className =
                    "product-order";

                order.target =
                    "_blank";

                order.rel =
                    "noopener noreferrer";

                const message =
                    "Hi, I am interested in " +
                    (product.name || product.title || "this product");


                order.href =
                    "https://wa.me/" +
                    whatsappNumber +
                    "?text=" +
                    encodeURIComponent(message);


                order.textContent =
                    "Enquire on WhatsApp";


                card.appendChild(order);
            }


            container.appendChild(card);

        });
    }


    /* =========================
       NOTES
    ========================= */

    function renderNotes(notes) {

        const container =
            getElement("productsNotes");

        container.innerHTML = "";


        if (!Array.isArray(notes) ||
            notes.length === 0) {

            return;
        }


        const wrapper =
            document.createElement("div");

        wrapper.className =
            "notes";


        notes.forEach(function (note) {

            const div =
                document.createElement("div");

            div.className =
                "note";

            div.textContent =
                "📌 " + note;

            wrapper.appendChild(div);

        });


        container.appendChild(wrapper);
    }


    /* =========================
       GALLERY
    ========================= */

    let galleryImages = [];

    let currentImage = 0;


    function normalizeGalleryItem(item) {

        if (typeof item === "string") {

            return {
                src: resolvePath(item),
                title: ""
            };
        }


        if (!item || typeof item !== "object") {
            return null;
        }


        const path =
            item.image ||
            item.src ||
            item.path;


        if (!path) {
            return null;
        }


        return {
            src: resolvePath(path),
            title:
                item.title ||
                item.name ||
                ""
        };
    }


    function renderGallery(gallery) {

        const container =
            getElement("galleryList");

        container.innerHTML = "";

        galleryImages = [];


        if (!Array.isArray(gallery) ||
            gallery.length === 0) {

            container.innerHTML =
                "<p>Gallery coming soon.</p>";

            return;
        }


        galleryImages =
            gallery
                .map(normalizeGalleryItem)
                .filter(Boolean);


        /*
         * Show first 3 images
         */

        const visibleCount =
            Math.min(3, galleryImages.length);


        for (
            let i = 0;
            i < visibleCount;
            i++
        ) {

            createGalleryItem(
                galleryImages[i],
                i,
                container
            );
        }


        /*
         * View all photos button
         */

        if (galleryImages.length > 3) {

            const more =
                document.createElement("div");

            more.className =
                "gallery-more";

            more.textContent =
                "View All Photos (" +
                galleryImages.length +
                ")";


            more.addEventListener(
                "click",
                function () {

                    openGallery(0);
                }
            );


            container.appendChild(more);
        }
    }


    function createGalleryItem(
        image,
        index,
        container
    ) {

        const item =
            document.createElement("div");

        item.className =
            "gallery-item";


        const img =
            document.createElement("img");

        img.src =
            image.src;

        img.alt =
            image.title ||
            "Gallery Image";


        img.addEventListener(
            "click",
            function () {

                openGallery(index);
            }
        );


        item.appendChild(img);

        container.appendChild(item);
    }


    /* =========================
       LIGHTBOX
    ========================= */

    function openGallery(index) {

        if (
            !galleryImages.length
        ) {
            return;
        }


        currentImage =
            index;


        updateLightbox();


        getElement("lightbox")
            .classList
            .add("active");
    }


    function updateLightbox() {

        const image =
            galleryImages[currentImage];


        getElement("lightboxImage").src =
            image.src;


        getElement("lightboxCounter").textContent =
            (currentImage + 1) +
            " / " +
            galleryImages.length;
    }


    function closeGallery() {

        getElement("lightbox")
            .classList
            .remove("active");
    }


    function nextImage() {

        if (!galleryImages.length) {
            return;
        }


        currentImage =
            (currentImage + 1) %
            galleryImages.length;


        updateLightbox();
    }


    function previousImage() {

        if (!galleryImages.length) {
            return;
        }


        currentImage =
            (currentImage - 1 +
            galleryImages.length) %
            galleryImages.length;


        updateLightbox();
    }


    getElement("lightboxClose")
        .addEventListener(
            "click",
            closeGallery
        );


    getElement("lightboxNext")
        .addEventListener(
            "click",
            nextImage
        );


    getElement("lightboxPrev")
        .addEventListener(
            "click",
            previousImage
        );


    getElement("lightbox")
        .addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    getElement("lightbox")
                ) {
                    closeGallery();
                }
            }
        );


    document.addEventListener(
        "keydown",
        function (event) {

            const lightbox =
                getElement("lightbox");

            if (
                !lightbox.classList.contains("active")
            ) {
                return;
            }


            if (event.key === "Escape") {
                closeGallery();
            }

            if (event.key === "ArrowRight") {
                nextImage();
            }

            if (event.key === "ArrowLeft") {
                previousImage();
            }
        }
    );


    /* =========================
       CONTACT
    ========================= */

    let currentBusinessData = null;


    function renderContact(contact) {

        if (contact.phone) {

            getElement("phone").textContent =
                "Phone: " + contact.phone;
        }


        if (contact.location) {

            getElement("location").textContent =
                "Location: " + contact.location;
        }


        const whatsappNumber =
            getWhatsAppNumber(contact);


        if (whatsappNumber) {

            const button =
                getElement("whatsappButton");

            button.href =
                "https://wa.me/" +
                whatsappNumber;

        } else {

            getElement("whatsappButton")
                .style.display = "none";
        }
    }


    function getWhatsAppNumber(contact) {

        contact =
            contact ||
            {};


        let number =
            contact.whatsappNumber ||
            contact.whatsapp ||
            "";


        if (typeof number === "object") {

            number =
                number.number ||
                "";
        }


        if (!number && currentBusinessData) {

            const business =
                currentBusinessData.business ||
                currentBusinessData;


            number =
                business.whatsapp ||
                "";
        }


        if (typeof number === "object") {

            number =
                number.number ||
                "";
        }


        return String(number)
            .replace(/\D/g, "");
    }


    /* =========================
       SOCIAL
    ========================= */

    function renderSocial(social) {

        const instagram =
            social.instagram ||
            "";


        const facebook =
            social.facebook ||
            "";


        setupSocialButton(
            "instagramButton",
            instagram
        );


        setupSocialButton(
            "facebookButton",
            facebook
        );
    }


    function setupSocialButton(
        id,
        url
    ) {

        const button =
            getElement(id);


        if (!url) {

            button.style.display =
                "none";

            return;
        }


        button.href =
            url;
    }


    /*
     * Store complete data for
     * WhatsApp/product functions.
     */

    const originalRenderBusiness =
        renderBusiness;

});
