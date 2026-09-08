document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       BUSINESS ID
    ========================================= */

    const params =
        new URLSearchParams(window.location.search);

    const businessId =
        params.get("business") ||
        "realisticportraitartist";


    /* =========================================
       CONFIG PATHS
    ========================================= */

    const businessConfigUrl =
        `businesses/${businessId}/config/data.json`;

    const sarvyantaConfigUrl =
        "config/sarvyanta.json";


    /* =========================================
       HTML ELEMENTS
    ========================================= */

    const businessLogo =
        document.getElementById("businessLogo");

    const businessName =
        document.getElementById("businessName");

    const tagline =
        document.getElementById("tagline");

    const description =
        document.getElementById("description");

    const phone =
        document.getElementById("phone");

    const location =
        document.getElementById("location");

    const servicesList =
        document.getElementById("servicesList");

    const productsList =
        document.getElementById("productsList");

    const galleryList =
        document.getElementById("galleryList");

    const whatsappButton =
        document.getElementById("whatsappButton");

    const instagramButton =
        document.getElementById("instagramButton");

    const facebookButton =
        document.getElementById("facebookButton");

    const socialLinks =
        document.getElementById("socialLinks");


    /* =========================================
       LOAD JSON
    ========================================= */

    Promise.all([

        fetch(businessConfigUrl)
            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        "Business JSON not found: " +
                        businessConfigUrl
                    );
                }

                return response.json();
            }),

        fetch(sarvyantaConfigUrl)
            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        "Sarvyanta JSON not found: " +
                        sarvyantaConfigUrl
                    );
                }

                return response.json();
            })

    ])

    .then(([businessConfig, sarvyanta]) => {

        /* =====================================
           CONFIG SECTIONS
        ===================================== */

        const business =
            businessConfig.business || {};

        const sections =
            businessConfig.sections || {};


        const services =
            sections.services || [];

        const servicesNotes =
            sections.servicesNotes || [];

        const products =
            sections.products || [];

        const productsNotes =
            sections.productsNotes || [];

        const gallery =
            sections.gallery || [];

        const contact =
            sections.contact || {};

        const social =
            sections.social || {};


        /* =====================================
           BUSINESS NAME
        ===================================== */

        if (business.name) {

            businessName.textContent =
                business.name;

            document.title =
                business.name;
        }


        /* =====================================
           TAGLINE
        ===================================== */

        if (business.tagline) {

            tagline.textContent =
                business.tagline;
        }


        /* =====================================
           DESCRIPTION
        ===================================== */

        if (business.description) {

            description.textContent =
                business.description;
        }


        /* =====================================
           LOGO
        ===================================== */

        if (business.logo) {

            businessLogo.src =
                business.logo;

            businessLogo.alt =
                `${business.name || "Business"} Logo`;

            businessLogo.style.display =
                "block";

        } else {

            businessLogo.style.display =
                "none";
        }


        /* =====================================
           CONTACT
        ===================================== */

        const phoneNumber =
            contact.phone ||
            business.phone ||
            "";

        if (phoneNumber) {

            phone.textContent =
                `Phone: ${phoneNumber}`;

        } else {

            phone.style.display =
                "none";
        }


        const businessLocation =
            contact.location ||
            business.location ||
            "";

        if (businessLocation) {

            location.textContent =
                `Location: ${businessLocation}`;

        } else {

            location.style.display =
                "none";
        }


        /* =====================================
           WHATSAPP
        ===================================== */

        let whatsappNumber = "";


        if (
            businessConfig.whatsapp &&
            businessConfig.whatsapp.owner === "business" &&
            businessConfig.whatsapp.number
        ) {

            whatsappNumber =
                businessConfig.whatsapp.number;
        }


        if (
            contact.whatsapp &&
            typeof contact.whatsapp === "object" &&
            contact.whatsapp.number
        ) {

            whatsappNumber =
                contact.whatsapp.number;
        }


        if (!whatsappNumber) {

            whatsappNumber =
                sarvyanta.whatsappNumber || "";
        }


        if (whatsappNumber) {

            whatsappButton.href =
                createWhatsappUrl(
                    whatsappNumber,
                    "Hi, I would like to know more about your services."
                );

            whatsappButton.style.display =
                "inline-block";

        } else {

            whatsappButton.style.display =
                "none";
        }


        /* =====================================
           SERVICES
        ===================================== */

        servicesList.innerHTML = "";


        if (
            Array.isArray(services) &&
            services.length > 0
        ) {

            services.forEach(service => {

                const li =
                    document.createElement("li");


                if (
                    typeof service === "string"
                ) {

                    li.textContent =
                        service;

                } else if (
                    service &&
                    service.name
                ) {

                    li.textContent =
                        service.name;
                }


                servicesList.appendChild(li);
            });

        } else {

            servicesList.innerHTML =
                "<li>Services information will be updated soon.</li>";
        }


        renderNotes(
            servicesNotes,
            "services",
            document.getElementById("services")
        );


        addWhatsappButtonToSection(
            document.getElementById("services"),
            whatsappNumber,
            "Enquire on WhatsApp"
        );


        /* =====================================
           PRODUCTS
        ===================================== */

        productsList.innerHTML = "";


        if (
            Array.isArray(products) &&
            products.length > 0
        ) {

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


                if (product.description) {

                    const desc =
                        document.createElement("p");

                    desc.className =
                        "product-description";

                    desc.textContent =
                        product.description;

                    card.appendChild(desc);
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


                if (whatsappNumber) {

                    const order =
                        document.createElement("a");

                    order.className =
                        "whatsapp-order";

                    order.href =
                        createWhatsappUrl(
                            whatsappNumber,
                            `Hi, I am interested in ${product.name || "this product"}.`
                        );

                    order.target =
                        "_blank";

                    order.rel =
                        "noopener noreferrer";

                    order.textContent =
                        "Order on WhatsApp";

                    card.appendChild(order);
                }


                productsList.appendChild(card);
            });

        } else {

            productsList.innerHTML =
                "<p>Products information will be updated soon.</p>";
        }


        /* =====================================
           PRODUCT NOTES
        ===================================== */

        renderNotes(
            productsNotes,
            "products",
            document.getElementById("products")
        );


        addWhatsappButtonToSection(
            document.getElementById("products"),
            whatsappNumber,
            "Enquire on WhatsApp"
        );


        /* =====================================
           GALLERY
        ===================================== */

        setupGallery(
            gallery,
            galleryList
        );


        /* =====================================
           INSTAGRAM
        ===================================== */

        setupSocialButton(
            instagramButton,
            social.instagram ||
            businessConfig.instagram ||
            "",
            socialLinks
        );


        /* =====================================
           FACEBOOK
        ===================================== */

        setupSocialButton(
            facebookButton,
            social.facebook ||
            businessConfig.facebook ||
            "",
            socialLinks
        );


        /* =====================================
           FOOTER
        ===================================== */

        const footerText =
            document.querySelector("footer p");

        if (
            footerText &&
            sarvyanta.collaborationText
        ) {

            footerText.textContent =
                sarvyanta.collaborationText;
        }


        /* =====================================
           HEADER HEIGHT
        ===================================== */

        updateTopBarHeight();

    })

    .catch(error => {

        console.error(
            "Website loading error:",
            error
        );

    });


    /* =========================================
       NOTES
    ========================================= */

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


        const container =
            document.createElement("div");

        container.className =
            `${className}-notes`;


        notes.forEach(note => {

            if (!note) {
                return;
            }


            const p =
                document.createElement("p");

            p.textContent =
                `📌 ${note}`;

            container.appendChild(p);
        });


        const enquiryButton =
            section.querySelector(
                ".whatsapp-enquire"
            );


        if (enquiryButton) {

            section.insertBefore(
                container,
                enquiryButton
            );

        } else {

            section.appendChild(container);
        }
    }


    /* =========================================
       WHATSAPP SECTION BUTTON
    ========================================= */

    function addWhatsappButtonToSection(
        section,
        number,
        text
    ) {

        if (
            !section ||
            !number
        ) {
            return;
        }


        if (
            section.querySelector(
                ".whatsapp-enquire"
            )
        ) {
            return;
        }


        const button =
            document.createElement("a");

        button.className =
            "whatsapp-enquire";

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


    /* =========================================
       WHATSAPP URL
    ========================================= */

    function createWhatsappUrl(
        number,
        message
    ) {

        const cleanNumber =
            String(number)
                .replace(/\D/g, "");


        return (
            "https://wa.me/" +
            cleanNumber +
            "?text=" +
            encodeURIComponent(message)
        );
    }


    /* =========================================
       PRICE
    ========================================= */

    function formatPrice(price) {

        if (
            typeof price === "number"
        ) {

            return (
                "₹" +
                price.toLocaleString("en-IN")
            );
        }


        return String(price);
    }


    /* =========================================
       SOCIAL BUTTON
    ========================================= */

    function setupSocialButton(
        button,
        url,
        container
    ) {

        if (
            !button ||
            !url
        ) {

            if (button) {
                button.style.display =
                    "none";
            }

            return;
        }


        button.href =
            url;

        button.target =
            "_blank";

        button.rel =
            "noopener noreferrer";

        button.style.display =
            "inline-block";


        if (container) {

            container.style.display =
                "flex";
        }
    }


    /* =========================================
       GALLERY
    ========================================= */

    let galleryImages = [];

    let currentGalleryIndex = 0;


    function setupGallery(
        gallery,
        container
    ) {

        if (!container) {
            return;
        }


        container.innerHTML = "";


        galleryImages =
            normalizeGallery(gallery);


        if (galleryImages.length === 0) {

            const message =
                document.createElement("p");

            message.textContent =
                "Gallery images will be added soon.";

            container.appendChild(message);

            return;
        }


        /* FIRST 3 */

        galleryImages
            .slice(0, 3)
            .forEach((image, index) => {

                createGalleryItem(
                    image,
                    index,
                    container
                );
            });


        /* VIEW ALL */

        if (galleryImages.length > 3) {

            const folder =
                document.createElement("div");

            folder.className =
                "gallery-folder";

            folder.textContent =
                `View All Photos (${galleryImages.length})`;


            folder.addEventListener(
                "click",
                openAllPhotos
            );


            container.appendChild(folder);
        }
    }


    function normalizeGallery(gallery) {

        if (!Array.isArray(gallery)) {
            return [];
        }


        return gallery
            .map(item => {

                if (
                    typeof item === "string"
                ) {

                    return {
                        src: item,
                        title: ""
                    };
                }


                if (
                    item &&
                    item.image
                ) {

                    return {
                        src: item.image,
                        title: item.title || ""
                    };
                }


                if (
                    item &&
                    item.src
                ) {

                    return {
                        src: item.src,
                        title: item.title || ""
                    };
                }


                if (
                    item &&
                    item.path
                ) {

                    return {
                        src: item.path,
                        title: item.title || ""
                    };
                }


                return null;

            })
            .filter(Boolean);
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


    /* =========================================
       CREATE GALLERY OVERLAYS
    ========================================= */

    function createGalleryOverlays() {

        if (
            document.getElementById(
                "galleryLightbox"
            )
        ) {
            return;
        }


        /* LIGHTBOX */

        const lightbox =
            document.createElement("div");

        lightbox.id =
            "galleryLightbox";


        const close =
            document.createElement("button");

        close.id =
            "galleryLightboxClose";

        close.textContent =
            "×";


        const prev =
            document.createElement("button");

        prev.id =
            "galleryPrev";

        prev.textContent =
            "‹";


        const image =
            document.createElement("img");

        image.id =
            "galleryLightboxImage";


        const next =
            document.createElement("button");

        next.id =
            "galleryNext";

        next.textContent =
            "›";


        const counter =
            document.createElement("div");

        counter.id =
            "galleryLightboxCounter";


        lightbox.appendChild(close);
        lightbox.appendChild(prev);
        lightbox.appendChild(image);
        lightbox.appendChild(next);
        lightbox.appendChild(counter);


        document.body.appendChild(lightbox);


        close.addEventListener(
            "click",
            closeLightbox
        );

        prev.addEventListener(
            "click",
            showPrevious
        );

        next.addEventListener(
            "click",
            showNext
        );


        lightbox.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === lightbox
                ) {

                    closeLightbox();
                }
            }
        );


        /* ALL PHOTOS */

        const allPhotos =
            document.createElement("div");

        allPhotos.id =
            "galleryAllPhotos";


        const allClose =
            document.createElement("button");

        allClose.id =
            "galleryAllPhotosClose";

        allClose.textContent =
            "×";


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


        allPhotos.appendChild(allClose);
        allPhotos.appendChild(title);
        allPhotos.appendChild(grid);


        document.body.appendChild(
            allPhotos
        );


        allClose.addEventListener(
            "click",
            closeAllPhotos
        );
    }


    createGalleryOverlays();


    /* =========================================
       LIGHTBOX
    ========================================= */

    function openLightbox(index) {

        if (
            index < 0 ||
            index >= galleryImages.length
        ) {
            return;
        }


        currentGalleryIndex =
            index;


        const lightbox =
            document.getElementById(
                "galleryLightbox"
            );

        const image =
            document.getElementById(
                "galleryLightboxImage"
            );

        const counter =
            document.getElementById(
                "galleryLightboxCounter"
            );


        image.src =
            galleryImages[index].src;

        image.alt =
            galleryImages[index].title ||
            `Gallery Image ${index + 1}`;


        counter.textContent =
            `${index + 1} / ${galleryImages.length}`;


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


    function showPrevious() {

        if (
            galleryImages.length === 0
        ) {
            return;
        }


        currentGalleryIndex =
            (
                currentGalleryIndex -
                1 +
                galleryImages.length
            ) %
            galleryImages.length;


        openLightbox(
            currentGalleryIndex
        );
    }


    function showNext() {

        if (
            galleryImages.length === 0
        ) {
            return;
        }


        currentGalleryIndex =
            (
                currentGalleryIndex +
                1
            ) %
            galleryImages.length;


        openLightbox(
            currentGalleryIndex
        );
    }


    /* =========================================
       ALL PHOTOS
    ========================================= */

    function openAllPhotos() {

        const overlay =
            document.getElementById(
                "galleryAllPhotos"
            );

        const grid =
            document.getElementById(
                "galleryAllPhotosGrid"
            );


        grid.innerHTML = "";


        galleryImages.forEach(
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


    /* =========================================
       KEYBOARD
    ========================================= */

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

                if (
                    event.key === "ArrowLeft"
                ) {

                    showPrevious();

                } else if (
                    event.key === "ArrowRight"
                ) {

                    showNext();

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


    /* =========================================
       TOUCH SWIPE
    ========================================= */

    let touchStartX = 0;


    document.addEventListener(
        "touchstart",
        function (event) {

            const lightbox =
                document.getElementById(
                    "galleryLightbox"
                );


            if (
                lightbox &&
                lightbox.style.display === "flex" &&
                event.changedTouches.length
            ) {

                touchStartX =
                    event.changedTouches[0].screenX;
            }
        },
        { passive: true }
    );


    document.addEventListener(
        "touchend",
        function (event) {

            const lightbox =
                document.getElementById(
                    "galleryLightbox"
                );


            if (
                !lightbox ||
                lightbox.style.display !== "flex" ||
                !event.changedTouches.length
            ) {
                return;
            }


            const touchEndX =
                event.changedTouches[0].screenX;


            const difference =
                touchEndX - touchStartX;


            if (
                Math.abs(difference) < 50
            ) {
                return;
            }


            if (difference > 0) {

                showPrevious();

            } else {

                showNext();
            }
        },
        { passive: true }
    );


    /* =========================================
       TOP BAR HEIGHT + SCROLL
    ========================================= */

    const topBar =
        document.getElementById("topBar");


    function updateTopBarHeight() {

        if (!topBar) {
            return;
        }


        document.documentElement
            .style
            .setProperty(
                "--topbar-height",
                topBar.offsetHeight + "px"
            );
    }


    function updateScrollState() {

        if (!topBar) {
            return;
        }


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
            updateTopBarHeight
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
        200
    );

});
