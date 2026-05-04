function renderMain() {
    let html = document.querySelector('.main-container');

    html.innerHTML = `
        <p class="slogan">See yourself in the world of pixels!</p>
        <p class="quick-how-to">Upload an image to convert it into a pixelated-style image.</p>
        <input type="file" id="upload" accept="image/png, image/jpeg, image/jpg" hidden>
        <label for="upload" class="upload-button">Upload Image</label>
    `;

    const fileInput = document.querySelector('#upload');

    fileInput.addEventListener('change', (event) => {
        let uploadedImage = event.target.files[0];

        if (uploadedImage) {
            const objectURL = URL.createObjectURL(uploadedImage);
            previewImage(objectURL);
        }
    });
}


function previewImage(objectURL) {
    let html = document.querySelector('.main-container');

    html.innerHTML = `
        <canvas class="image-canvas-container"></canvas>
        <div class="preview-buttons-container">
            <button class="back-button">Back</button>
            <button class="convert-button">Convert</button>
            <button class="download-button" disabled>Download</button>
        </div>
    `;

    const downloadBtn = document.querySelector('.download-button');
    const canvas = document.querySelector('.image-canvas-container');
    const ctx = canvas.getContext('2d');

    const backBtn = document.querySelector('.back-button');
    const convertBtn = document.querySelector('.convert-button');
    let isPixelated = false;

    convertBtn.addEventListener('click', () => {
    if (isPixelated) return;

    pixelate(canvas, ctx);
    isPixelated = true;

    downloadBtn.disabled = false;
    });

    downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `img2pixel_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    });


    let image = new Image();
    image.src = objectURL;

    image.onload = () => {
    const maxSize = 600;

    let width = image.width;
    let height = image.height;

    // Scale while keeping aspect ratio
    if (width > height) {
        if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
        }
    } else {
        if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
        }
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, 0, 0, width, height);

    URL.revokeObjectURL(objectURL);
    };

    // Back button
    backBtn.addEventListener('click', renderMain);

    // Convert button (PIXELATION HERE)
    convertBtn.addEventListener('click', () => {
        pixelate(canvas, ctx, image);
    });
}

function pixelate(canvas, ctx) {
    const pixelSize = 10;

    const width = canvas.width;
    const height = canvas.height;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = Math.floor(width / pixelSize);
    tempCanvas.height = Math.floor(height / pixelSize);

    // IMPORTANT: use canvas, not image
    tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, width, height);

    ctx.drawImage(
        tempCanvas,
        0, 0, tempCanvas.width, tempCanvas.height,
        0, 0, width, height
    );
}


renderMain()