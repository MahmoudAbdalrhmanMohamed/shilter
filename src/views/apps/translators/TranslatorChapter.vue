<template>
  <!--begin::Layout-->
  <div class="flex flex-col">
    <!--begin::Sidebar-->
    <div
      v-if="!loading && dataToShow"
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
              <img :src="dataToShow.image" alt="image" class="object-cover" />
            </div>
            <!--end::Avatar-->

            <!--end::Name-->
          </div>
          <!--end::Summary-->

          <!--begin::Details toggle-->
          <div
            class="d-flex flex-stack fs-4 py-3"
            @click="toggleDetails"
            role="button"
          >
            <div class="fw-bold rotate collapsible">
              {{ $t("details") }}
              <span class="ms-2" :class="{ 'rotate-180': isDetailsOpen }">
                <KTIcon icon-name="down" icon-class="fs-3" />
              </span>
            </div>
          </div>
          <!--end::Details toggle-->

          <!--begin::Details content-->
          <div
            id="kt_translator_view_details"
            class="my-4"
            :class="{ show: isDetailsOpen }"
          >
            <!-- Status Badge with Animation -->
            <div
              :class="[
                'badge d-inline text-xl capitalize md:text-2xl',
                {
                  'badge-gradient-approved': dataToShow.status === 'approved',
                  'badge-gradient-rejected': dataToShow.status === 'rejected',
                  'badge-gradient-pending': dataToShow.status === 'pending',
                },
              ]"
            >
              {{ dataToShow.status }}
            </div>
            <div class="py-5 fs-6">
              <!-- Location -->
              <div class="fw-bold mt-5">{{ $t("location") }}</div>
              <div class="text-gray-600">{{ dataToShow.address }}</div>

              <!-- Description -->
              <div class="fw-bold mt-5">{{ $t("description") }}</div>
              <div class="text-gray-600">
                {{ dataToShow.note ? dataToShow.note : $t("noDataFound") }}
              </div>

              <!-- Buttons -->
              <div class="flex items-center w-full mt-5">
                <button
                  class="btn btn-accept me-2 w-full"
                  @click="acceptRequest(dataToShow.id)"
                >
                  <i class="fas fa-check-circle me-2 pulse-icon"></i>
                  {{ $t("accept") }}
                </button>
                <button
                  class="btn btn-reject w-full"
                  @click="rejectRequest(dataToShow.id)"
                >
                  <i class="fas fa-times-circle me-2 pulse-icon"></i>
                  {{ $t("reject") }}
                </button>
              </div>
            </div>
          </div>
          <!--end::Details content-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Card-->

      <!-- New Card for Map -->
      <div class="card mb-5 mb-xl-8">
        <div class="card-body">
          <h3 class="fw-bold mb-5">{{ $t("locationMap") }}</h3>
          <!-- Google Map Component -->
          <GoogleMap
            :api-key="googleMapsApiKey"
            :center="mapCenter"
            :mapId="googleMapsApiKey"
            :zoom="15"
            style="height: 400px; width: 100%"
          >
            <AdvancedMarker :options="{ position: mapCenter }" />
          </GoogleMap>
        </div>
      </div>
    </div>

    <!--begin::Main Content-->
    <div v-else class="w-full h-screen grid place-items-center">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { GoogleMap, AdvancedMarker } from "vue3-google-map"; // Import GoogleMap and Marker components
import Swal from "sweetalert2"; // Import SweetAlert2
import { useRoute } from "vue-router";

const { t, locale } = useI18n();

// Reactive state
const dataToShow = ref(null);
const loading = ref(true); // Start with loading true
const isDetailsOpen = ref(true); // Track if details are open

// Google Maps API Key (replace with your actual API key)
const googleMapsApiKey = "AIzaSyDA64gvZkZ_jVnaSoXLb-H0wc2A9xWpe_c";

// Map center and marker options
const mapCenter = ref({}); // Default to New York

