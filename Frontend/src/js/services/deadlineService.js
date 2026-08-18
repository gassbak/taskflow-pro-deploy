class DeadlineService {

    /**
     * Vérifie si une date est valide
     */
    isValidDate(date) {

        if (!date) {
            return false;
        }

        const parsedDate = new Date(date);

        return !Number.isNaN(parsedDate.getTime());
    }


    /**
     * Retourne le nombre de jours entre
     * aujourd'hui et une deadline.
     *
     * Résultat :
     * > 0  = jours restants
     * = 0  = aujourd'hui
     * < 0  = deadline dépassée
     */
    getDaysRemaining(deadline) {

        if (!this.isValidDate(deadline)) {
            return null;
        }

        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        const targetDate = new Date(deadline);

        targetDate.setHours(
            0,
            0,
            0,
            0
        );

        const difference =
            targetDate.getTime() -
            today.getTime();

        return Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );
    }


    /**
     * Détermine le statut de la deadline.
     */
    getStatus(deadline) {

        const days =
            this.getDaysRemaining(deadline);

        if (days === null) {

            return "none";

        }

        if (days < 0) {

            return "overdue";

        }

        if (days === 0) {

            return "today";

        }

        if (days <= 3) {

            return "urgent";

        }

        if (days <= 7) {

            return "soon";

        }

        return "normal";
    }


    /**
     * Texte lisible pour l'utilisateur.
     */
    getLabel(deadline) {

        const days =
            this.getDaysRemaining(deadline);

        if (days === null) {

            return "Aucune deadline";

        }

        if (days < 0) {

            const lateDays =
                Math.abs(days);

            return lateDays === 1
                ? "En retard d'1 jour"
                : `En retard de ${lateDays} jours`;
        }

        if (days === 0) {

            return "Deadline aujourd'hui";

        }

        if (days === 1) {

            return "Plus qu'1 jour";

        }

        return `${days} jours restants`;
    }


    /**
     * Retourne les classes Tailwind
     * correspondant au statut.
     */
    getClasses(deadline) {

        const status =
            this.getStatus(deadline);

        const classes = {

            none: {
                badge:
                    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            },

            normal: {
                badge:
                    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
            },

            soon: {
                badge:
                    "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
            },

            urgent: {
                badge:
                    "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"
            },

            today: {
                badge:
                    "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
            },

            overdue: {
                badge:
                    "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
            }

        };

        return classes[status];
    }

}


const deadlineService =
    new DeadlineService();


export default deadlineService;