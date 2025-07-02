import React, { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import Table from "../components/Table";
import axios from "axios";
const NotePart = ({ isFlipped, setIsFlipped, setNote }) => {
  const checkValid = (e) => {
    if (e.target.classList.contains("is-invalid")) {
      e.target.classList.remove("is-invalid");
    }
  };

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <div>
        <h4 className="text-center offcanvas-title">Front</h4>
        <div className="d-inline-block position-relative ">
          <img src="../../images/notes1.png" width="300px" alt="." />
          <span className="position-absolute top-50 start-50 translate-middle text-center">
            <textarea
              id="addNoteFront"
              onChange={(e) => {
                setNote((prev) => ({
                  front: e.target.value,
                  back: prev["back"],
                }));
                checkValid(e);
              }}
              className={`form-control input-group-text`}
            />
          </span>
          {/*  is-invalid  */}
          <button
            className="btn btn-primary position-absolute bottom-0 start-50 p-3 translate-middle-x"
            onClick={() => {
              setIsFlipped((prev) => !prev);
            }}
          >
            turn
          </button>
        </div>
      </div>
      <div>
        <h4 className="text-center offcanvas-title">Arka Kısım</h4>
        <div className="d-inline-block position-relative">
          <img src="../../images/notes1.png" width="300px" alt="." />
          <span className="position-absolute top-50 start-50 translate-middle text-center">
            <textarea
              id="addNoteBack"
              onChange={(e) => {
                setNote((prev) => ({
                  back: e.target.value,
                  front: prev["front"],
                }));
                checkValid(e);
              }}
              className="form-control input-group-text"
            />
          </span>
          <button
            className="btn btn-primary position-absolute bottom-0 start-50 p-3 translate-middle-x"
            onClick={() => {
              setIsFlipped((prev) => !prev);
            }}
          >
            turn
          </button>
        </div>
      </div>
    </ReactCardFlip>
  );
};

const EditNote = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [allNotesList, setallNotesList] = useState([]);
  const [note, setNote] = useState({ front: "", back: "" });
  const jarNameDict = {
    "1hours": "1 Hours Jar",
    "3hours": "3 Hours Jars",
    "8hours": "8 Hours Jars",
    "24hours": "24 Hours Jars",
    done: "Done",
  };
  const userId = localStorage.getItem("userId")
  // const [isLoading, setIsLoading] = useState(true);

  const getAllNotes = () => {
    if (allNotesList.length > 0) {
      setallNotesList([]);
    }
    // let loading = true;
    Object.entries(jarNameDict).map(async (value) => {
    //   const dbNotes = JSON.parse(localStorage.getItem(value[0]));
      const res = await axios.get(
        `http://localhost:3001/api/flashcards/${userId}/${value[0]}`
      );
      const dbNotes = res.data.reduce((acc, card) => {
        return { ...acc, ...card.data };
      }, {});
      if (dbNotes != null) {
        Object.entries(dbNotes).map((wordEntry) => {
          const newData = {};
          newData["front"] = wordEntry[0];
          newData["back"] = wordEntry[1];
          newData["stage"] = value[0];
          setallNotesList((prev) => [...prev, newData]);
        });
      }
    //   if (dbNotes != null) {
    //     Object.entries(dbNotes).map((wordEntry) => {
    //       const newData = {};
    //       newData["front"] = wordEntry[0];
    //       newData["back"] = wordEntry[1];
    //       newData["stage"] = value[0];
    //       setallNotesList((prev) => [...prev, newData]);
    //     });
    //   }
    });
    // loading = false;
    // setIsLoading(loading);
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  const addNoteTosystem = async () => {
    if (note.front.length > 0 && note.back.length > 0) {
      const localDb = JSON.parse(localStorage.getItem("1hours"));
      if (localDb == undefined || localDb.length < 1) {
        const newData = {};
        newData[note.front] = note.back;
        localStorage.setItem("1hours", JSON.stringify(newData));
      } else {
        localDb[note.front] = note.back;
        localStorage.setItem("1hours", JSON.stringify(localDb));
      }
      const newData = {};
      newData[note.front] = note.back;
    const userId = localStorage.getItem("userId")
    await axios.post("http://localhost:3001/api/flashcards", {
        user_id: userId,
        jar: "1hours",
        category: "",
        lastReviewedAt: new Date().toISOString(),
        data: newData
    });
    //   window.location.reload();
    } else {
      console.log("hata");
      if (note.front.length < 1) {
        const invalidArea = document.getElementById("addNoteFront");
        console.log(invalidArea);
        invalidArea.classList.add("is-invalid");
      }
    }
  };

  return (
    <>
      <div
        id="jarsBg"
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          gap: 50,
          padding: "0 5vw",
        }}
      >
        <div
          style={{
            flex: 2,
            justifyContent: "center",
            alignContent: "center",
            zIndex: "5",
            textAlign: "center",
          }}
        >
          <h3 className="flashcard-header-pill">Add Flascard</h3>
          <NotePart
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
            setNote={setNote}
          />
          <button
            style={{
              background: "transparent",
              borderRadius: "100%",
              border: "transparent",
            }}
            onClick={addNoteTosystem}
          >
            <img
              className="rounded-circle"
              height="80px"
              src="../../images/done.png"
              alt="done"
            />
          </button>
        </div>

        <div
          style={{
            flex: 5,
            justifyContent: "center",
            alignContent: "center",
            zIndex: "5",
            textAlign: "center",
          }}
        >
          <h2 className="bg-primary p-4 rounded-pill">Delete Flascard</h2>
          <div className="w-100 py-2 bg-white rounded-3">
            <Table tableData={allNotesList} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditNote;
