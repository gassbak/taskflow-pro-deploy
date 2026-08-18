export class Project {

    constructor(data) {

        this.id =
            data.id ||
            crypto.randomUUID();

        this.name =
            data.name || "";

        this.description =
            data.description || "";

        this.color =
            data.color || "#6366f1";

        this.status =
            data.status || "active";

        this.deadline =
            data.deadline || null;

        this.createdAt =
            data.createdAt ||
            new Date().toISOString();

    }

}