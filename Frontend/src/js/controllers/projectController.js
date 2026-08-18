import { ProjectService } from "../services/projectService.js";
import projectTaskService from "../services/projectTaskService.js";

import { projectDetailsMixin } from "./projectDetailsController.js";
import { taskKanbanMixin } from "./taskKanbanController.js";

/**
 * ProjectController
 * ------------------
 * Contrôleur principal de la page "Projets" : création, édition,
 * suppression, archivage, filtrage et affichage de la liste des projets.
 *
 * Les fonctionnalités liées à la page de détails d'un projet et au
 * Kanban des tâches sont définies dans des fichiers séparés
 * (projectDetailsController.js et taskKanbanController.js) puis
 * ajoutées à cette classe via Object.assign, pour garder ce fichier
 * lisible sans changer le comportement de l'application.
 */
export class ProjectController {

    /**
     * Initialise le service projet et l'état interne du contrôleur.
     */
        constructor() {

            this.service =
                new ProjectService();

                this.taskService =
             projectTaskService;

            this.projects =
                [];

            this.modal =
                null;

        }

    /**
     * Point d'entrée : charge le modal, récupère les projets, attache les événements et affiche la liste.
     */
    async init() {

        await this.loadModal();

        this.projects =
            this.service.getAll();

        this.bindEvents();

        this.render();

    }

    /**
     * Charge le HTML du modal de création/édition de projet et l'insère dans la page.
     */
        async loadModal() {

        try {

            const response = await fetch(
                "src/views/projects/project-modal.html"
            );

            if (!response.ok) {

                throw new Error(
                    `Erreur HTTP ${response.status}`
                );

            }

            const modalHTML =
                await response.text();

            document.body.insertAdjacentHTML(
                "beforeend",
                modalHTML
            );

            this.modal =
                document.getElementById(
                    "project-modal"
                );

            console.log(
                "Modal chargé :",
                this.modal
            );

        } catch (error) {

            console.error(
                "Erreur chargement modal :",
                error
            );

        }

    }

