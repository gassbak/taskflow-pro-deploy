import { Member } from "../models/Member.js";

import {
    getData,
    saveData
} from "../utils/storage.js";


const STORAGE_KEY = "members";


/**
 * memberService.js
 * ----------------
 * Gère la liste des membres de l'équipe dans localStorage
 * (clé réelle : "taskflow_members", via storage.js).
 * Suit exactement le même pattern que projectService.js.
 */
export class MemberService {


    getAll() {

        return getData(
            STORAGE_KEY,
            []
        );

    }


    getById(id) {

        const members =
            this.getAll();

        return members.find(
            member => member.id === id
        );

    }


    create(memberData) {

        const members =
            this.getAll();

        const member =
            new Member(
                memberData
            );

        members.push(
            member
        );

        saveData(
            STORAGE_KEY,
            members
        );

        return member;

    }


    update(id, updates) {

        const members =
            this.getAll();

        const index =
            members.findIndex(
                member => member.id === id
            );

        if (index === -1) {

            return null;

        }

        members[index] = {
            ...members[index],
            ...updates
        };

        saveData(
            STORAGE_KEY,
            members
        );

        return members[index];

    }


    delete(id) {

        const members =
            this.getAll();

        const filteredMembers =
            members.filter(
                member => member.id !== id
            );

        saveData(
            STORAGE_KEY,
            filteredMembers
        );

        return true;

    }

}


const memberService =
    new MemberService();

export default memberService;
