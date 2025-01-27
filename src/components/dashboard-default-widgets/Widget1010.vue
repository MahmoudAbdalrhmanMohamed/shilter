<template>
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-7">
      <!--begin::Title-->
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">{{
          $t("Number Of New Registered Users")
        }}</span>
      </h3>
    </div>
    <div class="card-body pt-6">
      <!--begin::Table container-->
      <div class="table-responsive">
        <!--begin::Table-->
        <table class="table table-row-dashed align-middle gs-0 gy-3 my-0">
          <!--begin::Table head-->
          <thead>
            <tr class="fs-7 fw-bold text-gray-500 border-bottom-0">
              <th
                class="p-0 pb-3 min-w-175px px-6"
                :class="locale === 'en' ? 'text-start' : 'text-end'"
              >
                {{ $t("users") }}
              </th>
              <th
                class="p-0 pb-3 min-w-100px"
                :class="locale === 'en' ? 'text-start' : 'text-end'"
              >
                {{ $t("description") }}
              </th>
              <th class="p-0 pb-3 min-w-100px">
                {{ $t("address") }}
              </th>
              <th class="p-0 pb-3 w-50px text-end">{{ $t("view") }}</th>
            </tr>
          </thead>
          <!--end::Table head-->

          <!--begin::Table body-->
          <tbody>
            <template v-if="workshops.length">
              <template v-for="row in workshops" :key="row.id">
                <tr>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="symbol symbol-50px mx-4">
                        <img :src="row.image" class="" alt="" />
                      </div>

                      <div class="d-flex justify-content-start flex-column">
                        <router-link
                          :to="`/apps/workshops/workshop/${row.id}`"
                          class="text-gray-800 fw-bold text-hover-primary mb-1 fs-6"
                          >{{ row.name }}</router-link
                        >
                        <span class="text-gray-500 fw-semibold d-block fs-7">{{
                          row.phone
                        }}</span>
                      </div>
                    </div>
                  </td>

                  <td class="pe-0">
                    <span
                      class="text-gray-600 fw-bold fs-6 overflow-hidden text-ellipsis max-w-40"
                      :class="locale === 'en' ? '' : 'text-end'"
                    >
                      {{ row.description }}</span
                    >
                  </td>

                  <td class="p-0">
                    <span
                      :class="[
                        `badge py-3 px-4 fs-7 overflow-hidden text-ellipsis max-w-40`,
                        locale === 'en' ? '' : 'text-end',
                      ]"
                      >{{ row.address }}</span
                    >
                  </td>

                  <td class="text-end">
                    <router-link
                      :to="`/apps/workshops/workshop/${row.id}`"
                      class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary w-30px h-30px"
                    >
                      <KTIcon
                        icon-name="black-right"
                        icon-class="fs-5 text-gray-700"
                      />
                    </router-link>
                  </td>
                </tr>
              </template>
            </template>
            <template v-else class="w-full h-full">
              {{ $t("noData") }}
            </template>
          </tbody>
          <!--end::Table body-->
        </table>
      </div>
      <!--end::Table-->
    </div>
    <!--end: Card Body-->
  </div>
</template>
<script setup>
import { getAssetPath } from "@/core/helpers/assets";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();

const table = [
  {
    img: getAssetPath("media/stock/600x600/img-49.jpg"),
    title: "Mivy App",
    name: "Jane Cooper",
    price: "32,400",
    statistics: "9.2",
    icon: true,
    chartColor: "success",
    status: {
      label: "In Process",
      state: "primary",
    },
  },
  {
    img: getAssetPath("media/stock/600x600/img-40.jpg"),
    title: "Avionica",
    name: "Esther Howard",
    price: "256,910",
    statistics: "0.4",
    icon: false,
    chartColor: "danger",
    status: {
      label: "On Hold",
      state: "warning",
    },
  },
  {
    img: getAssetPath("media/stock/600x600/img-39.jpg"),
    title: "Charto CRM",
    name: "Jenny Wilson",
    price: "8,220",
    statistics: "9.2",
    icon: true,
    chartColor: "success",
    status: {
      label: "In Process",
      state: "primary",
    },
  },
  {
    img: getAssetPath("media/stock/600x600/img-47.jpg"),
    title: "Tower Hill",
    name: "Cody Fisher",
    price: "74,000",
    statistics: "9.2",
    icon: true,
    chartColor: "success",
    status: {
      label: "Completed",
      state: "success",
    },
  },
  {
    img: getAssetPath("media/stock/600x600/img-48.jpg"),
    title: "9 Degree",
    name: "Savannah Nguyen",
    price: "183,300",
    statistics: "0.4",
    icon: false,
    chartColor: "danger",
    status: {
      label: "In Process",
      state: "primary",
    },
  },
];

defineProps({
  className: { type: String, required: false },
  workshops: { required: false },
});
</script>
