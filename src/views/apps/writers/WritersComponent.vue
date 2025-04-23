<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!-- Search Bar -->
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
          :placeholder="$t('searchHomelesses')"
        />
      </div>

      <!-- Toolbar -->
      <div class="card-toolbar">
        <div
          v-if="!selectedIds.length"
          class="d-flex justify-content-end"
          data-kt-customer-table-toolbar="base"
        >
          <!-- <router-link
            :to="{ name: 'apps-homelesses-add' }"
            class="btn btn-primary"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ $t("addHomelesse") }}
          </router-link> -->
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
            @click="deleteSelectedPublishers"
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
        :itemsPerPage="per_page"
        :header="tableHeader"
        :enable-items-per-page-dropdown="false"
        :checkbox-enabled="true"
        checkbox-label="id"
        ref="pdfTable"
        :loading="load"
        :totalPages="Number(dataVal)"
        @page-change="fetching"
      >
        <!-- Year Column -->
        <template v-slot:status="{ row: publisher }">
          <span
            class="text-base capitalize md:text-lg"
            :class="[
              'badge',
              publisher.status === 'approved'
                ? 'badge-success'
                : publisher.status === 'rejected'
                  ? 'badge-danger'
                  : 'badge-warning',
            ]"
          >
            {{ publisher.status }}
          </span>
        </template>

        <!-- Rate Column -->
        <template v-slot:country="{ row: publisher }">{{
          publisher.country
        }}</template>
        <template v-slot:categories="{ row: publisher }">
          <div class="flex flex-wrap gap-1 items-center">
            <span
              class="rounded text-white px-2 py-1"
              :class="classes[index % classes.length]"
              v-for="(i, index) in publisher.categories"
            >
              {{ i.name }}
            </span>
          </div>
        </template>
        <!-- Logo Column -->
        <template v-slot:logo="{ row: publisher }">
          <img
            :src="publisher.image"
            alt="Publisher Logo"
            class="img-thumbnail"
            style="max-height: 200px; max-width: 100px"
          />
        </template>

        <!-- Actions Column -->
        <template v-slot:actions="{ row: publisher }">
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
            <!-- <div class="menu-item px-3">
              <router-link
                class="menu-link px-3 w-full"
                :to="`/apps/homelesses/updateHomelesse/${publisher.id}`"
              >
                {{ $t("edit") }}
              </router-link>
            </div> -->
            <div class="menu-item px-3">
              <router-link
                class="menu-link px-3 w-full"
                :to="`/apps/homelesses/homeless/${publisher.id}`"
              >
                {{ $t("view") }}
              </router-link>
            </div>

            <div class="menu-item px-3">
              <a
                @click="deletePublisher(publisher.id)"
                class="menu-link px-3"
                >{{ $t("delete") }}</a
              >
            </div>
          </div>
        </template>
      </Datatable>
    </div>
    <!-- temp -->
    <!-- <Chat />
    <ConnectionManager />
    <ConnectionState /> -->
  </div>
</template>

<script setup>
const classes = ref([
  "bg-red-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-black",
]);
import { ref, watch, onMounted } from "vue";
import { Dropdown } from "bootstrap";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import Datatable from "@/components/kt-datatable/KTDataTableV2.vue";
import Stars from "@/components/StarsWithoutText.vue";
import { useRouter } from "vue-router";
// import Chat from "@/components/Chat.vue";
// import ConnectionManager from "@/components/ConnectionManager.vue";
// import ConnectionState from "@/components/ConnectionState.vue";
const dataVal = ref();
const per_page = ref();

const router = useRouter();

const load = ref(false);
const selectedIds = ref([]);
const search = ref("");
const tableData = ref([]);
const initPublishers = ref([]);
const { locale } = useI18n();
// const dataVal = ref();

// Fetch publishers
const fetching = async (page = 1) => {
  try {
    load.value = true;

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/homelesses?page=${page}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json(); // Parse error response body
      console.error("Error response:", response.status, errorData);
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        router.replace("/");
      }
    }

    const data = await response.json();
    console.log(data.data.data);

    tableData.value = [...data.data.data];
    initPublishers.value = [...tableData.value];
    dataVal.value = data.data.meta.total;
    per_page.value = data.data.meta.per_page;

    load.value = false;
  } catch (error) {
    load.value = false;
    console.error("Error fetching data:", error);
  }
};

// Fetch initial data
fetching();

// Watch locale and refetch data on change
watch(
  () => locale.value,
  () => fetching(),
);

// Table header configuration
const tableHeader = ref([
  {
    columnName: "logo",
    columnLabel: "logo",
    sortEnabled: false,
    columnWidth: 175,
  },
  {
    columnName: "status",
    columnLabel: "status",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "country",
    columnLabel: "country",
    sortEnabled: true,
    columnWidth: 175,
  },

  {
    columnName: "categories",
    columnLabel: "categories",
    sortEnabled: false,
    columnWidth: 225,
  },

  {
    columnName: "actions",
    columnLabel: "actions",
    sortEnabled: false,
    columnWidth: 150,
  },
]);

// Delete a single publisher
const deletePublisher = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to delete this publisher.",
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
        `${import.meta.env.VITE_APP_API_URL_NEW}/homelesses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      tableData.value = tableData.value.filter(
        (publisher) => publisher.id !== id,
      );
      initPublishers.value = initPublishers.value.filter(
        (publisher) => publisher.id !== id,
      );

      Swal.fire({
        title: "Deleted!",
        text: "The homelesse has been deleted.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    } catch (error) {
      console.error("Error deleting homelesse:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the homelesse. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-danger" },
      });
    }
  }
};

// Delete multiple publishers
const deleteSelectedPublishers = async () => {
  if (!selectedIds.value.length) return;

  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: `You are about to delete ${selectedIds.value.length} homelesse.`,
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
          useFetch(`${import.meta.env.VITE_APP_API_URL_NEW}/homelesses/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
        ),
      );

      tableData.value = tableData.value.filter(
        (publisher) => !selectedIds.value.includes(publisher.id),
      );
      initPublishers.value = initPublishers.value.filter(
        (publisher) => !selectedIds.value.includes(publisher.id),
      );

      Swal.fire({
        title: "Deleted!",
        text: "The selected homelesses have been deleted.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
      selectedIds.value = [];
    } catch (error) {
      console.error("Error deleting selected homelesses:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete some homelesses. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-danger" },
      });
    }
  }
};

// Debounced search
const debouncedSearch = debounce(() => {
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    tableData.value = initPublishers.value.filter((item) =>
      Object.values(item).some(
        (field) =>
          typeof field === "string" &&
          field.toLowerCase().includes(lowerSearch),
      ),
    );
  } else {
    tableData.value = [...initPublishers.value];
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC", // Adjust timezone if needed
  }).format(date);
};
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

.rounded {
  border-radius: 8px;
}
</style>
