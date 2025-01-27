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
          :placeholder="$t('searchUsers')"
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
        ref="usersTable"
        :totalPages="Number(dataVal)"
        @page-change="fetchUsers"
        :loading="load"
      >
        <!-- Photo Column -->
        <template v-slot:photo="{ row: user }">
          <img
            :src="user.image"
            alt="User Photo"
            class="rounded-circle"
            style="width: 40px; height: 40px"
          />
        </template>
        <!-- Name Column -->
        <template v-slot:name="{ row: user }">
          {{ user.username }}
        </template>
        <!-- Email Column -->
        <template v-slot:email="{ row: user }">
          {{ user.email }}
        </template>
        <!-- Role Column -->
        <template v-slot:role="{ row: user }">
          {{ user.role }}
        </template>
        <!-- Status Column -->
        <template v-slot:status="{ row: user }">
          <span
            :class="[
              'badge',
              user.is_verified ? 'badge-success' : 'badge-secondary',
            ]"
          >
            {{ user.is_verified ? "Verified" : "Not Verified" }}
          </span>
        </template>
        <!-- Actions Column -->
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
              <router-link
                class="menu-link px-3 w-full"
                :to="
                  user.role === 'user'
                    ? `/apps/users/userNormal/${user.id}`
                    : `/apps/translators/translator/${user.id}`
                "
              >
                {{ $t("view") }}
              </router-link>
            </div>
            <div class="menu-item px-3">
              <a
                @click.prevent="deleteUser(user.id)"
                class="menu-link px-3 w-full"
              >
                {{ $t("delete") }}
              </a>
            </div>
            <!-- <div class="menu-item px-3">
              <button
                type="button"
                class="menu-link px-3 w-full"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_edit_user"
                @click="editUser(user)"
              >
                {{ $t("edit") }}
              </button>
            </div> -->
          </div>
        </template>
      </Datatable>
    </div>

    <!-- Edit Modal -->
    <EditUserModal
      :user="currentUser"
      @close="currentUser = null"
      @update-user="updateUser"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTableV2.vue";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import EditUserModal from "@/components/modals/forms/EditUserModal.vue";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();

const load = ref(false);

const dataVal = ref();
const search = ref("");
const tableData = ref([]);
const selectedIds = ref([]);
const filteredData = ref([]);
const currentUser = ref(null); // For editing modal

// Table headers
const tableHeader = ref([
  {
    columnName: "Photo",
    columnLabel: "photo",
    sortEnabled: false,
    columnWidth: 80,
  },
  {
    columnName: "Name",
    columnLabel: "name",
    sortEnabled: true,
    columnWidth: 200,
  },
  {
    columnName: "Email",
    columnLabel: "email",
    sortEnabled: true,
    columnWidth: 200,
  },
  {
    columnName: "Role",
    columnLabel: "role",
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

// Fetch data from backend
const fetchUsers = async (page = 1) => {
  try {
    load.value = true;
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/users?page=${page}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    const result = await response.json();
    if (result.status) {
      tableData.value = result.data.data.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
        role: user.role,
        is_verified: user.is_verified,
      }));
      filteredData.value = [...tableData.value];
      dataVal.value = result.data.meta.total;
      load.value = false;
    }
  } catch (error) {
    load.value = false;
    console.error("Failed to fetch users:", error);
  }
};

// Fetch users on component mount
fetchUsers();

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

// Single delete
const deleteUser = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to delete this user.",
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
        `${import.meta.env.VITE_APP_API_URL_NEW}/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      const result = await response.json();

      if (result.status) {
        // Remove the deleted user from the table
        filteredData.value = filteredData.value.filter(
          (item) => item.id !== id,
        );
        tableData.value = tableData.value.filter((item) => item.id !== id);

        Swal.fire({
          title: "Deleted!",
          text: "The user has been deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: { confirmButton: "btn btn-primary" },
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: result.message || "Failed to delete the user.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: { confirmButton: "btn btn-primary" },
        });
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the user.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    }
  }
};

// Multi-delete
const multiDelete = async () => {
  if (!selectedIds.value.length) return;

  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: `You are about to delete ${selectedIds.value.length} users.`,
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
      // Delete users one by one
      for (const id of selectedIds.value) {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL_NEW}/users/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );

        const result = await response.json();

        if (!result.status) {
          throw new Error(result.message || "Failed to delete users.");
        }
      }

      // Remove deleted users from the table
      filteredData.value = filteredData.value.filter(
        (item) => !selectedIds.value.includes(item.id),
      );
      tableData.value = tableData.value.filter(
        (item) => !selectedIds.value.includes(item.id),
      );

      // Clear selected IDs
      selectedIds.value = [];

      Swal.fire({
        title: "Deleted!",
        text: "The selected users have been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    } catch (error) {
      console.error("Failed to delete users:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the users.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    }
  }
};

// Edit user
const editUser = (user) => {
  currentUser.value = { ...user };
};

// Update user
const updateUser = (updatedUser) => {
  const index = tableData.value.findIndex((item) => item.id === updatedUser.id);
  if (index !== -1) {
    tableData.value[index] = { ...updatedUser };
    filteredData.value = [...tableData.value];
  }
};
</script>

<style scoped>
.badge-success {
  background-color: #28a745;
}

.badge-secondary {
  background-color: #6c757d;
}
</style>
