<template>
  <p class="my-4 capitalize text-base md:text-2xl font-semibold">
    {{ $t("translated comics") }}
  </p>
  <div :class="`card mb-6 mb-xl-9 ${cardClasses}`">
    <div class="card-header border-0 pt-6">
      <!-- Search Bar -->
      <div class="card-title">
        <div
          class="d-flex align-items-center position-relative my-1"
          :class="locale === 'ar' ? 'flex-row-reverse' : ''"
        >
          <KTIcon
            icon-name="magnifier"
            icon-class="fs-1 position-absolute ms-6"
          />
          <input
            type="text"
            v-model="search"
            @input="debouncedSearch"
            class="form-control form-control-solid w-250px ps-15"
            :placeholder="$t('search comics')"
          />
        </div>
      </div>

      <!-- Toolbar -->
      <div class="card-toolbar">
        <div
          v-if="!selectedIds.length"
          class="d-flex justify-content-end"
          data-kt-customer-table-toolbar="base"
        ></div>
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-customer-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span>
            {{ $t("selected") }}
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteSelectedComics"
          >
            {{ $t("deleteSelected") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card-body pt-0">
      <Datatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="tableData"
        :header="tableHeader"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        ref="pdfTable"
      >
        <!-- Comic Cover -->
        <template v-slot:cover="{ row: comic }">
          <img
            :src="comic.cover"
            alt="Comic Cover"
            class="img-thumbnail"
            style="max-height: 100px; max-width: 80px"
          />
        </template>

        <!-- Comic Description -->
        <template v-slot:description="{ row: comic }">
          {{ comic.description }}
        </template>

        <!-- Publisher -->
        <template v-slot:publisher="{ row: comic }">
          {{ comic.publisher }}
        </template>

        <!-- Genre -->
        <template v-slot:genre="{ row: comic }">
          {{ comic.genre }}
        </template>

        <!-- Artist -->
        <template v-slot:artist="{ row: comic }">
          {{ comic.artist }}
        </template>

        <!-- Writer -->
        <template v-slot:writer="{ row: comic }">
          {{ comic.writer }}
        </template>

        <!-- Status -->
        <template v-slot:status="{ row: comic }">
          <span
            :class="[
              'badge',
              comic.status === 'Approved'
                ? 'badge-success'
                : comic.status === 'Rejected'
                  ? 'badge-danger'
                  : 'badge-warning',
            ]"
          >
            {{ comic.status }}
          </span>
        </template>

        <!-- Actions -->
        <template v-slot:actions="{ row: comic }">
          <a
            href="#"
            class="btn btn-sm btn-light btn-active-light-primary"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ $t("actions") }}
            <KTIcon icon-name="down" icon-class="fs-5 m-0" />
          </a>
          <div
            class="dropdown-menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
            aria-labelledby="dropdownMenuButton"
          >
            <div class="menu-item px-3">
              <button
                type="button"
                class="menu-link px-3 w-full"
                @click="editComic(comic)"
              >
                {{ $t("edit") }}
              </button>
            </div>
            <div class="menu-item px-3">
              <a @click="deleteComic(comic.id)" class="menu-link px-3">
                {{ $t("delete") }}
              </a>
            </div>
          </div>
        </template>
      </Datatable>
    </div>
    <!-- Edit Modal -->
    <EditComicModal
      :comic="currentComic"
      @close="currentComic = null"
      @update-comic="updateComic"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { Dropdown } from "bootstrap";
import { useI18n } from "vue-i18n";
import { Modal } from "bootstrap";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import Datatable from "@/components/kt-datatable/KTDataTableV3.vue";
import EditComicModal from "../../../modals/forms/EditComicModal.vue";

const currentComic = ref();
const selectedIds = ref([]);
const search = ref("");
const tableData = ref([]);
const initComics = ref([]);
const { locale } = useI18n();

