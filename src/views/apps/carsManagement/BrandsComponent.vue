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
            @input="debouncedSearch"
            class="form-control form-control-solid w-250px ps-15"
            :placeholder="$t('searchBrands')"
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
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_brand_name"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" /> {{ $t("addBrand") }}
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
        :loading="load"
        :totalPages="Number(dataVal)"
        @page-change="fetching"
      >
        <template v-if="locale === 'ar'" v-slot:name="{ row: brand }">{{
          brand.name.ar
        }}</template>
        <template v-else v-slot:name="{ row: brand }">{{
          brand.name.en
        }}</template>

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
                data-bs-target="#kt_modal_update_brand_name"
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
  <AddBrandModal @data="addNewBrand" />
  <UpdateBrandModalName :currentBrand="currentBrand" @updateData="updateData" />
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { Dropdown } from "bootstrap";

import Datatable from "@/components/kt-datatable/KTDataTableV2.vue";
import ExportCustomerModal from "@/components/modals/forms/ExportCustomerModal.vue";
import AddBrandModal from "@/components/modals/forms/AddBrandModalName.vue";
import UpdateBrandModalName from "@/components/modals/forms/UpdateBrandModalName.vue";
import arraySort from "array-sort";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import Swal from "sweetalert2";
import debounce from "lodash.debounce";
const { locale, t } = useI18n();

const load = ref(false);

const dataVal = ref();

const currentBrand = ref(null);
const selectedIds = ref([]);
const search = ref("");
const tableData = ref([]);
const initialBrands = ref([]);
const initCustomers = ref([]);

const tableHeader = ref([
  {
    columnName: "brandName",
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

const fetching = async (page) => {
  try {
    load.value = true;
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/brands?page=${page}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();

    tableData.value = [...data.value.data.data];
    initialBrands.value = [...tableData.value];
    initCustomers.value = [...initialBrands.value];
    dataVal.value = data.value.data.meta.total;

    load.value = false;
  } catch (error) {
    load.value = false;

    console.error("Error fetching data:", error);
  }
};

// Fetching directly without onMounted
fetching(1); // Directly calling the function

// Watch for locale changes and re-fetch data if needed
watch(locale, async () => {
  await fetching(1);
});

const debouncedSearch = debounce(() => {
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    tableData.value = initCustomers.value.filter((brand) => {
      const nameAr = brand.name?.ar?.toLowerCase() || "";
      const nameEn = brand.name?.en?.toLowerCase() || "";
      return nameAr.includes(lowerSearch) || nameEn.includes(lowerSearch);
    });
  } else {
    tableData.value = [...initCustomers.value];
  }
}, 300);

const deleteSelectedBrands = async () => {
  const result = await Swal.fire({
    title: t("deleteMultipleConfirmationTitle"),
    text: t("deleteMultipleConfirmationText", {
      count: selectedIds.value.length,
    }),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: t("confirmDelete"),
    cancelButtonText: t("cancel"),
    customClass: {
      confirmButton: "btn btn-danger",
      cancelButton: "btn btn-secondary",
    },
  });

  if (result.isConfirmed) {
    for (const id of selectedIds.value) {
      await useFetch(
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/brands/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
    }
    tableData.value = tableData.value.filter(
      (item) => !selectedIds.value.includes(item.id),
    );
    initialBrands.value = initialBrands.value.filter(
      (item) => !selectedIds.value.includes(item.id),
    );
    selectedIds.value = [];
    Swal.fire({
      text: t("deleteMultipleSuccess"),
      icon: "success",
      confirmButtonText: t("okGotIt"),
      customClass: { confirmButton: "btn btn-primary" },
    });
  }
};

const deleteBrand = async (id) => {
  const result = await Swal.fire({
    title: t("deleteConfirmationTitle"),
    text: t("deleteConfirmationText"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: t("confirmDelete"),
    cancelButtonText: t("cancel"),
    customClass: {
      confirmButton: "btn btn-danger",
      cancelButton: "btn btn-secondary",
    },
  });

  if (result.isConfirmed) {
    await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/brands/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    tableData.value = tableData.value.filter((item) => item.id !== id);
    initialBrands.value = initialBrands.value.filter((item) => item.id !== id);
    Swal.fire({
      text: t("deleteSuccessMessage"),
      icon: "success",
      confirmButtonText: t("okGotIt"),
      customClass: { confirmButton: "btn btn-primary" },
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
  const newBrand = {
    name: {
      ar: newData.name.ar,
      en: newData.name.en,
    },
    id: newData.id,
  };

  tableData.value.push(newBrand);
  initialBrands.value.push(newBrand);
};

const updateData = (updatedData) => {
  tableData.value.some((el) => {
    if (el.id === currentBrand.value.id) {
      el.name = updatedData.name;
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

<!-- :totalPages="Number(dataVal)"
        @page-change="fetching" -->
