const STORAGE_KEY =
    "taskflow_settings";


const DEFAULT_SETTINGS = {

    theme: "light",

    notifications: true,

    deadlines: true

};


class SettingsService {


    getSettings() {

        const settings =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!settings) {

            return {
                ...DEFAULT_SETTINGS
            };

        }


        return {
            ...DEFAULT_SETTINGS,
            ...JSON.parse(settings)
        };

    }


    saveSettings(settings) {

        const currentSettings =
            this.getSettings();


        const updatedSettings = {

            ...currentSettings,

            ...settings

        };


        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                updatedSettings
            )
        );


        return updatedSettings;

    }


    resetSettings() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                DEFAULT_SETTINGS
            )
        );


        return {
            ...DEFAULT_SETTINGS
        };

    }


    getTheme() {

        return this.getSettings()
            .theme;

    }


    setTheme(theme) {

        return this.saveSettings({
            theme
        });

    }


    areNotificationsEnabled() {

        return this.getSettings()
            .notifications;

    }


    areDeadlinesEnabled() {

        return this.getSettings()
            .deadlines;

    }

}


const settingsService =
    new SettingsService();


export default settingsService;