const STORAGE_PREFIX = "taskflow_";


export function saveData(
    key,
    data
) {

    localStorage.setItem(
        `${STORAGE_PREFIX}${key}`,
        JSON.stringify(data)
    );

}


export function getData(
    key,
    defaultValue = []
) {

    const data =
        localStorage.getItem(
            `${STORAGE_PREFIX}${key}`
        );


    if (!data) {

        return defaultValue;

    }


    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Erreur de lecture localStorage :",
            error
        );

        return defaultValue;

    }

}


export function removeData(
    key
) {

    localStorage.removeItem(
        `${STORAGE_PREFIX}${key}`
    );

}