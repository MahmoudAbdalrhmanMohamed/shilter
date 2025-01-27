<template>
  <!--begin::Layout-->
  <div class="flex flex-col">
    <!--begin::Sidebar-->
    <div
      v-if="dataToShow"
      class="flex-column flex-lg-row-auto w-full mb-10"
    >
      <!--begin::Card-->
      <div class="card mb-5 mb-xl-8">
        <!--begin::Card body-->
        <div class="card-body pt-15">
          <!--begin::Summary-->
          <div class="d-flex flex-center flex-column mb-5">
            <!--begin::Avatar-->
            <div class="symbol symbol-100px symbol-circle mb-7">
              <img :src="dataToShow.data.image" alt="image" />
            </div>
            <!--end::Avatar-->

            <!--begin::Name-->
            <a
              href="#"
              class="fs-3 text-gray-800 text-hover-primary fw-bold mb-1"
            >
              {{ dataToShow.data.first_name }} {{ dataToShow.data.last_name }}
            </a>
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

          <!--begin::Details content-->
          <div id="kt_customer_view_details" class="show">
            <div class="py-5 fs-6">
              <!--begin::Badge-->
              <div class="badge badge-light-info d-inline">
                {{ dataToShow.data.type }} {{ $t("user") }}
              </div>
              <!--end::Badge-->

              <div class="fw-bold mt-5">{{ $t("account_id") }}</div>
              <div class="text-gray-600">ID-{{ dataToShow.data.id }}</div>

              <div class="fw-bold mt-5">{{ $t("language") }}</div>
              <div class="text-gray-600">
                {{ locale === "ar" ? "العربية" : "English" }}
              </div>
              <div class="fw-bold mt-5">{{ $t("verified") }}</div>
              <div class="text-gray-600">
                {{
                  dataToShow.data.verified ? $t("verified") : $t("notVerified")
                }}
              </div>

              <div class="fw-bold mt-5">{{ $t("phone") }}</div>
              <div class="text-gray-600">{{ dataToShow.data.phone }}</div>
              <div class="fw-bold mt-5">{{ $t("createdDate") }}</div>
              <div class="text-gray-600">{{ dataToShow.data.created_at }}</div>
            </div>
          </div>
          <!--end::Details content-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Card-->
    </div>
    <div v-else class="w-full h-screen grid place-items-center">
      <span class="loader"></span>
    </div>
    <div class="tab-content" id="myTabContent">
      <!--begin:::Tab pane-->
      <div
        v-if="dataToShow"
        class="tab-pane fade show active"
        id="kt_customer_view_overview_tab"
        role="tabpanel"
      >
        <PaymentRecords
          v-if="dataToShow.data.cars.length > 0"
          :data="dataToShow.data.cars"
          card-classes="mb-6 mb-xl-9"
        ></PaymentRecords>

        <CreditBalance
          v-if="dataToShow.data.workshop"
          :data="dataToShow.data.workshop"
          card-classes="mb-6 mb-xl-9"
        ></CreditBalance>

      </div>
    </div>
  </div>
</template>

<script setup>
import PaymentRecords from "@/components/customers/cards/overview/PaymentRecordsV15.vue";
import CreditBalance from "@/components/customers/cards/overview/CreditBalance.vue";
import Invoices from "@/components/customers/cards/overview/Invoices.vue";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
const route = useRoute();

const { locale } = useI18n();
const dataToShow = ref();

// Fetch customers
const fetching = async () => {
  try {
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/users/${route.params.id}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    dataToShow.value = data?.value || {}; // Fallback to an empty object
  } catch (error) {
    console.error("Error fetching data:", error);
    dataToShow.value = null; // Set to null on error to avoid further issues
  }
};

fetching();

watch(locale, fetching);
</script>

<style scoped>
.loader {
  width: 48px;
  height: 48px;
  border: 2px solid #fff;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after,
.loader::before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  background: #ff3d00;
  width: 6px;
  height: 6px;
  transform: translate(150%, 150%);
  border-radius: 50%;
}
.loader::before {
  left: auto;
  top: auto;
  right: 0;
  bottom: 0;
  transform: translate(-150%, -150%);
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
