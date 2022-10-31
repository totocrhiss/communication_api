import React, { useEffect, useState } from "react";
import "../style_css/Form.css";

function Form() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [inputs, setInputs] = useState({});
  const [articleText, setArticleText] = useState("");

  useEffect(() => {
    Users();
  }, []);

  const Users = () => {
    fetch("http://localhost:3001/POST")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Remarque : il faut gérer les erreurs ici plutôt que dans
        // un bloc catch() afin que nous n’avalions pas les exceptions
        // dues à de véritables bugs dans les composants.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const supprime = (id) => {
    console.log("id = " + id);
    const options_delete = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(`http://localhost:3001/POST/${id}`, options_delete)
      .then((response) => {
        if (response.ok) {
          console.log("response = " + JSON.stringify(response));
          Users();
          return Promise.resolve("L'utilisateur as été supprimé");
        } else {
          return Promise.reject("Une erreur est survenue");
        }
      })
      .then((response) => console.log(response))
      .catch((err) => console.log(`Erreur avec le message : ${err}`));
  };

  // formulaire

  const handleChange = (event) => {
    const firstName = event.target.name;
    const lastName = event.target.value;
    setInputs((values) => ({ ...values, [firstName]: lastName }));
  };

  const handleChangeTextarea = (event) => {
    const article = event.target.value;
    setArticleText(article);
  };

  const handleSubmit = (e) => {
    if (inputs.firstName === "") {
      return e.preventDefault();
    } else if ((inputs.firstName.length && inputs.lastName.length) > 0) {
      submit();
    }
  };

  const submit = () => {
    const addSubmit = {
      method: "POST",
      body: JSON.stringify({
        first_name: inputs.firstName,
        last_name: inputs.lastName,
        article_add: articleText,
        userId: Date.now(),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    fetch("http://localhost:3001/POST", addSubmit)
      .then((response) => response.json())
      .then((json) => JSON.stringify(json))
      .catch((error) => console.log(error));
  };

  // formulaire

  if (error) {
    return <div>Erreur : {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Chargement...</div>;
  } else {
    return (
      <>
        <div className="background-image" />
        <div className="form_container">
          <ul className="left style_text">
            <h1 className="add_article">Mes escapades en montagne.</h1>
            {items.map((item) => (
              <li key={item.id} style={{ listStyle: "none" }}>
                <br />
                {item.id} {item.first_name} {item.last_name}
                <br />
                {item.article_add}
                <button
                  className="button"
                  onClick={() => supprime(item.id)}
                  style={{ float: "right" }}
                >
                  {" "}
                  Supprimer{" "}
                </button>
              </li>
            ))}
          </ul>
          <div className="form left">
            <h1>Ajouter un article.</h1>
            <form className="form" onSubmit={handleSubmit}>
              <label>
                <input
                  type="text"
                  placeholder="First name"
                  name="firstName"
                  value={inputs.firstName || ""}
                  onChange={handleChange}
                />
              </label>
              <label>
                <input
                  type="text"
                  placeholder="Last name"
                  name="lastName"
                  value={inputs.lastName || ""}
                  onChange={handleChange}
                />
              </label>
              <textarea
                placeholder="Write your text."
                value={articleText}
                cols="30"
                rows="3"
                onChange={handleChangeTextarea}
              ></textarea>
              <input className="button" type="submit" />
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default Form;