    /**
     * Attache tous les écouteurs d'événements de la page Projets (boutons, formulaire, recherche, filtre).
     */
        bindEvents() {




            /*
             * Bouton nouveau projet
             */

            const addButton =
                document.getElementById(
                    "create-project-button"
                );


            if (addButton) {

                addButton.addEventListener(
                    "click",
                    () => this.openCreateModal()
                );

            }


            /*
             * Bouton de la zone vide
             */

            const emptyButton =
                document.getElementById(
                    "empty-add-project-button"
                );


            if (emptyButton) {

                emptyButton.addEventListener(
                    "click",
                    () => this.openCreateModal()
                );

            }


            /*
             * Fermeture
             */

            const closeButton =
                document.getElementById(
                    "close-project-modal"
                );


            if (closeButton) {

                closeButton.addEventListener(
                    "click",
                    () => this.closeModal()
                );

            }


            const cancelButton =
                document.getElementById(
                    "cancel-project-modal"
                );


            if (cancelButton) {

                cancelButton.addEventListener(
                    "click",
                    () => this.closeModal()
                );

            }


            /*
             * Clic sur le fond
             */

            if (this.modal) {

                this.modal.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target ===
                            this.modal
                        ) {

                            this.closeModal();

                        }

                    }
                );

            }


            /*
             * Formulaire
             */

            const form =
                document.getElementById(
                    "project-form"
                );


            if (form) {

                form.addEventListener(
                    "submit",
                    event =>
                        this.handleCreateProject(
                            event
                        )
                );

            }


            /*
             * Compteur description
             */

            const description =
                document.getElementById(
                    "project-description"
                );


            if (description) {

                description.addEventListener(
                    "input",
                    () => {

                        const counter =
                            document.getElementById(
                                "description-counter"
                            );


                        if (counter) {

                            counter.textContent =
                                `${description.value.length}/500`;

                        }

                    }
                );

            }


            /*
             * Recherche
             */

            const search =
                document.getElementById(
                    "project-search"
                );


            if (search) {

                search.addEventListener(
                    "input",
                    () => this.render()
                );

            }

            const projectsList =
        document.getElementById(
            "projects-list"
        );


    if (projectsList) {

        projectsList.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "button[data-action]"
                    );


                if (!button) {

                    return;

                }


                const action =
                    button.dataset.action;


                const id =
                    button.dataset.id;

    if (action === "details") {

        const project =
            this.service.getById(id);

        console.log(
            "PROJET RÉCUPÉRÉ :",
            project
        );

        console.log(
            "DEADLINE DU PROJET :",
            project?.deadline
        );

        this.showProjectDetails(id);

    }

                if (action === "edit") {

                    this.openEditModal(id);

                }


                if (action === "archive") {

                    this.toggleArchive(id);

                }


                if (action === "delete") {

                    this.confirmDelete(id);

                }

            }
        );

    }

            /*
             * Filtre statut
             */

            const statusFilter =
                document.getElementById(
                    "project-status-filter"
                );


            if (statusFilter) {

                statusFilter.addEventListener(
                    "change",
                    () => this.render()
                );

            }


            /*
             * ESC pour fermer
             */

            document.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Escape" &&
                        this.modal &&
                        !this.modal.classList.contains(
                            "hidden"
                        )
                    ) {

                        this.closeModal();

                    }

                }
            );

        }

    /**
     * Ouvre le modal en mode création (formulaire vide).
     */
        openCreateModal() {

        if (!this.modal) {

            return;

        }


        const form =
            document.getElementById(
                "project-form"
            );


        if (form) {

            form.reset();

        }


        const description =
            document.getElementById(
                "project-description"
            );


        if (description) {

            description.value = "";

        }


        const counter =
            document.getElementById(
                "description-counter"
            );


        if (counter) {

            counter.textContent =
                "0/500";

        }


        const title =
            document.getElementById(
                "project-modal-title"
            );


        if (title) {

            title.textContent =
                "Nouveau projet";

        }


        const submitButton =
            document.querySelector(
                "#project-form button[type='submit']"
            );


        if (submitButton) {

            submitButton.textContent =
                "Créer le projet";

        }


        form.dataset.editingId = "";


        this.clearErrors();


        this.modal.classList.remove(
            "hidden"
        );


        this.modal.classList.add(
            "flex"
        );


        const nameInput =
            document.getElementById(
                "project-name"
            );


        if (nameInput) {

            setTimeout(
                () => nameInput.focus(),
                50
            );

        }

    }

    /**
     * Ferme le modal et remet le formulaire à zéro.
     */
        closeModal() {

            if (!this.modal) {

                return;

            }


            this.modal.classList.add(
                "hidden"
            );


            this.modal.classList.remove(
                "flex"
            );

        }


        handleCreateProject(
        event
    ) {

        event.preventDefault();


        this.clearErrors();


        const form =
            event.target;


        const formData =
            new FormData(form);


        const name =
            formData
                .get("name")
                .trim();


        const description =
            formData
                .get("description")
                .trim();


        const color =
            formData.get("color");


        const status =
            formData.get("status");


        const deadline =
            formData.get("deadline");


        /*
         * Validation
         */

        if (!name) {

            this.showNameError(
                "Le nom du projet est obligatoire."
            );

            return;

        }


        if (name.length < 2) {

            this.showNameError(
                "Le nom doit contenir au moins 2 caractères."
            );

            return;

        }


        /*
         * Vérifier si nous sommes
         * en mode modification.
         */

        const editingId =
            form.dataset.editingId;


        if (editingId) {

            /*
             * MODIFICATION
             */

            const updatedProject =
                this.service.update(
                    editingId,
                    {
                        name,
                        description,
                        color,
                        status,
                        deadline
                    }
                );


            if (!updatedProject) {

                alert(
                    "Impossible de modifier le projet."
                );

                return;

            }


            console.log(
                "Projet modifié :",
                updatedProject
            );

        } else {

            /*
             * CRÉATION
             */

            const project =
                this.service.create({
                    name,
                    description,
                    color,
                    status,
                    deadline
                });


            console.log(
                "Projet créé :",
                project
            );

        }


        /*
         * Recharger les projets
         */

        this.projects =
            this.service.getAll();


        /*
         * Fermer
         */

        this.closeModal();


        /*
         * Réafficher
         */

        this.render();

    }


        showNameError(
            message
        ) {

            const error =
                document.getElementById(
                    "project-name-error"
                );


            if (!error) {

                return;

            }


            error.textContent =
                message;


            error.classList.remove(
                "hidden"
            );

        }

    /**
     * Supprime les messages d'erreur affichés dans le formulaire projet.
     */
        clearErrors() {

            const error =
                document.getElementById(
                    "project-name-error"
                );


            if (error) {

                error.textContent =
                    "";

                error.classList.add(
                    "hidden"
                );

            }

        }

    /**
     * Retourne les projets filtrés selon la recherche et le filtre de statut en cours.
     */
        getFilteredProjects() {

            const searchInput =
                document.getElementById(
                    "project-search"
                );


            const statusFilter =
                document.getElementById(
                    "project-status-filter"
                );


            const search =
                searchInput
                    ? searchInput.value
                        .toLowerCase()
                        .trim()
                    : "";


            const status =
                statusFilter
                    ? statusFilter.value
                    : "all";


            return this.projects.filter(
                project => {

                    const name =
                        project.name
                            .toLowerCase();


                    const description =
                        project.description
                            .toLowerCase();


                    const matchesSearch =
                        name.includes(search) ||
                        description.includes(search);


                    const matchesStatus =
                        status === "all" ||
                        project.status === status;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );

                }
            );

        }

    /**
     * Réaffiche la liste des projets à l'écran (cartes + état vide).
     */
        render() {

            const list =
                document.getElementById(
                    "projects-list"
                );


            const empty =
                document.getElementById(
                    "projects-empty"
                );


            if (!list || !empty) {

                return;

            }


            const projects =
                this.getFilteredProjects();


            list.innerHTML =
                "";


            if (projects.length === 0) {

                empty.classList.remove(
                    "hidden"
                );

            } else {

                empty.classList.add(
                    "hidden"
                );


                projects.forEach(
                    project => {

                        list.insertAdjacentHTML(
                            "beforeend",
                            this.createProjectCard(
                                project
                            )
                        );

                    }
                );

            }


            this.updateStatistics();

        }

    /**
     * Construit le HTML d'une carte projet.
     */
        createProjectCard(project) {

        const colors = {

            indigo: "bg-indigo-500",

            violet: "bg-violet-500",

            emerald: "bg-emerald-500",

            orange: "bg-orange-500",

            rose: "bg-rose-500"

        };


        const color =
            colors[project.color] ||
            colors.indigo;


        const isArchived =
            project.status === "archived";


        const statusLabel =
            isArchived
                ? "Archivé"
                : "Actif";


        return `
            <article
                class="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-md
                    dark:border-slate-800
                    dark:bg-slate-900
                "
            >

                <!-- Couleur -->

                <div
                    class="h-1.5 ${color}"
                ></div>


                <div class="p-5">

                    <!-- En-tête -->

                    <div
                        class="
                            flex
                            items-start
                            justify-between
                            gap-3
                        "
                    >

                        <div
                            class="
                                flex
                                min-w-0
                                items-center
                                gap-3
                            "
                        >

                            <div
                                class="
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-slate-100
                                    text-xl
                                    dark:bg-slate-800
                                "
                            >
                                📁
                            </div>


                            <div class="min-w-0">

                                <h3
                                    class="
                                        truncate
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                    "
                                    title="${this.escapeHtml(project.name)}"
                                >
                                    ${this.escapeHtml(project.name)}
                                </h3>


                                <span
                                    class="
                                        mt-1
                                        inline-flex
                                        rounded-full
                                        px-2
                                        py-0.5
                                        text-[11px]
                                        font-semibold
                                        ${
                                            isArchived
                                                ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                        }
                                    "
                                >
                                    ${statusLabel}
                                </span>

                            </div>

                        </div>


                        <!-- Menu -->

                        <div
                            class="
                                flex
                                shrink-0
                                items-center
                                gap-1
                            "
                        >

                            <button
                                type="button"
                                data-action="edit"
                                data-id="${project.id}"
                                class="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-slate-400
                                    transition
                                    hover:bg-indigo-50
                                    hover:text-indigo-600
                                    dark:hover:bg-indigo-500/10
                                    dark:hover:text-indigo-400
                                "
                                title="Modifier"
                                aria-label="Modifier le projet"
                            >
                                ✏️
                            </button>


                            <button
                                type="button"
                                data-action="archive"
                                data-id="${project.id}"
                                class="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-slate-400
                                    transition
                                    hover:bg-amber-50
                                    hover:text-amber-600
                                    dark:hover:bg-amber-500/10
                                    dark:hover:text-amber-400
                                "
                                title="${
                                    isArchived
                                        ? "Désarchiver"
                                        : "Archiver"
                                }"
                                aria-label="${
                                    isArchived
                                        ? "Désarchiver le projet"
                                        : "Archiver le projet"
                                }"
                            >
                                ${
                                    isArchived
                                        ? "📂"
                                        : "📦"
                                }
                            </button>


                            <button
                                type="button"
                                data-action="delete"
                                data-id="${project.id}"
                                class="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-slate-400
                                    transition
                                    hover:bg-red-50
                                    hover:text-red-600
                                    dark:hover:bg-red-500/10
                                    dark:hover:text-red-400
                                "
                                title="Supprimer"
                                aria-label="Supprimer le projet"
                            >
                                🗑️
                            </button>

                        </div>

                    </div>


                    <!-- Description -->

                    <p
                        class="
                            mt-4
                            min-h-12
                            text-sm
                            leading-6
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        ${this.escapeHtml(
                            project.description ||
                            "Aucune description."
                        )}
                    </p>


                    <!-- Footer -->

                    <div
                        class="
                            mt-5
                            border-t
                            border-slate-100
                            pt-4
                            dark:border-slate-800
                        "
                    >

                        <p
                            class="
                                text-xs
                                text-slate-400
                            "
                        >
                            Créé le
                            ${new Date(
                                project.createdAt
                            ).toLocaleDateString("fr-FR")}
                        </p>


                    </div>

                    <button
        type="button"
        data-action="details"
        data-id="${project.id}"
        class="
            mt-4
            w-full
            rounded-xl
            border
            border-slate-200
            px-4
            py-2.5
            text-sm
            font-semibold
            text-slate-700
            transition
            hover:bg-slate-100
            dark:border-slate-700
            dark:text-slate-200
            dark:hover:bg-slate-800
        "
    >
        Voir les détails
    </button>

                </div>

            </article>
        `;

    }

    /**
     * Met à jour les compteurs/statistiques affichés en haut de la page Projets.
     */
        updateStatistics() {

            const total =
                this.projects.length;


            const active =
                this.projects.filter(
                    project =>
                        project.status === "active"
                ).length;


            const archived =
                this.projects.filter(
                    project =>
                        project.status === "archived"
                ).length;


            const totalElement =
                document.getElementById(
                    "total-projects"
                );


            const activeElement =
                document.getElementById(
                    "active-projects"
                );


            const archivedElement =
                document.getElementById(
                    "archived-projects"
                );


            if (totalElement) {

                totalElement.textContent =
                    total;

            }


            if (activeElement) {

                activeElement.textContent =
                    active;

            }


            if (archivedElement) {

                archivedElement.textContent =
                    archived;

            }

        }


        escapeHtml(
            value
        ) {

            const div =
                document.createElement(
                    "div"
                );


            div.textContent =
                value;


            return div.innerHTML;

        }

    /**
     * Ouvre le modal en mode édition, pré-rempli avec les données du projet.
     */
        openEditModal(id) {

        const project =
            this.service.getById(id);


        if (!project) {

            console.error(
                "Projet introuvable."
            );

            return;

        }


        if (!this.modal) {

            return;

        }


        const form =
            document.getElementById(
                "project-form"
            );


        /*
         * Nom
         */

        const nameInput =
            document.getElementById(
                "project-name"
            );


        nameInput.value =
            project.name;


        /*
         * Description
         */

        const description =
            document.getElementById(
                "project-description"
            );


        description.value =
            project.description || "";


        /*
         * Compteur
         */

        const counter =
            document.getElementById(
                "description-counter"
            );


        if (counter) {

            counter.textContent =
                `${description.value.length}/500`;

        }


        /*
         * Couleur
         */

        const colorInput =
            document.querySelector(
                `input[name="color"][value="${project.color}"]`
            );


        if (colorInput) {

            colorInput.checked =
                true;

        }


        /*
         * Statut
         */

        const statusInput =
            document.getElementById(
                "project-status"
            );


        statusInput.value =
            project.status;


        /*
         * Titre
         */

        const title =
            document.getElementById(
                "project-modal-title"
            );


        title.textContent =
            "Modifier le projet";


        /*
         * Bouton
         */

        const submitButton =
            document.querySelector(
                "#project-form button[type='submit']"
            );


        submitButton.textContent =
            "Enregistrer les modifications";


        /*
         * Mémoriser l'ID
         */

        form.dataset.editingId =
            project.id;


        this.clearErrors();


        /*
         * Afficher la modal
         */

        this.modal.classList.remove(
            "hidden"
        );


        this.modal.classList.add(
            "flex"
        );


        setTimeout(
            () => nameInput.focus(),
            50
        );

    }

    /**
     * Archive ou désarchive un projet.
     */
    toggleArchive(id) {

        const project =
            this.service.getById(id);


        if (!project) {

            return;

        }


        const newStatus =
            project.status === "active"
                ? "archived"
                : "active";


        this.service.update(
            id,
            {
                status: newStatus
            }
        );


        this.projects =
            this.service.getAll();


        this.render();


        console.log(
            `Projet ${
                newStatus === "archived"
                    ? "archivé"
                    : "désarchivé"
            }`
        );

    }

    /**
     * Demande confirmation puis déclenche la suppression d'un projet.
     */
    confirmDelete(id) {

        const project =
            this.service.getById(id);


        if (!project) {

            return;

        }


        const confirmed =
            window.confirm(
                `Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ?\n\nCette action est irréversible.`
            );


        if (!confirmed) {

            return;

        }


        this.deleteProject(id);

    }

    /**
     * Supprime définitivement un projet du localStorage et réaffiche la liste.
     */
    deleteProject(id) {

        const project =
            this.service.getById(id);


        if (!project) {

            return;

        }


        this.service.delete(
            id
        );


        this.projects =
            this.service.getAll();


        this.render();


        console.log(
            "Projet supprimé :",
            project.name
        );

    }

    /**
     * Charge la page Projets (projects.html) dans le contenu principal et l'initialise.
     */
    async renderProjectsPage() {

        const content =
            await fetch(
                "src/views/projects/projects.html"
            )
            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "Impossible de charger la page projets."
                    );

                }

                return response.text();

            });


        const main =
            document.getElementById(
                "main-content"
            );


        if (!main) {

            return;

        }


        main.innerHTML =
            content;


        this.projects =
            this.service.getAll();


        this.bindEvents();

        this.render();

    }

}

// Ajout des méthodes "détails projet" et "Kanban / tâches" sur le prototype.
// (voir projectDetailsController.js et taskKanbanController.js)
Object.assign(ProjectController.prototype, projectDetailsMixin, taskKanbanMixin);
