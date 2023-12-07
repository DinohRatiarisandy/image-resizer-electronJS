const divToInput = document.getElementById("add-img");
const inputFile = document.getElementById("input-img");
const resizeInfo = document.getElementById("resize-informations");
const fileName = document.getElementById("file-name");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const outputPath = document.getElementById("output-path");
const form = document.querySelector("form");

divToInput.addEventListener("click", function() {
    inputFile.click();
});

form.addEventListener("submit", sendImage);

inputFile.addEventListener("change", function() {
    const selectedFile = inputFile.files[0];

    if (!isFileImage(selectedFile)) notification("Please select an image", "error");
    else {
        // Get original dimension
        const image = new Image();
        image.src = URL.createObjectURL(selectedFile);
        image.onload = function() {
            widthInput.value = this.width;
            heightInput.value = this.height;
        }

        resizeInfo.style.display = "block";
        fileName.innerText = selectedFile.name;
        outputPath.innerText = path.join(os.homedir(), 'imageresizer')
    }
})

// Make sure file is image
function isFileImage(file) {
    const acceptedImageTypes = ["image/gif", "image/png", "image/jpeg"];
    return file && acceptedImageTypes.includes(file['type']);
}

// Notifications
function notification(message, type="success") {
    const options = {
        text: message,
        duration: 2500,
    }

    switch (type) {
        case "success":
            options.style = {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                color: "white"
            }
            break;
            case "error":
                options.style = {
                background: "linear-gradient(135deg, #FF5733, #B22222)",
                color: "white"
            }
            break;
    }
    Toastify.toast(options);
}

// Send image data to main
function sendImage(e) {
    e.preventDefault();

    const width = widthInput.value;
    const height = heightInput.value;
    const imagePath = inputFile.files[0];
    
    if (!inputFile.files[0]) {
        notification("Please upload an image", "error");
        return;
    }

    if (width === "" || height === "") {
        notification("Please fill in width and height", "error")
        return;
    }

    // Get the file path
    const filePath = imagePath.path;

    // Send to main using ipcRenderer
    ipcRenderer.send("image:resize", {
        imagePath: filePath,
        width,
        height
    })
}

// Catch the image:done even
ipcRenderer.on("image:done", function () {
    notification(`Image resized to ${widthInput.value} x ${heightInput.value}`, "success")
})