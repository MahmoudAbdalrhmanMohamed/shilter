import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

// import { useI18n } from "vue-i18n";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },
      {
        path: "/apps/publishers/addPublisher",
        name: "apps-publishers-add",
        component: () => import("@/views/apps/publishers/addPublisher.vue"),
        meta: {
          pageTitle: "addPublisher",
          breadcrumbs: ["Apps", "Publishers", "Add Publisher"],
        },
      },
      {
        path: "/apps/publishers/updatePublisher/:updatePublisher",
        name: "apps-publishers-updatePublisher",
        component: () => import("@/views/apps/publishers/UpdatePublisher.vue"),
        meta: {
          pageTitle: "updatePublisher",
          breadcrumbs: ["Apps", "Publishers", "Update Publisher"],
        },
      },
      {
        path: "/apps/publishers/all",
        name: "apps-publishers-all",
        component: () =>
          import("@/views/apps/publishers/PublishersComponent.vue"),
        meta: {
          pageTitle: "Publishers",
          breadcrumbs: ["Apps", "Publishers"],
        },
      },

      {
        path: "/apps/artists/addArtist",
        name: "apps-artists-add",
        component: () => import("@/views/apps/artists/addArtist.vue"),
        meta: {
          pageTitle: "addArtist",
          breadcrumbs: ["Apps", "Artists", "Add Artist"],
        },
      },
      {
        path: "/apps/Artists/updateArtist/:updateArtist",
        name: "apps-Artists-updateArtist",
        component: () => import("@/views/apps/artists/UpdateArtist.vue"),
        meta: {
          pageTitle: "UpdateArtist",
          breadcrumbs: ["Apps", "Artists", "Update Artist"],
        },
      },
      {
        path: "/apps/artists/all",
        name: "apps-artists-all",
        component: () => import("@/views/apps/artists/ArtistsComponent.vue"),
        meta: {
          pageTitle: "artists",
          breadcrumbs: ["Apps", "Artists"],
        },
      },

      {
        path: "/apps/writers/addWriter",
        name: "apps-writers-add",
        component: () => import("@/views/apps/writers/addWriter.vue"),
        meta: {
          pageTitle: "addWriter",
          breadcrumbs: ["Apps", "Writers", "Add Writer"],
        },
      },
      {
        path: "/apps/Writers/updateWriter/:updateWriter",
        name: "apps-Writers-updateWriter",
        component: () => import("@/views/apps/writers/UpdateWriter.vue"),
        meta: {
          pageTitle: "updateWriter",
          breadcrumbs: ["Apps", "Writers", "Update Writer"],
        },
      },
      {
        path: "/apps/writers/all",
        name: "apps-writers-all",
        component: () => import("@/views/apps/writers/WritersComponent.vue"),
        meta: {
          pageTitle: "Writers",
          breadcrumbs: ["Apps", "Writers"],
        },
      },

      {
        path: "/apps/genres/addGenre",
        name: "apps-genres-add",
        component: () => import("@/views/apps/genres/addGenre.vue"),
        meta: {
          pageTitle: "addGenre",
          breadcrumbs: ["Apps", "Genres", "Add Genre"],
        },
      },
      {
        path: "/apps/Genres/updateGenre/:updateGenre",
        name: "apps-Genres-updateGenre",
        component: () => import("@/views/apps/genres/UpdateGenre.vue"),
        meta: {
          pageTitle: "updateGenre",
          breadcrumbs: ["Apps", "Genres", "Update Genre"],
        },
      },
      {
        path: "/apps/Genres/all",
        name: "apps-genres-all",
        component: () => import("@/views/apps/genres/GenresComponent.vue"),
        meta: {
          pageTitle: "Genres",
          breadcrumbs: ["Apps", "Genres"],
        },
      },

      {
        path: "/apps/chapters/addOneChapter",
        name: "apps-chapter-add-one",
        component: () => import("@/views/apps/chapters/addOneChapter.vue"),
        meta: {
          pageTitle: "Add One Chapter",
          breadcrumbs: ["Apps", "Chapters", "Add Chapter"],
        },
      },
      {
        path: "/apps/chapters/addAllChapter",
        name: "apps-chapter-add-all",
        component: () => import("@/views/apps/chapters/addAllChapters.vue"),
        meta: {
          pageTitle: "Add All Chapters",
          breadcrumbs: ["Apps", "Chapters", "Add Chapter"],
        },
      },
      {
        path: "/apps/chapters/addUrl",
        name: "apps-chapter-add-url",
        component: () => import("@/views/apps/chapters/addUrl.vue"),
        meta: {
          pageTitle: "Add Url",
          breadcrumbs: ["Apps", "Chapters", "Add Url"],
        },
      },
      {
        path: "/apps/chapters/addZip",
        name: "apps-chapter-add-zip",
        component: () => import("@/views/apps/chapters/addZip.vue"),
        meta: {
          pageTitle: "Add Zip",
          breadcrumbs: ["Apps", "Chapters", "Add Zip"],
        },
      },
      {
        path: "/apps/chapters/updateZip/:updateZip",
        name: "apps-chapters-updateZip",
        component: () => import("@/views/apps/chapters/updateZip.vue"),
        meta: {
          pageTitle: "Update Zip",
          breadcrumbs: ["Apps", "Chapters", "Update Zip"],
        },
      },
      {
        path: "/apps/chapters/updateOneChapter/:updateChapter",
        name: "apps-chapters-updateOneChapter",
        component: () => import("@/views/apps/chapters/updateOneChapter.vue"),
        meta: {
          pageTitle: "Update One Chapter",
          breadcrumbs: ["Apps", "Chapters", "Update Chapter"],
        },
      },
      {
        path: "/apps/chapters/updateAllChapter/:updateChapter",
        name: "apps-chapters-updateAllChapter",
        component: () => import("@/views/apps/chapters/updateAllChapters.vue"),
        meta: {
          pageTitle: "Update One Chapter",
          breadcrumbs: ["Apps", "Chapters", "Update Chapter"],
        },
      },
      {
        path: "/apps/chapters/updateUrl/:updateUrl",
        name: "apps-chapters-updateUrl",
        component: () => import("@/views/apps/chapters/updateUrl.vue"),
        meta: {
          pageTitle: "Update Url",
          breadcrumbs: ["Apps", "Chapters", "Update Url"],
        },
      },
      {
        path: "/apps/chapters/all",
        name: "apps-chapters-all",
        component: () => import("@/views/apps/chapters/ChaptersComponent.vue"),
        meta: {
          pageTitle: "Chapters",
          breadcrumbs: ["Apps", "Chapters"],
        },
      },
      {
        path: "/apps/chapters/AddSelect",
        name: "apps-chapters-AddSelect",
        component: () => import("@/views/apps/chapters/AddSelect.vue"),
        meta: {
          pageTitle: "Chapters",
          breadcrumbs: ["Apps", "Chapters", "Add Select"],
        },
      },

      {
        path: "/apps/comics/addComic",
        name: "apps-comics-add",
        component: () => import("@/views/apps/comics/addComic.vue"),
        meta: {
          pageTitle: "addComic",
          breadcrumbs: ["Apps", "Comics", "Add Comic"],
        },
      },
      {
        path: "/apps/comics/updateComic/:updateComic",
        name: "apps-comics-updateComic",
        component: () => import("@/views/apps/comics/UpdateComic.vue"),
        meta: {
          pageTitle: "updateComic",
          breadcrumbs: ["Apps", "Comics", "Update Comic"],
        },
      },
      {
        path: "/apps/comics/all",
        name: "apps-comics-all",
        component: () => import("@/views/apps/comics/ComicsComponent.vue"),
        meta: {
          pageTitle: "Comics",
          breadcrumbs: ["Apps", "Comics"],
        },
      },

      {
        path: "/apps/translators/comic",
        name: "apps-tanslators-comic",
        component: () =>
          import("@/views/apps/translators/RequestToAddComic.vue"),
        meta: {
          pageTitle: "Requests To Add Comics",
          breadcrumbs: ["Apps", "Translators", "Requests To Add Comics"],
        },
      },
      {
        path: "/apps/translators/chapter",
        name: "apps-tanslators-chapter",
        component: () =>
          import("@/views/apps/translators/RequestToAddChapter.vue"),
        meta: {
          pageTitle: "Requests To Add Chapters",
          breadcrumbs: ["Apps", "Translators", "Requests To Add Chapters"],
        },
      },
      {
        path: "/apps/translators/Translators",
        name: "apps-tanslators-translators",
        component: () => import("@/views/apps/translators/Translators.vue"),
        meta: {
          pageTitle: "Translators",
          breadcrumbs: ["Apps", "Translators"],
        },
      },
      {
        path: "/apps/translators/translator/:Translator",
        name: "apps-tanslators-translator",
        component: () => import("@/views/apps/translators/Translator.vue"),
        meta: {
          pageTitle: "Translator",
          breadcrumbs: ["Apps", "Translators", "Translator"],
        },
      },
      {
        path: "/apps/translators/TranslatorChapter/:Translator",
        name: "apps-tanslators-TranslatorChapter",
        component: () =>
          import("@/views/apps/translators/TranslatorChapter.vue"),
        meta: {
          pageTitle: "Translator",
          breadcrumbs: ["Apps", "Translators", "Translator"],
        },
      },
      {
        path: "/apps/translators/TranslatorComic/:Translator",
        name: "apps-tanslators-TranslatorComic",
        component: () => import("@/views/apps/translators/TranslatorComic.vue"),
        meta: {
          pageTitle: "Translator",
          breadcrumbs: ["Apps", "Translators", "Translator"],
        },
      },
      {
        path: "/apps/translators/RequestToJoin",
        name: "apps-tanslators-RequestToJoin",
        component: () => import("@/views/apps/translators/RequestToJoin.vue"),
        meta: {
          pageTitle: "Request To Join",
          breadcrumbs: ["Apps", "Translators", "Request To Join"],
        },
      },
      {
        path: "/apps/translator/:translator",
        name: "apps-tanslator",
        component: () =>
          import("@/views/apps/translators/TranslatorComponent.vue"),
        meta: {
          pageTitle: "Translator",
          breadcrumbs: ["Apps", "Translators", "Translator"],
        },
      },

      {
        path: "/apps/users/user/:user",
        name: "apps-users-user",
        component: () => import("@/views/apps/users/ComicsUser.vue"),
        meta: {
          pageTitle: "User",
          breadcrumbs: ["Apps", "Users", "User"],
        },
      },
      {
        path: "/apps/users/userNormal/:user",
        name: "apps-users-userNormal",
        component: () => import("@/views/apps/users/ComicsUserWithout.vue"),
        meta: {
          pageTitle: "User",
          breadcrumbs: ["Apps", "Users", "User"],
        },
      },
      {
        path: "/apps/users",
        name: "apps-users",
        component: () => import("@/views/apps/users/ComicsUsers.vue"),
        meta: {
          pageTitle: "Users",
          breadcrumbs: ["Apps", "Users"],
        },
      },

      {
        path: "/apps/admins/updateName",
        name: "apps-admins-updateName",
        component: () => import("@/views/apps/admins/UpdateName.vue"),
        meta: {
          pageTitle: "updateName",
          breadcrumbs: ["Apps", "Admins", "Update Name"],
        },
      },
      {
        path: "/apps/admins/updateImage",
        name: "apps-admins-updateImage",
        component: () => import("@/views/apps/admins/UpdateImage.vue"),
        meta: {
          pageTitle: "updateImage",
          breadcrumbs: ["Apps", "Admins", "Update Image"],
        },
      },
      {
        path: "/apps/admins/updatePassword",
        name: "apps-admins-updatePassword",
        component: () => import("@/views/apps/admins/UpdatePasword.vue"),
        meta: {
          pageTitle: "updatePassword",
          breadcrumbs: ["Apps", "Admins", "Update Password"],
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignUp.vue"),
        meta: {
          pageTitle: "Sign Up",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/crafted/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/crafted/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: "smooth",
      };
    } else {
      return {
        top: 0,
        left: 0,
        behavior: "smooth",
      };
    }
  },
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  const token = localStorage.getItem("authToken");

  if (token) {
    // Prevent authenticated users from visiting the sign-in page
    if (to.name === "sign-in") {
      next({ name: "dashboard" });
    } else {
      next();
    }
  } else {
    // Avoid redirecting to sign-in if already there
    if (to.name === "sign-in") {
      next(); // Already on the sign-in page
    } else {
      next({ name: "sign-in" }); // Redirect to sign-in for other routes
    }
  }
});

export default router;
