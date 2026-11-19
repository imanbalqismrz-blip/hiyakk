function getAnimals() {
    const saved = localStorage.getItem("pawpulseAnimals");
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Error parsing animals:", e);
        }
    }
    return [];
}

function saveAnimals(animals) {
    localStorage.setItem("pawpulseAnimals", JSON.stringify(animals));
}

function updateDashboardStatistics() {
    const animals = getAnimals();

    const totalAnimals = animals.length;
    const availableAnimals = animals.filter(animal => animal.status === "available").length;
    const adoptedAnimals = animals.filter(animal => animal.status === "adopted").length;

    const totalElements = document.querySelectorAll("#totalAnimals, #animalTotal");
    const availableElements = document.querySelectorAll("#availableAnimals, #animalAvailable");
    const adoptedElements = document.querySelectorAll("#adoptedAnimals, #animalAdopted");

    totalElements.forEach(el => el.textContent = totalAnimals);
    availableElements.forEach(el => el.textContent = availableAnimals);
    adoptedElements.forEach(el => el.textContent = adoptedAnimals);
}

function openAddAnimalModal() {
    const form = document.getElementById("animalForm");
    if (form) form.reset();
    
    const animalIdInput = document.getElementById("animalId");
    if (animalIdInput) animalIdInput.value = "";

    const modalTitle = document.getElementById("animalModalTitle");
    if (modalTitle) modalTitle.textContent = "Add New Animal";
}

function editAnimal(index) {
    const animals = getAnimals();
    const animal = animals[index];
    if (!animal) return;

    document.getElementById("animalId").value = index;
    document.getElementById("animalName").value = animal.name;
    document.getElementById("animalSpecies").value = animal.species;
    document.getElementById("animalBreed").value = animal.breed;
    document.getElementById("animalAge").value = animal.age;
    document.getElementById("animalGender").value = animal.gender;
    document.getElementById("animalStatus").value = animal.status;

    document.getElementById("animalModalTitle").textContent = "Edit Animal Details";

    const modalElement = document.getElementById("animalModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
}

function renderAnimalTable(filterText = "", statusFilter = "all") {
    const tableBody = document.getElementById("animalTableBody");
    if (!tableBody) return;

    const animals = getAnimals();
    tableBody.innerHTML = "";

    const filteredAnimals = animals.filter((animal, index) => {
        const animalIdStr = "#A" + (1000 + index);
        const searchString = (animal.name + " " + animal.species + " " + animal.breed + " " + animalIdStr).toLowerCase();
        
        const matchesSearch = searchString.includes(filterText.toLowerCase());
        const matchesStatus = (statusFilter === "all" || animal.status.toLowerCase() === statusFilter.toLowerCase());

        return matchesSearch && matchesStatus;
    });

    const noMsg = document.getElementById("noAnimalsMessage");

    if (filteredAnimals.length === 0) {
        if (noMsg) noMsg.classList.remove("d-none");
        return;
    } else {
        if (noMsg) noMsg.classList.add("d-none");
    }

    filteredAnimals.forEach((animal) => {
        const actualIndex = animals.indexOf(animal);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>#A${1000 + actualIndex}</td>
            <td>${animal.name}</td>
            <td>${animal.species}</td>
            <td>${animal.breed}</td>
            <td>${animal.age}</td>
            <td>${animal.gender}</td>
            <td><span class="badge bg-${animal.status === 'available' ? 'success' : animal.status === 'adopted' ? 'info' : 'secondary'}">${animal.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editAnimal(${actualIndex})">
                    <i class="bi bi-pencil"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    updateDashboardStatistics();
    renderAnimalTable();

    const searchInput = document.getElementById("animalSearch");
    const statusSelect = document.getElementById("statusFilter");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            renderAnimalTable(searchInput.value, statusSelect ? statusSelect.value : "all");
        });
    }

    if (statusSelect) {
        statusSelect.addEventListener("change", function () {
            renderAnimalTable(searchInput ? searchInput.value : "", statusSelect.value);
        });
    }

    const animalForm = document.getElementById("animalForm");
    if (animalForm) {
        animalForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const editIndex = document.getElementById("animalId").value;
            const name = document.getElementById("animalName").value.trim();
            const species = document.getElementById("animalSpecies").value;
            const breed = document.getElementById("animalBreed").value.trim();
            const age = document.getElementById("animalAge").value;
            const gender = document.getElementById("animalGender").value;
            const status = document.getElementById("animalStatus").value;

            const animals = getAnimals();

            if (editIndex !== "") {
                animals[editIndex] = { name, species, breed, age, gender, status };
            } else {
                animals.push({ name, species, breed, age, gender, status });
            }

            saveAnimals(animals);

            const modalElement = document.getElementById("animalModal");
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }

            renderAnimalTable(searchInput ? searchInput.value : "", statusSelect ? statusSelect.value : "all");
            updateDashboardStatistics();
            animalForm.reset();
            document.getElementById("animalId").value = "";
        });
    }
});