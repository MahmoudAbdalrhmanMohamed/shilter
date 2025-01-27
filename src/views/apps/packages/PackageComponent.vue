<template>
  <!--begin::Layout-->
  <div v-if="dataVal" class="d-flex flex-column flex-xl-row">
    <!--begin::Sidebar-->
    <div class="flex-column flex-lg-row-auto w-100 w-xl-350px mb-10">
      <!--begin::Card-->
      <div class="card mb-5 mb-xl-8">
        <!--begin::Card body-->
        <div class="card-body pt-15">
          <!--begin::Summary-->
          <div class="d-flex flex-center flex-column mb-5">
            <!--begin::Avatar-->
            <div class="symbol symbol-100px symbol-circle mb-7">
              <!-- <img :src="dataVal.image" alt="User Image" /> -->
            </div>
            <a
              href="#"
              class="fs-3 text-gray-800 text-hover-primary fw-bold mb-1"
            >
              {{ locale === "ar" ? dataVal.name.ar : dataVal.name.en }}
            </a>
            <div class="fs-5 fw-semibold text-muted mb-6">
              {{
                locale === "ar"
                  ? dataVal.description.ar
                  : dataVal.description.en
              }}
            </div>
          </div>
          <!--end::Summary-->

          <!--begin::Details toggle-->
          <div class="d-flex flex-stack fs-4 py-3">
            <div class="fw-bold rotate collapsible" role="button">
              {{ $t("details") }}
              <span class="ms-2 rotate-180">
                <KTIcon icon-name="down" icon-class="fs-3" />
              </span>
            </div>
          </div>
          <!--end::Details toggle-->

          <div class="separator separator-dashed my-3"></div>

          <!--begin::Details content-->
          <div id="kt_customer_view_details" class="show">
            <div class="py-5 fs-6">
              <!--begin::Badge-->
              <div class="badge badge-light-info d-inline">
                {{ $t("Premium user") }}
              </div>
              <!--end::Badge-->

              <div class="fw-bold mt-5">{{ $t("account_id") }}</div>
              <div class="text-gray-600">ID-{{ dataVal.id }}</div>

              <div class="fw-bold mt-5">{{ $t("language") }}</div>
              <div class="text-gray-600">
                {{ locale === "ar" ? "العربية" : "English" }}
              </div>
            </div>
          </div>
          <!--end::Details content-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Card-->
    </div>
    <!--end::Sidebar-->

    <!--begin::Content-->
    <div class="tab-content" id="myTabContent">
      <div
        class="tab-pane fade show active"
        id="kt_customer_view_overview_tab"
        role="tabpanel"
      >
        <Durations
          v-if="dataVal.duration.length"
          :duration="dataVal.duration"
          card-classes="mb-6 mb-xl-9"
        />
      </div>
    </div>
    <!--end::Content-->
  </div>
  <div v-else class="w-full h-screen grid place-items-center">
    <span class="loader"></span>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import Durations from "@/components/customers/cards/overview/Durations.vue";

const dataVal = ref(null);
const route = useRoute();
const { locale } = useI18n();

// Function to fetch customer data
const fetchData = async () => {
  try {
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/packages/${route.params.package}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    dataVal.value = data.value.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Fetch data initially
fetchData();

// Re-fetch data on locale change
watch(() => locale.value, fetchData);
</script>
