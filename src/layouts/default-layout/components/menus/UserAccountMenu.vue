<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold py-4 fs-6 w-275px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content d-flex align-items-center px-3">
        <!--begin::Avatar-->
        <div class="symbol symbol-50px me-5">
          <img v-if="dataVal" alt="Logo" :src="dataVal.image" />
          <img
            v-else
            src="/media/temp.webp"
            class="rounded-full bg-gray-600"
            alt="user"
          />
        </div>
        <!--end::Avatar-->

        <!--begin::Username-->
        <div class="d-flex flex-column">
          <div class="fw-bold d-flex align-items-center fs-5">
            {{ dataVal?.username }}
            <span
              class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2"
              >{{ $t("Pro") }}</span
            >
          </div>
          <a href="#" class="fw-semibold text-muted text-hover-primary fs-7">
            {{ dataVal?.email }}</a
          >
        </div>
        <!--end::Username-->
      </div>
    </div>
    <div
      class="menu-item px-5"
      data-kt-menu-trigger="hover"
      :data-kt-menu-placement="locale === 'ar' ? 'right-start' : 'left-start'"
      data-kt-menu-flip="center, top"
    >
      <div class="menu-link px-5">
        <span class="menu-title position-relative">
          {{ $t("Language") }}
          <span
            class="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0"
          >
            {{ $t(currentLangugeLocale.name) }}
            <img
              class="w-15px h-15px rounded-1 ms-2"
              :src="currentLangugeLocale.flag"
              alt="current language"
            />
          </span>
        </span>
      </div>

      <!--begin::Menu sub-->
      <div class="menu-sub menu-sub-dropdown w-175px py-4">
        <div
          class="menu-item px-3"
          v-for="(lang, code) in countries"
          :key="code"
        >
          <a
            @click="setLang(code, code === 'ar' ? 'rtl' : 'ltr')"
            href="#"
            class="menu-link d-flex px-5"
            :class="{ active: currentLanguage === code }"
          >
            <span class="symbol symbol-20px me-4">
              <img class="rounded-1" :src="lang.flag" alt="language flag" />
            </span>
            {{ $t(lang.name) }}
          </a>
        </div>
      </div>
      <!--end::Menu sub-->
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5 my-1">
      <router-link to="/apps/admins/updateName" class="menu-link px-5">
        {{ $t("updateName") }}
      </router-link>
    </div>
    <div class="menu-item px-5 my-1">
      <router-link to="/apps/admins/updateImage" class="menu-link px-5">
        {{ $t("updatePhoto") }}
      </router-link>
    </div>
    <div class="menu-item px-5 my-1">
      <router-link to="/apps/admins/updatePassword" class="menu-link px-5">
        {{ $t("updatePassword") }}
      </router-link>
    </div>

    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="signOut()" class="menu-link px-5"> {{ $t("Sign Out") }} </a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useFetch } from "@vueuse/core";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { getAssetPath } from "@/core/helpers/assets";

const router = useRouter();
const dataVal = ref(null);
const { locale, t } = useI18n();

locale.value = localStorage.getItem("lang") || "en";

document.documentElement.style.direction =
  localStorage.getItem("direction") || "ltr";

watch(
  () => locale.value,
  () => {
    document.documentElement.style.direction =
      locale.value === "ar" ? "rtl" : "ltr";
  },
);

// const fetchData = async () => {
//   try {
//     const response = await useFetch(
//       `${import.meta.env.VITE_APP_API_URL_MEGATRON}/auth/info`,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       },
//     ).json();
//     dataVal.value = response.data?.value?.data;
//   } catch (error) {
//     localStorage.removeItem("authToken");
//     router.replace({ name: "sign-in" });

//     console.error("Error fetching data:", error);
//   }
// };

// fetchData();

const signOut = async () => {
  try {
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    if (data.value.status) {
      localStorage.removeItem("authToken");
      Swal.fire({
        text: "You have successfully logged out!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semibold btn-light-primary",
        },
      }).then(() => {
        router.push({ name: "sign-in" });
      });
    }
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};

const setLang = (lang, dir) => {
  localStorage.setItem("lang", lang);
  locale.value = lang;
  localStorage.setItem("direction", dir);
};

const countries = {
  en: {
    flag: getAssetPath("media/flags/united-states.svg"),
    name: t("English"),
  },
  ar: {
    flag: getAssetPath("media/flags/Saudi_Arabia.svg"),
    name: t("Arabic"),
  },
  zh: {
    flag: getAssetPath("media/flags/china.svg"),
    name: t("Chinese"),
  },
  hi: {
    flag: getAssetPath("media/flags/india.svg"),
    name: t("Hindi"),
  },
  it: {
    flag: getAssetPath("media/flags/italy.svg"),
    name: t("Italian"),
  },
  es: {
    flag: getAssetPath("media/flags/spain.svg"),
    name: t("Spanish"),
  },
  ru: {
    flag: getAssetPath("media/flags/russia.svg"),
    name: t("Russian"),
  },
  tr: {
    flag: getAssetPath("media/flags/turkey.svg"),
    name: t("Turkish"),
  },
  fr: {
    flag: getAssetPath("media/flags/france.svg"),
    name: t("French"),
  },
  de: {
    flag: getAssetPath("media/flags/germany.svg"),
    name: t("German"),
  },
};

const currentLanguage = computed(() => locale.value);
const currentLangugeLocale = computed(() => countries[locale.value]);
</script>
