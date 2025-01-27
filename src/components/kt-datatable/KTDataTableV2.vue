<template>
  <div class="dataTables_wrapper dt-bootstrap4 no-footer">
    <TableContent
      @on-items-select="onItemSelect"
      @on-sort="onSort"
      :header="header"
      :data="dataToDisplay"
      :checkboxEnabled="checkboxEnabled"
      :checkboxLabel="checkboxLabel"
      :empty-table-text="emptyTableText"
      :sort-label="sortLabel"
      :sort-order="sortOrder"
      :loading="loading"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
        <slot :name="name" :row="item" />
      </template>
    </TableContent>
    <TableFooter
      @page-change="pageChange"
      :current-page="currentPage"
      v-model:itemsPerPage="itemsInTable"
      :count="totalPages"
      :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import TableContent from "@/components/kt-datatable/table-partials/table-content/TableContent.vue";
import TableFooter from "@/components/kt-datatable/table-partials/TableFooterV2.vue";

// Props
const props = defineProps({
  totalPages: { type: Number, required: true },
  header: { type: Array, required: true },
  data: { type: Array, required: true },
  itemsPerPage: { type: Number, default: 10 },
  itemsPerPageDropdownEnabled: { type: Boolean, default: true },
  checkboxEnabled: { type: Boolean, default: false },
  checkboxLabel: { type: String, default: "id" },
  total: { type: Number },
  loading: { type: Boolean, default: false },
  sortLabel: { type: String, default: null },
  sortOrder: { type: String, default: "asc" },
  emptyTableText: { type: String, default: "No data found" },
  currentPage: { type: Number, default: 1 },
});

// Emits
const emit = defineEmits([
  "page-change",
  "on-sort",
  "on-items-select",
  "on-items-per-page-change",
]);

// Reactive state
const currentPage = ref(props.currentPage);
const itemsInTable = ref(props.itemsPerPage);

// Watchers
watch(itemsInTable, (val) => {
  currentPage.value = 1;
  emit("on-items-per-page-change", val);
});

// Methods
const pageChange = (page) => {
  currentPage.value = page;
  emit("page-change", page);
};

const onSort = (sort) => {
  emit("on-sort", sort);
};

const onItemSelect = (selectedItems) => {
  emit("on-items-select", selectedItems);
};

// Computed properties
const dataToDisplay = computed(() => {
  if (props.data) {
    if (props.data.length <= itemsInTable.value) {
      return props.data;
    } else {
      const sliceFrom = (currentPage.value - 1) * itemsInTable.value;
      return props.data.slice(sliceFrom, sliceFrom + itemsInTable.value);
    }
  }
  return [];
});
</script>
