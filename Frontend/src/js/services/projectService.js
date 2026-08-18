import { Project } from "../models/Project.js";

import {
    getData,
    saveData
} from "../utils/storage.js";


const STORAGE_KEY = "projects";


export class ProjectService {


    getAll() {

        return getData(
            STORAGE_KEY,
            []
        );

    }


    getById(
        id
    ) {

        const projects =
            this.getAll();


        return projects.find(
            project => project.id === id
        );

    }


    create(
        projectData,
        
    ) {

        const projects =
            this.getAll();


        const project =
            new Project(
                projectData
            );


        projects.push(
            project
        );

        

        saveData(
            STORAGE_KEY,
            projects
        );


        return project;

    }


    update(
        id,
        updates
    ) {

        const projects =
            this.getAll();


        const index =
            projects.findIndex(
                project => project.id === id
            );


        if (index === -1) {

            return null;

        }


        projects[index] = {
            ...projects[index],
            ...updates
        };


        saveData(
            STORAGE_KEY,
            projects
        );


        return projects[index];

    }


    delete(
        id
    ) {

        const projects =
            this.getAll();


        const filteredProjects =
            projects.filter(
                project => project.id !== id
            );


        saveData(
            STORAGE_KEY,
            filteredProjects
        );


        return true;

    }

}