const tableHeader = ref([
  {
    columnLabel: "cover",
    columnName: "Comic Cover",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "Description",
    columnLabel: "description",
    sortEnabled: true,
    columnWidth: 200,
  },
  {
    columnName: "Publisher",
    columnLabel: "publisher",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "Genre",
    columnLabel: "genre",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "Artist",
    columnLabel: "artist",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "Writer",
    columnLabel: "writer",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "Status",
    columnLabel: "status",
    sortEnabled: false,
    columnWidth: 100,
  },
  {
    columnName: "Actions",
    columnLabel: "actions",
    sortEnabled: false,
    columnWidth: 120,
  },
]);

const props = defineProps(["socialMedias", "cardClasses"]);
tableData.value = [...props.socialMedias];
initComics.value = [...props.socialMedias];

watch(
  () => props.socialMedias,
  (newData) => {
    tableData.value = [...newData];
    initComics.value = [...tableData.value];
  },
);

// Delete a single comic
const deleteComic = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to delete this comic.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    customClass: {
      confirmButton: "btn btn-danger",
      cancelButton: "btn btn-secondary",
    },
  });

  if (confirmResult.isConfirmed) {
    tableData.value = tableData.value.filter((comic) => comic.id !== id);
    Swal.fire({
      title: "Deleted!",
      text: "The comic has been deleted.",
      icon: "success",
      confirmButtonText: "OK",
      customClass: { confirmButton: "btn btn-primary" },
    });
  }
};

// Delete multiple comics
const deleteSelectedComics = async () => {
  if (!selectedIds.value.length) return;

  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: `You are about to delete ${selectedIds.value.length} comics.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete them!",
    cancelButtonText: "No, cancel!",
    customClass: {
      confirmButton: "btn btn-danger",
      cancelButton: "btn btn-secondary",
    },
  });

  if (confirmResult.isConfirmed) {
    tableData.value = tableData.value.filter(
      (comic) => !selectedIds.value.includes(comic.id),
    );
    selectedIds.value = [];
    Swal.fire({
      title: "Deleted!",
      text: "The selected comics have been deleted.",
      icon: "success",
      confirmButtonText: "OK",
      customClass: { confirmButton: "btn btn-primary" },
    });
  }
};

// Search functionality
const debouncedSearch = debounce(() => {
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    tableData.value = initComics.value.filter((comic) =>
      Object.values(comic).some(
        (field) =>
          typeof field === "string" &&
          field.toLowerCase().includes(lowerSearch),
      ),
    );
  } else {
    tableData.value = [...initComics.value];
  }
}, 300);

const onItemSelect = (selectedItems) => {
  selectedIds.value = selectedItems;
};

const sort = ({ label, order }) => {
  const reverse = order === "desc";

  tableData.value.sort((a, b) => {
    const valA = a[label] || "";
    const valB = b[label] || "";

    return reverse ? valB.localeCompare(valA) : valA.localeCompare(valB);
  });
};

onMounted(() => {
  const dropdownElements = document.querySelectorAll(
    '[data-bs-toggle="dropdown"]',
  );
  dropdownElements.forEach((element) => {
    new Dropdown(element);
  });
});

// Edit Comic Function
const editComic = (comic) => {
  currentComic.value = { ...comic };

  const modalElement = document.getElementById("kt_modal_edit_comic");
  if (modalElement) {
    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.show();

    // Add cleanup to reset form on modal close
    modalElement.addEventListener("hidden.bs.modal", () => {
      currentComic.value = null;
    });
  } else {
    console.log("no");
  }
};

// Update Comic in Table
const updateComic = (updatedComic) => {
  const index = tableData.value.findIndex(
    (comic) => comic.id === updatedComic.id,
  );
  if (index !== -1) {
    tableData.value[index] = { ...updatedComic };
  }
};

// Close Modal Function
const closeModal = () => {
  const modalElement = document.getElementById("kt_modal_edit_comic");
  if (modalElement) {
    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.hide();
  }
};
</script>
