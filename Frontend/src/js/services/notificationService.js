const STORAGE_KEY =
    "taskflow_notifications";


class NotificationService {


    getNotifications() {

        const notifications =
            localStorage.getItem(
                STORAGE_KEY
            );


        return notifications
            ? JSON.parse(notifications)
            : [];

    }


    saveNotifications(notifications) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(notifications)
        );

    }


    createNotification({
        title,
        message,
        type = "info",
        relatedId = null
    }) {

        const notifications =
            this.getNotifications();


        const notification = {

            id:
                crypto.randomUUID(),

            title,

            message,

            type,

            relatedId,

            read: false,

            createdAt:
                new Date().toISOString()

        };


        notifications.unshift(
            notification
        );


        this.saveNotifications(
            notifications
        );


        return notification;

    }


    markAsRead(id) {

        const notifications =
            this.getNotifications();


        const notification =
            notifications.find(
                item =>
                    item.id === id
            );


        if (notification) {

            notification.read = true;

        }


        this.saveNotifications(
            notifications
        );

    }


    markAllAsRead() {

        const notifications =
            this.getNotifications();


        notifications.forEach(
            notification => {

                notification.read = true;

            }
        );


        this.saveNotifications(
            notifications
        );

    }


    deleteNotification(id) {

        const notifications =
            this.getNotifications()
                .filter(
                    notification =>
                        notification.id !== id
                );


        this.saveNotifications(
            notifications
        );

    }


    deleteAllNotifications() {

        localStorage.removeItem(
            STORAGE_KEY
        );

    }


    getUnreadCount() {

        return this.getNotifications()
            .filter(
                notification =>
                    !notification.read
            )
            .length;

    }

}


const notificationService =
    new NotificationService();


export default notificationService;