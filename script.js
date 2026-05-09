function renderMain() {
    let html = document.querySelector('.main-container');

    html.innerHTML = `
        <h1 class="slogan">See yourself in the world of pixels!</h1>
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

        <div class="loader-overlay hidden">
        <div class="loader"></div>
            <p>Converting image...</p>
        </div>

        <canvas class="image-canvas-container"></canvas>
        
        <div class="preview-buttons-container">
            <button class="back-button">Back</button>
            <button class="convert-button">Convert</button>
        </div>
    `;
    
    const canvas = document.querySelector('.image-canvas-container');
    const ctx = canvas.getContext('2d');

    const backBtn = document.querySelector('.back-button');
    const convertBtn = document.querySelector('.convert-button');
    let isPixelated = false;

    convertBtn.addEventListener('click', () => {
        const loader = document.querySelector('.loader-overlay');

        loader.classList.remove('hidden');

        // Allow browser to render loader first
        setTimeout(() => {

        pixelate(canvas, ctx);

        loader.classList.add('hidden');

        let buttonsHTML = document.querySelector('.preview-buttons-container');

        buttonsHTML.innerHTML = `
            <div class="preview-buttons-container">
                <button class="download-button">Download</button>
                <button class="next-button">Next</button>
            </div>
        `;

        const downloadBtn = document.querySelector('.download-button');

        downloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            
            link.download = `img2pixel_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });

        const nextBtn = document.querySelector('.next-button');
        nextBtn.addEventListener('click', renderMain);
    }, 100);
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
    const pixelSize = 16;

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

function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
} 

/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu*/
function burgerMenuButton() {
    const menu = document.querySelector(".myLinks");
    menu.classList.toggle("show");
}

// Close menu when a nav link is clicked
document.querySelectorAll(".myLinks a").forEach(link => {
    link.addEventListener("click", () => {
        const menu = document.querySelector(".myLinks");
        menu.classList.remove("show");
    });
});

renderMain()