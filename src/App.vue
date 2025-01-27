<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeMount, onMounted } from "vue";
import { RouterView } from "vue-router";
import { useConfigStore } from "@/stores/config";
import { useThemeStore } from "@/stores/theme";
import { useBodyStore } from "@/stores/body";
import { themeConfigValue } from "@/layouts/default-layout/config/helper";
import { initializeComponents } from "@/core/plugins/keenthemes";

export default defineComponent({
  name: "app",
  components: {
    RouterView,
  },
  setup() {
    const configStore = useConfigStore();
    const themeStore = useThemeStore();
    const bodyStore = useBodyStore();

    onBeforeMount(() => {
      // Override the layout config using saved data from localStorage (or static config)
      configStore.overrideLayoutConfig();

      // Set theme mode based on configuration
      themeStore.setThemeMode(themeConfigValue.value);
    });

    onMounted(() => {
      nextTick(() => {
        initializeComponents();

        // Remove the loading class from the body
        bodyStore.removeBodyClassName("page-loading");
      });
    });
  },
});
</script>

<style lang="scss">
@import "bootstrap-icons/font/bootstrap-icons.css";
@import "apexcharts/dist/apexcharts.css";
@import "quill/dist/quill.snow.css";
@import "animate.css";
@import "sweetalert2/dist/sweetalert2.css";
@import "nouislider/dist/nouislider.css";
@import "@fortawesome/fontawesome-free/css/all.min.css";
@import "socicon/css/socicon.css";
@import "line-awesome/dist/line-awesome/css/line-awesome.css";
@import "dropzone/dist/dropzone.css";
@import "@vueform/multiselect/themes/default.css";
@import "prism-themes/themes/prism-shades-of-purple.css";
@import "element-plus/dist/index.css";

// Main demo style scss
@import "assets/keenicons/duotone/style.css";
@import "assets/keenicons/outline/style.css";
@import "assets/keenicons/solid/style.css";
@import "assets/sass/element-ui.dark";
@import "assets/sass/plugins";
@import "assets/sass/style";

#app {
  display: contents;
}
.fade-enter-from,
.fade-leave-to {
  transform: translateY(100px);
  opacity: 0;
}
.fade-enter-from,
.fade-leave-to {
  transform: translateY(0);
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: 0.3s;
}
.el-upload-list__item + .el-upload--picture-card {
  display: none !important;
}
</style>
