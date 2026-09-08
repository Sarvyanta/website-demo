document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);
    const businessId = params.get("business") || "bakery";

    const businessConfigUrl =
        `businesses/${businessId}/config/data.json`;

    const sarvyantaConfigUrl =
        "config/sarvyanta.json";


    // --------------------------------------------------
    // BASIC ELEMENTS
    // --------------------------------------------------

    const businessLogo = document.getElementById("businessLogo");
    const businessName = document.getElementById("businessName");
    const tagline = document.getElementById("tagline");
    const description = document.getElementById("description");

    const phone = document.getElementById("phone");
    const location = document.getElementById("location");

    const servicesList = document.getElementById("servicesList");
    const productsList = document.getElementById("productsList");
    const galleryList = document.getElementById("galleryList");

    const whatsappButton = document.getElementById("whatsappButton");

    const instagramButton =
        document.getElementById("instagramButton");

    const facebookButton =
        document.getElementById("facebookButton");

    const socialLinks =
        document.getElementById("socialLinks");


    // --------------------------------------------------
    // LOAD CONFIGURATION
    // --------------------------------------------------

    Promise.all([
        fetch(businessConfigUrl).then(response => {
            if (!response.ok) {
                throw new Error(
                    `Business configuration not found: ${businessConfigUrl}`
                );
            }

            return response.json();
        }),

        fetch(sarvyantaConfigUrl).then(response => {
            if (!response.ok) {
                throw new Error(
                    `Sarvyanta configuration not found: ${sarvyantaConfigUrl}`
                );
            }

            return response.json();
        })
    ])

    .then(([businessConfig, sarvyanta]) => {

        const business =
            businessConfig.business || businessConfig;

        const sections =
            businessConfig.sections || {};

        const services =
            sections.services ||
            businessConfig.services ||
            [];

        const products =
            sections.products ||
            businessConfig.products ||
            [];

        const gallery =
            sections.gallery ||
            businessConfig.gallery ||
            [];

        const contact =
            sections.contact ||
            businessConfig.contact ||
            {};

        const social =
            sections.social ||
            businessConfig.social ||
            {};


        // --------------------------------------------------
        // BUSINESS IDENTITY
        // --------------------------------------------------

        if (business.name) {
            businessName.textContent = business.name;

            document.title = business.name;
        }

        if (business.tagline) {
            tagline.textContent = business.tagline;
        }

        if (business.description) {
            description.textContent = business.description;
        }


        // --------------------------------------------------
        // LOGO
        // --------------------------------------------------

        if (business.logo) {

            businessLogo.src = business.logo;

            businessLogo.alt =
                `${business.name || "Business"} Logo`;

            businessLogo.style.display = "block";

        } else {

            businessLogo.style.display = "none";
        }


        // --------------------------------------------------
        // CONTACT
        // --------------------------------------------------

        let businessWhatsappNumber = null;

        if (
            businessConfig.whatsapp &&
            businessConfig.whatsapp.owner === "business" &&
            businessConfig.whatsapp.number
        ) {
            businessWhatsappNumber =
                businessConfig.whatsapp.number;
        }

        if (
            contact.whatsapp &&
            typeof contact.whatsapp === "object" &&
            contact.whatsapp.number
        ) {
            businessWhatsappNumber =
                contact.whatsapp.number;
        }

        if (contact.phone) {

            phone.textContent =
                `Phone: ${contact.phone}`;

        } else if (business.phone) {

            phone.textContent =
                `Phone: ${business.phone}`;

        } else {

            phone.style.display = "none";
        }


        if (contact.location) {

            location.textContent =
                `Location: ${contact.location}`;

        } else if (business.location) {

            location.textContent =
                `Location: ${business.location}`;

        } else {

            location.style.display = "none";
        }


        // --------------------------------------------------
        // WHATSAPP NUMBER
        // --------------------------------------------------

        const globalWhatsappNumber =
            sarvyanta.whatsappNumber || "";

        const whatsappNumber =
            businessWhatsappNumber ||
            globalWhatsappNumber;


        if (whatsappNumber) {

            const cleanNumber =
                String(whatsappNumber)
                    .replace(/\D/g, "");

            whatsappButton.href =
                `https://wa.me/${cleanNumber}`;

            whatsappButton.target = "_blank";

            whatsappButton.rel =
                "noopener noreferrer";

            whatsappButton.style.display =
                "inline-block";

        } else {

            whatsappButton.style.display = "none";
        }


        // --------------------------------------------------
        // SERVICES
        // --------------------------------------------------

        servicesList.innerHTML = "";

        if (Array.isArray(services) && services.length > 0) {

            services.forEach(service => {

                const li =
                    document.createElement("li");

                if (typeof service === "string") {

                    li.textContent = service;

                } else if (service && service.name) {

                    li.textContent = service.name;

                }

                servicesList.appendChild(li);
            });

        } else {

            const li =
                document.createElement("li");

            li.textContent =
                "Services information will be updated soon.";

            servicesList.appendChild(li);
        }


        // --------------------------------------------------
        // SERVICES NOTES
        // --------------------------------------------------

        const servicesNotes =
            sections.servicesNotes ||
            businessConfig.servicesNotes ||
            [];

        renderNotes(
            servicesNotes,
            "services",
            document.getElementById("services")
        );


        // --------------------------------------------------
        // SERVICES WHATSAPP ENQUIRE BUTTON
        // --------------------------------------------------

        addWhatsappButtonToSection(
            document.getElementById("services"),
            whatsappNumber,
            "Enquire on WhatsApp",
            "whatsapp-enquire"
        );


        // --------------------------------------------------
        // PRODUCTS
        // --------------------------------------------------

        productsList.innerHTML = "";

        if (Array.isArray(products) && products.length > 0) {

            products.forEach(product => {

                const card =
                    document.createElement("div");

                card.className =
                    "product-card";


                const name =
                    document.createElement("h3");

                name.textContent =
                    product.name || "Product";


                card.appendChild(name);


                if (
                    product.description
                ) {

                    const productDescription =
                        document.createElement("p");

                    productDescription.textContent =
                        product.description;

                    card.appendChild(
                        productDescription
                    );
                }


                if (
                    product.price !== undefined &&
                    product.price !== null &&
                    product.price !== ""
                ) {

                    const price =
                        document.createElement("div");

                    price.className =
                        "product-price";

                    price.textContent =
                        formatPrice(product.price);

                    card.appendChild(price);
                }


                // Product-level WhatsApp order button
                if (whatsappNumber) {

                    const orderButton =
                        document.createElement("a");

                    orderButton.className =
                        "whatsapp-order";

                    orderButton.href =
                        createWhatsappUrl(
                            whatsappNumber,
                            `Hi, I am interested in ${product.name || "this product"}.`
                        );

                    orderButton.target =
                        "_blank";

                    orderButton.rel =
                        "noopener noreferrer";

                    orderButton.textContent =
                        "Order on WhatsApp";

                    card.appendChild(
                        orderButton
                    );
                }


                productsList.appendChild(card);
            });

        } else {

            const message =
                document.createElement("p");

            message.textContent =
                "Products information will be updated soon.";

            productsList.appendChild(message);
        }


        // --------------------------------------------------
        // PRODUCTS NOTES
        // IMPORTANT:
        // Notes appear BEFORE the section-level button.
        // --------------------------------------------------

        const productsNotes =
            sections.productsNotes ||
            businessConfig.productsNotes ||
            [];

        renderNotes(
            productsNotes,
            "products",
            document.getElementById("products")
        );


        // --------------------------------------------------
        // PRODUCT SECTION WHATSAPP BUTTON
        // --------------------------------------------------

        addWhatsappButtonToSection(
            document.getElementById("products"),
            whatsappNumber,
            "Enquire on WhatsApp",
            "whatsapp-enquire"
        );


        // --------------------------------------------------
        // GALLERY
        // --------------------------------------------------

        setupGallery(
            gallery,
            galleryList
        );


        // --------------------------------------------------
        // SOCIAL LINKS
        // --------------------------------------------------

        let hasSocialLink = false;


        const instagram =
            social.instagram ||
            businessConfig.instagram ||
            "";

        const facebook =
            social.facebook ||
            businessConfig.facebook ||
            "";


        if (instagram) {

            instagramButton.href =
                instagram;

            instagramButton.style.display =
                "inline-block";

            hasSocialLink = true;

        } else {

            instagramButton.style.display =
                "none";
        }


        if (facebook) {

            facebookButton.href =
                facebook;

            facebookButton.style.display =
                "inline-block";

            hasSocialLink = true;

        } else {

            facebookButton.style.display =
                "none";
        }


        if (!hasSocialLink) {

            socialLinks.style.display =
                "none";
        }


        // --------------------------------------------------
        // FOOTER
        // --------------------------------------------------

        const footerText =
            document.querySelector("footer p");

        if (
            footerText &&
            sarvyanta.collaborationText
        ) {

            footerText.textContent =
                sarvyanta.collaborationText;
        }


        // --------------------------------------------------
        // INITIAL TOP BAR HEIGHT
        // --------------------------------------------------

        updateTopBarHeight();

    })

    .catch(error => {

        console.error(
            "Error loading website configuration:",
            error
        );

    });


    // ==================================================
    // NOTES
    // ==================================================

    function renderNotes(
        notes,
        className,
        section
    ) {

        if (
            !section ||
            !Array.isArray(notes) ||
            notes.length === 0
        ) {
            return;
        }


        const notesContainer =
            document.createElement("div");

        notesContainer.className =
            `${className}-notes`;


        notes.forEach(note => {

            if (!note) {
                return;
            }

            const p =
                document.createElement("p");

            p.textContent =
                `📌 ${note}`;

            notesContainer.appendChild(p);
        });


        if (notesContainer.children.length === 0) {
            return;
        }


        /*
         * Insert notes immediately after the
         * main content of the section.
         *
         * For products this means:
         *
         * Product cards
         *       ↓
         * Products notes
         *       ↓
         * Enquire button
         */

        if (className === "products") {

            const existingButton =
                section.querySelector(
                    ".whatsapp-enquire"
                );

            if (existingButton) {

                existingButton.parentNode.insertBefore(
                    notesContainer,
                    existingButton
                );

            } else {

                section.appendChild(
                    notesContainer
                );
            }

        } else {

            section.appendChild(
                notesContainer
            );
        }
    }


    // ==================================================
    // WHATSAPP BUTTON
    // ==================================================

    function addWhatsappButtonToSection(
        section,
        number,
        text,
        className
    ) {

        if (
            !section ||
            !number
        ) {
            return;
        }


        const existingButton =
            section.querySelector(
                `.${className}`
            );


        if (existingButton) {
            return;
        }


        const button =
            document.createElement("a");

        button.className =
            className;

        button.href =
            createWhatsappUrl(
                number,
                "Hi, I would like to know more about your services."
            );

        button.target =
            "_blank";

        button.rel =
            "noopener noreferrer";

        button.textContent =
            text;


        section.appendChild(button);
    }


    function createWhatsappUrl(
        number,
        message
    ) {

        const cleanNumber =
            String(number)
                .replace(/\D/g, "");

        return (
            `https://wa.me/${cleanNumber}` +
            `?text=${encodeURIComponent(message)}`
        );
    }


    // ==================================================
    // PRICE FORMAT
    // ==================================================

    function formatPrice(price) {

        if (
            typeof price === "number"
        ) {

            return (
                "₹" +
                price.toLocaleString("en-IN")
            );
        }


        if (
            typeof price === "string"
        ) {

            return price;
        }


        return "";
    }


    // ==================================================
    // GALLERY
    // ==================================================

    function setupGallery(
        gallery,
        galleryContainer
    ) {

        if (
            !galleryContainer
        ) {
            return;
        }


        galleryContainer.innerHTML = "";


        const images =
            normalizeGallery(gallery);


        if (
            images.length === 0
        ) {

            const message =
                document.createElement("p");

            message.textContent =
                "Gallery images will be added soon.";

            galleryContainer.appendChild(
                message
            );

            return;
        }


        // Store gallery images globally
        window.sarvyantaGalleryImages =
            images;


        // Show first 3 images
        const featuredImages =
            images.slice(
                0,
                3
            );


        featuredImages.forEach(
            (image, index) => {

                createGalleryItem(
                    image,
                    index,
                    galleryContainer
                );
            }
        );


        // More than 3 images
        if (images.length > 3) {

            const folder =
                document.createElement("div");

            folder.className =
                "gallery-folder";

            folder.textContent =
                `View All Photos (${images.length})`;


            folder.addEventListener(
                "click",
                function () {

                    openAllPhotos();
                }
            );


            galleryContainer.appendChild(
                folder
            );
        }
    }


    function normalizeGallery(
        gallery
    ) {

        if (!Array.isArray(gallery)) {
            return [];
        }


        const result = [];


        gallery.forEach(item => {

            if (!item) {
                return;
            }


            if (typeof item === "string") {

                result.push({
                    src: item,
                    title: ""
                });

                return;
            }


            if (item.image) {

                result.push({
                    src: item.image,
                    title: item.title || ""
                });

                return;
            }


            if (item.src) {

                result.push({
                    src: item.src,
                    title: item.title || ""
                });

                return;
            }


            if (item.path) {

                result.push({
                    src: item.path,
                    title: item.title || ""
                });
            }
        });


        return result;
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
            `Gallery Image ${index + 1}`;

        img.loading =
            "lazy";


        item.appendChild(img);


        item.addEventListener(
            "click",
            function () {

                openLightbox(index);
            }
        );


        container.appendChild(item);
    }


    // ==================================================
    // CREATE GALLERY OVERLAYS
    // ==================================================

    function createGalleryOverlays() {

        let lightbox =
            document.getElementById(
                "galleryLightbox"
            );


        let allPhotos =
            document.getElementById(
                "galleryAllPhotos"
            );


        // ----------------------------------------------
        // LIGHTBOX
        // ----------------------------------------------

        if (!lightbox) {

            lightbox =
                document.createElement("div");

            lightbox.id =
                "galleryLightbox";


            const close =
                document.createElement("button");

            close.id =
                "galleryLightboxClose";

            close.innerHTML =
                "×";

            close.setAttribute(
                "aria-label",
                "Close"
            );


            const prev =
                document.createElement("button");

            prev.id =
                "galleryPrev";

            prev.innerHTML =
                "‹";

            prev.setAttribute(
                "aria-label",
                "Previous"
            );


            const img =
                document.createElement("img");

            img.id =
                "galleryLightboxImage";


            const next =
                document.createElement("button");

            next.id =
                "galleryNext";

            next.innerHTML =
                "›";

            next.setAttribute(
                "aria-label",
                "Next"
            );


            const counter =
                document.createElement("div");

            counter.id =
                "galleryLightboxCounter";


            lightbox.appendChild(close);
            lightbox.appendChild(prev);
            lightbox.appendChild(img);
            lightbox.appendChild(next);
            lightbox.appendChild(counter);


            document.body.appendChild(
                lightbox
            );
        }


        // ----------------------------------------------
        // ALL PHOTOS
        // ----------------------------------------------

        if (!allPhotos) {

            allPhotos =
                document.createElement("div");

            allPhotos.id =
                "galleryAllPhotos";


            const close =
                document.createElement("button");

            close.id =
                "galleryAllPhotosClose";

            close.innerHTML =
                "×";

            close.setAttribute(
                "aria-label",
                "Close"
            );


            const title =
                document.createElement("h2");

            title.id =
                "galleryAllPhotosTitle";

            title.textContent =
                "All Photos";


            const grid =
                document.createElement("div");

            grid.id =
                "galleryAllPhotosGrid";


            allPhotos.appendChild(close);
            allPhotos.appendChild(title);
            allPhotos.appendChild(grid);


            document.body.appendChild(
                allPhotos
            );
        }
    }


    createGalleryOverlays();


    // ==================================================
    // LIGHTBOX STATE
    // ==================================================

    let currentGalleryIndex = 0;


    function openLightbox(index) {

        const images =
            window.sarvyantaGalleryImages || [];


        if (
            images.length === 0 ||
            index < 0 ||
            index >= images.length
        ) {
            return;
        }


        currentGalleryIndex =
            index;


        const lightbox =
            document.getElementById(
                "galleryLightbox"
            );

        const imageElement =
            document.getElementById(
                "galleryLightboxImage"
            );

        const counter =
            document.getElementById(
                "galleryLightboxCounter"
            );


        imageElement.src =
            images[index].src;

        imageElement.alt =
            images[index].title ||
            `Gallery Image ${index + 1}`;


        counter.textContent =
            `${index + 1} / ${images.length}`;


        lightbox.style.display =
            "flex";


        document.body.style.overflow =
            "hidden";
    }


    function closeLightbox() {

        const lightbox =
            document.getElementById(
                "galleryLightbox"
            );


        if (!lightbox) {
            return;
        }


        lightbox.style.display =
            "none";


        document.body.style.overflow =
            "";
    }


    function showPreviousImage() {

        const images =
            window.sarvyantaGalleryImages || [];


        if (images.length === 0) {
            return;
        }


        currentGalleryIndex =
            (
                currentGalleryIndex -
                1 +
                images.length
            ) %
            images.length;


        openLightbox(
            currentGalleryIndex
        );
    }


    function showNextImage() {

        const images =
            window.sarvyantaGalleryImages || [];


        if (images.length === 0) {
            return;
        }


        currentGalleryIndex =
            (
                currentGalleryIndex +
                1
            ) %
            images.length;


        openLightbox(
            currentGalleryIndex
        );
    }


    // ==================================================
    // ALL PHOTOS
    // ==================================================

    function openAllPhotos() {

        const images =
            window.sarvyantaGalleryImages || [];


        if (images.length === 0) {
            return;
        }


        const overlay =
            document.getElementById(
                "galleryAllPhotos"
            );

        const grid =
            document.getElementById(
                "galleryAllPhotosGrid"
            );


        grid.innerHTML = "";


        images.forEach(
            (image, index) => {

                const img =
                    document.createElement("img");

                img.src =
                    image.src;

                img.alt =
                    image.title ||
                    `Gallery Image ${index + 1}`;

                img.loading =
                    "lazy";


                img.addEventListener(
                    "click",
                    function () {

                        closeAllPhotos();

                        openLightbox(index);
                    }
                );


                grid.appendChild(img);
            }
        );


        overlay.style.display =
            "block";


        document.body.style.overflow =
            "hidden";
    }


    function closeAllPhotos() {

        const overlay =
            document.getElementById(
                "galleryAllPhotos"
            );


        if (!overlay) {
            return;
        }


        overlay.style.display =
            "none";


        document.body.style.overflow =
            "";
    }


    // ==================================================
    // GALLERY BUTTON EVENTS
    // ==================================================

    document
        .getElementById(
            "galleryLightboxClose"
        )
        .addEventListener(
            "click",
            closeLightbox
        );


    document
        .getElementById(
            "galleryPrev"
        )
        .addEventListener(
            "click",
            showPreviousImage
        );


    document
        .getElementById(
            "galleryNext"
        )
        .addEventListener(
            "click",
            showNextImage
        );


    document
        .getElementById(
            "galleryAllPhotosClose"
        )
        .addEventListener(
            "click",
            closeAllPhotos
        );


    // Close when clicking dark background
    document
        .getElementById(
            "galleryLightbox"
        )
        .addEventListener(
            "click",
            function (event) {

                if (
                    event.target === this
                ) {
                    closeLightbox();
                }
            }
        );


    // ==================================================
    // KEYBOARD CONTROLS
    // ==================================================

    document.addEventListener(
        "keydown",
        function (event) {

            const lightbox =
                document.getElementById(
                    "galleryLightbox"
                );

            const allPhotos =
                document.getElementById(
                    "galleryAllPhotos"
                );


            if (
                lightbox &&
                lightbox.style.display === "flex"
            ) {

                if (event.key === "ArrowLeft") {

                    showPreviousImage();

                } else if (
                    event.key === "ArrowRight"
                ) {

                    showNextImage();

                } else if (
                    event.key === "Escape"
                ) {

                    closeLightbox();
                }
            }


            if (
                allPhotos &&
                allPhotos.style.display === "block" &&
                event.key === "Escape"
            ) {

                closeAllPhotos();
            }
        }
    );


    // ==================================================
    // TOUCH / SWIPE SUPPORT
    // ==================================================

    let touchStartX = 0;
    let touchEndX = 0;


    const lightboxElement =
        document.getElementById(
            "galleryLightbox"
        );


    lightboxElement.addEventListener(
        "touchstart",
        function (event) {

            if (
                event.changedTouches.length > 0
            ) {

                touchStartX =
                    event.changedTouches[0].screenX;
            }
        },
        { passive: true }
    );


    lightboxElement.addEventListener(
        "touchend",
        function (event) {

            if (
                event.changedTouches.length === 0
            ) {
                return;
            }


            touchEndX =
                event.changedTouches[0].screenX;


            handleSwipe();
        },
        { passive: true }
    );


    function handleSwipe() {

        const difference =
            touchEndX -
            touchStartX;


        if (
            Math.abs(difference) < 50
        ) {
            return;
        }


        if (difference > 0) {

            showPreviousImage();

        } else {

            showNextImage();
        }
    }


    // ==================================================
    // DYNAMIC TOP BAR HEIGHT
    // ==================================================
    // This keeps the page content correctly positioned
    // below the fixed header + navigation.
    //
    // No hard-coded 390px / 205px / 185px values.
    // ==================================================

    const topBar =
        document.getElementById(
            "topBar"
        );


    if (topBar) {

        function updateTopBarHeight() {

            const height =
                topBar.offsetHeight;


            document.documentElement
                .style
                .setProperty(
                    "--topbar-height",
                    height + "px"
                );
        }


        function updateScrollState() {

            if (
                window.scrollY > 80
            ) {

                topBar.classList.add(
                    "scrolled"
                );

            } else {

                topBar.classList.remove(
                    "scrolled"
                );
            }


            requestAnimationFrame(
                function () {

                    updateTopBarHeight();
                }
            );
        }


        window.addEventListener(
            "scroll",
            updateScrollState,
            { passive: true }
        );


        window.addEventListener(
            "resize",
            updateTopBarHeight
        );


        window.addEventListener(
            "load",
            updateTopBarHeight
        );


        updateTopBarHeight();


        setTimeout(
            updateTopBarHeight,
            100
        );
    }

});
