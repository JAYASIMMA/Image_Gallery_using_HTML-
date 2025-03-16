const gallery = document.querySelector('.gallery');
const imageUpload = document.getElementById('image-upload');
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const imageTitle = document.getElementById('image-title');
const imageDescription = document.getElementById('image-description');
const fileName = document.getElementById('file-name');
const fileSize = document.getElementById('file-size');
const uploadDate = document.getElementById('upload-date');
const closeButton = document.querySelector('.close-button');
const removeImageButton = document.getElementById('remove-image-button');
const editImageButton = document.getElementById('edit-image-button');
let images = [];
let selectedImageIndex = -1;

// Function to show the modal with image details
function showModal(index) {
    const image = images[index];
    modalImage.src = image.src; // Update the modal image source
    imageTitle.textContent = image.title || "No Title";
    imageDescription.textContent = image.description || "No Description";
    fileName.textContent = image.fileName;
    fileSize.textContent = image.fileSize;
    uploadDate.textContent = image.uploadDate;
    selectedImageIndex = index;
    modal.style.display = "flex";
}

// Function to hide the modal
function hideModal() {
    modal.style.display = "none";
}

// Function to add an image to the gallery
function addImageToGallery(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        // Prompt user for title and description
        const title = prompt("Enter a title for the image:");
        const description = prompt("Enter a description for the image:");

        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        const flipCard = document.createElement('div');
        flipCard.classList.add('flip-card');

        const flipCardFront = document.createElement('div');
        flipCardFront.classList.add('flip-card-front');
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = "Uploaded Image";
        flipCardFront.appendChild(img);

        const flipCardBack = document.createElement('div');
        flipCardBack.classList.add('flip-card-back');
        flipCardBack.innerHTML = `
            <h3>${title || "No Title"}</h3>
            <p>${description || "No Description"}</p>
            <p><strong>File Name:</strong> ${file.name}</p>
            <p><strong>File Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
            <p><strong>Upload Date:</strong> ${new Date().toLocaleString()}</p>
        `;

        flipCard.appendChild(flipCardFront);
        flipCard.appendChild(flipCardBack);
        galleryItem.appendChild(flipCard);
        gallery.appendChild(galleryItem);

        const imageDetails = {
            src: e.target.result,
            fileName: file.name,
            fileSize: `${(file.size / 1024).toFixed(2)} KB`,
            uploadDate: new Date().toLocaleString(),
            title,
            description,
        };

        images.push(imageDetails);

        // Add click event to show modal
        galleryItem.addEventListener('click', () => showModal(images.length - 1));
    };
    reader.readAsDataURL(file);
}

// Handle image upload
imageUpload.addEventListener('change', (event) => {
    const files = event.target.files;
    for (const file of files) {
        if (file.type.startsWith('image/')) {
            addImageToGallery(file);
        }
    }
});

// Close modal when clicking the close button
closeButton.addEventListener('click', hideModal);

// Remove image from gallery
removeImageButton.addEventListener('click', () => {
    if (selectedImageIndex !== -1) {
        gallery.removeChild(gallery.children[selectedImageIndex]);
        images.splice(selectedImageIndex, 1);
        hideModal();
    }
});

// Edit image details
editImageButton.addEventListener('click', () => {
    if (selectedImageIndex !== -1) {
        const newTitle = prompt("Enter new title:", images[selectedImageIndex].title);
        const newDescription = prompt("Enter new description:", images[selectedImageIndex].description);

        if (newTitle !== null && newDescription !== null) {
            images[selectedImageIndex].title = newTitle;
            images[selectedImageIndex].description = newDescription;
            showModal(selectedImageIndex); // Refresh modal with updated details
        }
    }
});