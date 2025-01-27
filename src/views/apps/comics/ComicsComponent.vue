<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!-- Search Bar -->
      <div class="d-flex align-items-center position-relative my-1">
        <KTIcon
          icon-name="magnifier"
          icon-class="fs-1 position-absolute ms-6"
        />
        <input
          type="text"
          v-model="search"
          @input="debouncedSearch"
          class="form-control form-control-solid w-250px ps-15"
          :placeholder="$t('searchComics')"
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
        <button type="button" class="btn btn-danger" @click="multiDelete">
          {{ $t("deleteSelected") }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="card-body pt-0">
      <Datatable
        @on-items-select="onItemSelect"
        @on-sort="sort"
        :data="filteredData"
        :header="tableHeader"
        :checkbox-enabled="true"
        ref="comicsTable"
        :loading="load"
        :totalPages="Number(dataVal)"
        @page-change="fetching"
      >
        <!-- Image Column -->
        <template v-slot:image="{ row: comic }">
          <img
            :src="comic.image"
            alt="Comic Image"
            class="rounded"
            style="width: 60px; height: 80px"
          />
        </template>
        <!-- Name Column -->
        <template v-slot:name="{ row: comic }">
          {{ comic.name }}
        </template>
        <!-- Year Column -->
        <template v-slot:year="{ row: comic }">
          {{ comic.year }}
        </template>
        <!-- Chapters Column -->
        <template v-slot:chapters="{ row: comic }">
          {{ comic.chapters }}
        </template>
        <!-- Language Column -->
        <template v-slot:language="{ row: comic }">
          {{ languages[comic.language_code]?.lang || comic.language_code }}
        </template>
        <!-- Publisher Column -->
        <template v-slot:publisher="{ row: comic }">
          {{ comic.publisher.name }}
        </template>
        <!-- Genres Column -->
        <template v-slot:genres="{ row: comic }">
          <span
            v-for="genre in comic.genres"
            :key="genre.id"
            class="badge badge-light me-1"
          >
            {{ genre.name[locale] }}
          </span>
        </template>
        <!-- Status Column -->
        <template v-slot:status="{ row: comic }">
          <span
            :class="[
              'badge',
              comic.status === 'ongoing' ? 'badge-success' : 'badge-secondary',
            ]"
          >
            {{ comic.status }}
          </span>
        </template>
        <!-- Actions Column -->
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
            <!-- <div class="menu-item px-3">
              <router-link
                class="menu-link px-3 w-full"
                :to="`/apps/comics/comic/${comic.id}`"
              >
                {{ $t("view") }}
              </router-link>
            </div> -->
            <div class="menu-item px-3">
              <a
                @click.prevent="deleteComic(comic.id)"
                class="menu-link px-3 w-full"
              >
                {{ $t("delete") }}
              </a>
            </div>
            <div class="menu-item px-3">
              <router-link
                :to="`/apps/comics/updateComic/${comic.id}`"
                class="menu-link px-3 w-full"
              >
                {{ $t("edit") }}
              </router-link>
            </div>
          </div>
        </template>
      </Datatable>
    </div>

    
  </div>
