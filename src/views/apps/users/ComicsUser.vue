<template>
  <!--begin::Layout-->
  <div class="flex flex-col">
    <!--begin::Sidebar-->
    <div v-if="dataToShow" class="flex-column flex-lg-row-auto w-full mb-10">
      <!--begin::Card-->
      <div class="card mb-5 mb-xl-8">
        <!--begin::Card body-->
        <div class="card-body pt-15">
          <!--begin::Summary-->
          <div class="d-flex flex-center flex-column mb-5">
            <!--begin::Avatar-->
            <div class="symbol symbol-100px symbol-circle mb-7">
              <img
                :src="dataToShow.image"
                alt="image"
                class="rounded-full w-[100px] h-[100px]"
              />
            </div>
            <!--end::Avatar-->

            <!--begin::Name-->
            <a
              href="#"
              class="fs-3 text-gray-800 text-hover-primary fw-bold mb-1"
            >
              {{ dataToShow.first_name }} {{ dataToShow.last_name }}
            </a>
          </div>
          <!--end::Summary-->

          <!--begin::Details toggle-->
          <div class="d-flex flex-stack fs-4 py-3">
            <div
              class="fw-bold rotate collapsible"
              role="button"
              @click="toggleDetails"
            >
              {{ $t("details") }}
              <span class="ms-2" :class="{ 'rotate-180': isDetailsOpen }">
                <KTIcon icon-name="down" icon-class="fs-3" />
              </span>
            </div>
          </div>
          <!--end::Details toggle-->

          <!--begin::Details content-->
          <div v-if="isDetailsOpen" id="kt_comic_user_details">
            <div class="py-5 fs-6">
              <!--begin::Badge-->
              <div class="badge badge-light-info d-inline">
                {{ dataToShow.type }} {{ $t("user") }}
              </div>
              <!--end::Badge-->

              <div class="fw-bold mt-5">{{ $t("account_id") }}</div>
              <div class="text-gray-600">ID-{{ dataToShow.id }}</div>

              <div class="fw-bold mt-5">{{ $t("language") }}</div>
              <div class="text-gray-600">
                {{ dataToShow.language_code === "ar" ? "العربية" : "English" }}
              </div>

              <div class="fw-bold mt-5">{{ $t("description") }}</div>
              <div class="text-gray-600">{{ dataToShow.description }}</div>

              <div class="fw-bold mt-5">{{ $t("verified") }}</div>
              <div class="text-gray-600">
                {{ dataToShow.verified ? $t("verified") : $t("notVerified") }}
              </div>

              <div class="fw-bold mt-5">{{ $t("email") }}</div>
              <div class="text-gray-600">{{ dataToShow.email }}</div>

              <div class="fw-bold mt-5">{{ $t("joinedDate") }}</div>
              <div class="text-gray-600">{{ dataToShow.created_at }}</div>
            </div>
          </div>
          <!--end::Details content-->

          <!--begin::Accept/Reject Buttons-->
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
          <!--end::Accept/Reject Buttons-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Card-->
    </div>

    <!--begin::Main Content-->
    <div v-else class="w-full h-screen grid place-items-center">
      <span class="loader"></span>
    </div>
    <div class="tab-content" id="myTabContent">
      <!--begin:::Tab pane-->
      <div
        v-if="dataToShow"
        class="tab-pane fade show active"
        id="kt_comic_user_overview_tab"
        role="tabpanel"
      >
        <!-- Comics Savings -->
        <ComicsSavings
          v-if="dataToShow.comicsSavings.length > 0"
          :data="dataToShow.comicsSavings"
          card-classes="mb-6 mb-xl-9"
          @update-comic="handleUpdateComic"
        ></ComicsSavings>

        <!-- Chapters Savings -->
        <ChaptersSavings
          v-if="dataToShow.chaptersSavings.length > 0"
          :data="dataToShow.chaptersSavings"
          card-classes="mb-6 mb-xl-9"
          @update-chapter="handleUpdateChapter"
        ></ChaptersSavings>

        <!-- Favorite Chapters -->
        <FavoriteChapters
          v-if="dataToShow.favoriteChapters.length > 0"
          :data="dataToShow.favoriteChapters"
          card-classes="mb-6 mb-xl-9"
          @update-favorite="handleUpdateFavorite"
        ></FavoriteChapters>

        <!-- History Chapters -->
        <HistoryChapters
          v-if="dataToShow.historyChapters.length > 0"
          :data="dataToShow.historyChapters"
          card-classes="mb-6 mb-xl-9"
          @remove-chapter="handleRemoveChapter"
        ></HistoryChapters>

        <!-- Comments -->
        <Comments
          v-if="dataToShow.comments.length > 0"
          :data="dataToShow.comments"
          card-classes="mb-6 mb-xl-9"
          @delete-comment="handleDeleteComment"
        ></Comments>

        <!-- Following Translators -->
        <FollowingTranslators
          v-if="dataToShow.followingTranslators.length > 0"
          :data="dataToShow.followingTranslators"
          card-classes="mb-6 mb-xl-9"
          @update-follow="handleUpdateFollow"
        ></FollowingTranslators>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Swal from "sweetalert2";
import ComicsSavings from "@/components/cards/ComicsSavings.vue";
import ChaptersSavings from "@/components/cards/ChaptersSavings.vue";
import FavoriteChapters from "@/components/cards/FavoriteChapters.vue";
import HistoryChapters from "@/components/cards/HistoryChapters.vue";
import Comments from "@/components/cards/Comments.vue";
import FollowingTranslators from "@/components/cards/FollowingTranslators.vue";
import { useRoute } from "vue-router";

const { locale } = useI18n();

