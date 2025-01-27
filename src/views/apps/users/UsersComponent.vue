<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!-- Search Bar -->
      <div class="card-title">
        <div
          :class="locale === 'ar' ? 'flex-row-reverse' : ''"
          class="d-flex align-items-center position-relative my-1"
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
    <div v-if="!loading" class="card-body pt-0">
      <Datatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="tableData"
        :header="tableHeader"
        :enable-items-per-page-dropdown="false"
        :checkbox-enabled="true"
        checkbox-label="id"
        ref="pdfTable"
        :loading="load"
        :totalPages="Number(dataVal)"
        @page-change="fetching"
      >
        <template v-slot:first_name="{ row: user }">{{
          user.first_name
        }}</template>
        <template v-slot:lastName="{ row: user }">{{
          user.last_name
        }}</template>
        <template v-slot:phone="{ row: user }">{{ user.phone }}</template>
        <template v-slot:image="{ row: user }">{{ user.image }}</template>

        <template v-slot:type="{ row: user }">{{ user.type }}</template>
        <template v-slot:block="{ row: user }">
          <div
            class="bg-red-500 p-2 rounded w-fit text-white"
            v-if="user.block"
          >
            {{ $t("blockedUser") }}
          </div>
          <div class="bg-green-500 p-2 rounded w-fit text-white" v-else>
            {{ $t("AccpetedUser") }}
          </div>
        </template>

        <template v-slot:date="{ row: user }">{{ user.created_at }}</template>

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
                data-bs-target="#kt_modal_update_user"
                @click="openEditModal(user)"
              >
                {{ $t("edit") }}
              </button>
            </div>

            <div class="menu-item px-3">
              <a @click="deleteCustomer(user.id)" class="menu-link px-3">{{
                $t("block")
              }}</a>
            </div>
            <div class="menu-item px-3">
              <router-link
                class="menu-link px-3"
                :to="`/apps/users/user/${user.id}`"
                >{{ $t("view") }}
              </router-link>
            </div>
            <!-- <div class="menu-item px-3">
              <button
                type="button"
                class="menu-link px-3 w-full"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_reset_user_password"
                @click="openEditModal(user)"
              >
                rest Password
              </button>
            </div> -->
          </div>
        </template>
      </Datatable>
    </div>
    <div v-else class="w-full h-screen grid place-items-center">
      <span class="loader"></span>
    </div>
  </div>
  <ExportCustomerModal />
  <AddCustomerModal @newRow="addNewRow" />
  <RestUserPasswordModal :userId="currentUser" />
  <UpdateUserModal @updateData="updateData" :currentUser="currentUser" />
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { Dropdown } from "bootstrap";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import Datatable from "@/components/kt-datatable/KTDataTableV2.vue";
import ExportCustomerModal from "@/components/modals/forms/ExportCustomerModal.vue";
import AddCustomerModal from "@/components/modals/forms/AddUserModal.vue";
import RestUserPasswordModal from "@/components/modals/forms/RestUserPasswordModal.vue";
import UpdateUserModal from "@/components/modals/forms/UpdateUserModal.vue";

const load = ref(false);

const currentUser = ref(null);
const selectedIds = ref([]);
const search = ref("");
const tableData = ref([]);
const initCustomers = ref([]);
const { locale } = useI18n();
const dataVal = ref();
const loading = ref(false);

loading.value = true;
// Fetch customers
const fetching = async (page = 1) => {
  try {
    load.value = true;

    tableData.value = [];
    initCustomers.value = [];
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/users?page=${page}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    tableData.value = [...data.value.data.data];
    initCustomers.value = [...data.value.data.data];
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
watch(
  () => locale.value, // Source to watch
  () => fetching(1), // Callback to run on source change
);

// Table header configuration
const tableHeader = ref([
  {
    columnName: "firstName",
    columnLabel: "first_name",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "lastName",
    columnLabel: "lastName",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "phone",
    columnLabel: "phone",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "photo",
    columnLabel: "image",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "type",
    columnLabel: "type",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "block",
    columnLabel: "block",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "createdDate",
    columnLabel: "date",
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

// Delete a single customer
const deleteCustomer = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to block this user.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, block it!",
    cancelButtonText: "No, cancel!",
    customClass: {
      confirmButton: "btn btn-danger",
      cancelButton: "btn btn-secondary",
    },
  });

  if (confirmResult.isConfirmed) {
    try {
      await useFetch(
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/users/${id}/toggle-block`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      const user = tableData.value.find((data) => data.id === id);
      if (user) {
        user.block = true;
      }
      Swal.fire({
        title: "Blocked!",
        text: "The customer has been blocked.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    } catch (error) {
      console.error("Error blocking user:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to block the user. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-danger" },
      });
    }
  }
};

// Delete multiple customers
const deleteSelectedCustomers = async () => {
  if (!selectedIds.value.length) return;

  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: `You are about to block ${selectedIds.value.length} users.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, block them!",
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
            `${import.meta.env.VITE_APP_API_URL_MEGATRON}/users/${id}/toggle-block`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            },
          ),
        ),
      );

      selectedIds.value.forEach((id) => {
        const user = tableData.value.find((data) => data.id === id);
        if (user) {
          user.block = true;
        }
      });
      selectedIds.value = [];
      Swal.fire({
        title: "Blocked!",
        text: "The selected users have been Blocked.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    } catch (error) {
      console.error("Error blocking selected users:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to block some users. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-danger" },
      });
    }
  }
};

// Open edit modal
const openEditModal = (user) => {
  currentUser.value = user ? { ...user } : null;
};

// Add new row
const addNewRow = (data) => {
  const newUser = {
    id: data.id,
    first_name: data.firstName,
    last_name: data.lastName,
    phone: data.phoneNum,
    image: data.files[0]?.url || "",
    date: new Date()
      .toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "")
      .replace(" ", "-"),
  };
  tableData.value.push(newUser);
  initCustomers.value.push(newUser);
};

// Update user data
const updateData = (updatedUser) => {
  const index = tableData.value.findIndex((user) => user.id === updatedUser.id);
  if (index !== -1) {
    tableData.value[index] = { ...updatedUser };
  }
};

const debouncedSearch = debounce(() => {
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    tableData.value = initCustomers.value.filter((item) => {
      return (
        (item.first_name &&
          item.first_name.toLowerCase().includes(lowerSearch)) ||
        (item.last_name &&
          item.last_name.toLowerCase().includes(lowerSearch)) ||
        (item.phone && item.phone.toLowerCase().includes(lowerSearch)) ||
        (item.type && item.type.toLowerCase().includes(lowerSearch)) ||
        (item.id && String(item.id).toLowerCase().includes(lowerSearch)) // In case id is part of the search
      );
    });
  } else {
    tableData.value = [...initCustomers.value];
  }
}, 300);

// Handle item selection
const onItemSelect = (selectedItems) => {
  selectedIds.value = selectedItems;
};

// Sort table data
const sort = ({ label, order }) => {
  const reverse = order === "desc";
  tableData.value.sort((a, b) => {
    const valueA = a[label] || ""; // Ensure there's a fallback if the label is undefined
    const valueB = b[label] || ""; // Ensure there's a fallback if the label is undefined

    return reverse
      ? valueB.localeCompare(valueA)
      : valueA.localeCompare(valueB);
  });
};

// Initialize dropdowns
onMounted(() => {
  const dropdownElements = document.querySelectorAll(
    '[data-bs-toggle="dropdown"]',
  );
  dropdownElements.forEach((element) => {
    new Dropdown(element);
  });
});
loading.value = false;
</script>
