<template>
  <p class="my-4 capitalize text-base md:text-2xl font-semibold">
    {{ $t("models") }}
  </p>
  <div :class="`card mb-6 mb-xl-9 ${cardClasses}`">
    <div class="card-header border-0 pt-6">
      <!-- Search Bar -->
      <div class="card-title">
        <div
          class="flex items-center relative my-1"
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
            :placeholder="$t('searchModels')"
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
            @click="deleteSelectedCustomers"
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
          {{ user.model }}
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
                data-bs-target="#kt_modal_update_worksop_model"
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
  <UpdateWorkshopModelModal
    @updateData="updateData"
    :currentUser="currentUser"
  />
</template>

<script setup>
import { ref, watch } from "vue";
import debounce from "lodash.debounce";
import { useI18n } from "vue-i18n";
import Swal from "sweetalert2";
import Datatable from "@/components/kt-datatable/KTDataTableV3.vue";
import UpdateWorkshopModelModal from "@/components/modals/forms/UpdateWorkshopModelModal.vue";
import { useFetch } from "@vueuse/core";

const currentUser = ref();
const selectedIds = ref([]);
const search = ref("");
const tableData = ref([]);
const initCustomers = ref([]);
const { locale } = useI18n();

const emit = defineEmits(["newChnage"]);

const props = defineProps({
  models: {
    type: Array,
    default: () => [], // Default to an empty array if not provided
  },
  cardClasses: {
    type: String,
    default: "",
  },
});

tableData.value = [...props.models];
initCustomers.value = [...tableData.value];

watch(
  () => props.models,
  (newData) => {
    tableData.value = [...newData];
    initCustomers.value = [...tableData.value];
  },
);

// Table Headers
const tableHeader = ref([
  { columnName: "Car Models", columnLabel: "services", sortEnabled: true },
  { columnName: "Actions", columnLabel: "actions", sortEnabled: false },
]);

const onItemSelect = (selectedItems) => {
  selectedIds.value = selectedItems;
};
const deleteSelectedCustomers = () => {
  selectedIds.value.forEach(deleteCustomer);
  selectedIds.value = [];
};

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

// Delete Customer
const deleteCustomer = async (id) => {
  const confirmed = await Swal.fire({
    title: "Delete this model?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete!",
  });

  if (confirmed.isConfirmed) {
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/workshop/models/${id}`,
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
      Swal.fire("Deleted!", "The model was removed.", "success");
    }
  }
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
const updateData = () => {
  emit("newChnage");
};
</script>
