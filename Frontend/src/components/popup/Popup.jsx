import React from "react";
import "./Popup.css";

export default function Popup(props) {
    return (props.trigger) ? (
         <div className="popup">
            <div className="popup-interieur">
                <a className="fermer" onClick={() => props.setTrigger(false)}>Fermer</a>
                { props.children }
            </div>
        </div>

    ) : "";
}