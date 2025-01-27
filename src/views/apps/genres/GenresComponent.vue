<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!-- Search Bar -->
      <div
        :class="locale === 'ar' ? 'flex-row-reverse' : ''"
        class="d-flex align-items-center position-relative my-1"
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
          :placeholder="$t('searchGenres')"
        />
      </div>

      <!-- Toolbar -->
      <div class="card-toolbar">
        <div
          v-if="!selectedIds.length"
          class="d-flex justify-content-end"
          data-kt-customer-table-toolbar="base"
        >
          <router-link
            :to="{ name: 'apps-genres-add' }"
            class="btn btn-primary"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ $t("addGenre") }}
          </router-link>
        </div>
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
            @click="deleteSelectedGenres"
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
        :enable-items-per-page-dropdown="false"
        :checkbox-enabled="true"
        checkbox-label="id"
        ref="pdfTable"
        :loading="load"
        :totalPages="Number(dataVal)"
        @page-change="fetching"
      >
        <!-- Name Column -->
        <template v-slot:name="{ row: genre }">{{
          genre.name[locale]
        }}</template>
        <!-- Slug Column -->
        <template v-slot:slug="{ row: genre }">{{
          genre.slug[locale]
        }}</template>
        <!-- Created At Column -->
        <template v-slot:created_at="{ row: genre }">
          {{ new Date(genre.created_at).toLocaleString() }}
        </template>
        <!-- Updated At Column -->
        <template v-slot:updated_at="{ row: genre }">
          {{ new Date(genre.updated_at).toLocaleString() }}
        </template>
        <!-- Actions Column -->
        <template v-slot:actions="{ row: genre }">
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
              <router-link
                class="menu-link px-3 w-full"
                :to="`/apps/genres/updateGenre/${genre.id}`"
              >
                {{ $t("edit") }}
              </router-link>
            </div>
            <div class="menu-item px-3">
              <a @click="deleteGenre(genre.id)" class="menu-link px-3">{{
                $t("delete")
              }}</a>
            </div>
          </div>
        </template>
      </Datatable>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { Dropdown } from "bootstrap";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import Datatable from "@/components/kt-datatable/KTDataTableV2.vue";

const dataVal = ref();

const load = ref(false);
const selectedIds = ref([]);
const search = ref("");
const tableData = ref([]);
const initGenres = ref([]);
const { locale } = useI18n();

const fetching = async (page = 1) => {
  try {
    load.value = true;

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/genres?page=${page}`,
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
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        router.replace("/");
      }
    }

    const data = await response.json();
    tableData.value = [...data.data.data];
    initGenres.value = [...tableData.value];
    dataVal.value = data.data.meta.total;

    load.value = false;
  } catch (error) {
    load.value = false;
    console.error("Error fetching data:", error);
  }
};

// Fetch initial data
fetching();

// Watch locale and refetch data on change
watch(
  () => locale.value,
  () => fetching(),
);

// Table header configuration
const tableHeader = ref([
  {
    columnName: "name",
    columnLabel: "name",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "slug",
    columnLabel: "slug",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "created_at",
    columnLabel: "created_at",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "updated_at",
    columnLabel: "updated_at",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "actions",
    columnLabel: "actions",
    sortEnabled: false,
    columnWidth: 100,
  },
]);

// Delete a single genre
const deleteGenre = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to delete this genre.",
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
      await useFetch(`${import.meta.env.VITE_APP_API_URL_NEW}/genres/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      tableData.value = tableData.value.filter((genre) => genre.id !== id);
      initGenres.value = initGenres.value.filter((genre) => genre.id !== id);

      Swal.fire({
        title: "Deleted!",
        text: "The genre has been deleted.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    } catch (error) {
      console.error("Error deleting genre:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the genre. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-danger" },
      });
    }
  }
};

// Delete multiple genres
const deleteSelectedGenres = async () => {
  if (!selectedIds.value.length) return;

  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: `You are about to delete ${selectedIds.value.length} genres.`,
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
      await Promise.all(
        selectedIds.value.map((id) =>
          useFetch(`${import.meta.env.VITE_APP_API_URL_NEW}/genres/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
        ),
      );

      tableData.value = tableData.value.filter(
        (genre) => !selectedIds.value.includes(genre.id),
      );
      initGenres.value = initGenres.value.filter(
        (genre) => !selectedIds.value.includes(genre.id),
      );

      Swal.fire({
        title: "Deleted!",
        text: "The selected genres have been deleted.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
      selectedIds.value = [];
    } catch (error) {
      console.error("Error deleting selected genres:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete some genres. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-danger" },
      });
    }
  }
};

// Debounced search
const debouncedSearch = debounce(() => {
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    tableData.value = initGenres.value.filter((item) =>
      Object.values(item).some(
        (field) =>
          typeof field === "string" &&
          field.toLowerCase().includes(lowerSearch),
      ),
    );
  } else {
    tableData.value = [...initGenres.value];
  }
}, 300);

// Handle item selection
const onItemSelect = (selectedItems) => {
  selectedIds.value = selectedItems;
};

// Sort table data
const sort = ({ label, order }) => {
  const reverse = order === "desc";
  tableData.value.sort((a, b) => {
    const valueA = a[label] || "";
    const valueB = b[label] || "";

    return reverse
      ? valueB.localeCompare(valueA)
      : valueA.localeCompare(valueB);
  });
};

// Initialize dropdowns
onMounted(() => {
  const dropdownElements = document.querySelectorAll(
    '[data-bs-toggle="dropdown"]',
  );
  dropdownElements.forEach((element) => {
    new Dropdown(element);
  });
});
</script>
