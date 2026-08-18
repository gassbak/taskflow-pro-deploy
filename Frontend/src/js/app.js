import { ProjectController }
    from "./controllers/projectController.js";

import { NotificationController }
    from "./controllers/notificationController.js";

import { SettingsController }
    from "./controllers/settingsController.js";

import { DashboardController }
    from "./controllers/dashboardController.js";

import { MemberController }
    from "./controllers/memberController.js";

import { ProfileController }
    from "./controllers/profileController.js";

import userService
    from "./services/userService.js";


const app =
    document.getElementById("app");


/**
 * Charge un fichier HTML
 * et retourne son contenu.
 */
async function loadView(path) {

    try {

        const response =
            await fetch(path);


        if (!response.ok) {

            throw new Error(
                `Impossible de charger : ${path}`
            );

        }


        return await response.text();

    } catch (error) {

        console.error(
            error
        );


        return `
            <div
                class="
                    m-6
                    rounded-xl
                    bg-red-50
                    p-6
                    text-sm
                    text-red-600
                "
            >
                Impossible de charger
                cette partie de l'application.
            </div>
        `;

    }

}


/**
 * Initialise l'application.
 */
async function initializeApp() {

    /*
     * 1. Charger le shell
     */

    const shell =
        await loadView(
            "./src/views/layout/app-shell.html"
        );


    app.innerHTML =
        shell;


    /*
     * 2. Charger la Sidebar
     */

    const sidebar =
        await loadView(
            "./src/views/layout/sidebar.html"
        );


    const sidebarContainer =
        document.getElementById(
            "sidebar-container"
        );


    if (sidebarContainer) {

        sidebarContainer.innerHTML =
            sidebar;

    }


    /*
     * 3. Charger le Header
     */

    const header =
        await loadView(
            "./src/views/layout/header.html"
        );


    const headerContainer =
        document.getElementById(
            "header-container"
        );


    if (headerContainer) {

        headerContainer.innerHTML =
            header;

    }

    const notificationController =
        new NotificationController();

    notificationController
        .initialize();

    /*
     * 4. Afficher le nom/les initiales de
     *    l'utilisateur dans la sidebar et le header
     */

    syncUserDisplay();

    /*
     * 5. Initialiser les interactions
     */

    initializeSidebar();

    /*
     * 6. Page affichée au démarrage
     */

    await navigateToPage("dashboard");

}


/**
 * Met à jour tous les éléments [data-user-initials]
 * et [data-user-name] (sidebar + header) avec le profil
 * actuellement enregistré. Appelé au démarrage et à chaque
 * fois que le profil est modifié (voir ProfileController).
 */
function syncUserDisplay() {

    const user =
        userService.getUser();

    document
        .querySelectorAll("[data-user-initials]")
        .forEach(element => {

            element.textContent =
                userService.getInitials(user.name);

        });

    document
        .querySelectorAll("[data-user-name]")
        .forEach(element => {

            element.textContent =
                user.name || "Utilisateur";

        });

}


/**
 * Gestion de la Sidebar mobile + navigation.
 *
 * Les liens [data-page] sont gérés par délégation d'événements
 * sur `document` : un seul écouteur, qui fonctionne aussi pour
 * les liens ajoutés plus tard dynamiquement (ex: le lien
 * "Voir tous les projets" du Dashboard).
 */
function initializeSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    const menuButton =
        document.getElementById(
            "mobile-menu-button"
        );

    const overlay =
        document.getElementById(
            "sidebar-overlay"
        );

    function openSidebar() {

        sidebar?.classList.remove(
            "-translate-x-full"
        );

        overlay?.classList.remove(
            "hidden"
        );

    }

    function closeSidebar() {

        sidebar?.classList.add(
            "-translate-x-full"
        );

        overlay?.classList.add(
            "hidden"
        );

    }

    menuButton?.addEventListener(
        "click",
        openSidebar
    );

    overlay?.addEventListener(
        "click",
        closeSidebar
    );

    /*
     * Un seul écouteur pour tous les liens/boutons [data-page],
     * présents ou futurs.
     */

    document.addEventListener(
        "click",
        async event => {

            const link =
                event.target.closest(
                    "[data-page]"
                );

            if (!link) {

                return;

            }

            event.preventDefault();

            const page =
                link.dataset.page;

            // Il n'y a pas de page dédiée "Notifications" :
            // le lien de la sidebar ouvre simplement le panneau
            // de notifications déjà présent dans le Header,
            // plutôt que de naviguer vers une page vide.
            if (page === "notifications") {

                document
                    .getElementById("notification-button")
                    ?.click();

                closeSidebar();

                return;

            }

            await navigateToPage(page);

            closeSidebar();

        }
    );

}


const routes = {

    dashboard:
        "./src/views/dashboard/dashboard.html",

    projects:
        "./src/views/projects/projects.html",

    // Il n'existe pas de Kanban global indépendant d'un projet :
    // le Kanban vit dans la page de détails d'un projet
    // (voir ProjectController.showProjectDetails). Le lien
    // "Kanban" de la sidebar amène donc vers la liste des
    // projets, où l'on choisit le projet dont on veut voir
    // le Kanban.
    kanban:
        "./src/views/projects/projects.html",

    members:
        "./src/views/members/members.html",

    profile:
        "./src/views/profile/profile.html",

    settings:
        "./src/views/settings/settings.html"

};


async function navigateToPage(page) {

    const path =
        routes[page];


    if (!path) {

        console.error(
            "Page inconnue :",
            page
        );

        return;

    }


    const content =
        await loadView(path);


    const main =
        document.getElementById(
            "main-content"
        );


    if (!main) {

        console.error(
            "main-content introuvable"
        );

        return;

    }


    main.innerHTML =
        content;


    setActiveSidebarLink(page);


    /*
     * Initialisation de la page
     */

    if (page === "dashboard") {

        const dashboardController =
            new DashboardController();

        dashboardController.init();

    }


    if (page === "projects" || page === "kanban") {

        const projectController =
            new ProjectController();

        await projectController.init();

    }


    if (page === "members") {

        const memberController =
            new MemberController();

        memberController.init();

    }


    if (page === "profile") {

        const profileController =
            new ProfileController();

        profileController.init();

    }


    if (page === "settings") {

        const settingsController =
            new SettingsController();

        settingsController.init();

    }

}


/**
 * Met en surbrillance le lien de la sidebar
 * correspondant à la page actuellement affichée.
 */
function setActiveSidebarLink(page) {

    const links =
        document.querySelectorAll(
            "#sidebar [data-page]"
        );

    links.forEach(link => {

        const isActive =
            link.dataset.page === page;

        link.classList.toggle(
            "bg-indigo-50",
            isActive
        );

        link.classList.toggle(
            "text-indigo-700",
            isActive
        );

        link.classList.toggle(
            "font-semibold",
            isActive
        );

        link.classList.toggle(
            "dark:bg-indigo-500/10",
            isActive
        );

        link.classList.toggle(
            "dark:text-indigo-400",
            isActive
        );

        link.classList.toggle(
            "text-slate-600",
            !isActive
        );

        link.classList.toggle(
            "font-medium",
            !isActive
        );

        link.classList.toggle(
            "dark:text-slate-300",
            !isActive
        );

    });

}


initializeApp();
