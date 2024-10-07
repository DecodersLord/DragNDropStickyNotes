import React from "react";
import { useContext } from "react";
import Trash from "../icons/Trash";
import { db } from "../appwrite/databases";
import { NoteContext } from "../context/NoteContext";

function DeleteButton({ noteId }) {
    const { setNotes } = useContext(NoteContext);
    async function handleDelete() {
        db.notes.delete(noteId);
        setNotes((prevState) => {
            return prevState.filter((note) => note.$id !== noteId);
        });
    }

    return (
        <div onClick={handleDelete}>
            <Trash />
        </div>
    );
}

export default DeleteButton;
