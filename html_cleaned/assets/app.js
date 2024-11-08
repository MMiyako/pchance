document.querySelectorAll(".imageCtn").forEach((container) => {
    const imageWrapper = container.querySelector(".imageWrapper");
    const image = container.querySelector("img");

    image.addEventListener("click", () => {
        // Check if an overlay already exists, and remove it if it does
        const existingOverlay = container.querySelector(".overlay");

        if (existingOverlay) {
            existingOverlay.remove();
            return;
        }

        // Create a new overlay
        const overlay = document.createElement("div");
        overlay.className = "overlay";

        // Create overlay content
        const overlayContent = document.createElement("div");
        overlayContent.className = "overlay-content";

        // Close the overlay when clicking outside of the overlay content
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });

        // Get data attributes
        const dataId = container.getAttribute("data-image-id");
        const dataGuidanceScale = container.getAttribute("data-guidance-scale");
        const dataSeed = container.getAttribute("data-seed");
        const dataPrompt = container.getAttribute("data-prompt");
        const dataNegativePrompt = container.getAttribute("data-negative-prompt");

        // Image ID
        const id = createElement(
            "div",
            { className: "id" },
            createElement("div", {}, dataId),
            createCopyButton(dataId),
        );

        // Scale
        const scale = createElement(
            "div",
            { className: "scale" },
            createElement("label", {}, "Scale"),
            createElement("div", {}, ": " + dataGuidanceScale),
            createCopyButton(dataGuidanceScale),
        );

        // Seed
        const seed = createElement(
            "div",
            { className: "seed" },
            createElement("label", {}, "Seed"),
            createElement("div", {}, ": " + dataSeed),
            createCopyButton(dataSeed),
        );

        // Prompt
        const prompt = createElement(
            "div",
            { className: "prompt" },
            createElement(
                "div",
                { className: "header" },
                createElement("label", {}, "Prompt"),
                createCopyButton(dataPrompt),
            ),
            createElement("textarea", { value: dataPrompt }),
        );

        // Negative Prompt
        const negativePrompt = createElement(
            "div",
            { className: "prompt" },
            createElement(
                "div",
                { className: "header" },
                createElement("label", {}, "Negative Prompt"),
                createCopyButton(dataNegativePrompt),
            ),
            createElement("textarea", { value: dataNegativePrompt }),
        );

        overlayContent.appendChild(id);
        overlayContent.appendChild(scale);
        overlayContent.appendChild(seed);
        overlayContent.appendChild(prompt);
        overlayContent.appendChild(negativePrompt);

        overlay.appendChild(overlayContent);

        imageWrapper.appendChild(overlay);
    });
});

function showFlashMessage(message) {
    const flashMessage = document.createElement("div");
    flashMessage.className = "flash-message";
    flashMessage.textContent = message;

    document.body.appendChild(flashMessage);

    setTimeout(() => {
        flashMessage.remove();
    }, 2000);
}

const createElement = (tag, attributes = {}, ...children) => {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach((key) => {
        element[key] = attributes[key];
    });
    children.forEach((child) => {
        if (typeof child === "string") {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    return element;
};

const createCopyButton = (text) => {
    const button = document.createElement("button");
    button.className = "copy-button";
    button.textContent = "Copy";
    button.onclick = () => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                showFlashMessage("Copied to clipboard");
            })
            .catch((err) => {
                console.error("Could not copy text: ", err);
            });
    };
    return button;
};
