<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
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
            @input="searchItems"
            class="form-control form-control-solid w-250px ps-15"
            :placeholder="$t('searchYears')"
          />
        </div>
      </div>
      <div class="card-toolbar">
        <div
          v-if="!selectedIds.length"
          class="d-flex justify-content-end"
          data-kt-customer-table-toolbar="base"
        >
          <button
            type="button"
            class="btn btn-light-primary me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_customers_export_modal"
          >
            <KTIcon icon-name="exit-up" icon-class="fs-2" /> {{ $t("export") }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_year"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" /> {{$t('addYear')}}
          </button>
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
            @click="deleteSelectedBrands"
          >
            {{ $t("deleteSelected") }}
          </button>
        </div>
      </div>
    </div>

    <div class="card-body pt-0">
      <Datatable
        @on-sort="sortTable"
        @on-items-select="onItemSelect"
        :data="tableData"
        :header="tableHeader"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
      >
        <template v-slot:name="{ row: brand }">{{ brand.year }}</template>

        <template v-slot:actions="{ row: brand }">
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
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_update_year"
                @click="openEditModal(brand)"
              >
                {{ $t("edit") }}
              </button>
            </div>
            <div class="menu-item px-3">
              <a @click="deleteBrand(brand.id)" class="menu-link px-3">{{
                $t("delete")
              }}</a>
            </div>
          </div>
        </template>
      </Datatable>
    </div>
  </div>

  <ExportCustomerModal />
  <AddYearModal @data="addNewBrand" />
  <UpdateYearModal :currentBrand="currentBrand" @updateData="updateData" />
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { Dropdown } from "bootstrap";

import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ExportCustomerModal from "@/components/modals/forms/ExportCustomerModal.vue";
import AddYearModal from "@/components/modals/forms/AddYearModal.vue";
import UpdateYearModal from "@/components/modals/forms/UpdateYearModal.vue";
import arraySort from "array-sort";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import Swal from "sweetalert2";

const { locale } = useI18n();

const currentBrand = ref(null);
const selectedIds = ref([]);
const search = ref("");
const tableData = ref([]);
const initialBrands = ref([]);

const tableHeader = ref([
  {
    columnName: "modelName",
    columnLabel: "name",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "actions",
    columnLabel: "actions",
    sortEnabled: false,
    columnWidth: 135,
  },
]);

const fetching = async () => {
  try {
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/years`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    tableData.value = [...data.value.data];
    initialBrands.value = [...data.value.data];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Fetching directly without onMounted
fetching();

// Watch for locale changes and re-fetch data if needed
watch(locale, async () => {
  await fetching();
});

const searchItems = () => {
  tableData.value = initialBrands.value.filter((item) => {
    return Object.values(item).some((field) =>
      typeof field === "string"
        ? field.toLowerCase().includes(search.value.toLowerCase())
        : false,
    );
  });
};

const deleteSelectedBrands = async () => {
  if (!selectedIds.value.length) {
    Swal.fire({
      text: "No years selected!",
      icon: "warning",
      confirmButtonText: "OK",
      customClass: { confirmButton: "btn btn-warning" },
    });
    return;
  }

  const confirmation = await Swal.fire({
    text: `Are you sure you want to delete ${selectedIds.value.length} years?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
    customClass: {
      confirmButton: "btn btn-danger",
      cancelButton: "btn btn-secondary",
    },
  });

  if (!confirmation.isConfirmed) return;

  try {
    await Promise.all(
      selectedIds.value.map((id) =>
        useFetch(`${import.meta.env.VITE_APP_API_URL_MEGATRON}/years/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }).json(),
      ),
    );

    // Update UI
    tableData.value = tableData.value.filter(
      (item) => !selectedIds.value.includes(item.id),
    );
    initialBrands.value = initialBrands.value.filter(
      (item) => !selectedIds.value.includes(item.id),
    );

    Swal.fire({
      text: "Selected years deleted successfully!",
      icon: "success",
      confirmButtonText: "OK",
      customClass: { confirmButton: "btn btn-primary" },
    });

    selectedIds.value = [];
  } catch (error) {
    Swal.fire({
      text: error.message || "An error occurred while deleting years.",
      icon: "error",
      confirmButtonText: "Try Again",
      customClass: { confirmButton: "btn btn-danger" },
    });
  }
};

const sortTable = (sortData) => {
  const reverse = sortData.order === "desc";
  arraySort(tableData.value, sortData.label, { reverse });
};

const onItemSelect = (selectedItems) => {
  selectedIds.value = selectedItems;
};

const openEditModal = (brand) => {
  currentBrand.value = { ...brand };
};

const addNewBrand = (newData) => {
  tableData.value.push(newData);
  initialBrands.value.push(newData);
};

const updateData = (updatedData) => {
  tableData.value.some((el) => {
    if (el.id === currentBrand.value.id) {
      el.name = updatedData.year;
      return true;
    }
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
</script>

<style scoped>
.badge-primary {
  background-color: #0d6efd;
  color: #fff;
  padding: 0.2em 0.4em;
  border-radius: 0.2em;
}
.badge-secondary {
  background-color: #6c757d;
  color: #fff;
  padding: 0.2em 0.4em;
  border-radius: 0.2em;
}
.badge-success {
  background-color: #198754;
  color: #fff;
  padding: 0.2em 0.4em;
  border-radius: 0.2em;
}
.badge-danger {
  background-color: #dc3545;
  color: #fff;
  padding: 0.2em 0.4em;
  border-radius: 0.2em;
}
.badge-warning {
  background-color: #ffc107;
  color: #212529;
  padding: 0.2em 0.4em;
  border-radius: 0.2em;
}
.badge-info {
  background-color: #0dcaf0;
  color: #212529;
  padding: 0.2em 0.4em;
  border-radius: 0.2em;
}
</style>
