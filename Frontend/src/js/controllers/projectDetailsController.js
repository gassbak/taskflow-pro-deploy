import deadlineService from "../services/deadlineService.js";

/**
 * projectDetailsController.js
 * ----------------------------
 * Regroupe tout ce qui concerne la page de DÉTAILS d'un projet :
 * chargement de la page, affichage des infos du projet, deadline,
 * et les boutons de cette page (retour, modifier, supprimer, nouvelle tâche).
 *
 * Ces méthodes sont écrites comme un objet "mixin" : elles sont ensuite
 * copiées sur ProjectController.prototype (voir projectController.js),
 * donc `this` fait toujours référence à l'instance de ProjectController
 * quand elles sont appelées (this.service, this.taskService, etc. restent
 * accessibles normalement).
 */
export const projectDetailsMixin = {

    /**
     * Charge et affiche la page de détails d'un projet (project-details.html).
     */
    async showProjectDetails(id) {

        const project =
            this.service.getById(id);

        console.log("=================================");
        console.log("ID CLIQUÉ :", id);
        console.log("PROJET RÉCUPÉRÉ :", project);
        console.log("DEADLINE :", project?.deadline);
        console.log("=================================");

        if (!project) {

            console.error(
                "Projet introuvable :",
                id
            );

            return;
        }

        try {

            const response =
                await fetch(
                    "src/views/projects/project-details.html"
                );

            if (!response.ok) {

                throw new Error(
                    `Erreur HTTP ${response.status}`
                );

            }

            const detailsHTML =
                await response.text();

            const main =
                document.getElementById(
                    "main-content"
                );

            if (!main) {

                console.error(
                    "L'élément #main-content est introuvable."
                );

                return;
            }

            main.innerHTML =
                detailsHTML;

                await this.loadTaskModal();

            /*
             * Vérification du conteneur deadline
             */

            const deadlineContainer =
                document.getElementById(
                    "project-deadline"
                );

            console.log(
                "CONTENEUR DEADLINE APRÈS CHARGEMENT :",
                deadlineContainer
            );

            /*
             * Affichage des informations
             */

            this.renderProjectDetails(
                project
            );

            /*
             * Affichage de la deadline
             */

            this.renderProjectDeadline(
                project
            );

            /*
             * Affichage des tâches
             */

            this.renderProjectTasks(
                project
            );

            /*
             * Événements
             */

            this.bindProjectDetailsEvents(
                project
            );

            this.initKanbanDragAndDrop(project);

        } catch (error) {

            console.error(
                "Erreur lors du chargement des détails :",
                error
            );

        }
    },

    /**
     * Charge le HTML du modal de création/édition de tâche et l'insère dans la page.
     */
    async loadTaskModal() {

        try {

            const response =
                await fetch(
                    "src/views/tasks/task-modal.html"
                );

            if (!response.ok) {

                throw new Error(
                    `Erreur HTTP ${response.status}`
                );

            }

            const modalHTML =
                await response.text();

            const container =
                document.getElementById(
                    "task-modal-container"
                );

            if (!container) {

                console.error(
                    "Le conteneur #task-modal-container est introuvable."
                );

                return;
            }

            container.innerHTML =
                modalHTML;

            console.log(
                "Formulaire de tâche chargé."
            );

        } catch (error) {

            console.error(
                "Erreur lors du chargement du formulaire de tâche :",
                error
            );

        }

    },

    /**
     * Remplit la page de détails avec les infos du projet (nom, description, statut...).
     */
    renderProjectDetails(project) {

        const name =
            document.getElementById(
                "project-details-name"
            );

        const description =
            document.getElementById(
                "project-details-description"
            );

        const status =
            document.getElementById(
                "project-details-status"
            );

        const createdAt =
            document.getElementById(
                "project-created-at"
            );

        const updatedAt =
            document.getElementById(
                "project-updated-at"
            );

        const colorBar =
            document.getElementById(
                "project-color-bar"
            );

        const taskCount =
            document.getElementById(
                "project-task-count"
            );


        /*
         * Nom
         */

        if (name) {

            name.textContent =
                project.name || "";

        }


        /*
         * Description
         */

        if (description) {

            description.textContent =
                project.description ||
                "Aucune description.";

        }


        /*
         * Statut
         */

        if (status) {

            const isArchived =
                project.status === "archived";


            status.textContent =
                isArchived
                    ? "Archivé"
                    : "Actif";


            status.className =
                isArchived

                    ? `
                        rounded-full
                        bg-slate-100
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-slate-600
                        dark:bg-slate-800
                        dark:text-slate-400
                    `

                    : `
                        rounded-full
                        bg-emerald-50
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-emerald-700
                        dark:bg-emerald-500/10
                        dark:text-emerald-400
                    `;

        }


        /*
         * Date création
         */

        if (createdAt) {

            createdAt.textContent =
                this.formatDate(
                    project.createdAt
                );

        }


        /*
         * Date modification
         */

        if (updatedAt) {

            updatedAt.textContent =
                this.formatDate(
                    project.updatedAt ||
                    project.createdAt
                );

        }


        /*
         * Couleur
         */

        if (colorBar) {

            const colors = {

                indigo: "bg-indigo-500",

                violet: "bg-violet-500",

                emerald: "bg-emerald-500",

                orange: "bg-orange-500",

                rose: "bg-rose-500"

            };


            colorBar.className =
                `h-2 ${
                    colors[project.color] ||
                    colors.indigo
                }`;

        }


        /*
         * Nombre de tâches
         */

        if (taskCount) {

            const count =
                this.taskService
                    .getTaskCountByProjectId(
                        project.id
                    );


            taskCount.textContent =
                count === 1
                    ? "1 tâche"
                    : `${count} tâches`;

        }

    },

    /**
     * Formate une date (AAAA-MM-JJ) en format lisible pour l'affichage.
     */
     formatDate(date) {

        if (!date) {

            return "—";

        }


        return new Date(
            date
        ).toLocaleDateString(
            "fr-FR",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    },

    /**
     * Attache les événements de la page de détails (retour, modifier, supprimer, nouvelle tâche...).
     */
    bindProjectDetailsEvents(project) {

        /*
         * Retour aux projets
         */

        const backButton =
            document.getElementById(
                "back-to-projects"
            );


        if (backButton) {

            backButton.addEventListener(
                "click",
                () => {

                    this.renderProjectsPage();

                }
            );

        }


        /*
         * Modifier
         */

        const editButton =
            document.getElementById(
                "edit-project-details"
            );


        if (editButton) {

            editButton.addEventListener(
                "click",
                () => {

                    this.openEditModal(
                        project.id
                    );

                }
            );

        }


        /*
         * Archiver
         */

        const archiveButton =
            document.getElementById(
                "archive-project-details"
            );


        if (archiveButton) {

            archiveButton.addEventListener(
                "click",
                () => {

                    this.toggleArchive(
                        project.id
                    );


                    this.showProjectDetails(
                        project.id
                    );

                }
            );

        }


        /*
         * Ajouter une tâche
         *
         * Pour l'instant nous ne
         * connectons PAS encore
         * le module Tasks.
         */

        const addTaskButton =
            document.getElementById(
                "add-task-to-project"
            );


    if (addTaskButton) {

        addTaskButton.addEventListener(
            "click",
            () => {

                this.openCreateTaskModal(project);

            }
        );

    }

    /*
     * Formulaire de création d'une tâche
     *
     * Le formulaire est géré par le module Kanban/Tâches.
     */
    
    if (typeof this.bindTaskFormEvents === "function") {
    
        this.bindTaskFormEvents(project);
    
    }

    },

    /**
     * Affiche la deadline du projet avec son style (en retard, proche, ok...).
     */
    renderProjectDeadline(project) {

        const container =
            document.getElementById(
                "project-deadline"
            );

        if (!container) {
            return;
        }

        const deadline =
            project?.deadline;

        console.log(
            "DEADLINE À AFFICHER :",
            deadline
        );

        if (!deadline) {

            container.innerHTML = `
                <div
                    class="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        bg-slate-50
                        p-4
                        dark:bg-slate-800/50
                    "
                >

                    <div class="text-2xl">
                        📅
                    </div>

                    <div>
                        <p
                            class="
                                text-sm
                                font-medium
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Deadline
                        </p>

                        <p
                            class="
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Aucune deadline définie
                        </p>
                    </div>

                </div>
            `;

            return;
        }

        // suite de ton code...


        // Le reste de ton code continue ici...


        const label =
            deadlineService.getLabel(
                deadline
            );

        const classes =
            deadlineService.getClasses(
                deadline
            );


        const formattedDate =
            new Intl.DateTimeFormat(
                "fr-FR",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            ).format(
                new Date(deadline)
            );


        container.innerHTML = `



            <div
                class="
                    flex
                    flex-col
                    gap-4
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    dark:border-slate-700
                    dark:bg-slate-900
                "
            >

                <div
                    class="
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >

                    <div>

                        <p
                            class="
                                text-sm
                                font-medium
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Deadline du projet
                        </p>

                        <p
                            class="
                                mt-1
                                text-lg
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            📅 ${formattedDate}
                        </p>

                    </div>


                    <span
                        class="
                            rounded-full
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            ${classes.badge}
                        "
                    >
                        ${label}
                    </span>

                </div>

            </div>

        `;
        console.log(
        "HTML DEADLINE APRÈS RENDU :",
        container.innerHTML
    );
    }

};
