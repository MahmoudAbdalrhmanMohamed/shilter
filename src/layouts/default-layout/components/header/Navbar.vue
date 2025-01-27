<template>
  <!--begin::Navbar-->
  <div class="app-navbar flex-shrink-0">
    <!--begin::Notifications-->
    <div class="app-navbar-item ms-1 ms-md-4">
      <!--begin::Menu- wrapper-->
      <div
        class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px"
        data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
        id="kt_menu_item_wow"
      >
        <KTIcon icon-name="notification-status" icon-class="fs-2" />
      </div>
      <KTNotificationMenu />
      <!--end::Menu wrapper-->
    </div>
    <!--end::Notifications-->

    <!--begin::Theme mode-->
    <div class="app-navbar-item ms-1 ms-md-3">
      <a
        href="#"
        class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-30px h-30px w-md-40px h-md-40px"
        data-kt-menu-trigger="{default:'click', lg: 'hover'}"
        data-kt-menu-attach="parent"
        :data-kt-menu-placement="
          locale === 'en' ? 'bottom-end' : 'bottom-start'
        "
      >
        <KTIcon
          v-if="themeMode === 'light'"
          icon-name="night-day"
          icon-class="fs-2"
        />
        <KTIcon v-else icon-name="moon" icon-class="fs-2" />
      </a>
      <KTThemeModeSwitcher />
    </div>
    <!--end::Theme mode-->

    <!--begin::User menu-->
    <div class="app-navbar-item ms-1 ms-md-4" id="kt_header_user_menu_toggle">
      <div
        class="cursor-pointer symbol symbol-35px"
        data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
        data-kt-menu-attach="parent"
        :data-kt-menu-placement="
          locale === 'ar' ? 'bottom-start' : 'bottom-end'
        "
      >
        <img
          v-if="!loading && localFormData"
          :src="localFormData"
          class="rounded-3"
          alt="user"
        />
        <img
          v-else
          src="/media/temp.webp"
          class="rounded-full bg-gray-600"
          alt="user"
        />
        <!-- <span v-else class="loader"></span> -->
      </div>
      <KTUserMenu />
    </div>
    <!--end::User menu-->

    <!--begin::Header menu toggle-->
    <div class="app-navbar-item d-lg-none ms-2 me-n2">
      <div
        class="btn btn-flex btn-icon btn-active-color-primary w-30px h-30px"
        id="kt_app_header_menu_toggle"
      >
        <KTIcon icon-name="element-4" icon-class="fs-2" />
      </div>
    </div>
    <!--end::Header menu toggle-->
  </div>
  <!--end::Navbar-->
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useThemeStore } from "@/stores/theme";
import { ThemeModeComponent } from "@/assets/ts/layout";
import KTNotificationMenu from "@/layouts/default-layout/components/menus/NotificationsMenu.vue";
import KTUserMenu from "@/layouts/default-layout/components/menus/UserAccountMenu.vue";
import KTThemeModeSwitcher from "@/layouts/default-layout/components/theme-mode/ThemeModeSwitcher.vue";
import { useFetch } from "@vueuse/core";
import { getAssetPath } from "@/core/helpers/assets";

// Setup state management
const store = useThemeStore();
const { locale } = useI18n();
const loading = ref(false);
const localFormData = ref("");

// // Fetch data function
// const fetchData = async () => {
//   try {
//     loading.value = true;
//     const response = await useFetch(
//       `${import.meta.env.VITE_APP_API_URL_MEGATRON}/auth/info`,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       },
//     ).json();

//     if (response.data?.value?.data?.image) {
//       localFormData.value = response.data.value.data.image;
//     }
//     loading.value = false;
//   } catch (error) {
//     localStorage.removeItem("authToken");
//     router.replace({ name: "sign-in" });
//     console.error("Error fetching data:", error);
//     loading.value = false;
//   }
// };

// // Automatically fetch data on mount
// onMounted(fetchData);

// Computed property for theme mode
const themeMode = computed(() => {
  if (store.mode === "system") {
    return ThemeModeComponent.getSystemMode();
  }
  return store.mode;
});
</script>
