// import { fakeData as notes } from "../assets/fakeData.js";
import { useState, useEffect, useContext } from "react";
import NoteCard from "../Components/NoteCard.jsx";
import { NoteContext } from "../context/NoteContext.jsx";
import Controls from "../Components/Controls.jsx";

export default function NotesPages() {
    const { notes } = useContext(NoteContext);
    return (
        <div>
            {notes.map((note) => (
                <NoteCard key={note.$id} note={note} />
            ))}
            <Controls />
        </div>
    );
}
