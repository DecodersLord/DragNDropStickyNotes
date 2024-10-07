import { useEffect, useRef, useState, useContext } from "react";
import Spinner from "../icons/Spinner.jsx";
import { db } from "../appwrite/databases.js";
import DeleteButton from "./DeleteButton.jsx";
import { setNewOffset, autoGrow, setZIndex, bodyParser } from "../utils";
import { NoteContext } from "../context/NoteContext.jsx";

export default function NoteCard({ note }) {
    const textAreaRef = useRef(null);
    const cardRef = useRef(null);
    const keyUpTimer = useRef(null);

    const [saving, setSaving] = useState(false);
    const [position, setPosition] = useState(JSON.parse(note.position));
    const { setSelectedNote } = useContext(NoteContext);

    const body = bodyParser(note.body);
    const colors = bodyParser(note.colors);

    let mouseStartPos = { x: 0, y: 0 };

    useEffect(() => {
        autoGrow(textAreaRef);
        setZIndex(cardRef.current);
    }, []);

    function mouseDown(e) {
        if (e.target.className === "card-header") {
            mouseStartPos.x = e.clientX;
            mouseStartPos.y = e.clientY;

            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);

            setSelectedNote(note);

            setZIndex(cardRef.current);
        }
    }

    function mouseUp() {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);

        const newPosition = setNewOffset(cardRef.current);
        saveData("position", newPosition);
    }

    async function saveData(key, value) {
        const payload = { [key]: JSON.stringify(value) };

        try {
            await db.notes.update(note.$id, payload);
        } catch (error) {
            console.error(error);
        }

        setSaving(false);
    }

    function mouseMove(e) {
        let mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        };

        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;

        const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
        setPosition(newPosition);
    }

    function handleKeyUp() {
        setSaving(true);

        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }
        keyUpTimer.current = setTimeout(() => {
            saveData("body", textAreaRef.current.value);
        }, 2000);
    }

    return (
        <div
            className="card"
            style={{
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            ref={cardRef}
        >
            <div
                className="card-header"
                style={{ backgroundColor: colors.colorHeader }}
                onMouseDown={mouseDown}
            >
                <DeleteButton noteId={note.$id} />
                {saving && (
                    <div className="card-saving">
                        <Spinner color={colors.colorText} />
                        <span style={{ color: colors.colorText }}>
                            Saving...
                        </span>
                    </div>
                )}
            </div>
            <div className="card-body">
                <textarea
                    onKeyUp={handleKeyUp}
                    name=""
                    id=""
                    ref={textAreaRef}
                    onInput={() => {
                        autoGrow(textAreaRef);
                    }}
                    onFocus={() => {
                        setZIndex(cardRef.current);
                        setSelectedNote(note);
                    }}
                    style={{ color: colors.colorText }}
                    defaultValue={body}
                ></textarea>
            </div>
        </div>
    );
}
