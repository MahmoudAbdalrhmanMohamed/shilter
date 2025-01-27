<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <div class="d-flex align-items-center position-relative my-1">
          <KTIcon
            icon-name="magnifier"
            icon-class="fs-1 position-absolute ms-6"
          />
          <input
            type="text"
            v-model="search"
            @input="searchItems"
            class="form-control form-control-solid w-250px ps-15"
            placeholder="Search Brands"
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
            data-bs-target="#kt_modal_add_brand"
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
      >
        <template v-slot:name="{ row: brand }">{{ brand.name }}</template>
        <template v-slot:models="{ row: brand }">
          <span
            v-for="(model, index) in brand.models"
            :key="model.name"
            :class="modelBadgeClass(index)"
            class="m-2 flex w-fit"
          >
            {{ model.name }}
          </span>
        </template>
        <template v-slot:years="{ row: brand }">
          <div class="my-2" v-for="(model, index) in brand.models" :key="index">
            <span
              v-for="(year, idx) in model.years"
              :key="idx"
              :class="yearBadgeClass(index)"
              class="mx-2 w-16 inline-block text-center"
            >
              {{ year.value }}
            </span>
          </div>
        </template>

        <template v-slot:actions="{ row: brand }">
          <a
            href="#"
            class="btn btn-sm btn-light btn-active-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="top-end"
          >
            {{ $t("actions") }}
            <KTIcon icon-name="down" icon-class="fs-5 m-0" />
          </a>
          <div
            class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
            data-kt-menu="true"
          >
            <div class="menu-item px-3">
              <button
                type="button"
                class="menu-link px-3 w-full"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_update_brand"
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
  <UpdateBrandModal :currentBrand="currentBrand" @updateData="updateData" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ExportCustomerModal from "@/components/modals/forms/ExportCustomerModal.vue";
import AddBrandModal from "@/components/modals/forms/AddBrandModal.vue";
import UpdateBrandModal from "@/components/modals/forms/UpdateBrandModalName.vue";
import brands from "@/core/data/brands.js";
import arraySort from "array-sort";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();

const currentBrand = ref(null);
const selectedIds = ref([]);
const search = ref("");
const tableData = ref([...brands]);
const initialBrands = ref([...brands]);

const tableHeader = ref([
  {
    columnName: "brandName",
    columnLabel: "name",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "models",
    columnLabel: "models",
    sortEnabled: true,
    columnWidth: 250,
  },
  {
    columnName: "years",
    columnLabel: "years",
    sortEnabled: true,
    columnWidth: 230,
  },

  {
    columnName: "actions",
    columnLabel: "actions",
    sortEnabled: false,
    columnWidth: 135,
  },
]);

const badgeClasses = [
  "badge-primary",
  "badge-secondary",
  "badge-success",
  "badge-danger",
  "badge-warning",
  "badge-info",
];

// const fetching = async () => {
//   try {
//     await getData(locale);
//     tableData.value = [...brands.value];
//     initialBrands.value = [...brands.value];
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };

// // Fetching directly without onMounted
// fetching(); // Directly calling the function

// // Watch for locale changes and re-fetch data if needed
// watch(locale, async () => {
//   await fetching();
// });

const modelBadgeClass = (index) => badgeClasses[index % badgeClasses.length];
const yearBadgeClass = (index) => badgeClasses[index % badgeClasses.length];

onMounted(() => {
  initialBrands.value = [...tableData.value];
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

const deleteSelectedBrands = () => {
  selectedIds.value.forEach(deleteBrand);
  selectedIds.value = [];
};

const deleteBrand = (id) => {
  tableData.value = tableData.value.filter((item) => item.id !== id);
  initialBrands.value = initialBrands.value.filter((item) => item.id !== id);
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
    name: locale.value === "ar" ? newData.nameAr : newData.nameEn,
    models: newData.models.map((model) => {
      return {
        name: locale.value === "ar" ? model.nameAr : model.nameEn,
        years: model.years.map((year) => year),
      };
    }),
    id: Math.floor(Math.random() * 99999) + 1,
  };

  tableData.value.push(newBrand);
  initialBrands.value.push(newBrand);
};

const updateData = (updatedData) => {
  tableData.value.some((el) => {
    if (el.id === currentBrand.value.id) {
      el.name = locale.value === "ar" ? updatedData.nameAr : updatedData.nameEn;

      el.models = updatedData.models.map((model) => {
        return {
          name: locale.value === "ar" ? model.nameAr : model.nameEn,
          years: model.years.map((yearObj) => ({ year: yearObj.year })),
        };
      });
      return true;
    }
  });
};
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
