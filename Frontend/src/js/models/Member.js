/**
 * Member.js
 * ---------
 * Modèle d'un membre de l'équipe TaskFlow Pro.
 * Suit le même style que Project.js : valeurs par défaut simples,
 * id généré automatiquement si absent.
 */
export class Member {

    constructor(data) {

        this.id =
            data.id ||
            crypto.randomUUID();

        this.name =
            data.name || "";

        this.email =
            data.email || "";

        this.role =
            data.role || "member";

        this.createdAt =
            data.createdAt ||
            new Date().toISOString();

    }

}
