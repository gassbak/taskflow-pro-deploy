class ProjectTaskService {

    constructor() {

        this.storageKey = "taskflow_tasks";

    }


    /**
     * Récupère toutes les tâches.
     *
     * Ce service ne crée pas et ne modifie
     * aucune tâche pour le moment.
     */

    getAllTasks() {

        try {

            const data =
                localStorage.getItem(
                    this.storageKey
                );


            if (!data) {

                return [];

            }


            const tasks =
                JSON.parse(data);


            return Array.isArray(tasks)
                ? tasks
                : [];


        } catch (error) {

            console.error(
                "Erreur lors de la lecture des tâches :",
                error
            );


            return [];

        }

    }


    /**
     * Retourne les tâches appartenant
     * à un projet donné.
     */

    getTasksByProjectId(projectId) {

        if (!projectId) {

            return [];

        }


        const tasks =
            this.getAllTasks();


        return tasks.filter(
            task =>
                task.projectId === projectId
        );

    }


/**
 * Crée une nouvelle tâche.
 */
createTask(taskData) {

    const tasks =
        this.getAllTasks();

    const task = {

        id: crypto.randomUUID(),

        projectId:
            taskData.projectId,

        title:
            taskData.title,

        description:
            taskData.description || "",

        priority:
            taskData.priority || "medium",

        deadline:
            taskData.deadline || null,

        status:
            taskData.status || "todo",

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    tasks.push(task);


    localStorage.setItem(

        this.storageKey,

        JSON.stringify(tasks)

    );


    return task;

}

/**
 * Met à jour une tâche existante.
 */
updateTask(taskId, updates) {

    const tasks =
        this.getAllTasks();

    const taskIndex =
        tasks.findIndex(
            task => task.id === taskId
        );

    if (taskIndex === -1) {

        console.error(
            "Tâche introuvable :",
            taskId
        );

        return null;

    }

    tasks[taskIndex] = {

        ...tasks[taskIndex],

        ...updates,

        updatedAt:
            new Date().toISOString()

    };

    localStorage.setItem(

        this.storageKey,

        JSON.stringify(tasks)

    );

    return tasks[taskIndex];

}


/**
 * Supprime une tâche.
 */
deleteTask(taskId) {

    const tasks =
        this.getAllTasks();

    const taskExists =
        tasks.some(
            task => task.id === taskId
        );

    if (!taskExists) {

        console.error(
            "Tâche introuvable :",
            taskId
        );

        return false;

    }

    const updatedTasks =
        tasks.filter(
            task => task.id !== taskId
        );

    localStorage.setItem(

        this.storageKey,

        JSON.stringify(updatedTasks)

    );

    return true;

}


/**
 * Retourne le nombre de tâches
 * d'un projet.
 */
getTaskCountByProjectId(projectId) {

    return this
        .getTasksByProjectId(projectId)
        .length;

}

}




const projectTaskService =
    new ProjectTaskService();

export default projectTaskService;