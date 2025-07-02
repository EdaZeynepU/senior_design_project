import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { handleNavbar } from "../redux/reducers/GeneralReducer";
import { useState } from "react";

const Sidebar = ({setlogin}) => {
  const dispatch = useDispatch();
  const { isNavbarOpen } = useSelector((state) => state.general);
  const [flashcards, setFlashcards] = useState(false);
  if (document.URL.indexOf('study-time') > 0) {
    document.body.style.overflow = 'hidden';
    console.log('a');
    
  } else {
    console.log('b');
    document.body.style.overflow = 'auto';
  }
  return (
    <div
      id="sidebar"
      className={isNavbarOpen ? "open-sidebar" : "close-sidebar"}
    >
      <div>
        <button
          onClick={() => {
            dispatch(handleNavbar());
          }}
        >
          {isNavbarOpen? "←" : "→"}
        </button>
        <img src="/public/icons/logo.png" className="logo-normal" alt="" />
        <hr />
      </div>
      <ul>
        <Link to="/ml">
          <li>ML Suggestion</li>
        </Link>
        <Link to="/study-time">
          <li>Study Time</li>
        </Link>
        <Link to="/emotion-diary">
          <li>Feeling Diary</li>
        </Link>
        <Link to="dashboard/emotions-timeline">
          <li>Emotions Charts</li>
        </Link>
        <Link to="dashboard/times">
          <li>Study Time Charts</li>
        </Link>
          <Link to="flashcards/edit_note">
        <li>Add Flashcard
          </li>
          </Link>
          <Link to="flashcards/edit_note_ai"> 
          <li>
          Add Flashcard AI
          </li>
          </Link>
          <Link to="flashcards"> 
          <li>
          Study FLashcard
        </li>
          </Link>
        <li>
          <button className="cute-button" onClick={()=>{
            setlogin(false);
            localStorage.setItem("userId",null)
            location.reload()
          }}>Exit</button> 
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
