<template>
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-7">
      <!--begin::Title-->
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">{{
          $t("latestHomelesses")
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
                {{ $t("photo") }}
              </th>
              <th
                class="p-0 pb-3 min-w-100px"
                :class="locale === 'en' ? 'text-start' : 'text-end'"
              >
                {{ $t("status") }}
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
                    </div>
                  </td>

                  <!-- Status Column -->
                  <td class="p-0">
                    <span
                      class="text-base capitalize md:text-lg"
                      :class="[
                        'badge',
                        row.status === 'approved'
                          ? 'badge-success'
                          : row.status === 'rejected'
                            ? 'badge-danger'
                            : 'badge-warning',
                      ]"
                      >{{ row.status }}</span
                    >
                  </td>

                  <!-- Address Column -->
                  <td class="p-0">
                    <span
                      :class="[
                        `badge md:text-lg text-base py-1  text-ellipsis max-w-40`,
                        locale === 'en' ? '' : 'text-end',
                      ]"
                      >{{ row.address ? row.address : "no address" }}</span
                    >
                  </td>

                  <td class="text-end p-0">
                    <router-link
                      :to="`/apps/homelesses/homeless/${row.id}`"
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
import { useI18n } from "vue-i18n";
const { locale } = useI18n();

defineProps({
  className: { type: String, required: false },
  workshops: { required: false },
});
</script>

<style scoped>
/* Custom styles to remove extra padding */
td.p-0 {
  padding: 0 !important;
}

.badge {
  padding: 0.25rem 0.5rem; /* Adjust badge padding as needed */
}
</style>