// Reactive state for collapsible details
const isDetailsOpen = ref(true);

// Toggle details visibility
const toggleDetails = () => {
  isDetailsOpen.value = !isDetailsOpen.value;
};

const route = useRoute();

// Mock data
const dataToShow = ref({
  id: route.params.user,

  first_name: "John",
  last_name: "Doe",
  image: "/media/temp.webp",
  type: "Comic",
  email: "john.doe@example.com",
  verified: true,
  created_at: "2023-01-15",
  description: "description test body",
  language_code: "ar",
  comicsSavings: [
    {
      id: 1,
      title: "The Adventures of Captain Star",
      genre: "Science Fiction",
      publisher: "Galactic Press",
      status: "Active",
      cover: "https://via.placeholder.com/80x100",
      saved: true,
    },
    {
      id: 2,
      title: "The Mystery Chronicles",
      genre: "Mystery",
      publisher: "Detective Tales",
      status: "Completed",
      cover: "https://via.placeholder.com/80x100",
      saved: false,
    },
  ],
  chaptersSavings: [
    {
      id: 1,
      title: "Chapter 1: The Beginning",
      comicTitle: "The Adventures of Captain Star",
      status: "Saved",
      saved: true,
    },
    {
      id: 2,
      title: "Chapter 2: The Mystery Deepens",
      comicTitle: "The Mystery Chronicles",
      status: "Saved",
      saved: false,
    },
  ],
  favoriteChapters: [
    {
      id: 1,
      title: "Chapter 1: The Beginning",
      comicTitle: "The Adventures of Captain Star",
      favorited: true,
    },
    {
      id: 2,
      title: "Chapter 3: The Final Showdown",
      comicTitle: "Legends of the Forgotten Realm",
      favorited: false,
    },
  ],
  historyChapters: [
    {
      id: 1,
      title: "Chapter 1: The Beginning",
      comicTitle: "The Adventures of Captain Star",
      readDate: "2023-10-01",
    },
    {
      id: 2,
      title: "Chapter 2: The Mystery Deepens",
      comicTitle: "The Mystery Chronicles",
      readDate: "2023-10-05",
    },
  ],
  comments: [
    {
      id: 1,
      comicTitle: "The Adventures of Captain Star",
      comment: "This is an amazing comic! The art and story are top-notch.",
      date: "2023-10-01",
    },
    {
      id: 2,
      comicTitle: "The Mystery Chronicles",
      comment: "The plot twists are incredible! I couldn't put it down.",
      date: "2023-10-05",
    },
  ],
  followingTranslators: [
    {
      id: 1,
      name: "Translator One",
      language: "English",
      followed: true,
    },
    {
      id: 2,
      name: "Translator Two",
      language: "Japanese",
      followed: false,
    },
  ],
});

// Event handlers
const handleUpdateComic = (comic) => {
  const index = dataToShow.value.comicsSavings.findIndex(
    (c) => c.id === comic.id,
  );
  if (index !== -1) {
    dataToShow.value.comicsSavings[index] = comic;
  }
};

const handleUpdateChapter = (chapter) => {
  const index = dataToShow.value.chaptersSavings.findIndex(
    (c) => c.id === chapter.id,
  );
  if (index !== -1) {
    dataToShow.value.chaptersSavings[index] = chapter;
  }
};

const handleUpdateFavorite = (chapter) => {
  const index = dataToShow.value.favoriteChapters.findIndex(
    (c) => c.id === chapter.id,
  );
  if (index !== -1) {
    dataToShow.value.favoriteChapters[index] = chapter;
  }
};

const handleDeleteComment = (comment) => {
  dataToShow.value.comments = dataToShow.value.comments.filter(
    (c) => c.id !== comment.id,
  );
};

const handleUpdateFollow = (translator) => {
  const index = dataToShow.value.followingTranslators.findIndex(
    (t) => t.id === translator.id,
  );
  if (index !== -1) {
    dataToShow.value.followingTranslators[index] = translator;
  }
};

const handleRemoveChapter = (chapter) => {
  dataToShow.value.historyChapters = dataToShow.value.historyChapters.filter(
    (c) => c.id !== chapter.id,
  );
};

// Accept Request
const acceptRequest = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to approve this translator request.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, approve it!",
    cancelButtonText: "No, cancel!",
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-secondary",
    },
  });

  if (confirmResult.isConfirmed) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/translator-requests/${id}/approved`,
        {
          method: "PATCH",
          headers: {
            "X-localization": locale.value,
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle backend error
        Swal.fire({
          title: "Error!",
          text: data.message || "Failed to approve the request.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: { confirmButton: "btn btn-primary" },
        });
        return;
      }

      console.log("Request approved:", data);
      fetching(); // Refresh the data

      Swal.fire({
        title: "Approved!",
        text: "The translator request has been approved successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    } catch (error) {
      console.error("Error approving request:", error);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred while approving the request.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    }
  }
};

// Reject Request
const rejectRequest = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to reject this translator request.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, reject it!",
    cancelButtonText: "No, cancel!",
    customClass: {
      confirmButton: "btn btn-danger",
      cancelButton: "btn btn-secondary",
    },
  });

  if (confirmResult.isConfirmed) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/translator-requests/${id}/rejected`,
        {
          method: "PATCH",
          headers: {
            "X-localization": locale.value,
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle backend error
        Swal.fire({
          title: "Error!",
          text: data.message || "Failed to reject the request.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: { confirmButton: "btn btn-primary" },
        });
        return;
      }

      console.log("Request rejected:", data);
      fetching(); // Refresh the data

      Swal.fire({
        title: "Rejected!",
        text: "The translator request has been rejected successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred while rejecting the request.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    }
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
</style>
