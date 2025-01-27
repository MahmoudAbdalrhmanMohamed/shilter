<template>
  <!--begin::Card-->
  <p class="font-semibold md:text-2xl mt-4 mb-1 text-lg">
    {{ $t("carsDetails") }}
  </p>
  <div :class="`card pt-4 ${cardClasses}`">
    <!--begin::Card body-->
    <div class="card-body pt-0 pb-5">
      <Datatable
        :header="tableHeader"
        :data="tableData"
        :items-per-page="5"
        :items-per-page-dropdown-enabled="false"
      >
        <template v-slot:brand="{ row: payment }">
          {{ payment.brand}}
        </template>
        <template v-slot:model="{ row: payment }">
          {{ payment.model }}
        </template>
        <template v-slot:year="{ row: payment }">
          {{ payment.year }}
        </template>
        <template v-slot:date="{ row: payment }">
          {{ payment.date }}
        </template>
      </Datatable>
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script setup>
import { ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";

const props = defineProps(["cardClasses", "data"]);

const tableHeader = ref([
  {
    columnName: "brand",
    columnLabel: "brand",
    sortEnabled: false,
  },
  {
    columnName: "models",
    columnLabel: "model",
    sortEnabled: false,
  },
  {
    columnName: "years",
    columnLabel: "year",
    sortEnabled: false,
  },
  {
    columnName: "date",
    columnLabel: "date",
    sortEnabled: false,
  },
]);

const tableData = ref([...props.data]);
</script>
