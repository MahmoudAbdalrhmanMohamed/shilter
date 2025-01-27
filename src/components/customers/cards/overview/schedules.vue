<template>
  <p class="my-4 capitalize text-base md:text-2xl font-semibold">
    {{ $t("schedule") }}
  </p>
  <div :class="['card', cardClasses]">
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
            :placeholder="$t('search')"
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
            @click="deleteSelectedBrands"
          >
            {{ $t("deleteSelected") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card-body pt-0">
      <Datatable
        v-if="tableData.length"
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="tableData"
        :header="tableHeader"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        ref="pdfTable"
      >
        <!-- Services Slot -->
        <template v-slot:services="{ row: user }">
          {{ user.day_week }}
        </template>
        <template v-slot:opening_time="{ row: user }">
          {{ user.opening_time }}
        </template>
        <template v-slot:closing_time="{ row: user }">
          {{ user.closing_time }}
        </template>
        <!-- Actions Slot -->
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
                data-bs-target="#kt_modal_update_schedule"
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
          </div>
        </template>
      </Datatable>

      <!-- Empty State -->
      <div v-else class="text-center py-5">
        <h5>{{ $t("noData") }}</h5>
      </div>
    </div>
  </div>

  <!-- Update Socials Modal -->
  <schedulesModal @updateData="updateData" :currentUser="currentUser" />
</template>

<script setup>
import { ref } from "vue";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import schedulesModal from "@/components/modals/forms/schedulesModal.vue";
import { useFetch } from "@vueuse/core";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();

// Props

const currentUser = ref();
const selectedIds = ref([]);
const search = ref("");
const tableData = ref([]);
const initCustomers = ref([]);

const props = defineProps(["cardClasses", "schedule"]);

tableData.value = [...props.schedule];
initCustomers.value = [...props.schedule];

// Table Headers
const tableHeader = ref([
  { columnName: "Working Days", columnLabel: "services", sortEnabled: true },
  {
    columnName: "Opening Time",
    columnLabel: "opening_time",
    sortEnabled: true,
  },
  {
    columnName: "Closing Time",
    columnLabel: "closing_time",
    sortEnabled: true,
  },
  { columnName: "Actions", columnLabel: "actions", sortEnabled: false },
]);

// Search Functionality
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
  selectedIds.value = selectedItems;
};

// Delete Customer
const deleteCustomer = async (id) => {
  const confirmed = await Swal.fire({
    title: "Delete this customer?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete!",
  });
  if (confirmed.isConfirmed) {
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/workshops/schedules/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    if (data.value.status) {
      tableData.value = tableData.value.filter(
        (customer) => customer.id !== id,
      );
      Swal.fire("Deleted!", "The customer was removed.", "success");
    }
  }
};
const deleteSelectedBrands = () => {
  selectedIds.value.forEach(deleteBrand);
  selectedIds.value = [];
};

const sort = ({ label, order }) => {
  const reverse = order === "desc";

  tableData.value.sort((a, b) => {
    const aValue = a[label] || ""; // Default to an empty string if undefined/null
    const bValue = b[label] || ""; // Default to an empty string if undefined/null

    // Ensure we are comparing strings
    if (typeof aValue === "string" && typeof bValue === "string") {
      return reverse
        ? bValue.localeCompare(aValue)
        : aValue.localeCompare(bValue);
    }

    // For non-string types, perform a basic comparison
    if (aValue > bValue) return reverse ? -1 : 1;
    if (aValue < bValue) return reverse ? 1 : -1;
    return 0;
  });
};
// Open Edit Modal
const openEditModal = (user) => {
  currentUser.value = { ...user };
};

// Update Data
const updateData = (updatedUser) => {
  const index = tableData.value.findIndex((user) => user.id === updatedUser.id);
  if (index !== -1) tableData.value[index] = updatedUser;
};
</script>
