let works = [];
let categories = [];


const topBarContainer = document.querySelector(".top-bar-container");
const projectTitleContainer = document.querySelector(
  ".project-title-container"
);
const modalContainer = document.querySelector(".modal-container");
const token = localStorage.getItem("token");
const getCategories = async () => {
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
      categories = data;
      if (!token) {
        displayCategories();
      }
     
    });
};

const getWorks = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      works = data;
      displayWorks(0);
    });
};

const builder = async () => {
  await getCategories();
  await getWorks();
};

builder();


/**boutton filtre */

const displayCategories = () => {
  let filteredCategories = [...categories];
  filteredCategories.push({
    id: 0,
    name: "Tous",
  });
  filteredCategories.sort((a, b) => a.id - b.id);
  const filtre = document.querySelector(".filtre");
  filtre.innerHTML = "";
  for (let i = 0; i < filteredCategories.length; i++) {
    const button = document.createElement("button");
    if (filteredCategories[i].id === 0) {
      button.className = "btn-filtre-active button-filter";
    } else {
      button.className = "btn-filtre button-filter";
    }

    button.addEventListener("click", () =>
      displayWorks(filteredCategories[i].id)
    );
    button.innerHTML = filteredCategories[i].name;
    filtre.appendChild(button);
  }
};

const displayWorks = (categoryId) => {
  console.log(categoryId);
  const buttonFilter = document.getElementsByClassName("button-filter");

  for (let i = 0; i < buttonFilter.length; i++) {
    if (i === categoryId) {
      buttonFilter[i].className = "btn-filtre-active button-filter";
    } else {
      buttonFilter[i].className = "btn-filtre button-filter";
    }
  }

  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  let worksList = [];
  if (categoryId === 0) {
    worksList = [...works];
  } else {
    worksList = works.filter((work) => work.categoryId === categoryId);
  }

  worksList.forEach((work) => {
    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    gallery.appendChild(imgElement);
  });
};



const logoutUser = () => {
  localStorage.removeItem("token");
  window.location.href = "./index.html";
};

/*** generer la premiere modale***/


