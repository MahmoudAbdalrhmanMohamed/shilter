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

            <!--begin::Name-->
            <a
              href="#"
              class="fs-3 text-gray-800 text-hover-primary fw-bold mb-1"
            >
              {{ dataToShow.name }}
            </a>
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
              class="badge badge-light-info d-inline text-xl md:text-2xl animate-pulse"
            >
              {{ dataToShow.status }}
            </div>
            <div class="py-5 fs-6">
              <!-- Location -->
              <div class="fw-bold mt-5">{{ $t("location") }}</div>
              <div class="text-gray-600">{{ dataToShow.location }}</div>

              <!-- Age -->
              <div class="fw-bold mt-5">{{ $t("age") }}</div>
              <div class="text-gray-600">{{ dataToShow.age }}</div>

              <!-- Needs -->
              <div class="fw-bold mt-5">{{ $t("needs") }}</div>
              <div class="text-gray-600">
                <ul>
                  <li v-for="(need, index) in dataToShow.needs" :key="index">
                    {{ need }}
                  </li>
                </ul>
              </div>

              <!-- Description -->
              <div class="fw-bold mt-5">{{ $t("description") }}</div>
              <div class="text-gray-600">{{ dataToShow.description }}</div>

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
          <h3 class="fw-bold mb-5">Location Map</h3>
          <!-- Google Map Component -->
          <GoogleMap
            api-key="AIzaSyDA64gvZkZ_jVnaSoXLb-H0wc2A9xWpe_c"
            :center="center"
            :zoom="15"
            style="height: 400px; width: 100%"
          >
            <Marker :options="{ position: 'center' }" />
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
import { GoogleMap, Marker } from "vue3-google-map"; // Import GoogleMap and Marker components

const { t } = useI18n();

// Reactive state
const dataToShow = ref(null);
const loading = ref(true); // Start with loading true
const isDetailsOpen = ref(false); // Track if details are open

// Google Maps API Key (replace with your actual API key)
const googleMapsApiKey = "AIzaSyDA64gvZkZ_jVnaSoXLb-H0wc2A9xWpe_c";

const center = { lat: 40.689247, lng: -74.044502 };
// Map center and marker options
const mapCenter = ref({ lat: 35.151, lng: 27.156 }); // Default to New York
const markerOptions = ref({
  position: { lat: 35.151, lng: 27.156 }, // Default to New York
  title: "Homeless Person Location",
});

// Fake data for a homeless person
const fakeData = {
  id: 1,
  name: "John Doe",
  image: "https://via.placeholder.com/150",
  status: "Needs Shelter",
  location: "New York, USA",
  age: 45,
  needs: ["Shelter", "Food", "Clothing"],
  description:
    "John has been homeless for 2 years and is seeking assistance to get back on his feet.",
  language_code: "English", // Added for compatibility with the template
  followers_count: 120, // Added for compatibility with the template
  rate_tranlation: 4.5, // Added for compatibility with the template
  rate_clarity: 4.2, // Added for compatibility with the template
  experience_type: "Senior", // Added for compatibility with the template
  type: "Homeless", // Added for compatibility with the template
};

// Simulate loading state

dataToShow.value = fakeData;
loading.value = false;

// Update map center and marker based on fake data

mapCenter.value = { lat: 35.151, lng: 27.156 };
markerOptions.value.position = { lat: 35.151, lng: 27.156 };

// Toggle details visibility
const toggleDetails = () => {
  isDetailsOpen.value = !isDetailsOpen.value;
};

// Accept request
const acceptRequest = (id) => {
  console.log("Accepted request for ID:", id);
  alert(`Accepted request for ID: ${id}`);
};

// Reject request
const rejectRequest = (id) => {
  console.log("Rejected request for ID:", id);
  alert(`Rejected request for ID: ${id}`);
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
</style>
