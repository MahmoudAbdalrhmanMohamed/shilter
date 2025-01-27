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
          <div id="kt_translator_view_details" class="show">
            <div class="py-5 fs-6">
              <div class="fw-bold mt-5">{{ $t("language") }}</div>
              <div class="text-gray-600">{{ dataToShow.language }}</div>

              <div class="fw-bold mt-5">{{ $t("seriesName") }}</div>
              <div class="text-gray-600">{{ dataToShow.series }}</div>
            </div>
          </div>
          <!--end::Details content-->
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
      <div
        v-if="dataToShow"
        class="tab-pane fade show active"
        id="kt_translator_view_overview_tab"
        role="tabpanel"
      >
        <!-- Using PaymentRecordsTranslator.vue -->
        <PaymentRecordsTranslator
          :card-classes="'mb-6 mb-xl-9'"
          :social-medias="dataToShow.comics"
        />
        <PaymentRecordsTranslatorChapters
          :card-classes="'mb-6 mb-xl-9'"
          :social-medias="dataToShow.chapters"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import PaymentRecordsTranslator from "@/components/customers/cards/overview/PaymentRecordsTranslator.vue";
import PaymentRecordsTranslatorChapters from "@/components/customers/cards/overview/PaymentRecordsTranslatorChapters.vue";

// Fake data for translator
const dataToShow = ref({
  id: 1,
  name: "John Doe",
  // image: "https://via.placeholder.com/100",
  image: "/media/temp.webp",
  language: "English",
  series: "Fantasy Chronicles",
  comics: [
    {
      id: 1,
      cover: "https://via.placeholder.com/80x100",
      description: "A tale of epic fantasy and adventure.",
      publisher: "Magic Press",
      genre: "Fantasy",
      artist: "Jane Smith",
      writer: "Bob White",
      status: "Pending",
    },
    {
      id: 2,
      cover: "https://via.placeholder.com/80x100",
      description: "A gripping mystery set in the heart of Paris.",
      publisher: "Detective Books",
      genre: "Mystery",
      artist: "Alice Brown",
      writer: "Chris Black",
      status: "Pending",
    },
    {
      id: 3,
      cover: "https://via.placeholder.com/80x100",
      description: "A thrilling science fiction saga across galaxies.",
      publisher: "Galactic Publishers",
      genre: "Science Fiction",
      artist: "David Green",
      writer: "Emily Silver",
      status: "Rejected",
    },
    {
      id: 4,
      cover: "https://via.placeholder.com/80x100",
      description: "An inspiring story of courage and perseverance.",
      publisher: "Inspire Publications",
      genre: "Drama",
      artist: "Lisa White",
      writer: "Tom Blue",
      status: "Approved",
    },
  ],
  chapters: [
    {
      id: 1,
      translatorName: "John Doe",
      translatorPhoto: "https://via.placeholder.com/40",
      language: "English",
      seriesName: "Fantasy Chronicles",
      chapterName: "The Beginning",
      chapterNumber: 1,
      chapterPDF:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      chapterCover: "https://via.placeholder.com/80x100",
      status: "Pending",
    },
    {
      id: 2,
      translatorName: "Jane Smith",
      translatorPhoto: "https://via.placeholder.com/40",
      language: "French",
      seriesName: "Mystery Tales",
      chapterName: "The Clue",
      chapterNumber: 3,
      chapterPDF:
        "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
      chapterCover: "https://via.placeholder.com/80x100",
      status: "Approved",
    },
    {
      id: 3,
      translatorName: "Jane Smith",
      translatorPhoto: "https://via.placeholder.com/40",
      language: "French",
      seriesName: "Mystery Tales",
      chapterName: "The Clue",
      chapterNumber: 4,
      chapterPDF:
        "https://file-examples.com/wp-content/uploads/2017/10/file-sample_150kB.pdf",
      chapterCover: "https://via.placeholder.com/80x100",
      status: "Rejected",
    },
  ],
});
</script>
