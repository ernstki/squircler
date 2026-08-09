// Global variables
let uploadedImage = null;
let currentRadius = 20;
let currentPadding = 0;

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const controlsSection = document.getElementById('controlsSection');
const downloadSection = document.getElementById('downloadSection');
const radiusSlider = document.getElementById('radiusSlider');
const paddingSlider = document.getElementById('paddingSlider');
const presetRadios = document.querySelectorAll('input[name="presetMode"]');
const radiusValue = document.getElementById('radiusValue');
const paddingValue = document.getElementById('paddingValue');
const downloadBtn = document.getElementById('downloadBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Event listeners
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
radiusSlider.addEventListener('input', handleRadiusChange);
paddingSlider.addEventListener('input', handlePaddingChange);
downloadBtn.addEventListener('click', downloadImage);

presetRadios.forEach(radio => {
    radio.addEventListener('change', handlePresetModeChange);
});

// File upload handlers
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    if (!file.type.match(/image\/(png|jpg|jpeg|webp)/)) {
        alert('Please select a valid image file (PNG, JPG, or WebP)');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImage = new Image();
        uploadedImage.onload = function() {
            showPreview();
        };
        uploadedImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function showPreview() {
    previewImage.src = uploadedImage.src;
    previewSection.classList.remove('hidden');
    controlsSection.classList.remove('hidden');
    downloadSection.classList.remove('hidden');
    updateSquircle();
}

// Control handlers
function handleRadiusChange(e) {
    currentRadius = parseFloat(e.target.value);
    radiusValue.textContent = currentRadius + '%';
    
    // If user manually moves slider, switch radio to Custom
    const customRadio = document.querySelector('input[name="presetMode"][value="custom"]');
    if (!customRadio.checked) {
        customRadio.checked = true;
    }
    
    updateSquircle();
}

function handlePaddingChange(e) {
    currentPadding = parseFloat(e.target.value);
    paddingValue.textContent = currentPadding + '%';
    
    // If user manually moves slider, switch radio to Custom
    const customRadio = document.querySelector('input[name="presetMode"][value="custom"]');
    if (!customRadio.checked) {
        customRadio.checked = true;
    }
    
    updateSquircle();
}

function handlePresetModeChange(e) {
    const mode = e.target.value;
    if (mode === 'linux') {
        radiusSlider.disabled = true;
        paddingSlider.disabled = true;
        setRadiusValue(20);
        setPaddingValue(10);
    } else if (mode === 'macos') {
        radiusSlider.disabled = true;
        paddingSlider.disabled = true;
        setRadiusValue(22.5);
        setPaddingValue(12.5);
    } else {
        radiusSlider.disabled = false;
        paddingSlider.disabled = false;
        setRadiusValue(parseFloat(radiusSlider.value));
        setPaddingValue(parseFloat(paddingSlider.value));
    }
}

function setRadiusValue(val) {
    currentRadius = val;
    radiusSlider.value = val;
    radiusValue.textContent = val + '%';
    updateSquircle();
}

function setPaddingValue(val) {
    currentPadding = val;
    paddingSlider.value = val;
    paddingValue.textContent = val + '%';
    updateSquircle();
}

function updateSquircle() {
    if (!uploadedImage) return;

    const borderRadius = currentRadius + '%';

    previewImage.style.borderRadius = borderRadius;

    // Use scale to simulate the transparent padding around the image
    // so it doesn't break the border-radius on the image itself.
    const scaleValue = 1 - (currentPadding / 100);
    previewImage.style.transform = `scale(${scaleValue})`;
    previewImage.style.padding = '0';
}

// Download functionality
function downloadImageOld() {
    if (!uploadedImage) return;

    // Calculate dimensions
    const maxSize = 800;
    let { width, height } = uploadedImage;

    if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width *= ratio;
        height *= ratio;
    }

    const paddingPx = Math.min(width, height) * (currentPadding / 100);
    const canvasWidth = width + (paddingPx * 2);
    const canvasHeight = height + (paddingPx * 2);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Create squircle path
    const x = paddingPx;
    const y = paddingPx;
    const radius = Math.min(width, height) * (currentRadius / 100);

    ctx.save();
    ctx.beginPath();
    createSquirclePath(ctx, x, y, width, height, radius);
    ctx.clip();

    // Draw image
    ctx.drawImage(uploadedImage, x, y, width, height);
    ctx.restore();

    // Download
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "squircle-image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, "image/png");
}

function downloadImage() {
  if (!uploadedImage) return;

  // --- draw to canvas (same logic as before) ---
  const maxSize = 800;
  let { width, height } = uploadedImage;
  if (width > maxSize || height > maxSize) {
    const ratio = Math.min(maxSize / width, maxSize / height);
    width *= ratio;
    height *= ratio;
  }

  const paddingPx = Math.min(width, height) * (currentPadding / 100);
  const canvasWidth = Math.round(width + paddingPx * 2);
  const canvasHeight = Math.round(height + paddingPx * 2);

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const x = paddingPx;
  const y = paddingPx;
  const radius = Math.min(width, height) * (currentRadius / 100);

  ctx.save();
  ctx.beginPath();
  createSquirclePath(ctx, x, y, width, height, radius);
  ctx.clip();
  ctx.drawImage(uploadedImage, x, y, width, height);
  ctx.restore();

  // --- get blob and then try native save via window.__TAURI__ ---
  canvas.toBlob(async function (blob) {
    if (!blob) {
      alert('Failed to create image');
      return;
    }

    // Try Tauri global shim (no bundler)
    try {
      if (window.__TAURI__ && window.__TAURI__.dialog && window.__TAURI__.fs && window.__TAURI__.path) {

        let fullDefaultPath = 'squircle-image.png';
        try {
          const pathApi = window.__TAURI__.path;
          let baseDir;

          // Try multiple standard directories in case Downloads is missing
          const dirsToTry = ['downloadDir', 'desktopDir', 'documentDir', 'pictureDir'];
          for (const dirFn of dirsToTry) {
            try {
              if (typeof pathApi[dirFn] === 'function') {
                baseDir = await pathApi[dirFn]();
                if (baseDir) break; // Found a valid directory!
              }
            } catch (e) {
              // Ignore and try the next directory
            }
          }

          if (baseDir) {
            fullDefaultPath = await pathApi.join(baseDir, 'squircle-image.png');
          }
        } catch (e) {
          console.warn("Could not resolve standard folders, falling back to default OS behavior", e);
        }

        // show native Save dialog
        const saveOptions = {
          defaultPath: fullDefaultPath,
          filters: [{ name: 'PNG', extensions: ['png'] }]
        };

        // Some shim versions return undefined on cancel; use that to abort
        const path = await window.__TAURI__.dialog.save(saveOptions);
        if (!path) return; // cancelled

        const arrayBuffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        if (typeof window.__TAURI__.fs.writeFile === 'function') {
          await window.__TAURI__.fs.writeFile(path, bytes);
          return;
        }

        throw new Error('No suitable fs write function found on '
                        + 'window.__TAURI__.fs');
      }
    } catch (err) {
      // If anything fails, we'll fall back to browser download below.
      // Use DevTools console to inspect `err` if you need details.
      // eslint-disable-next-line no-console
      console.warn('Tauri native save failed or not present, falling '
                   + 'back to browser download:', err);
    }

    // --- Final fallback: classic anchor download (browser) ---
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'squircle-image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

function createSquirclePath(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);

    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// Prevent the browser from navigating if user drops a file outside the drop target
window.addEventListener('dragover', (e) => {
  e.preventDefault();
});

window.addEventListener('drop', (e) => {
  e.preventDefault();
  // If they drop directly onto the uploadArea your existing uploadArea.drop listener will run.
  // This catches drops that land elsewhere (or in case platform routes the event to window).
  const files = e.dataTransfer && e.dataTransfer.files;
  if (files && files.length > 0) {
    // Use the first file, or adapt to multiple files like your existing code
    handleFile(files[0]);
  }
});

// Tauri Native Drag and Drop Handling
console.log("Checking for Tauri global:", window.__TAURI__);

if (window.__TAURI__ && window.__TAURI__.event) {
  console.log("Tauri event API found, registering drag-and-drop listeners...");

  window.__TAURI__.event.listen('tauri://drag-over', () => {
    uploadArea.classList.add('dragover');
  });

  window.__TAURI__.event.listen('tauri://drag-leave', () => {
    uploadArea.classList.remove('dragover');
  });

  // Note: In Tauri v2, the event is 'tauri://drag-drop'
  window.__TAURI__.event.listen('tauri://drag-drop', async (e) => {
    console.log("Tauri drag-drop event fired!", e);
    uploadArea.classList.remove('dragover');

    const paths = e.payload?.paths || e.payload;
    if (paths && paths.length > 0) {
      const filePath = paths[0];
      console.log("File dropped:", filePath);

      const lowerPath = filePath.toLowerCase();
      if (!lowerPath.match(/\.(png|jpg|jpeg|webp)$/)) {
        alert('Please select a valid image file (PNG, JPG, or WebP)');
        return;
      }

      try {
        console.log("Attempting to read file via Tauri FS...");
        const bytes = await window.__TAURI__.fs.readFile(filePath);
        console.log("File read successfully, bytes:", bytes.length);

        let mimeType = 'image/png';
        if (lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg')) mimeType = 'image/jpeg';
        else if (lowerPath.endsWith('.webp')) mimeType = 'image/webp';

        const blob = new Blob([bytes], { type: mimeType });
        const url = URL.createObjectURL(blob);

        uploadedImage = new Image();
        uploadedImage.onload = function() {
          showPreview();
          URL.revokeObjectURL(url);
        };
        uploadedImage.src = url;
      } catch (err) {
        console.error('Failed to read dropped file via Tauri FS:', err);
        alert('Failed to read the dropped file. Check console for details.');
      }
    }
  });
} else {
  console.warn("Tauri global or event API not found. Native drag-and-drop won't work.");
}
