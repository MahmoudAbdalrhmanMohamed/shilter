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
            :placeholder="$t('searchServices')"
          />
        </div>
      </div>
      <div class="card-toolbar">
        <div
          v-if="!selectedIds.size"
          class="d-flex justify-content-end"
          data-kt-customer-table-toolbar="base"
        >
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_customer"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" /> {{ $t("addService") }}
          </button>
        </div>
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-customer-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.size }}</span>
            {{ $t("selected") }}
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewCustomers"
            aria-label="Delete Selected Services"
          >
            {{ $t("deleteSelected") }}
          </button>
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <Datatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="tableData"
        :header="tableHeader"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        :loading="load"
        :totalPages="Number(dataVal2)"
        @page-change="fetching"
      >
        <template v-if="locale === 'ar'" v-slot:name="{ row: customer }">{{
          customer.name.ar
        }}</template>
        <template v-else v-slot:name="{ row: customer }">{{
          customer.name.en
        }}</template>
        <template v-slot:image="{ row: customer }">{{
          customer.image
        }}</template>
        <template v-slot:actions="{ row: customer }">
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
                data-bs-target="#kt_modal_update_service"
                @click="openEditModal(customer)"
              >
                {{ $t("edit") }}
              </button>
            </div>
            <div class="menu-item px-3">
              <a @click="deleteCustomer(customer.id)" class="menu-link px-3">
                {{ $t("delete") }}
              </a>
            </div>
          </div>
        </template>
      </Datatable>
    </div>
  </div>

  <ExportCustomerModal></ExportCustomerModal>
  <AddCustomerModal @newRow="addNewRow" />
  <UpdateServiceModal
    @updateData="updateData"
    :currentService="currentCustomer"
  />
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Dropdown } from "bootstrap";
import Datatable from "@/components/kt-datatable/KTDataTableV2.vue";
import ExportCustomerModal from "@/components/modals/forms/ExportCustomerModal.vue";
import AddCustomerModal from "@/components/modals/forms/AddCustomerModal.vue";
import UpdateServiceModal from "@/components/modals/forms/UpdateServiceModal.vue";
import { customers, getData, dataVal } from "@/core/data/customers.js";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import debounce from "lodash.debounce";
// import { MenuComponent } from "@/assets/ts/components";

const { locale, t } = useI18n();

const dataVal2 = ref();

const load = ref(false);
const currentCustomer = ref(null);
const selectedIds = ref(new Set());
const search = ref("");
const tableData = ref([]);
const initCustomers = ref([]);

const tableHeader = ref([
  {
    columnName: "servicesName",
    columnLabel: "name",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "photo",
    columnLabel: "image",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "actions",
    columnLabel: "actions",
    sortEnabled: false,
    columnWidth: 150,
  },
]);

const fetching = async (page) => {
  try {
    load.value = true;
    await getData(locale, page);
    tableData.value = [...customers.value];
    initCustomers.value = [...customers.value];
    dataVal2.value = dataVal.value;
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

const openEditModal = (customer) => {
  currentCustomer.value = { ...customer };
};

const updateData = (data) => {

  const index = tableData.value.findIndex(
    (item) => item.id === currentCustomer.value.id,
  );
  if (index !== -1) {
    tableData.value[index] = {
      ...tableData.value[index],
      name: data.name,
      image: data.image || "",
    };
  }
};

const addNewRow = (data) => {
  tableData.value.push({
    id: data.data.id,
    name: data.data.name,
    image: data.data.image,
  });
};

const deleteCustomer = async (id) => {
  const result = await Swal.fire({
    text: t("deleteConfirmationText"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: t("confirmDelete"),
    cancelButtonText: "Cancel",
    customClass: {
      confirmButton: "btn btn-danger",
      cancelButton: "btn btn-secondary",
    },
    buttonsStyling: false,
  });

  if (result.isConfirmed) {
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/services/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();

    if (data.value.status) {
      Swal.fire({
        text: "Service has been successfully deleted!",
        icon: "success",
        confirmButtonText: "Ok, got it!",
        customClass: { confirmButton: "btn btn-primary" },
      });

      tableData.value = tableData.value.filter(
        (customer) => customer.id !== id,
      );
      initCustomers.value = [...tableData.value];
    }
  }
};

const deleteFewCustomers = async () => {
  const result = await Swal.fire({
    text: "Are you sure you want to delete the selected services?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete them!",
    cancelButtonText: "Cancel",
    customClass: {
      confirmButton: "btn btn-danger",
      cancelButton: "btn btn-secondary",
    },
    buttonsStyling: false,
  });

  if (result.isConfirmed) {
    selectedIds.value.forEach(async (id) => {
      await deleteCustomer(id);
    });
    selectedIds.value.clear();
  }
};

const sort = ({ label, order }) => {
  const reverse = order === "desc" ? -1 : 1;
  tableData.value.sort((a, b) => {
    const valA = a[label];
    const valB = b[label];
    if (typeof valA === "number" && typeof valB === "number") {
      return reverse * (valA - valB);
    }
    return reverse * String(valA).localeCompare(String(valB));
  });
};

const debouncedSearch = debounce(() => {
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    tableData.value = initCustomers.value.filter((item) =>
      Object.values(item).some(
        (field) =>
          typeof field === "string" &&
          field.toLowerCase().includes(lowerSearch),
      ),
    );
  } else {
    tableData.value = [...initCustomers.value];
  }
}, 300);

const onItemSelect = (selectedItems) => {
  selectedIds.value = new Set(selectedItems);
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
