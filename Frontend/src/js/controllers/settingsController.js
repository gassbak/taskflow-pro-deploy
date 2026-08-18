import settingsService
    from "../services/settingsService.js";


export class SettingsController {


    constructor() {

        this.service =
            settingsService;

    }


    init() {

        this.loadSettings();

        this.bindEvents();

    }


loadSettings() {

    const settings =
        this.service.getSettings();


    /*
     * Appliquer le thème sauvegardé
     */

    if (settings.theme === "dark") {

        document.documentElement.classList.add(
            "dark"
        );

    } else {

        document.documentElement.classList.remove(
            "dark"
        );

    }


    const notifications =
        document.getElementById(
            "setting-notifications"
        );


    const deadlines =
        document.getElementById(
            "setting-deadlines"
        );


    if (notifications) {

        notifications.checked =
            settings.notifications;

    }


    if (deadlines) {

        deadlines.checked =
            settings.deadlines;

    }

}


    bindEvents() {

        const saveButton =
            document.getElementById(
                "save-settings"
            );


        const lightButton =
            document.getElementById(
                "theme-light"
            );


        const darkButton =
            document.getElementById(
                "theme-dark"
            );


        /*
         * Mode clair
         */

        lightButton?.addEventListener(
            "click",
            () => {

                this.changeTheme(
                    "light"
                );

            }
        );


        /*
         * Mode sombre
         */

        darkButton?.addEventListener(
            "click",
            () => {

                this.changeTheme(
                    "dark"
                );

            }
        );


        /*
         * Enregistrement
         */

        saveButton?.addEventListener(
            "click",
            () => {

                this.save();

            }
        );

    }


    changeTheme(theme) {

        this.service.setTheme(
            theme
        );


        if (theme === "dark") {

            document.documentElement
                .classList.add("dark");

        } else {

            document.documentElement
                .classList.remove("dark");

        }


        console.log(
            "THÈME MODIFIÉ :",
            theme
        );

    }


    save() {

        const notifications =
            document.getElementById(
                "setting-notifications"
            );


        const deadlines =
            document.getElementById(
                "setting-deadlines"
            );


        const settings =
            this.service.saveSettings({

                notifications:
                    notifications
                        ? notifications.checked
                        : true,

                deadlines:
                    deadlines
                        ? deadlines.checked
                        : true

            });


        console.log(
            "PARAMÈTRES SAUVEGARDÉS :",
            settings
        );


        this.showSuccessMessage();

    }


    showSuccessMessage() {

        const button =
            document.getElementById(
                "save-settings"
            );


        if (!button) {

            return;

        }


        const originalText =
            button.textContent;


        button.textContent =
            "✓ Paramètres enregistrés";


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