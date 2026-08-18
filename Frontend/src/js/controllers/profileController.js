import userService
    from "../services/userService.js";


/**
 * ProfileController
 * ------------------
 * Page "Mon profil" : afficher, modifier et sauvegarder
 * le nom et l'email de l'utilisateur.
 * Les données sont persistées dans localStorage (taskflow_user).
 */
export class ProfileController {


    constructor() {

        this.service =
            userService;

    }


    init() {

        this.loadProfile();

        this.bindEvents();

    }


    /**
     * Affiche les données actuelles de l'utilisateur
     * (carte du haut + champs du formulaire).
     */
    loadProfile() {

        const user =
            this.service.getUser();

        const nameField =
            document.getElementById(
                "profile-name"
            );

        const emailField =
            document.getElementById(
                "profile-email"
            );

        if (nameField) {

            nameField.value =
                user.name;

        }

        if (emailField) {

            emailField.value =
                user.email;

        }

        this.updateProfileCard(
            user
        );

    }


    /**
     * Met à jour l'avatar (initiales) et le résumé
     * nom/email affichés en haut de la carte.
     */
    updateProfileCard(user) {

        const avatar =
            document.getElementById(
                "profile-avatar"
            );

        const nameDisplay =
            document.getElementById(
                "profile-current-name"
            );

        const emailDisplay =
            document.getElementById(
                "profile-current-email"
            );

        if (avatar) {

            avatar.textContent =
                this.service.getInitials(
                    user.name
                );

        }

        if (nameDisplay) {

            nameDisplay.textContent =
                user.name || "Utilisateur";

        }

        if (emailDisplay) {

            emailDisplay.textContent =
                user.email || "Aucun email renseigné";

        }

        // Le bouton profil de la sidebar et l'avatar
        // du header affichent aussi les initiales :
        // on les met à jour ici pour rester cohérent
        // sans recharger toute la page.
        document
            .querySelectorAll(
                "[data-user-initials]"
            )
            .forEach(element => {

                element.textContent =
                    this.service.getInitials(
                        user.name
                    );

            });

        document
            .querySelectorAll(
                "[data-user-name]"
            )
            .forEach(element => {

                element.textContent =
                    user.name || "Utilisateur";

            });

    }


    bindEvents() {

        const form =
            document.getElementById(
                "profile-form"
            );

        if (form) {

            form.addEventListener(
                "submit",
                event => this.handleSave(event)
            );

        }

    }


    handleSave(event) {

        event.preventDefault();

        const nameField =
            document.getElementById(
                "profile-name"
            );

        const emailField =
            document.getElementById(
                "profile-email"
            );

        const errorMessage =
            document.getElementById(
                "profile-error"
            );

        const name =
            nameField
                ? nameField.value.trim()
                : "";

        const email =
            emailField
                ? emailField.value.trim()
                : "";

        if (!name) {

            if (errorMessage) {

                errorMessage.textContent =
                    "Le nom ne peut pas être vide.";

                errorMessage.classList.remove(
                    "hidden"
                );

            }

            return;

        }

        if (errorMessage) {

            errorMessage.classList.add(
                "hidden"
            );

        }

        const updatedUser =
            this.service.saveUser({
                name,
                email
            });

        this.updateProfileCard(
            updatedUser
        );

        this.showSavedFeedback();

    }


    /**
     * Petit retour visuel après enregistrement,
     * même logique que showSuccessMessage()
     * dans SettingsController.
     */
    showSavedFeedback() {

        const button =
            document.getElementById(
                "save-profile"
            );

        if (!button) {

            return;

        }

        const originalText =
            button.textContent;

        button.textContent =
            "✓ Profil enregistré";

        button.classList.add(
            "bg-green-600"
        );

        button.classList.remove(
            "bg-indigo-600"
        );

        setTimeout(() => {

            button.textContent =
                originalText;

            button.classList.remove(
                "bg-green-600"
            );

            button.classList.add(
                "bg-indigo-600"
            );

        }, 2000);

    }

}
