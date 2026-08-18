import memberService
    from "../services/memberService.js";

import userService
    from "../services/userService.js";


const ROLE_LABELS = {

    owner: "Propriétaire",

    admin: "Administrateur",

    member: "Membre",

    viewer: "Observateur"

};


/**
 * MemberController
 * -----------------
 * Page "Membres" : afficher, ajouter, modifier le rôle
 * et supprimer les membres de l'équipe.
 * Suit le même pattern que ProjectController
 * (constructor -> init -> bindEvents -> render).
 */
export class MemberController {


    constructor() {

        this.service =
            memberService;

        this.modal = null;

    }


    init() {

        this.modal =
            document.getElementById(
                "member-modal"
            );

        this.bindEvents();

        this.render();

    }


    bindEvents() {

        const addButton =
            document.getElementById(
                "add-member-button"
            );

        if (addButton) {

            addButton.addEventListener(
                "click",
                () => this.openCreateModal()
            );

        }

        const closeButton =
            document.getElementById(
                "close-member-modal"
            );

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                () => this.closeModal()
            );

        }

        const cancelButton =
            document.getElementById(
                "cancel-member-modal"
            );

        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                () => this.closeModal()
            );

        }

        if (this.modal) {

            this.modal.addEventListener(
                "click",
                event => {

                    if (event.target === this.modal) {

                        this.closeModal();

                    }

                }
            );

        }

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    this.modal &&
                    !this.modal.classList.contains("hidden")
                ) {

                    this.closeModal();

                }

            }
        );

        const form =
            document.getElementById(
                "member-form"
            );

        if (form) {

            form.addEventListener(
                "submit",
                event => this.handleSubmit(event)
            );

        }

        // Délégation d'événements : les cartes membres
        // sont recréées à chaque render(), donc on écoute
        // les clics sur le conteneur plutôt que sur chaque carte.
        const list =
            document.getElementById(
                "members-list"
            );

        if (list) {

            list.addEventListener(
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

                    if (action === "edit") {

                        this.openEditModal(id);

                    }

                    if (action === "delete") {

                        this.handleDelete(id);

                    }

                }
            );

        }

    }


    openCreateModal() {

        if (!this.modal) {

            return;

        }

        const form =
            document.getElementById(
                "member-form"
            );

        if (form) {

            form.reset();

        }

        const idField =
            document.getElementById(
                "member-id"
            );

        if (idField) {

            idField.value = "";

        }

        const title =
            document.getElementById(
                "member-modal-title"
            );

        if (title) {

            title.textContent =
                "Ajouter un membre";

        }

        this.modal.classList.remove(
            "hidden"
        );

        this.modal.classList.add(
            "flex"
        );

    }


    openEditModal(id) {

        const member =
            this.service.getById(id);

        if (!member || !this.modal) {

            return;

        }

        const idField =
            document.getElementById(
                "member-id"
            );

        const nameField =
            document.getElementById(
                "member-name"
            );

        const emailField =
            document.getElementById(
                "member-email"
            );

        const roleField =
            document.getElementById(
                "member-role"
            );

        if (idField) idField.value = member.id;
        if (nameField) nameField.value = member.name;
        if (emailField) emailField.value = member.email;
        if (roleField) roleField.value = member.role;

        const title =
            document.getElementById(
                "member-modal-title"
            );

        if (title) {

            title.textContent =
                "Modifier le membre";

        }

        this.modal.classList.remove(
            "hidden"
        );

        this.modal.classList.add(
            "flex"
        );

    }


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


    handleSubmit(event) {

        event.preventDefault();

        const idField =
            document.getElementById(
                "member-id"
            );

        const nameField =
            document.getElementById(
                "member-name"
            );

        const emailField =
            document.getElementById(
                "member-email"
            );

        const roleField =
            document.getElementById(
                "member-role"
            );

        const name =
            nameField
                ? nameField.value.trim()
                : "";

        if (!name) {

            return;

        }

        const memberData = {

            name,

            email:
                emailField
                    ? emailField.value.trim()
                    : "",

            role:
                roleField
                    ? roleField.value
                    : "member"

        };

        const id =
            idField
                ? idField.value
                : "";

        if (id) {

            this.service.update(
                id,
                memberData
            );

        } else {

            this.service.create(
                memberData
            );

        }

        this.closeModal();
        this.render();

    }


    handleDelete(id) {

        const member =
            this.service.getById(id);

        if (!member) {

            return;

        }

        const confirmed =
            confirm(
                `Retirer ${member.name} de l'équipe ?`
            );

        if (!confirmed) {

            return;

        }

        this.service.delete(id);

        this.render();

    }


    /**
     * Réaffiche la liste des membres
     * (cartes + état vide si aucun membre).
     */
    render() {

        const list =
            document.getElementById(
                "members-list"
            );

        const emptyState =
            document.getElementById(
                "members-empty-state"
            );

        if (!list) {

            return;

        }

        const members =
            this.service.getAll();

        if (members.length === 0) {

            list.innerHTML = "";

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

        list.innerHTML =
            members
                .map(member => this.createMemberCard(member))
                .join("");

    }


    createMemberCard(member) {

        const initials =
            userService.getInitials(
                member.name
            );

        const roleLabel =
            ROLE_LABELS[member.role] ||
            member.role;

        return `
            <div
                class="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                    dark:border-slate-800
                    dark:bg-slate-900
                "
            >
                <div class="flex items-start justify-between gap-3">

                    <div class="flex items-center gap-3 min-w-0">

                        <div
                            class="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-indigo-100
                                font-bold
                                text-indigo-700
                                dark:bg-indigo-500/20
                                dark:text-indigo-400
                            "
                        >
                            ${initials}
                        </div>

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
                                ${member.name}
                            </p>

                            <p
                                class="
                                    truncate
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                ${member.email || "Pas d'email"}
                            </p>

                        </div>

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
                        ${roleLabel}
                    </span>

                </div>

                <div
                    class="
                        mt-4
                        flex
                        gap-2
                        border-t
                        border-slate-100
                        pt-4
                        dark:border-slate-800
                    "
                >

                    <button
                        type="button"
                        data-action="edit"
                        data-id="${member.id}"
                        class="
                            flex-1
                            rounded-lg
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-slate-600
                            transition
                            hover:bg-slate-100
                            dark:text-slate-300
                            dark:hover:bg-slate-800
                        "
                    >
                        Modifier
                    </button>

                    <button
                        type="button"
                        data-action="delete"
                        data-id="${member.id}"
                        class="
                            flex-1
                            rounded-lg
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-red-600
                            transition
                            hover:bg-red-50
                            dark:text-red-400
                            dark:hover:bg-red-500/10
                        "
                    >
                        Retirer
                    </button>

                </div>

            </div>
        `;

    }

}
