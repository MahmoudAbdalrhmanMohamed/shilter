<template>
  <!--begin::Header-->
  <div
    v-if="headerDisplay"
    id="kt_app_header"
    class="app-header"
    data-kt-sticky="true"
    data-kt-sticky-activate="{default: true, lg: true}"
    data-kt-sticky-name="app-header-minimize"
    data-kt-sticky-offset="{default: '200px', lg: '0'}"
    data-kt-sticky-animation="false"
  >
    <!--begin::Header container-->
    <div
      class="app-container d-flex align-items-stretch justify-content-between"
      :class="{
        'container-fluid': headerWidthFluid,
        'container-xxl': !headerWidthFluid,
      }"
    >
      <div
        v-if="layout === 'light-header' || layout === 'dark-header'"
        class="d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15"
      >
        <router-link to="/">
          <img
            v-if="themeMode === 'light' && layout === 'light-header'"
            alt="Logo"
            :src="getAssetPath('media/logos/default.svg')"
            class="h-20px h-lg-30px app-sidebar-logo-default theme-light-show"
          />
          <img
            v-if="
              layout === 'dark-header' ||
              (themeMode === 'dark' && layout === 'light-header')
            "
            alt="Logo"
            :src="getAssetPath('media/logos/default-dark.svg')"
            class="h-20px h-lg-30px app-sidebar-logo-default"
          />
        </router-link>
      </div>
      <template v-else>
        <!--begin::sidebar mobile toggle-->
        <div
          :class="locale === 'ar' ? '-mr-3 ml-1 md:ml-2' : '-ml-3 mr-1 md:mr-2'"
          class="flex items-center lg:hidden"
        >
          <div
            class="btn btn-icon btn-active-color-primary w-35px h-35px"
            id="kt_app_sidebar_mobile_toggle"
          >
            <KTIcon icon-name="abstract-14" icon-class="fs-2 fs-md-1" />
          </div>
        </div>
        <!--end::sidebar mobile toggle-->
        <!--begin::Mobile logo-->
        <div class="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
          <router-link to="/" class="d-lg-none">
            <img
              alt="Logo"
              :src="getAssetPath('logo.png')"
              class="w-40px object-cover mix"
            />
          </router-link>
        </div>
        <!--end::Mobile logo-->
      </template>
      <!--begin::Header wrapper-->
      <div
        class="d-flex align-items-stretch justify-content-between flex-lg-grow-1"
        id="kt_app_header_wrapper"
      >
        <KTHeaderMenu />
        <KTHeaderNavbar />
      </div>
      <!--end::Header wrapper-->
    </div>
    <!--end::Header container-->
  </div>
  <!--end::Header-->
</template>

<script setup>
import { getAssetPath } from "@/core/helpers/assets";
import KTHeaderMenu from "@/layouts/default-layout/components/header/menu/Menu.vue";
import KTHeaderNavbar from "@/layouts/default-layout/components/header/Navbar.vue";
import {
  headerDisplay,
  headerWidthFluid,
  layout,
  themeMode,
} from "@/layouts/default-layout/config/helper";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
</script>
