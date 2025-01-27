<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px"
    data-kt-menu="true"
  >
    <!--begin::Heading-->
    <div
      class="d-flex flex-column bgi-no-repeat rounded-top"
      :style="`background-image: url('${getAssetPath('/smallLogo.svg')}')`"
    >
      <!--begin::Title-->
      <h3 class="text-white fw-semibold px-9 mt-10 mb-6">
        {{ $t("notifications.title") }}
        <span class="fs-8 opacity-75 ps-3">
          {{ $t("notifications.reports", { count: totalNotifications }) }}
        </span>
      </h3>
      <!--end::Title-->

      <!--begin::Mark All as Read Button-->
      <div class="text-end mb-6 px-4">
        <button
          class="btn btn-sm btn-light-primary"
          @click="markAllAsRead"
          :disabled="loading || notifications.length === 0"
        >
          {{ $t("notifications.markAllAsRead") }}
        </button>
      </div>
      <!--end::Mark All as Read Button-->
    </div>
    <!--end::Heading-->

    <!--begin::Tab content-->
    <div class="tab-content">
      <!--begin::Tab panel-->
      <div
        class="tab-pane fade show active"
        id="kt_topbar_notifications_1"
        role="tabpanel"
      >
        <!--begin::Items-->
        <div
          class="scroll-y mh-325px my-5 px-8"
          @scroll="handleScroll"
          ref="scrollContainer"
        >
          <template v-if="loading && notifications.length === 0">
            <!-- Loading State -->
            <div class="text-center py-4">
              <span class="spinner-border text-primary"></span>
            </div>
          </template>
          <template v-else>
            <template v-for="(item, index) in notifications" :key="index">
              <!--begin::Item-->
              <div
                class="d-flex flex-stack py-4 notification-item"
                :class="{ 'hover-effect': !item.readIs }"
                @click="markAsRead(item.id)"
              >
                <!--begin::Section-->
                <div class="d-flex align-items-center">
                  <!--begin::Symbol-->
                  <div class="symbol symbol-35px me-4">
                    <span
                      v-if="!item.readIs"
                      class="symbol-label bg-light-warning"
                    >
                      <img
                        :src="getAssetPath('smallLogo.svg')"
                        alt="Unread"
                        class="h-25px w-25px"
                      />
                    </span>
                    <span v-else class="symbol-label bg-light-success">
                      <KTIcon icon-name="check" icon-class="text-success" />
                    </span>
                  </div>
                  <!--end::Symbol-->

                  <!--begin::Title-->
                  <div class="mb-0 me-2">
                    <a
                      href="#"
                      class="fs-6 text-gray-800 text-hover-primary fw-bold"
                      >{{ item.title }}</a
                    >
                    <div class="text-gray-500 fs-7">
                      {{ item.created_at }}
                    </div>
                  </div>
                  <!--end::Title-->
                </div>
                <!--end::Section-->

                <!--begin::Remove Button-->
                <button
                  class="btn btn-icon btn-sm btn-light-danger"
                  @click.stop="deleteNotification(item.id)"
                >
                  <KTIcon icon-name="trash" icon-class="fs-5" />
                </button>
                <!--end::Remove Button-->
              </div>
              <!--end::Item-->
            </template>

            <!-- Loading More State -->
            <template v-if="loadingMore">
              <div class="text-center py-4">
                <span class="spinner-border text-primary"></span>
              </div>
            </template>

            <!-- No More Notifications -->
            <template v-if="!hasMore">
              <div class="text-center py-4 text-gray-600">
                {{ $t("notifications.noMoreNotifications") }}
              </div>
            </template>
          </template>
        </div>
        <!--end::Items-->
      </div>
      <!--end::Tab panel-->
    </div>
    <!--end::Tab content-->
  </div>
  <!--end::Menu-->
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAssetPath } from "@/core/helpers/assets";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";
const router = useRouter();

const { t } = useI18n();

// Reactive state
const loading = ref(false);
const loadingMore = ref(false);
const notifications = ref([]);
const totalNotifications = ref(0);
const currentPage = ref(1);
const hasMore = ref(true);
const scrollContainer = ref(null);

