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
            :placeholder="$t('search')"
          />
        </div>
      </div>

      <div class="card-toolbar">
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-customer-table-toolbar="base"
        >
          <!-- <button
            type="button"
            class="btn btn-light-primary me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_customers_export_modal"
          >
            <KTIcon icon-name="exit-up" icon-class="fs-2" />
            {{ $t("export") }}
          </button> -->
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_package"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ $t("addPackage") }}
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
            @click="deleteFewCustomers"
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
        ref="pdfTable"
        :loading="load"
        :totalPages="Number(dataVal)"
        @page-change="fetching"
      >
        <template v-slot:name="{ row: user }" v-if="locale === 'ar'">{{
          user.name.ar
        }}</template>
        <template v-slot:name="{ row: user }" v-else>{{
          user.name.en
        }}</template>

        <template v-slot:subscriptions="{ row: user }">{{
          user.subscriptions
        }}</template>

        <template v-slot:actions="{ row: user }">
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
                data-bs-target="#kt_modal_update_package"
                @click="openEditModal(user)"
              >
                {{ $t("edit") }}
              </button>
            </div>

            <div class="menu-item px-3">
              <a @click="deleteCustomer(user.id)" class="menu-link px-3">{{
                $t("delete")
              }}</a>
            </div>
            <div class="menu-item px-3">
              <router-link
                class="menu-link px-3"
                :to="`/apps/packages/package/${user.id}`"
                >{{ $t("view") }}
              </router-link>
            </div>
          </div>
        </template>
      </Datatable>
    </div>
  </div>

  <ExportCustomerModal />
  <AddPackageModal @newRow="addNewRow" />
  <UpdatePackageModal @updateData="updateData" :currentPackage="currentUser" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTableV2.vue";
import ExportCustomerModal from "@/components/modals/forms/ExportCustomerModal.vue";
import AddPackageModal from "@/components/modals/forms/AddPackageModal.vue";
import UpdatePackageModal from "@/components/modals/forms/UpdatePackageModal.vue";
import arraySort from "array-sort";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MenuComponent } from "@/assets/ts/components";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import { Dropdown } from "bootstrap";

const load = ref(false);

const dataVal = ref();

const { locale } = useI18n();
const currentUser = ref(null);
const selectedIds = ref([]);
const search = ref("");
const tableData = ref([]);
const initCustomers = ref([]);

// Fetch customers
const fetching = async (page) => {
  try {
    load.value = true;

    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/packages`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    tableData.value = [...data.value.data.data];
    initCustomers.value = [...tableData.value];
    dataVal.value = data.value.data.meta.total;

    load.value = false;
  } catch (error) {
    load.value = false;

    console.error("Error fetching data:", error);
  }
};

// Fetch initial data
fetching(1);

// Watch locale and refetch data on change

const tableHeader = ref([
  {
    columnName: "name",
    columnLabel: "name",
    sortEnabled: true,
    columnWidth: 175,
  },

  {
    columnName: "subscriptions",
    columnLabel: "subscriptions",
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

const openEditModal = (user) => {
  currentUser.value = { ...user };
};

const deleteFewCustomers = async () => {
  if (!selectedIds.value.length) return;

  // Show confirmation dialog
  const confirmed = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete them!",
    cancelButtonText: "Cancel",
  });

  if (confirmed.isConfirmed) {
    // Execute deletion for selected customers
    await Promise.all(selectedIds.value.map((id) => deleteCustomer(id)));

    // Clear the selected IDs
    selectedIds.value = [];

    // Success message
    Swal.fire("Deleted!", "Selected items have been deleted.", "success");
  }
};

const deleteCustomer = async (id) => {
  // Show confirmation dialog
  const confirmed = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (confirmed.isConfirmed) {
    try {
      const { data } = await useFetch(
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/packages/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      ).json();

      if (data.value.status) {
        // Update table data after successful deletion
        tableData.value = tableData.value.filter(
          (customer) => customer.id !== id,
        );
        initCustomers.value = initCustomers.value.filter(
          (customer) => customer.id !== id,
        );

        // Show success message
        Swal.fire("Deleted!", "The customer has been deleted.", "success");
      } else {
        // Handle failure
        Swal.fire(
          "Error!",
          "Failed to delete the customer. Please try again.",
          "error",
        );
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the customer.",
        "error",
      );
    }
  }
};

const searchItems = () => {
  if (search.value) {
    const lowerSearchValue = search.value.toLowerCase();

    tableData.value = initCustomers.value.filter((item) => {
      // Check if the search value matches the name (ar or en)
      const matchesName =
        (item.name?.ar &&
          item.name.ar.toLowerCase().includes(lowerSearchValue)) ||
        (item.name?.en &&
          item.name.en.toLowerCase().includes(lowerSearchValue));

      // Check if the search value matches subscriptions (numeric comparison)
      const matchesSubscriptions =
        item.subscriptions !== null && // Ensure subscriptions is not null
        item.subscriptions.toString().includes(lowerSearchValue);

      return matchesName || matchesSubscriptions; // Match either condition
    });
  } else {
    // Reset to initial data when search is cleared
    tableData.value = [...initCustomers.value];
  }

  // Reinitialize the dropdown menu
  MenuComponent.reinitialization();
};

const sort = (sortData) => {
  const reverse = sortData.order === "desc";
  arraySort(tableData.value, sortData.label, { reverse });
};

const onItemSelect = (selectedItems) => {
  selectedIds.value = selectedItems;
};

const addNewRow = (data) => {
  const newUser = {
    id: data.id,
    name: data.name,
    subscriptions: data.subscriptions,
  };
  tableData.value.push(newUser);
  initCustomers.value.push(newUser);
};

// Update function to use updatedUser data directly
const updateData = (updatedUser) => {
  const index = tableData.value.findIndex(
    (user) => user.id === currentUser.value.id,
  );
  if (index !== -1) {
    tableData.value[index].name.ar = updatedUser.name.ar;
    tableData.value[index].name.en = updatedUser.name.en;
  }
  currentUser.value = null; // Reset after update
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
