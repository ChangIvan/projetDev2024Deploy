import React, { useState } from "react";
import Login from "../components/login/Login";
import OffersList from "../components/OffersList/OffersList";
import { OFFER } from "../components/data/offers";

export default function Connexion() {
    const [typeCompte, setTypeCompte] = useState("Candidat");
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // Simule l'authentification

    const handleLogin = () => {
        // Logique pour l'authentification ici
        setIsAuthenticated(true);
    };

    return (
        <div>
            <div className="typeCompte">
                <a onClick={() => setTypeCompte("Candidat")}>Candidat</a>
                <a onClick={() => setTypeCompte("Employeur")}>Employeur</a>
            </div>

            <Login type={typeCompte} onLogin={handleLogin} />

            {/* Affiche les offres uniquement si l'utilisateur est un candidat et authentifié */}
            {typeCompte === "Candidat" && isAuthenticated && <OffersList items={OFFER} />}
        </div>
    );
}
