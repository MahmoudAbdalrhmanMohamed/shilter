<template>
  <p class="mt-16 mb-4 capitalize text-base md:text-2xl font-semibold">
    {{ $t("translatedChapters") }}
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
            :placeholder="$t('searchChapters')"
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
            @click="deleteSelectedChapters"
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
        <!-- Translator Photo -->
        <!-- <template v-slot:translatorPhoto="{ row: chapter }">
          <img
            :src="chapter.translatorPhoto"
            alt="Translator Photo"
            class="img-thumbnail rounded-circle"
            style="max-height: 40px; max-width: 40px"
          />
        </template> -->

        <!-- Translator Name -->
        <!-- <template v-slot:translatorName="{ row: chapter }">
          {{ chapter.translatorName }}
        </template> -->

        <!-- Language -->
        <template v-slot:language="{ row: chapter }">
          {{ chapter.language }}
        </template>

        <!-- Series Name -->
        <template v-slot:seriesName="{ row: chapter }">
          {{ chapter.seriesName }}
        </template>

        <!-- Chapter Name -->
        <template v-slot:chapterName="{ row: chapter }">
          {{ chapter.chapterName }}
        </template>

        <!-- Chapter Number -->
        <template v-slot:chapterNumber="{ row: chapter }">
          {{ chapter.chapterNumber }}
        </template>

        <!-- Chapter PDF -->
        <template v-slot:chapterPdf="{ row: chapter }">
          <a
            download="download"
            class="btn btn-primary"
            :href="chapter.chapterPDF"
            target="_blank"
            >{{ $t("viewPdf") }}</a
          >
        </template>

        <!-- Chapter Cover -->
        <template v-slot:chapterCover="{ row: chapter }">
          <img
            :src="chapter.chapterCover"
            alt="Chapter Cover"
            class="img-thumbnail"
            style="max-height: 100px; max-width: 80px"
          />
        </template>

        <!-- Status -->
        <template v-slot:status="{ row: chapter }">
          <span
            :class="[
              'badge',
              chapter.status === 'Approved'
                ? 'badge-success'
                : chapter.status === 'Rejected'
                  ? 'badge-danger'
                  : 'badge-warning',
            ]"
          >
            {{ chapter.status }}
          </span>
        </template>

        <!-- Actions -->
        <template v-slot:actions="{ row: chapter }">
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
                @click="editChapter(chapter)"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_edit_chapter"
              >
                {{ $t("edit") }}
              </button>
            </div>
            <div class="menu-item px-3">
              <a @click="deleteChapter(chapter.id)" class="menu-link px-3">
                {{ $t("delete") }}
              </a>
            </div>
          </div>
        </template>
      </Datatable>
    </div>
    <!-- Edit Modal  -->
    <EditChapterModal
      :chapter="currentChapter"
      @close="currentChapter = null"
      @update-chapter="updateChapter"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { Dropdown } from "bootstrap";
import { useI18n } from "vue-i18n";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import Datatable from "@/components/kt-datatable/KTDataTableV3.vue";
import EditChapterModal from "../../../modals/forms/EditChapterModal.vue";

const currentChapter = ref();
const selectedIds = ref([]);
const search = ref("");
const tableData = ref([]);
const initChapters = ref([]);
const { locale } = useI18n();

const tableHeader = ref([
  // {
  //   columnLabel: "translatorPhoto",
  //   columnName: "translatorPhoto",
  //   sortEnabled: false,
  //   columnWidth: 150,
  // },
  // {
  //   columnLabel: "translatorName",
  //   columnName: "translatorName",
  //   sortEnabled: true,
  //   columnWidth: 200,
  // },
  {
    columnLabel: "language",
    columnName: "Language",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnLabel: "seriesName",
    columnName: "seriesName",
    sortEnabled: true,
    columnWidth: 200,
  },
  {
    columnLabel: "chapterName",
    columnName: "chapterName",
    sortEnabled: true,
    columnWidth: 200,
  },
  {
    columnLabel: "chapterNumber",
    columnName: "chapterNumber",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnLabel: "chapterPdf",
    columnName: "chapterPDF",
    sortEnabled: false,
    columnWidth: 150,
  },
  {
    columnLabel: "chapterCover",
    columnName: "chapterCover",
    sortEnabled: false,
    columnWidth: 150,
  },
  {
    columnLabel: "status",
    columnName: "Status",
    sortEnabled: false,
    columnWidth: 100,
  },
  {
    columnLabel: "actions",
    columnName: "Actions",
    sortEnabled: false,
    columnWidth: 120,
  },
]);

const props = defineProps(["socialMedias", "cardClasses"]);
tableData.value = [...props.socialMedias];
initChapters.value = [...props.socialMedias];

watch(
  () => props.socialMedias,
  (newData) => {
    tableData.value = [...newData];
    initChapters.value = [...tableData.value];
  },
);

// Delete a single chapter
const deleteChapter = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to delete this chapter.",
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
    tableData.value = tableData.value.filter((chapter) => chapter.id !== id);
    Swal.fire({
      title: "Deleted!",
      text: "The chapter has been deleted.",
      icon: "success",
      confirmButtonText: "OK",
      customClass: { confirmButton: "btn btn-primary" },
    });
  }
};

// Delete multiple chapters
const deleteSelectedChapters = async () => {
  if (!selectedIds.value.length) return;

  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: `You are about to delete ${selectedIds.value.length} chapters.`,
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
    tableData.value = tableData.value.filter(
      (chapter) => !selectedIds.value.includes(chapter.id),
    );
    selectedIds.value = [];
    Swal.fire({
      title: "Deleted!",
      text: "The selected chapters have been deleted.",
      icon: "success",
      confirmButtonText: "OK",
      customClass: { confirmButton: "btn btn-primary" },
    });
  }
};

// Search functionality
const debouncedSearch = debounce(() => {
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    tableData.value = initChapters.value.filter((chapter) =>
      Object.values(chapter).some(
        (field) =>
          typeof field === "string" &&
          field.toLowerCase().includes(lowerSearch),
      ),
    );
  } else {
    tableData.value = [...initChapters.value];
  }
}, 300);

const onItemSelect = (selectedItems) => {
  selectedIds.value = selectedItems;
};

const sort = ({ label, order }) => {
  const reverse = order === "desc";

  tableData.value.sort((a, b) => {
    const valA = a[label] || "";
    const valB = b[label] || "";

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

// Open Edit Modal
const editChapter = (chapter) => {
  currentChapter.value = { ...chapter };
};

// Update Chapter in Table
const updateChapter = (updatedChapter) => {
  const index = tableData.value.findIndex(
    (chapter) => chapter.id === updatedChapter.id,
  );
  if (index !== -1) {
    tableData.value[index] = { ...updatedChapter };
  }
};
</script>
