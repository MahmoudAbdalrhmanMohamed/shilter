<template>
  <p class="my-4 capitalize text-base md:text-2xl font-semibold">
    {{ $t("socials medias") }}
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
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="tableData"
        :header="tableHeader"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        ref="pdfTable"
      >
        <template v-slot:platform="{ row: user }">
          {{ user.platform }}
        </template>
        <template v-slot:url="{ row: user }">
          {{ user.url }}
        </template>

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
                data-bs-target="#kt_modal_update_workshop_socials"
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
    </div>
  </div>
  <UpdateWorkshopSocialsModal
    @updateData="updateData"
    :currentUser="currentUser"
  />
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import { Dropdown } from "bootstrap";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import Datatable from "@/components/kt-datatable/KTDataTableV3.vue";
import UpdateWorkshopSocialsModal from "@/components/modals/forms/UpdateWorkshopSocialsModal.vue";

const currentUser = ref();
const selectedIds = ref([]);
const search = ref("");
const tableData = ref([]);
const initCustomers = ref([]);
const { locale } = useI18n();

const tableHeader = ref([
  {
    columnName: "Platform",
    columnLabel: "platform",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "Url",
    columnLabel: "url",
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

const props = defineProps(["socialMedias", "cardClasses"]);
tableData.value = [...props.socialMedias];
initCustomers.value = [...props.socialMedias];

watch(
  () => props.socialMedias,
  (newData) => {
    tableData.value = [...newData];
    initCustomers.value = [...tableData.value];
  },
);

// Delete a single customer
const deleteCustomer = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to delete this socials.",
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
      await useFetch(
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/workshop/socials/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      ).json();

      tableData.value = tableData.value.filter(
        (customer) => customer.id !== id,
      );
      initCustomers.value = initCustomers.value.filter(
        (customer) => customer.id !== id,
      );

      Swal.fire({
        title: "Deleted!",
        text: "The socials has been deleted.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });
    } catch (error) {
      console.error("Error deleting socials:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the socials. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-danger",
        },
      });
    }
  }
};

// Delete multiple customers
const deleteSelectedCustomers = async () => {
  if (!selectedIds.value.length) return;

  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: `You are about to delete ${selectedIds.value.length} socials.`,
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
          useFetch(
            `${import.meta.env.VITE_APP_API_URL_MEGATRON}/workshop/socials/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            },
          ),
        ),
      );

      tableData.value = tableData.value.filter(
        (customer) => !selectedIds.value.includes(customer.id),
      );
      initCustomers.value = initCustomers.value.filter(
        (customer) => !selectedIds.value.includes(customer.id),
      );

      Swal.fire({
        title: "Blocked!",
        text: "The selected customers have been Blocked.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });
      selectedIds.value = [];
    } catch (error) {
      console.error("Error Blocked selected users:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete some customers. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-danger",
        },
      });
    }
  }
};

const openEditModal = (user) => {
  currentUser.value = user ? { ...user } : null;
};

const updateData = (updatedUser) => {
  const index = tableData.value.findIndex(
    (user) => user.id === currentUser.value.id,
  );
  if (index !== -1) {
    tableData.value[index].url = updatedUser.url;
  }
  currentUser.value = null;
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
  selectedIds.value = selectedItems;
};

const sort = ({ label, order }) => {
  const reverse = order === "desc";

  tableData.value.sort((a, b) => {
    const valA = a[label] || ""; // Default to an empty string if undefined
    const valB = b[label] || ""; // Default to an empty string if undefined

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
</script>
