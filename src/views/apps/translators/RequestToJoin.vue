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
          :placeholder="$t('searchTranslators')"
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
        ref="translatorTable"
        :totalPages="Number(dataVal)"
        @page-change="fetching"
        :loading="load"
      >
        <!-- Translator Name Column -->
        <template v-slot:translatorName="{ row: translator }">
          {{ translator.user_name || "N/A" }}
        </template>
        <!-- Nationality Column -->
        <template v-slot:nationality="{ row: translator }">
          {{ translator.nationality || "N/A" }}
        </template>
        <!-- Language Column -->
        <template v-slot:language="{ row: translator }">
          {{ $t(translator.language_code) || "N/A" }}
        </template>
        <!-- Created At Column -->
        <template v-slot:createdAt="{ row: translator }">
          {{ translator.created_at || "N/A" }}
        </template>
        <!-- Approved At Column -->
        <template v-slot:approvedAt="{ row: translator }">
          {{ translator.approved_at || "N/A" }}
        </template>
        <!-- Status Column -->
        <template v-slot:status="{ row: translator }">
          <span
            :class="[
              'badge',
              translator.status === 'approved'
                ? 'badge-success'
                : translator.status === 'rejected'
                  ? 'badge-danger'
                  : 'badge-warning',
            ]"
          >
            {{ translator.status }}
          </span>
        </template>
        <!-- Actions Column -->
        <template v-slot:actions="{ row: translator }">
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
                :to="`/apps/users/user/${translator.id}`"
              >
                {{ $t("view") }}
              </router-link>
            </div>
            <div class="menu-item px-3">
              <a
                @click.prevent="deleteRequest(translator.id)"
                class="menu-link px-3 w-full"
              >
                {{ $t("delete") }}
              </a>
            </div>
            <div class="menu-item px-3">
              <button
                class="menu-link px-3 w-full"
                @click="rejectRequest(translator.id)"
              >
                {{ $t("reject") }}
              </button>
            </div>
            <div class="menu-item px-3">
              <button
                class="menu-link px-3 w-full"
                @click="acceptRequest(translator.id)"
              >
                {{ $t("accept") }}
              </button>
            </div>
          </div>
        </template>
      </Datatable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTableV2.vue";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const dataVal = ref();
const load = ref(false);

const search = ref("");
const tableData = ref([]);
const filteredData = ref([...tableData.value]);
const selectedIds = ref([]);

// Table headers
const tableHeader = ref([
  {
    columnName: "Translator Name",
    columnLabel: "translatorName",
    sortEnabled: true,
    columnWidth: 200,
  },
  {
    columnName: "Nationality",
    columnLabel: "nationality",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "Language",
    columnLabel: "language",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "Created At",
    columnLabel: "createdAt",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "Approved At",
    columnLabel: "approvedAt",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "Status",
    columnLabel: "status",
    sortEnabled: false,
    columnWidth: 150,
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

// Fetch data from the backend
const fetching = async (page = 1) => {
  try {
    load.value = true;

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/translator-requests?page=${page}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", response.status, errorData);
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

// Single Delete Request
const deleteRequest = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to delete this translator request.",
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
        `${import.meta.env.VITE_APP_API_URL_NEW}/translator-requests/${id}`,
        {
          method: "DELETE",
          headers: {
            "X-localization": locale.value,
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", response.status, errorData);
        return;
      }

      // Remove the deleted item from the table
      tableData.value = tableData.value.filter((item) => item.id !== id);
      filteredData.value = filteredData.value.filter((item) => item.id !== id);

      Swal.fire({
        title: "Deleted!",
        text: "The translator request has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  }
};

// Multi-Delete
const multiDelete = async () => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: `You are about to delete ${selectedIds.value.length} translator requests.`,
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
      // Delete all selected items
      await Promise.all(
        selectedIds.value.map((id) =>
          fetch(
            `${import.meta.env.VITE_APP_API_URL_NEW}/translator-requests/${id}`,
            {
              method: "DELETE",
              headers: {
                "X-localization": locale.value,
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            },
          ),
        ),
      );

      // Remove deleted items from the table
      tableData.value = tableData.value.filter(
        (item) => !selectedIds.value.includes(item.id),
      );
      filteredData.value = filteredData.value.filter(
        (item) => !selectedIds.value.includes(item.id),
      );
      selectedIds.value = [];

      Swal.fire({
        title: "Deleted!",
        text: "The selected translator requests have been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    } catch (error) {
      console.error("Error deleting requests:", error);
    }
  }
};

// Accept Request
const acceptRequest = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to approve this translator request.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, approve it!",
    cancelButtonText: "No, cancel!",
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-secondary",
    },
  });

  if (confirmResult.isConfirmed) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/translator-requests/${id}/approved`,
        {
          method: "PATCH",
          headers: {
            "X-localization": locale.value,
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle backend error
        Swal.fire({
          title: "Error!",
          text: data.message || "Failed to approve the request.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: { confirmButton: "btn btn-primary" },
        });
        return;
      }

      console.log("Request approved:", data);
      fetching(); // Refresh the data

      Swal.fire({
        title: "Approved!",
        text: "The translator request has been approved successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    } catch (error) {
      console.error("Error approving request:", error);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred while approving the request.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    }
  }
};

// Reject Request
const rejectRequest = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to reject this translator request.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, reject it!",
    cancelButtonText: "No, cancel!",
    customClass: {
      confirmButton: "btn btn-danger",
      cancelButton: "btn btn-secondary",
    },
  });

  if (confirmResult.isConfirmed) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/translator-requests/${id}/rejected`,
        {
          method: "PATCH",
          headers: {
            "X-localization": locale.value,
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle backend error
        Swal.fire({
          title: "Error!",
          text: data.message || "Failed to reject the request.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: { confirmButton: "btn btn-primary" },
        });
        return;
      }

      console.log("Request rejected:", data);
      fetching(); // Refresh the data

      Swal.fire({
        title: "Rejected!",
        text: "The translator request has been rejected successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred while rejecting the request.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    }
  }
};

// Fetch initial data
fetching();
</script>

<style scoped>
.badge-success {
  background-color: #28a745;
}

.badge-danger {
  background-color: #dc3545;
}

.badge-warning {
  background-color: #ffc107;
}
</style>
