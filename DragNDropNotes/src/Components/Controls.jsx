import React from "react";
import AddButton from "./AddButton";
import Color from "./Color";
import colors from "../assets/colors.json";

export default function Controls() {
    return (
        <div id="controls">
            <AddButton />
            {colors.map((color) => (
                <Color key={color.id} color={color} />
            ))}
        </div>
    );
}