// Fetch data function
const fetchData = async (page = 1) => {
  try {
    if (page === 1) {
      loading.value = true;
    } else {
      loadingMore.value = true;
    }

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/notifications?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(t("notifications.error.fetch"));
    }

    const data = await response.json();

    if (data.status) {
      if (page === 1) {
        notifications.value = data.data.data;
      } else {
        notifications.value = [...notifications.value, ...data.data.data];
      }
      totalNotifications.value = data.data.meta.total;

      // Check if there are more pages
      if (data.data.data.length < data.data.meta.per_page) {
        hasMore.value = false;
      }
    } else {
      localStorage.removeItem("authToken");
      router.replace("/");
      // Swal.fire({
      //  icon: "error",
      //  title: t("common.error"),
      //  text: data.message || t("notifications.error.fetch"),
      // });
    }
  } catch (error) {
    localStorage.removeItem("authToken");
    router.replace("/");
    //Swal.fire({
    //  icon: "error",
    // title: t("common.error"),
    //text: error.message || t("notifications.error.fetch"),
    //  });
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

// Handle scroll event
const handleScroll = (event) => {
  const container = event.target;
  const { scrollTop, scrollHeight, clientHeight } = container;

  // Fetch next page if scrolled to the bottom
  if (
    scrollHeight - (scrollTop + clientHeight) < 50 &&
    hasMore.value &&
    !loadingMore.value
  ) {
    currentPage.value += 1;
    fetchData(currentPage.value);
  }
};

// Mark a notification as read
const markAsRead = async (id) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/notifications/${id}/read`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(t("notifications.error.markAsRead"));
    }

    const data = await response.json();

    if (data.status) {
      // Update the notification's read status in the UI
      const index = notifications.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        notifications.value[index].readIs = true;
      }

      // Show success message
      Swal.fire({
        icon: "success",
        title: t("common.success"),
        text: t("notifications.success.markAsRead"),
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: t("common.error"),
        text: data.message || t("notifications.error.markAsRead"),
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: t("common.error"),
      text: error.message || t("notifications.error.markAsRead"),
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/notifications/all-read`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(t("notifications.error.markAllAsRead"));
    }

    const data = await response.json();

    if (data.status) {
      // Update all notifications' read status in the UI
      notifications.value.forEach((item) => (item.readIs = true));

      // Show success message
      Swal.fire({
        icon: "success",
        title: t("common.success"),
        text: t("notifications.success.markAllAsRead"),
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: t("common.error"),
        text: data.message || t("notifications.error.markAllAsRead"),
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: t("common.error"),
      text: error.message || t("notifications.error.markAllAsRead"),
    });
  }
};

// Delete a notification
const deleteNotification = async (id) => {
  const result = await Swal.fire({
    title: t("notifications.deleteConfirmation.title"),
    text: t("notifications.deleteConfirmation.text"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: t("notifications.deleteConfirmation.confirmButton"),
    cancelButtonText: t("notifications.deleteConfirmation.cancelButton"),
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/notifications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(t("notifications.error.delete"));
      }

      const data = await response.json();

      if (data.status) {
        // Remove the deleted notification from the UI
        notifications.value = notifications.value.filter(
          (item) => item.id !== id,
        );
        totalNotifications.value -= 1;

        // Show success message
        Swal.fire({
          icon: "success",
          title: t("common.success"),
          text: t("notifications.success.delete"),
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: t("common.error"),
          text: data.message || t("notifications.error.delete"),
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("common.error"),
        text: error.message || t("notifications.error.delete"),
      });
    }
  }
};

fetchData();
</script>
<style scoped>
.notification-item {
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  border-radius: 8px;
  padding: 12px;
}

.notification-item.hover-effect:hover {
  background: linear-gradient(135deg, #f6f7f9, #e9ecef);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-light-danger {
  background-color: #fff5f5;
  border-color: #fff5f5;
  color: #f1416c;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.btn-light-danger:hover {
  background-color: #f1416c;
  color: white;
  transform: scale(1.1);
}
</style>