</template>
<script setup>
import { ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTableV2.vue";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import EditComicModal from "@/components/modals/forms/EditComicModal.vue";
import { useI18n } from "vue-i18n";
const load = ref(false);
const dataVal = ref()

const { locale } = useI18n();

const languages = {
  ar: { lang: "arabic", code: "ar" },
  en: { lang: "english", code: "en" },
  zh: { lang: "chinese", code: "zh" },
  hi: { lang: "indian", code: "hi" },
  it: { lang: "italian", code: "it" },
  es: { lang: "spanish", code: "es" },
  ru: { lang: "russian", code: "ru" },
  tr: { lang: "turkish", code: "tr" },
  fr: { lang: "french", code: "fr" },
  de: { lang: "german", code: "de" },
};

const search = ref("");
const tableData = ref([]);

const selectedIds = ref([]);
const filteredData = ref([...tableData.value]);
const currentComic = ref(null); // For editing modal

// Table headers
const tableHeader = ref([
  {
    columnName: "Image",
    columnLabel: "image",
    sortEnabled: false,
    columnWidth: 100,
  },
  {
    columnName: "Name",
    columnLabel: "name",
    sortEnabled: true,
    columnWidth: 200,
  },
  {
    columnName: "Year",
    columnLabel: "year",
    sortEnabled: true,
    columnWidth: 100,
  },
  {
    columnName: "Chapters",
    columnLabel: "chapters",
    sortEnabled: true,
    columnWidth: 100,
  },
  {
    columnName: "Language",
    columnLabel: "language",
    sortEnabled: true,
    columnWidth: 120,
  },
  {
    columnName: "Publisher",
    columnLabel: "publisher",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "Genres",
    columnLabel: "genres",
    sortEnabled: false,
    columnWidth: 200,
  },
  {
    columnName: "Status",
    columnLabel: "status",
    sortEnabled: false,
    columnWidth: 120,
  },
  {
    columnName: "Actions",
    columnLabel: "actions",
    sortEnabled: false,
    columnWidth: 150,
  },
]);

// Filter data based on search
const debouncedSearch = debounce(() => {
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    filteredData.value = tableData.value.filter((item) =>
      Object.values(item).some(
        (field) =>
          typeof field === "string" &&
          field.toLowerCase().includes(lowerSearch),
      ),
    );
  } else {
    filteredData.value = [...tableData.value];
  }
}, 300);

// Handle item selection
const onItemSelect = (selectedItems) => {
  selectedIds.value = selectedItems;
};

// Sort table data
const sort = ({ label, order }) => {
  const reverse = order === "desc";
  filteredData.value.sort((a, b) => {
    const valueA = a[label] || "";
    const valueB = b[label] || "";

    return reverse
      ? valueB.localeCompare(valueA)
      : valueA.localeCompare(valueB);
  });
};

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
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/comics/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete comic.");
      }

      // Remove the deleted comic from the table
      filteredData.value = filteredData.value.filter((item) => item.id !== id);
      tableData.value = tableData.value.filter((item) => item.id !== id);

      Swal.fire({
        title: "Deleted!",
        text: "The comic has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    }
  }
};

const multiDelete = async () => {
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
    try {
      // Loop through selected IDs and delete each one
      for (const id of selectedIds.value) {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL_NEW}/comics/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete comic.");
        }
      }

      // Remove the deleted comics from the table
      filteredData.value = filteredData.value.filter(
        (item) => !selectedIds.value.includes(item.id),
      );
      tableData.value = tableData.value.filter(
        (item) => !selectedIds.value.includes(item.id),
      );

      // Clear the selected IDs
      selectedIds.value = [];

      Swal.fire({
        title: "Deleted!",
        text: "The selected comics have been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    }
  }
};

// Update comic
const updateComic = (updatedComic) => {
  const index = tableData.value.findIndex(
    (item) => item.id === updatedComic.id,
  );
  if (index !== -1) {
    tableData.value[index] = { ...updatedComic };
    filteredData.value = [...tableData.value];
  }
};
const fetching = async (page = 1) => {
  try {
    load.value = true;

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/comics?page=${page}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json(); // Parse error response body
      console.error("Error response:", response.status, errorData);
      // if (response.status === 401) {
      //   localStorage.removeItem("authToken");
      //   router.replace("/");
      // }
    }

    const data = await response.json();
    tableData.value = [...data.data.data];
    filteredData.value = [...tableData.value];
    dataVal.value = data.data.meta.total;

    load.value = false;
  } catch (error) {
    load.value = false;
    console.error("Error fetching data:", error);
  }
};

// Fetch initial data
fetching();
</script>

<style scoped>
.badge-success {
  background-color: #28a745;
}

.badge-secondary {
  background-color: #6c757d;
}
</style>