const generateModalFirstContent = () => {
  const modal = document.querySelector(".modal");
  modal.innerHTML = "";

  const title = document.createElement("h2");
  title.innerHTML = "Galerie photo";
  title.className = "modal-maintitle";
  const buttonBar = document.createElement("div");
  buttonBar.className = "button-bar";

  const button = document.createElement("button");
  button.innerHTML = "Ajouter une photo";
  button.classList.add("button-modal");
  button.addEventListener("click", generateModalSecondContent);

  modal.appendChild(title);

  const gallery = document.createElement("div");
  gallery.className = "gallery-modal";
  works.forEach((work) => {
    const imgContainer = document.createElement("div");
    imgContainer.className = "img-container";

    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;

    const deleteWork = async () => {
      console.log(work.id);

      fetch("http://localhost:5678/api/works/" + work.id, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then(async (response) => {
        if (response.ok) {
          await getWorks();
          generateModalFirstContent();
        }
      });
    };
    const trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash";
    trashIcon.addEventListener("click", deleteWork);

    imgContainer.appendChild(imgElement);
    imgContainer.appendChild(trashIcon);
    gallery.appendChild(imgContainer);
  });

  const xMark = document.createElement("i");
  xMark.className = "fa-solid fa-xmark xMark";
  xMark.addEventListener("click", () => {
    const modalContent = document.querySelector(".modal-content");
    if (modalContent) {
      modalContent.remove();
    }
  });
  buttonBar.appendChild(button);
  modal.appendChild(gallery);
  modal.appendChild(xMark);
  modal.appendChild(buttonBar);
};

/*** generer la seconde modale***/

const generateModalSecondContent = () => {
  const modal = document.querySelector(".modal");
  modal.innerHTML = "";

  const title = document.createElement("h2");
  title.innerHTML = "Ajout photo";
  title.classList.add("modal-maintitle");

  const previousButton = document.createElement("i");
  previousButton.innerHTML = "";
  previousButton.className = "fa-solid fa-arrow-left previousButton";
  previousButton.addEventListener("click", generateModalFirstContent);

  const xMark = document.createElement("i");
  xMark.className = "fa-solid fa-xmark xMark";
  xMark.addEventListener("click", () => {
    const modalContent = document.querySelector(".modal-content");
    if (modalContent) {
      modalContent.remove();
    }
  });

  const buttonBar = document.createElement("div");
  buttonBar.className = "button-bar";

  const pictureDiv = document.createElement("label");
  pictureDiv.htmlFor = "inputPicture";
  pictureDiv.className = "picture-div";   

  const iconPicture = document.createElement("i");
  iconPicture.className = "fa-regular fa-image fa-5x";

  const buttonModalSecondContent = document.createElement("div");
  buttonModalSecondContent.classList.add("button-modal-second");
  buttonModalSecondContent.innerHTML = "+ Ajouter photo";

  const infoElement = document.createElement("p");
  infoElement.classList.add("info-element");
  infoElement.innerHTML = "jpg, png : 4mo max";

  const secondTitle = document.createElement("label");
  secondTitle.innerHTML = "Titre";

  const firstInput = document.createElement("input");

  const thirdTitle = document.createElement("label");
  thirdTitle.innerHTML = "Catégorie";

  const categoryInput = document.createElement("select");
  for (let i = 0; i < categories.length; i++) {
    const option = document.createElement("option");
    option.value = categories[i].id;
    option.innerHTML = categories[i].name;
    categoryInput.appendChild(option);
  }
  const dropdownIcon = document.createElement("i");
  dropdownIcon.className = "fa-solid fa-chevron-down";

  const inputWrapper = document.createElement("div");
  inputWrapper.appendChild(categoryInput);

  const button = document.createElement("button");
  button.innerHTML = "Valider";
  button.classList.add("button-modal-disable");

  const fileInput = document.createElement("input");
  fileInput.id = "inputPicture";
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.className = "display-none";

  buttonModalSecondContent.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    let selectedFile = event.target.files[0];
    if (selectedFile.type !== "image/jpeg" && selectedFile.type !== "image/png" && selectedFile.type !== "image/jpg")
      {
       return alert("Le fichier n'est pas du type jpeg ou png")
      }
      else if (selectedFile.size > 4000000)
      {
     return alert("La photo est supérieur à 4 mo")
      }
    else if (selectedFile) {
      iconPicture.style.display = "none";
      const previewImage = document.createElement("img");
      previewImage.src = URL.createObjectURL(selectedFile);
      previewImage.classList.add("preview-image");
      pictureDiv.appendChild(previewImage);
      buttonModalSecondContent.style.display = "none";
      infoElement.style.display = "none";
    }
    if (firstInput.value && selectedFile) {
      button.className = "button-modal";
    } else {
      button.className = "button-modal-disable";
    }
  });
  firstInput.addEventListener("change", (event) => {
    let selectedFile = fileInput.files[0];
    console.log(selectedFile);
    console.log(firstInput.value);
    if (firstInput.value && selectedFile) {
      button.className = "button-modal";
    } else {
      button.className = "button-modal-disable";
    }
  });
  const addWork = async () => {
    let selectedFile = fileInput.files[0];
    if (!firstInput.value || !selectedFile) {
      alert("Veuillez remplir tous les champs.");
    } else {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("title", firstInput.value);
      formData.append("category", categoryInput.value);
      fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
        body: formData,
      }).then(async (response) => {
        if (response.ok) {
          await getWorks();
          generateModalSecondContent();
        }
      });
    }
  };

  button.addEventListener("click", addWork);

  pictureDiv.appendChild(iconPicture);
  pictureDiv.appendChild(infoElement);

  buttonBar.appendChild(button);

  modal.appendChild(fileInput);
  modal.appendChild(title);
  modal.appendChild(previousButton);
  modal.appendChild(xMark);
  modal.appendChild(pictureDiv);
  modal.appendChild(secondTitle);
  modal.appendChild(firstInput);
  modal.appendChild(thirdTitle);
  modal.appendChild(inputWrapper);
  modal.appendChild(buttonBar);
  pictureDiv.appendChild(buttonModalSecondContent);
};

const generateModal = () => {
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  const modal = document.createElement("div");

  modal.className = "modal";
  modalContent.appendChild(modal);

  modalContainer.appendChild(modalContent);
  generateModalFirstContent();
};

/*** Action a réaliser en présence d'un token lors de la connection***/

if (token) {
  const topBar = document.createElement("div");
  topBar.className = "top-bar";
  const iconTopBar = document.createElement("i");
  iconTopBar.className = "fa-regular fa-pen-to-square";
  const text = document.createElement("span");
  text.innerHTML = "Mode édition";
  topBar.appendChild(iconTopBar);
  topBar.appendChild(text);
  topBarContainer.appendChild(topBar);

  const authButton = document.querySelector(".auth-button");
  authButton.innerHTML = "";
  const logoutButton = document.createElement("a");
  logoutButton.innerHTML = "logout";
  logoutButton.addEventListener("click", logoutUser);
  authButton.appendChild(logoutButton);

  const editButton = document.createElement("a");
  const buttonText = document.createElement("span");
  const icon = document.createElement("i");
  icon.className = "fa-regular fa-pen-to-square icon";
  buttonText.innerHTML = "Modifier";
  editButton.appendChild(icon);
  editButton.appendChild(buttonText);
  editButton.addEventListener("click", generateModal);
  projectTitleContainer.appendChild(editButton);
}
