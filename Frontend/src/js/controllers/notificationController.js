import notificationService
    from "../services/notificationService.js";


export class NotificationController {


    constructor() {

        this.service =
            notificationService;

    }


    createTestNotification() {

        const notification =
            this.service.createNotification({

                title:
                    "Nouvelle notification",

                message:
                    "Bienvenue dans TaskFlow Pro.",

                type:
                    "info"

            });


        console.log(
            "NOTIFICATION CRÉÉE :",
            notification
        );


        return notification;

    }


    getNotifications() {

        return this.service
            .getNotifications();

    }


    getUnreadCount() {

        return this.service
            .getUnreadCount();

    }


    markAsRead(id) {

        this.service
            .markAsRead(id);

        this.renderNotifications();

    }


    markAllAsRead() {

        this.service
            .markAllAsRead();

        this.renderNotifications();

    }


    deleteNotification(id) {

        this.service
            .deleteNotification(id);

        this.renderNotifications();

    }


    renderNotifications() {

        const notifications =
            this.getNotifications();


        const unreadCount =
            this.getUnreadCount();


        const countElement =
            document.getElementById(
                "notification-count"
            );


        const listElement =
            document.getElementById(
                "notification-list"
            );


        const summaryElement =
            document.getElementById(
                "notification-summary"
            );


        if (!countElement ||
            !listElement ||
            !summaryElement) {

            return;

        }


        /*
         * Compteur
         */

        if (unreadCount > 0) {

            countElement.textContent =
                unreadCount;

            countElement.classList.remove(
                "hidden"
            );

        } else {

            countElement.classList.add(
                "hidden"
            );

        }


        /*
         * Résumé
         */

        if (notifications.length === 0) {

            summaryElement.textContent =
                "Aucune notification";

        } else {

            summaryElement.textContent =
                `${notifications.length} notification${
                    notifications.length > 1
                        ? "s"
                        : ""
                }`;

        }


        /*
         * Liste vide
         */

        if (notifications.length === 0) {

            listElement.innerHTML = `
                <div
                    class="
                        px-4
                        py-8
                        text-center
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    Aucune notification
                </div>
            `;

            return;

        }


        /*
         * Affichage
         */

        listElement.innerHTML =
            notifications
                .map(notification =>
                    this.createNotificationHTML(
                        notification
                    )
                )
                .join("");


        this.bindNotificationEvents();

    }


    createNotificationHTML(
        notification
    ) {

        const unreadClass =
            notification.read
                ? ""
                : "bg-indigo-50 dark:bg-indigo-950/30";


        return `

            <div
                class="
                    notification-item
                    border-b
                    border-slate-100
                    px-4
                    py-3
                    transition
                    hover:bg-slate-50
                    dark:border-slate-800
                    dark:hover:bg-slate-800
                    ${unreadClass}
                "
                data-id="${notification.id}"
            >

                <div
                    class="
                        flex
                        items-start
                        justify-between
                        gap-3
                    "
                >

                    <div class="min-w-0">

                        <h4
                            class="
                                text-sm
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            ${notification.title}
                        </h4>

                        <p
                            class="
                                mt-1
                                text-xs
                                leading-5
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            ${notification.message}
                        </p>

                    </div>


                    <button
                        type="button"
                        class="
                            delete-notification
                            shrink-0
                            text-xs
                            text-slate-400
                            hover:text-red-500
                        "
                        data-id="${notification.id}"
                        title="Supprimer"
                    >
                        ✕
                    </button>

                </div>


                <div
                    class="
                        mt-2
                        flex
                        items-center
                        justify-between
                    "
                >

                    <span
                        class="
                            text-[10px]
                            text-slate-400
                        "
                    >
                        ${this.formatDate(
                            notification.createdAt
                        )}
                    </span>


                    ${
                        !notification.read
                            ? `
                                <button
                                    type="button"
                                    class="
                                        mark-notification-read
                                        text-[11px]
                                        font-medium
                                        text-indigo-600
                                        hover:text-indigo-700
                                        dark:text-indigo-400
                                    "
                                    data-id="${notification.id}"
                                >
                                    Marquer comme lu
                                </button>
                            `
                            : `
                                <span
                                    class="
                                        text-[11px]
                                        text-slate-400
                                    "
                                >
                                    Lu
                                </span>
                            `
                    }

                </div>

            </div>

        `;

    }


    formatDate(date) {

        const notificationDate =
            new Date(date);


        return notificationDate.toLocaleString(
            "fr-FR",
            {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    bindNotificationEvents() {

        const readButtons =
            document.querySelectorAll(
                ".mark-notification-read"
            );


        readButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;

                    this.markAsRead(id);

                }
            );

        });


        const deleteButtons =
            document.querySelectorAll(
                ".delete-notification"
            );


        deleteButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;

                    this.deleteNotification(id);

                }
            );

        });

    }


    initialize() {

        const button =
            document.getElementById(
                "notification-button"
            );


        const panel =
            document.getElementById(
                "notification-panel"
            );


        const markAllButton =
            document.getElementById(
                "mark-all-notifications"
            );


        if (!button || !panel) {

            return;

        }


        button.addEventListener(
            "click",
            () => {

                panel.classList.toggle(
                    "hidden"
                );


                const isOpen =
                    !panel.classList.contains(
                        "hidden"
                    );


                button.setAttribute(
                    "aria-expanded",
                    isOpen
                );

            }
        );


        markAllButton?.addEventListener(
            "click",
            () => {

                this.markAllAsRead();

            }
        );


        this.renderNotifications();

    }

}