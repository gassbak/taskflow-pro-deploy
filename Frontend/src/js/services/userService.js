const STORAGE_KEY =
    "taskflow_user";


const DEFAULT_USER = {

    name: "Utilisateur",

    email: ""

};


/**
 * userService.js
 * --------------
 * Gère le profil de l'utilisateur courant dans localStorage.
 * Un seul profil est stocké (pas une liste), même logique que
 * settingsService.js.
 */
class UserService {


    getUser() {

        const user =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!user) {

            return {
                ...DEFAULT_USER
            };

        }


        return {
            ...DEFAULT_USER,
            ...JSON.parse(user)
        };

    }


    saveUser(updates) {

        const currentUser =
            this.getUser();


        const updatedUser = {

            ...currentUser,

            ...updates

        };


        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                updatedUser
            )
        );


        return updatedUser;

    }


    /**
     * Calcule les initiales à partir
     * du nom (ex: "Baye Gassama" -> "BG").
     */
    getInitials(name) {

        if (!name || !name.trim()) {

            return "?";

        }

        const parts =
            name
                .trim()
                .split(/\s+/)
                .slice(0, 2);

        return parts
            .map(part => part[0].toUpperCase())
            .join("");

    }

}


const userService =
    new UserService();

export default userService;
