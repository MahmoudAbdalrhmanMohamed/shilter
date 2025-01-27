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

    <!-- Table -->
    <div class="card-body pt-0">
      <Datatable
        :data="filteredData"
        :header="tableHeader"
        :loading="load"
        :totalPages="Number(dataVal)"
        @page-change="fetching"
      >
        <!-- Image Column -->
        <template v-slot:image="{ row: translator }">
          <img
            :src="translator.image || 'https://via.placeholder.com/50'"
            alt="Translator Image"
            class="rounded-full object-cover"
            width="50"
            height="50"
          />
        </template>

        <!-- Name Column -->
        <template v-slot:name="{ row: translator }">
          {{ translator.name || "N/A" }}
        </template>

        <!-- Language Column -->
        <template v-slot:language="{ row: translator }">
          {{ $t(translator.language_code) || "N/A" }}
        </template>

        <!-- Followers Column -->
        <template v-slot:followers="{ row: translator }">
          {{ translator.followers_count }}
        </template>

        <!-- Translation Rate Column -->
        <template v-slot:rate_translation="{ row: translator }">
          <Stars :value="Number(translator.rate_tranlation)" />
        </template>

        <!-- Clarity Rate Column -->
        <template v-slot:rate_clarity="{ row: translator }">
          <Stars :value="Number(translator.rate_clarity)" />
        </template>

        <!-- Experience Column -->
        <template v-slot:experience="{ row: translator }">
          {{ translator.experience_type || "N/A" }}
        </template>

        <!-- Actions Column -->
        <template v-slot:actions="{ row: translator }">
          <router-link
            :to="`/apps/translators/translator/${translator.id}`"
            class="btn btn-sm btn-light btn-active-light-primary"
          >
            {{ $t("view") }}
          </router-link>
        </template>
      </Datatable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTableV2.vue";
import debounce from "lodash.debounce";
import { useI18n } from "vue-i18n";
import Stars from "@/components/StarsWithoutText.vue";

const { locale } = useI18n();

const dataVal = ref();
const load = ref(false);

const search = ref("");
const tableData = ref([]);
const filteredData = ref([...tableData.value]);

// Table headers
const tableHeader = ref([
  {
    columnName: "Image",
    columnLabel: "image",
    sortEnabled: false,
    columnWidth: 100,
  },
  {
    columnName: "Name",
    columnLabel: "name",
    sortEnabled: true,
    columnWidth: 200,
  },
  {
    columnName: "Language",
    columnLabel: "language",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "Followers",
    columnLabel: "followers",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "Translation Rate",
    columnLabel: "rate_translation",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "Clarity Rate",
    columnLabel: "rate_clarity",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "Experience",
    columnLabel: "experience",
    sortEnabled: true,
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

// Fetch data from the backend
const fetching = async (page = 1) => {
  try {
    load.value = true;

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/translators?page=${page}`,
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

.rounded-circle {
  border-radius: 50%;
}
</style>
