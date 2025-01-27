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
          :placeholder="$t('searchChapters')"
        />
      </div>

      <!-- Toolbar -->
      <div class="card-toolbar">
        <div
          v-if="!selectedIds.length"
          class="flex justify-content-end flex-wrap gap-2"
          data-kt-customer-table-toolbar="base"
        >
          <!-- Add Chapter Button -->
          <router-link
            :to="{ name: 'apps-chapters-AddSelect' }"
            class="btn btn-primary"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ $t("addSelect") }}
          </router-link>
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
        :header="tableHeader"
        :enable-items-per-page-dropdown="false"
        :checkbox-enabled="true"
        checkbox-label="id"
        ref="pdfTable"
        :totalPages="Number(dataVal)"
        @page-change="fetching"
        :loading="load"
      >
        <!-- Username Column -->
        <template v-slot:username="{ row: publisher }">{{
          publisher.username
        }}</template>
        <!-- Language Column -->
        <template v-slot:language="{ row: publisher }">{{
          publisher.language
        }}</template>
        <!-- Year Column -->
        <template v-slot:year="{ row: publisher }">{{
          publisher.year
        }}</template>
        <!-- Description Column -->
        <template v-slot:description="{ row: publisher }">
          {{ publisher.description }}
        </template>
        <!-- Rate Column -->
        <template v-slot:rate="{ row: publisher }"
          ><Stars :value="publisher.rate"
        /></template>
        <!-- Logo Column -->
        <template v-slot:logo="{ row: publisher }">
          <img
            :src="publisher.logo"
            alt="Publisher Logo"
            class="img-thumbnail"
            style="max-height: 50px; max-width: 50px"
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
            <div class="menu-item px-3">
              <router-link
                class="menu-link px-3 w-full"
                :to="`/apps/publishers/updatePublisher/${publisher.id}`"
              >
                {{ $t("edit") }}
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
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { Dropdown } from "bootstrap";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import Datatable from "@/components/kt-datatable/KTDataTableV2.vue";
import Stars from "@/components/StarsWithoutText.vue";

const load = ref(false);
const selectedIds = ref([]);
const search = ref("");
const tableData = ref([]);
const initPublishers = ref([]);
const { locale } = useI18n();
const dataVal = ref();

// Fetch publishers
const fetching = async (page = 1) => {
  try {
    load.value = true;

    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/publishers?page=${page}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    tableData.value = [...data.value.data.data];
    initPublishers.value = [...data.value.data.data];
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
  () => locale.value,
  () => fetching(1),
);

// Table header configuration
const tableHeader = ref([
  { columnName: "username", columnLabel: "username", sortEnabled: true },
  { columnName: "language", columnLabel: "language", sortEnabled: true },
  { columnName: "year", columnLabel: "year", sortEnabled: true },
  { columnName: "description", columnLabel: "description", sortEnabled: false },
  { columnName: "rate", columnLabel: "rate", sortEnabled: true },
  { columnName: "logo", columnLabel: "logo", sortEnabled: false },
  { columnName: "actions", columnLabel: "actions", sortEnabled: false },
]);

// Handle item selection
const onItemSelect = (selectedItems) => {
  selectedIds.value = selectedItems;
};

// Debounced search
const debouncedSearch = debounce(() => {
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    tableData.value = initComics.value.filter((item) =>
      Object.values(item).some(
        (field) =>
          typeof field === "string" &&
          field.toLowerCase().includes(lowerSearch),
      ),
    );
  } else {
    tableData.value = [...initComics.value];
  }
}, 300);
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
</script>
