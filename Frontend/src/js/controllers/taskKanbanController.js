/**
 * taskKanbanController.js
 * -------------------------
 * Gestion des tâches et du Kanban :
 * - affichage des tâches
 * - modification
 * - suppression
 * - changement de statut
 * - drag & drop
 * - compteurs
 */

export const taskKanbanMixin = {

    /**
     * ============================================================
     * AFFICHAGE D'UNE CARTE DE TÂCHE
     * ============================================================
     */
    createProjectTaskPreview(task) {

        const priorityLabels = {

            low: "Faible",
            medium: "Moyenne",
            high: "Haute",
            urgent: "Urgente"

        };


        /*
         * Compatibilité avec les anciens statuts
         */
        let normalizedStatus =
            task.status;

        if (task.status === "progress") {

            normalizedStatus =
                "in_progress";

        }

        else if (task.status === "completed") {

            normalizedStatus =
                "done";

        }


        return `

            <div
                class="
                    task-card
                    cursor-grab
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    transition
                    hover:bg-slate-50
                    active:cursor-grabbing
                    dark:border-slate-800
                    dark:bg-slate-950
                    dark:hover:bg-slate-800/50
                "
                draggable="true"
                data-task-id="${task.id}"
            >

                <!-- CONTENU PRINCIPAL -->

                <div
                    class="
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >

                    <div class="min-w-0 flex-1">

                        <!-- TITRE -->

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


                        <!-- DESCRIPTION -->

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


                        <!-- STATUT + PRIORITÉ -->

                        <div
                            class="
                                mt-3
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >

                            <!-- SELECT STATUT -->

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
                                        normalizedStatus === "todo"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    À faire
                                </option>

                                <option
                                    value="in_progress"
                                    ${
                                        normalizedStatus === "in_progress"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    En cours
                                </option>

                                <option
                                    value="done"
                                    ${
                                        normalizedStatus === "done"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Terminée
                                </option>

                            </select>


                            <!-- PRIORITÉ -->

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


                    <!-- DEADLINE -->

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


                <!-- ACTIONS -->

                <div
                    class="
                        mt-4
                        flex
                        justify-end
                        gap-2
                    "
                >

                    <!-- MODIFIER -->

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


                    <!-- SUPPRIMER -->

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
     * ============================================================
     * ÉVÉNEMENTS DES TÂCHES
     * ============================================================
     */
    bindTaskActionEvents(project) {

        const kanban =
            document.getElementById(
                "project-kanban"
            );


        if (!kanban) {

            console.error(
                "Conteneur #project-kanban introuvable."
            );

            return;

        }


        /*
         * Éviter plusieurs branchements.
         */
        if (
            kanban.dataset.eventsBound === "true"
        ) {

            return;

        }


        kanban.dataset.eventsBound =
            "true";


        /*
         * ========================================================
         * MODIFIER / SUPPRIMER
         * ========================================================
         */

        kanban.addEventListener(
            "click",
            (event) => {

                /*
                 * MODIFIER
                 */

                const editButton =
                    event.target.closest(
                        ".edit-task"
                    );


                if (editButton) {

                    const taskId =
                        editButton.dataset.taskId;


                    if (!taskId) {

                        console.error(
                            "ID de tâche manquant pour la modification."
                        );

                        return;

                    }


                    console.log(
                        "MODIFICATION TÂCHE :",
                        taskId
                    );


                    this.openEditTaskModal(
                        taskId,
                        project
                    );


                    return;

                }


                /*
                 * SUPPRIMER
                 */

                const deleteButton =
                    event.target.closest(
                        ".delete-task"
                    );


                if (deleteButton) {

                    const taskId =
                        deleteButton.dataset.taskId;


                    if (!taskId) {

                        console.error(
                            "ID de tâche manquant pour la suppression."
                        );

                        return;

                    }


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

            }
        );


        /*
         * ========================================================
         * CHANGEMENT DE STATUT VIA SELECT
         * ========================================================
         */

        kanban.addEventListener(
            "change",
            (event) => {

                const select =
                    event.target.closest(
                        ".task-status"
                    );


                if (!select) {

                    return;

                }


                const taskId =
                    select.dataset.taskId;


                const newStatus =
                    select.value;


                if (!taskId) {

                    console.error(
                        "ID de tâche manquant."
                    );

                    return;

                }


                const allowedStatuses = [
                    "todo",
                    "in_progress",
                    "done"
                ];


                if (
                    !allowedStatuses.includes(
                        newStatus
                    )
                ) {

                    console.error(
                        "Statut invalide :",
                        newStatus
                    );

                    return;

                }


                console.log(
                    "CHANGEMENT DE STATUT :",
                    taskId,
                    "→",
                    newStatus
                );


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
                    "Tâche mise à jour :",
                    updatedTask
                );


                this.renderProjectTasks(
                    project
                );

            }
        );


        /*
         * ========================================================
         * DRAG START
         * ========================================================
         */

        kanban.addEventListener(
            "dragstart",
            (event) => {

                const card =
                    event.target.closest(
                        ".task-card"
                    );


                if (!card) {

                    return;

                }


                const taskId =
                    card.dataset.taskId;


                if (!taskId) {

                    console.error(
                        "ID de tâche absent."
                    );

                    return;

                }


                console.log(
                    "DRAG START :",
                    taskId
                );


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
         * ========================================================
         * DRAG END
         * ========================================================
         */

        kanban.addEventListener(
            "dragend",
            (event) => {

                const card =
                    event.target.closest(
                        ".task-card"
                    );


                if (card) {

                    card.classList.remove(
                        "opacity-50"
                    );

                }


                kanban
                    .querySelectorAll(
                        ".task-drop-zone"
                    )
                    .forEach(zone => {

                        zone.classList.remove(
                            "ring-2",
                            "ring-blue-400"
                        );

                    });

            }
        );


        /*
         * ========================================================
         * DRAG OVER
         * ========================================================
         */

        kanban.addEventListener(
            "dragover",
            (event) => {

                const zone =
                    event.target.closest(
                        ".task-drop-zone"
                    );


                if (!zone) {

                    return;

                }


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
         * ========================================================
         * DRAG LEAVE
         * ========================================================
         */

        kanban.addEventListener(
            "dragleave",
            (event) => {

                const zone =
                    event.target.closest(
                        ".task-drop-zone"
                    );


                if (!zone) {

                    return;

                }


                if (
                    !zone.contains(
                        event.relatedTarget
                    )
                ) {

                    zone.classList.remove(
                        "ring-2",
                        "ring-blue-400"
                    );

                }

            }
        );


        /*
         * ========================================================
         * DROP
         * ========================================================
         */

        kanban.addEventListener(
            "drop",
            (event) => {

                event.preventDefault();


                const zone =
                    event.target.closest(
                        ".task-drop-zone"
                    );


                if (!zone) {

                    return;

                }


                zone.classList.remove(
                    "ring-2",
                    "ring-blue-400"
                );


                const taskId =
                    event.dataTransfer.getData(
                        "text/plain"
                    );


                if (!taskId) {

                    console.error(
                        "Aucun ID de tâche récupéré."
                    );

                    return;

                }


                let newStatus =
                    null;


                if (
                    zone.id === "todo-tasks"
                ) {

                    newStatus =
                        "todo";

                }

                else if (
                    zone.id === "inprogress-tasks"
                ) {

                    newStatus =
                        "in_progress";

                }

                else if (
                    zone.id === "done-tasks"
                ) {

                    newStatus =
                        "done";

                }


                if (!newStatus) {

                    console.error(
                        "Zone Kanban inconnue :",
                        zone.id
                    );

                    return;

                }


                console.log(
                    "DROP :",
                    taskId,
                    "→",
                    newStatus
                );


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
                    "TÂCHE DÉPLACÉE :",
                    updatedTask
                );


                this.renderProjectTasks(
                    project
                );

            }
        );


        console.log(
            "Événements Kanban activés."
        );

    },


    /**
     * ============================================================
     * MODIFICATION D'UNE TÂCHE
     * ============================================================
     */
    openEditTaskModal(taskId, project) {

        const tasks =
            this.taskService.getAllTasks();


        const task =
            tasks.find(
                item =>
                    item.id === taskId
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
                "Priorité (low, medium, high, urgent) :",
                task.priority || "medium"
            );


        if (priority === null) {

            return;

        }


        const allowedPriorities = [
            "low",
            "medium",
            "high",
            "urgent"
        ];


        const cleanPriority =
            priority
                .trim()
                .toLowerCase();


        if (
            !allowedPriorities.includes(
                cleanPriority
            )
        ) {

            alert(
                "Priorité invalide. Utilisez : low, medium, high ou urgent."
            );

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
                        cleanPriority,

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
     * ============================================================
     * INITIALISATION DU KANBAN
     * ============================================================
     */
    initKanbanDragAndDrop(project) {

        console.log(
            "Initialisation du Kanban..."
        );


        const kanban =
            document.getElementById(
                "project-kanban"
            );


        if (!kanban) {

            console.error(
                "Conteneur #project-kanban introuvable."
            );

            return;

        }


        const zones =
            kanban.querySelectorAll(
                ".task-drop-zone"
            );


        console.log(
            "ZONES KANBAN TROUVÉES :",
            zones.length
        );


        if (zones.length !== 3) {

            console.warn(
                "Le Kanban devrait contenir 3 zones."
            );

        }


        /*
         * Les événements sont centralisés
         * dans bindTaskActionEvents().
         */

        this.bindTaskActionEvents(
            project
        );

    },


    /**
     * ============================================================
     * RENDU DU KANBAN
     * ============================================================
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
         * Récupérer les tâches
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

        todoContainer.innerHTML =
            "";

        inProgressContainer.innerHTML =
            "";

        doneContainer.innerHTML =
            "";


        /*
         * Afficher les tâches
         */

        tasks.forEach(
            task => {

                /*
                 * Compatibilité avec les
                 * anciennes valeurs du localStorage.
                 */

                let status =
                    task.status;


                if (
                    status === "progress"
                ) {

                    status =
                        "in_progress";

                }

                else if (
                    status === "completed"
                ) {

                    status =
                        "done";

                }


                const taskHTML =
                    this.createProjectTaskPreview(
                        task
                    );


                if (
                    status === "todo"
                ) {

                    todoContainer.insertAdjacentHTML(
                        "beforeend",
                        taskHTML
                    );

                }

                else if (
                    status === "in_progress"
                ) {

                    inProgressContainer.insertAdjacentHTML(
                        "beforeend",
                        taskHTML
                    );

                }

                else if (
                    status === "done"
                ) {

                    doneContainer.insertAdjacentHTML(
                        "beforeend",
                        taskHTML
                    );

                }

                else {

                    console.warn(
                        "Statut de tâche inconnu :",
                        task.status,
                        task
                    );

                }

            }
        );


        /*
         * ========================================================
         * COMPTEURS
         * ========================================================
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


        const todoTasks =
            tasks.filter(
                task =>
                    task.status === "todo"
            );


        const inProgressTasks =
            tasks.filter(
                task =>
                    task.status === "inprogress" ||
                    task.status === "in_progress" ||
                    task.status === "progress"
            );


        const doneTasks =
            tasks.filter(
                task =>
                    task.status === "done" ||
                    task.status === "completed"
            );


        if (todoCount) {

            todoCount.textContent =
                todoTasks.length;

        }


        if (inProgressCount) {

            inProgressCount.textContent =
                inProgressTasks.length;

        }


        if (doneCount) {

            doneCount.textContent =
                doneTasks.length;

        }


        /*
         * Les événements sont délégués sur
         * #project-kanban.
         *
         * Pas besoin de les rattacher
         * à chaque nouvelle carte.
         */

        this.bindTaskActionEvents(
            project
        );

    }

};