// Fetch data from API
const fetchData = async (id) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/homelesses/${id}`,
      {
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    if (data.status) {
      dataToShow.value = data.data;
      mapCenter.value = {
        lat: parseFloat(data.data.latitude),
        lng: parseFloat(data.data.longitude),
      };
    } else {
      console.error("Failed to fetch data:", data.message);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to fetch data. Please try again later.",
    });
  } finally {
    loading.value = false;
  }
};

const route = useRoute();
// Fetch data when component is mounted

const id = route.params.homeless; // Get ID from route params
fetchData(id);

// Toggle details visibility
const toggleDetails = () => {
  isDetailsOpen.value = !isDetailsOpen.value;
};

// Accept request
const acceptRequest = async (id) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/homelesses/${id}/approved`,
      {
        method: "PATCH",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to accept request");
    }
    const data = await response.json();
    if (data.status) {
      dataToShow.value.status = "approved";
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Request accepted successfully!",
      });
      fetchData(id); // Refresh data
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "Failed to accept request",
      });
    }
  } catch (error) {
    console.error("Error accepting request:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error accepting request. Please try again later.",
    });
  }
};

// Reject request
const rejectRequest = async (id) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/homelesses/${id}/rejected`,
      {
        method: "PATCH",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to reject request");
    }
    const data = await response.json();
    if (data.status) {
      dataToShow.value.status = "rejected";

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Request rejected successfully!",
      });
      fetchData(id); // Refresh data
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "Failed to reject request",
      });
    }
  } catch (error) {
    console.error("Error rejecting request:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error rejecting request. Please try again later.",
    });
  }
};
</script>

<style scoped>
/* Base button styles */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* Gradient animation */
.btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%
  );
  background-size: 200% 200%;
  transition: background-position 0.5s ease;
  z-index: 1;
  border-radius: 12px;
}

.btn:hover::before {
  background-position: -100% -100%;
}

/* Accept button */
.btn-accept {
  background: linear-gradient(135deg, #4caf50, #81c784);
  color: white;
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
  position: relative;
  z-index: 2;
}

.btn-accept:hover {
  background: linear-gradient(135deg, #81c784, #4caf50);
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
  transform: translateY(-2px);
}

.btn-accept:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
}

/* Reject button */
.btn-reject {
  background: linear-gradient(135deg, #f44336, #e57373);
  color: white;
  box-shadow: 0 4px 6px rgba(244, 67, 54, 0.2);
  position: relative;
  z-index: 2;
}

.btn-reject:hover {
  background: linear-gradient(135deg, #e57373, #f44336);
  box-shadow: 0 6px 12px rgba(244, 67, 54, 0.3);
  transform: translateY(-2px);
}

.btn-reject:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(244, 67, 54, 0.2);
}

/* Icon styles */
.btn i {
  font-size: 16px;
  transition:
    transform 0.3s ease,
    color 0.3s ease;
  color: white; /* Set icon color to white */
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5); /* Add a subtle glow */
}

/* Icon animation on hover */
.btn:hover i {
  transform: scale(1.2);
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.8); /* Increase glow on hover */
}

/* Pulse animation for icons */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.pulse-icon {
  animation: pulse 1.5s infinite;
}

/* Status Badge Animation */
@keyframes pulse-badge {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.badge.animate-pulse {
  animation: pulse-badge 2s infinite;
  background: linear-gradient(135deg, #6ee7b7, #3b82f6);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
}

/* Details content visibility */
#kt_translator_view_details {
  display: none;
  transition: all 0.3s ease;
}

#kt_translator_view_details.show {
  display: block;
}

/* Rotate arrow icon */
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.GoogleMap {
  height: 400px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}
.badge {
  transition: all 0.5s ease;
}

.badge-gradient-approved {
  animation: pulse-badge 2s infinite;
  background: linear-gradient(
    135deg,
    #6ee7b7,
    #3b82f6
  ); /* Green-Blue gradient */
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2); /* Subtle shadow */
}

.badge-gradient-rejected {
  animation: pulse-badge 2s infinite;
  background: linear-gradient(
    135deg,
    #f87171,
    #ef4444
  ); /* Light to Dark Red gradient */
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2); /* Subtle shadow */
}

.badge-gradient-pending {
  animation: pulse-badge 2s infinite;
  background: linear-gradient(
    135deg,
    #fcd34d,
    #f59e0b
  ); /* Yellow-Orange gradient */
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(245, 158, 11, 0.2); /* Subtle shadow */
}

.badge-gradient-approved:hover,
.badge-gradient-rejected:hover,
.badge-gradient-pending:hover {
  filter: brightness(1.1);
  transform: scale(1.05); /* Slight zoom-in */
  transition: all 0.3s ease;
}
</style>
