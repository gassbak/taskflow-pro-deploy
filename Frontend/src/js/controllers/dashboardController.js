import { ProjectService } from "../services/projectService.js";
import projectTaskService from "../services/projectTaskService.js";


/**
 * DashboardController
 * --------------------
 * Page "Dashboard" : quelques statistiques rapides et les
 * projets les plus récents. Ne fait que LIRE les données déjà
 * gérées par ProjectService et projectTaskService — aucune
 * nouvelle donnée n'est créée ici.
 */
export class DashboardController {


    constructor() {

        this.projectService =
            new ProjectService();

        this.taskService =
            projectTaskService;

    }


    init() {

        this.renderStatistics();

        this.renderRecentProjects();

    }


    renderStatistics() {

        const projects =
            this.projectService.getAll();

        const tasks =
            this.taskService.getAllTasks();

        const activeProjects =
            projects.filter(
                project => project.status === "active"
            );

        const doneTasks =
            tasks.filter(
                task => task.status === "done"
            );

        const pendingTasks =
            tasks.filter(
                task =>
                    task.status !== "done"
            );

        this.setStat(
            "stat-total-projects",
            projects.length
        );

        this.setStat(
            "stat-active-projects",
            activeProjects.length
        );

        this.setStat(
            "stat-done-tasks",
            doneTasks.length
        );

        this.setStat(
            "stat-pending-tasks",
            pendingTasks.length
        );

    }


    setStat(elementId, value) {

        const element =
            document.getElementById(
                elementId
            );

        if (element) {

            element.textContent =
                value;

        }

    }


    renderRecentProjects() {

        const container =
            document.getElementById(
                "dashboard-recent-projects"
            );

        const emptyState =
            document.getElementById(
                "dashboard-empty-state"
            );

        if (!container) {

            return;

        }

        const projects =
            this.projectService
                .getAll()
                .slice()
                .sort(
                    (a, b) =>
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                )
                .slice(0, 5);

        if (projects.length === 0) {

            container.innerHTML = "";

            if (emptyState) {

                emptyState.classList.remove(
                    "hidden"
                );

            }

            return;

        }

        if (emptyState) {

            emptyState.classList.add(
                "hidden"
            );

        }

        container.innerHTML =
            projects
                .map(project => this.createProjectRow(project))
                .join("");

    }


    createProjectRow(project) {

        const taskCount =
            this.taskService.getTaskCountByProjectId(
                project.id
            );

        return `
            <div
                class="
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-xl
                    border
                    border-slate-100
                    px-4
                    py-3
                    dark:border-slate-800
                "
            >
                <div class="min-w-0">
                    <p
                        class="
                            truncate
                            text-sm
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        ${project.name}
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                        ${taskCount} tâche(s)
                    </p>
                </div>

                <span
                    class="
                        shrink-0
                        rounded-full
                        bg-slate-100
                        px-2.5
                        py-1
                        text-[11px]
                        font-semibold
                        text-slate-600
                        dark:bg-slate-800
                        dark:text-slate-300
                    "
                >
                    ${project.status}
                </span>
            </div>
        `;

    }

}
