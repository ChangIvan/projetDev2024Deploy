import React, { useState, useContext, useEffect } from "react";
import "./OffersItem.css";
import Popup from "../popup/Popup";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../context/AuthContext";


const OffersItem = ({onChange = () => {}, ...props}) => {
    const [btnPopup, setBtnPopup] = useState(false);
    const [btnPopup2, setBtnPopup2] = useState(false);
    const [candidatures, setCandidatures] = useState([]);
    const [postule, setPostule] = useState(false);
    const [publiee, setPubliee] = useState(props.published);
    let pos = 0;

    const { sendRequest } = useHttpClient();

   
    const auth = useContext(AuthContext);

    useEffect(() => {
      if (auth.user == props.employeurId) {
        async function listeCandidatures() {
          try {
            const resCandidatures = await sendRequest(
              process.env.REACT_APP_BACKEND_URL + `candidatures/${props.id}/`,
              "GET",
              null,
              {
                "Content-Type": "application/json",
              }
            );
            setCandidatures(resCandidatures.candidatures);
            console.log(candidatures);
          } catch (e) {
            console.error(e);
          }
        }
        listeCandidatures();
      } else {
        async function listeCandidaturesCandidat() {
          try {
            const resCandidatures = await sendRequest(
              process.env.REACT_APP_BACKEND_URL + `candidatures/liste/${auth.user}/`,
              "GET",
              null,
              {
                "Content-Type": "application/json",
              }
            );
            setCandidatures(resCandidatures.candidatures);
            console.log(candidatures);
          } catch (e) {
            console.error(e);
          }
        }
        listeCandidaturesCandidat();
        while (postule == false && pos < candidatures.length) {
          if (candidatures[pos].offreId == props.id) {
            setPostule(true);
          }
          pos++;
        }
      }
      
    }, [btnPopup]);


    async function addCandidatureSubmitHandler(event) {

        console.log(props.emailCandidat);

        event.preventDefault();
        const fd = new FormData(event.target);
        const data = Object.fromEntries(fd.entries());
        const newCandidature = {
          email: props.emailCandidat,
          offreId: props.id,
          candidatId: auth.user,
        };
        
        try {
          await sendRequest(
            process.env.REACT_APP_BACKEND_URL + "candidatures/",
            "POST",
            JSON.stringify(newCandidature),
            { "Content-Type": "application/json" }
          );
        } catch (err) {
          console.error(err);
        }
        console.log(JSON.stringify(newCandidature));
        event.target.reset();

        setBtnPopup2(true);
        setBtnPopup(false);
      };


      function publicationHandler (event) {
        event.preventDefault();

        const newChecked = event.target.checked;

        setPubliee(newChecked);
      }

      // S'assure que le useState publiee est bien changé avant de commencer de changer la publication dans la BD
      useEffect(() => {

        onChange(publiee);

        async function publication() {

          const updatedOffre = {
            published: publiee,
          };
  
          try {
            await sendRequest(
              process.env.REACT_APP_BACKEND_URL + `offres/${props.id}`,
              "PUT",
              JSON.stringify(updatedOffre),
              {
                "Content-Type": "application/json",
              }
            );
          } catch (err) {
            console.error(err);
          }
          console.log(JSON.stringify(updatedOffre));
        }
        publication();
        
      }, [publiee]);

    return (
        <div>
            <li className="offer-item">
                <div className="offer-item__info">
                    <span className="offer-title" onClick={() => btnPopup ? setBtnPopup(false) : setBtnPopup(true)}>
                        <h2>{props.titre}</h2>
                    </span>
                    <p>Contact: {props.email}</p>
                </div>
            </li>
            {auth.user == props.employeurId ? (
              <div>
                <Popup trigger={btnPopup} setTrigger={setBtnPopup} type="info">
                  <form onSubmit={addCandidatureSubmitHandler}>
                      <h1>{props.titre}</h1>
                      <p>Nom de l'employeur : {props.nomEmployeur}</p>
                      <p>Contact: {props.email}</p>
                      <p>Salaire: {props.salaire} $/h</p>
                      <h5>Détails : </h5>
                      <p>{props.details}</p>

                      <h2>Liste de candidatures : </h2>

                      <ul>

                        {candidatures.length > 0 ? candidatures.map((candidature) => (
                          <li key={candidature.id}>{candidature.email}</li>
                        )) : null}
                      </ul>
                      <br/><br/>
                      <div className="controles-rows">
                        <div className="controles no-margin">
                          <label>Publier cette offre :</label>
                          <input type="checkbox" name="published" onChange={publicationHandler} defaultValue={props.published} checked={publiee}/>
                        </div>
                      </div>
                  </form>
                </Popup>
              </div>
            ) : (
              <div>
                <Popup trigger={btnPopup} setTrigger={setBtnPopup} type="info">
                  <form onSubmit={addCandidatureSubmitHandler}>
                      <h1>{props.titre}</h1>
                      <p>Nom de l'employeur : {props.nomEmployeur}</p>
                      <p>Contact: {props.email}</p>
                      <p>Salaire: {props.salaire} $/h</p>
                      <h5>Détails : </h5>
                      <p>{props.details}</p>

                      {postule === true ? (
                        <p>Vous avez postulé</p>
                      ) : (
                        <button type="submit">Postuler</button>
                      )
                      }
                      
                  </form>
                </Popup>

                <Popup trigger={btnPopup2} setTrigger={setBtnPopup2} type="confirmation">
                  <h5>Candidature envoyée.</h5>
                  <p>Bonne chance! Tu en auras besoin...</p>
                </Popup>
              </div>
            )}
            
      </div>
    );
};

export default OffersItem;
