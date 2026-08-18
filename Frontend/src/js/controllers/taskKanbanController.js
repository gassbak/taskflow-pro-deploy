/**
 * taskKanbanController.js
 * -------------------------
 * Regroupe tout ce qui concerne les TÂCHES et le KANBAN à l'intérieur
 * d'un projet : affichage des cartes, création/édition de tâche,
 * changement de statut (select), glisser-déposer et compteurs.
 *
 * Ces méthodes sont écrites comme un objet "mixin" : elles sont ensuite
 * copiées sur ProjectController.prototype (voir projectController.js),
 * donc `this` fait toujours référence à l'instance de ProjectController
 * (this.taskService, this.service, etc. restent accessibles normalement).
 *
 * NOTE (correction appliquée) : createProjectTaskPreview() était définie
 * deux fois dans l'ancien fichier. La version qui gagnait avait perdu
 * l'attribut draggable="true" et la classe "task-card" en cours de route,
 * ce qui empêchait les cartes d'être détectées et déplacées. La classe et
 * l'attribut ont été remis ici, et la valeur de statut "inprogress" a été
 * harmonisée en "in_progress" pour rester cohérente avec le glisser-déposer.
 */
export const taskKanbanMixin = {

    /**
     * Attache les événements des cartes tâches : changement de statut (select), modifier, supprimer.
     */
    bindTaskActionEvents(project) {

        /*
         * ============================
         * DRAG & DROP
         * ============================
         */


        const taskCards =
            document.querySelectorAll(
                ".task-card"
            );


        taskCards.forEach(card => {

            /*
             * Début du déplacement
             */

            card.addEventListener(
                "dragstart",
                event => {

                    const taskId =
                        card.dataset.taskId;


                    event.dataTransfer.setData(
                        "text/plain",
                        taskId
                    );


                    event.dataTransfer.effectAllowed =
                        "move";


                    card.classList.add(
                        "opacity-50"
                    );

                }
            );


            /*
             * Fin du déplacement
             */

            card.addEventListener(
                "dragend",
                () => {

                    card.classList.remove(
                        "opacity-50"
                    );

                }
            );

        });


        /*
         * Zones de dépôt
         */

        const dropZones =
            document.querySelectorAll(
                ".task-drop-zone"
            );


        dropZones.forEach(zone => {

            /*
             * Autoriser le dépôt
             */

            zone.addEventListener(
                "dragover",
                event => {

                    event.preventDefault();


                    event.dataTransfer.dropEffect =
                        "move";


                    zone.classList.add(
                        "ring-2",
                        "ring-blue-400"
                    );

                }
            );


            /*
             * Retirer l'indication visuelle
             */

            zone.addEventListener(
                "dragleave",
                () => {

                    zone.classList.remove(
                        "ring-2",
                        "ring-blue-400"
                    );

                }
            );


            /*
             * Déposer la tâche
             */

            zone.addEventListener(
                "drop",
                event => {

                    event.preventDefault();


                    zone.classList.remove(
                        "ring-2",
                        "ring-blue-400"
                    );


                    const taskId =
                        event.dataTransfer.getData(
                            "text/plain"
                        );


                    if (!taskId) {

                        return;

                    }


                    /*
                     * Déterminer le nouveau statut
                     */

                    let newStatus =
                        "todo";


                    if (
                        zone.id ===
                        "inprogress-tasks"
                    ) {

                        newStatus =
                            "inprogress";

                    }


                    else if (
                        zone.id ===
                        "done-tasks"
                    ) {

                        newStatus =
                            "done";

                    }


                    /*
                     * Mettre à jour la tâche
                     */

                    const updatedTask =
                        this.taskService.updateTask(
                            taskId,
                            {
                                status:
                                    newStatus
                            }
                        );


                    if (!updatedTask) {

                        alert(
                            "Impossible de déplacer la tâche."
                        );

                        return;

                    }


                    console.log(
                        "Tâche déplacée :",
                        updatedTask
                    );


                    /*
                     * Rafraîchir le Kanban
                     */

                    this.renderProjectTasks(
                        project
                    );

                }
            );

        });


        /*
         * ============================
         * CHANGEMENT DE STATUT
         * ============================
         */

        document
            .querySelectorAll(".task-status")
            .forEach(select => {

                select.addEventListener(
                    "change",
                    () => {

                        const taskId =
                            select.dataset.taskId;


                        const newStatus =
                            select.value;


                        const updatedTask =
                            this.taskService.updateTask(
                                taskId,
                                {
                                    status:
                                        newStatus
                                }
                            );


                        if (!updatedTask) {

                            alert(
                                "Impossible de modifier le statut."
                            );

                            return;

                        }


                        console.log(
                            "Statut modifié :",
                            updatedTask
                        );


                        this.renderProjectTasks(
                            project
                        );

                    }
                );

            });


        /*
         * ============================
         * SUPPRESSION
         * ============================
         */

        document
            .querySelectorAll(".delete-task")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const taskId =
                            button.dataset.taskId;


                        const confirmation =
                            confirm(
                                "Voulez-vous vraiment supprimer cette tâche ?"
                            );


                        if (!confirmation) {

                            return;

                        }


                        const deleted =
                            this.taskService.deleteTask(
                                taskId
                            );


                        if (!deleted) {

                            alert(
                                "Impossible de supprimer la tâche."
                            );

                            return;

                        }


                        console.log(
                            "Tâche supprimée :",
                            taskId
                        );


                        this.renderProjectTasks(
                            project
                        );

                    }
                );

            });


        /*
         * ============================
         * MODIFICATION
         * ============================
         */

        document
            .querySelectorAll(".edit-task")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const taskId =
                            button.dataset.taskId;


                        this.openEditTaskModal(
                            taskId,
                            project
                        );

                    }
                );

            });

    },

    /**
     * Construit le HTML d'une carte tâche du Kanban (avec draggable + classe task-card).
     */
    createProjectTaskPreview(task) {

        const priorityLabels = {

            low: "Faible",

            medium: "Moyenne",

            high: "Haute"

        };


        return `

            <div
                class="
                    task-card
                    cursor-grab
                    rounded-xl
                    border
                    border-slate-200
                    p-4
                    transition
                    hover:bg-slate-50
                    active:cursor-grabbing
                    dark:border-slate-800
                    dark:hover:bg-slate-800/50
                "
                draggable="true"
                data-task-id="${task.id}"
            >

                <!-- Partie principale -->

                <div
                    class="
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >

                    <div class="min-w-0 flex-1">

                        <!-- Titre -->

                        <h3
                            class="
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            ${this.escapeHtml(
                                task.title || "Sans titre"
                            )}
                        </h3>


                        <!-- Description -->

                        ${
                            task.description
                                ? `
                                    <p
                                        class="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        ${this.escapeHtml(
                                            task.description
                                        )}
                                    </p>
                                `
                                : ""
                        }


                        <!-- Statut + priorité -->

                        <div
                            class="
                                mt-3
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >

                            <!-- Sélecteur de statut -->

                            <select
                                class="
                                    task-status
                                    rounded-full
                                    border
                                    border-slate-200
                                    bg-slate-100
                                    px-3
                                    py-1
                                    text-xs
                                    font-medium
                                    text-slate-700
                                    outline-none
                                    transition
                                    focus:ring-2
                                    focus:ring-blue-500
                                    dark:border-slate-700
                                    dark:bg-slate-800
                                    dark:text-slate-300
                                "
                                data-task-id="${task.id}"
                            >

                                <option
                                    value="todo"
                                    ${
                                        task.status === "todo"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    À faire
                                </option>


                                <option
                                    value="in_progress"
                                    ${
                                        task.status === "in_progress" ||
                                        task.status === "inprogress"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    En cours
                                </option>


                                <option
                                    value="done"
                                    ${
                                        task.status === "done"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Terminée
                                </option>

                            </select>


                            <!-- Priorité -->

                            ${
                                task.priority
                                    ? `
                                        <span
                                            class="
                                                rounded-full
                                                bg-indigo-50
                                                px-2
                                                py-1
                                                text-xs
                                                text-indigo-600
                                                dark:bg-indigo-500/10
                                                dark:text-indigo-400
                                            "
                                        >
                                            ${
                                                priorityLabels[
                                                    task.priority
                                                ]
                                                || task.priority
                                            }
                                        </span>
                                    `
                                    : ""
                            }

                        </div>

                    </div>


                    <!-- Deadline -->

                    <div
                        class="
                            shrink-0
                            text-xs
                            text-slate-400
                        "
                    >
                        ${
                            task.deadline
                                ? this.formatDate(
                                    task.deadline
                                )
                                : "Pas de deadline"
                        }
                    </div>

                </div>


                <!-- Actions -->

                <div
                    class="
                        mt-4
                        flex
                        justify-end
                        gap-2
                    "
                >

                    <!-- Modifier -->

                    <button
                        type="button"
                        class="
                            edit-task
                            rounded-lg
                            border
                            border-slate-200
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-slate-700
                            transition
                            hover:bg-slate-100
                            dark:border-slate-700
                            dark:text-slate-200
                            dark:hover:bg-slate-700
                        "
                        data-task-id="${task.id}"
                    >
                        Modifier
                    </button>


                    <!-- Supprimer -->

                    <button
                        type="button"
                        class="
                            delete-task
                            rounded-lg
                            bg-red-500
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-red-600
                        "
                        data-task-id="${task.id}"
                    >
                        Supprimer
                    </button>

                </div>

            </div>

        `;

    },

    /**
     * Ouvre le modal de création d'une tâche pour un projet donné.
     */
    openCreateTaskModal(project) {

        const modal =
            document.getElementById("task-modal");

        if (!modal) {

            console.error(
                "Le formulaire de tâche est introuvable."
            );

            return;
        }

        modal.classList.remove("hidden");

        modal.dataset.projectId =
            project.id;

    },

    /**
     * Attache l'événement de soumission du formulaire de création de tâche.
     */
    bindTaskFormEvents(project) {

        const form =
            document.getElementById("task-form");

        const modal =
            document.getElementById("task-modal");

        const closeButton =
            document.getElementById("close-task-modal");

        const cancelButton =
            document.getElementById("cancel-task-modal");


        if (!form) {

            console.error(
                "Le formulaire #task-form est introuvable."
            );

            return;
        }


        form.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const formData =
                    new FormData(form);


                const title =
                    formData
                        .get("title")
                        ?.toString()
                        .trim();


                if (!title) {

                    alert(
                        "Le titre de la tâche est obligatoire."
                    );

                    return;
                }


                const task =
                    this.taskService.createTask({

                        projectId:
                            project.id,

                        title:
                            title,

                        description:
                            formData
                                .get("description")
                                ?.toString()
                                .trim() || "",

                        priority:
                            formData
                                .get("priority")
                                ?.toString() || "medium",

                        deadline:
                            formData
                                .get("deadline")
                                ?.toString() || null,

                        status:
                            "todo"

                    });


                console.log(
                    "Tâche créée :",
                    task
                );


                form.reset();


                if (modal) {

                    modal.classList.add(
                        "hidden"
                    );

                }


                this.renderProjectTasks(
                    project
                );

            }
        );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                () => {

                    modal.classList.add(
                        "hidden"
                    );

                }
            );

        }


        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                () => {

                    modal.classList.add(
                        "hidden"
                    );

                }
            );

        }

    },

    /**
     * Ouvre une édition simple (via prompt) d'une tâche existante.
     */
    openEditTaskModal(taskId, project) {

        const tasks =
            this.taskService.getAllTasks();

        const task =
            tasks.find(
                item => item.id === taskId
            );

        if (!task) {

            console.error(
                "Tâche introuvable :",
                taskId
            );

            return;

        }


        const title =
            prompt(
                "Titre de la tâche :",
                task.title || ""
            );


        if (title === null) {

            return;

        }


        const description =
            prompt(
                "Description :",
                task.description || ""
            );


        if (description === null) {

            return;

        }


        const priority =
            prompt(
                "Priorité (low, medium, high) :",
                task.priority || "medium"
            );


        if (priority === null) {

            return;

        }


        const deadline =
            prompt(
                "Deadline (AAAA-MM-JJ) :",
                task.deadline || ""
            );


        if (deadline === null) {

            return;

        }


        const updatedTask =
            this.taskService.updateTask(
                taskId,
                {

                    title:
                        title.trim(),

                    description:
                        description.trim(),

                    priority:
                        priority.trim(),

                    deadline:
                        deadline.trim() || null

                }
            );


        if (!updatedTask) {

            alert(
                "Impossible de modifier la tâche."
            );

            return;

        }


        console.log(
            "Tâche modifiée :",
            updatedTask
        );


        this.renderProjectTasks(
            project
        );

    },

    /**
     * Active le glisser-déposer des cartes entre les 3 colonnes du Kanban.
     */
    initKanbanDragAndDrop(project) {

        const dropZones =
            document.querySelectorAll(".task-drop-zone");

        console.log(
            "ZONES KANBAN TROUVÉES :",
            dropZones.length
        );

        if (!dropZones.length) {

            console.warn(
                "Aucune zone Kanban trouvée."
            );

            return;
        }

        dropZones.forEach(zone => {

            zone.addEventListener(
                "dragover",
                (event) => {

                    event.preventDefault();

                }
            );

            zone.addEventListener(
                "drop",
                async (event) => {

                    event.preventDefault();

                    const taskId =
                        event.dataTransfer.getData(
                            "text/plain"
                        );

                    if (!taskId) {

                        console.warn(
                            "Aucun ID de tâche récupéré."
                        );

                        return;
                    }

                    const newStatus =
                        zone.id === "todo-tasks"
                            ? "todo"
                            : zone.id === "inprogress-tasks"
                                ? "in_progress"
                                : zone.id === "done-tasks"
                                    ? "done"
                                    : null;

                    if (!newStatus) {

                        console.warn(
                            "Statut inconnu pour :",
                            zone.id
                        );

                        return;
                    }

                    console.log(
                        "TÂCHE DÉPLACÉE :",
                        taskId
                    );

                    console.log(
                        "NOUVEAU STATUT :",
                        newStatus
                    );

                }
            );

        });

    },

    /**
     * Récupère les tâches du projet, les répartit dans les 3 colonnes et met à jour les compteurs.
     */
    renderProjectTasks(project) {

        console.log(
            "=== RENDU DES TÂCHES DU PROJET ==="
        );

        const todoContainer =
            document.getElementById(
                "todo-tasks"
            );

        const inProgressContainer =
            document.getElementById(
                "inprogress-tasks"
            );

        const doneContainer =
            document.getElementById(
                "done-tasks"
            );


        if (
            !todoContainer ||
            !inProgressContainer ||
            !doneContainer
        ) {

            console.error(
                "Conteneurs Kanban introuvables."
            );

            return;

        }


        /*
         * Récupérer les tâches du projet
         */

        const tasks =
            this.taskService.getTasksByProjectId(
                project.id
            );


        console.log(
            "TÂCHES DU PROJET :",
            tasks
        );


        /*
         * Nettoyer les colonnes
         */

        todoContainer.innerHTML = "";
        inProgressContainer.innerHTML = "";
        doneContainer.innerHTML = "";


        /*
         * Afficher les tâches
         */

        tasks.forEach(task => {

            const taskHTML =
                this.createProjectTaskPreview(
                    task
                );


            if (task.status === "todo") {

                todoContainer.insertAdjacentHTML(
                    "beforeend",
                    taskHTML
                );

            }

            else if (
                task.status === "inprogress" ||
                task.status === "in_progress"
            ) {

                inProgressContainer.insertAdjacentHTML(
                    "beforeend",
                    taskHTML
                );

            }

            else if (task.status === "done") {

                doneContainer.insertAdjacentHTML(
                    "beforeend",
                    taskHTML
                );

            }

        });


        /*
         * Mettre à jour les compteurs
         */

        const todoCount =
            document.getElementById(
                "todo-task-count"
            );

        const inProgressCount =
            document.getElementById(
                "inprogress-task-count"
            );

        const doneCount =
            document.getElementById(
                "done-task-count"
            );


        if (todoCount) {

            todoCount.textContent =
                tasks.filter(
                    task =>
                        task.status === "todo"
                ).length;

        }


        if (inProgressCount) {

            inProgressCount.textContent =
                tasks.filter(
                    task =>
                        task.status === "inprogress" ||
                        task.status === "in_progress"
                ).length;

        }


        if (doneCount) {

            doneCount.textContent =
                tasks.filter(
                    task =>
                        task.status === "done"
                ).length;

        }


        /*
         * Réactiver le drag & drop
         * après le rendu des cartes
         */

        this.initKanbanDragAndDrop(
            project
        );

    }

};
