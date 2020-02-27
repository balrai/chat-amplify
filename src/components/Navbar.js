import React from 'react';

export default ({ signout, status, changePage }) => {

  return (
    <>
      <div className="header">
        <div>

          <img src="./images/NOVA_logo.png" alt="Nova logo" id="logo" />

        </div>
        <button className="signout" onClick={signout}>
          Logout
          </button>
      </div>
      <div className="nav">
        <div className={status === "agenda" ? "active" : ""} onClick={() => changePage("agenda")}>Agenda</div>
        <div className={status === "bio" ? "active" : ""} onClick={() => changePage("bio")}>Biographies</div>
        <div className={status === "chat" ? "active" : ""} onClick={() => changePage("chat")}>Messenger</div>
      </div>
    </>
  )

}



