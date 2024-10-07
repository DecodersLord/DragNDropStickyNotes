import React, { useContext, useRef } from "react";
import Plus from "../icons/Plus.jsx";
import colors from "../assets/colors.json";
import { NoteContext } from "../context/NoteContext.jsx";
import { db } from "../appwrite/databases.js";

export default function AddButton() {
    const startinPos = useRef(10);
    const { setNotes } = useContext(NoteContext);

    async function addNote() {
        const payload = {
            position: JSON.stringify({
                x: startinPos.current,
                y: startinPos.current,
            }),
            colors: JSON.stringify(colors[0]),
        };

        startinPos.current += 10;

        const response = await db.notes.create(payload);
        setNotes((prevState) => [response, ...prevState]);
    }

    return (
        <div id="add-btn" onClick={addNote}>
            <Plus />
        </div>
    );
}
