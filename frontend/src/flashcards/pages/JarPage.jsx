import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DraggableCore from 'react-draggable';
import ReactCardFlip from 'react-card-flip';
import axios from "axios";


const JarNotes = ({ note, index, JarNext, jarCurrent, JarBefore, setJarContentDict, handleNoteChange, lastReviewed }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const jarDurations = {
    "1hours": 1,
    "3hours": 3,
    "8hours": 8,
    "24hours": 24,
  };
  console.log('jarDurations',jarCurrent);
  
  function handleDragStop(e) {
    const jarNextX = JarNext.location.x;
    const jarNextY = JarNext.location.y;
    const jarBeforeX = JarBefore.location.x;
    const jarBeforeY = JarBefore.location.y;
    
    if (jarNextX+200>e.x && jarNextX<e.x) {
        if(jarNextY+260>e.y && jarNextY+50<e.y){
            const selectedEntry={};
            selectedEntry[note[0]]=note[1];
            handleNoteChange(note);
            setJarContentDict(prev=>({nextLst:{...prev["nextLst"],...selectedEntry},prevLst:prev["prevLst"],currentLst:prev["currentLst"]}));
            e.target.parentElement.parentElement.parentElement.parentElement.classList.add("d-none");
        }
    }else if (jarBeforeX+200>e.x && jarBeforeX<e.x) {
      if(jarBeforeY+260>e.y && jarBeforeY+50<e.y){
          const selectedEntry={};
          selectedEntry[note[0]]=note[1];
          handleNoteChange(note);
          setJarContentDict(prev=>({nextLst:prev["nextLst"],prevLst:{...prev["prevLst"],...selectedEntry},currentLst:prev["currentLst"]}));
          e.target.parentElement.parentElement.parentElement.parentElement.classList.add("d-none");
      }
    }

  }

  return (
    <DraggableCore 
        key={index} 
        onDrop={(e)=>{e.preventDefault();}}
        onStop={handleDragStop}

    >
      <div className='z-3' draggable={false}>
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
          <div className='d-inline-block position-relative ' draggable={false}>
            <img src="../../images/notes1.png" width="300px" draggable={false} alt="." />
            <span className="position-absolute top-50 start-50 translate-middle text-center ">{note[0]} {
    console.log(jarDurations[jarCurrent] * 60 * 60 * 100)}</span>
            <span
              style={{
                position: "absolute",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "0.75rem",
                fontWeight: "bold",
                color:
                  Date.now() >= new Date(lastReviewed).getTime() + jarDurations[jarCurrent] * 60 * 60 * 100
                    ? "green"
                    : "red"
              }}
            >
              {Date.now() >= new Date(lastReviewed).getTime()  + jarDurations[jarCurrent] * 60 * 60 * 100
                ? "Study"
                : "Wait"}
            </span>
            <button className="btn position-absolute start-50 p-3 translate-middle-x"  style={{bottom:-30}} onClick={()=>{setIsFlipped(prev=>(!prev))}} ><img src="../../icons/turn_around.png" alt="turn" width={60}/></button>
          </div>
          
          <div className='d-inline-block position-relative'>
            <img src="../../images/notes1.png" width="300px" draggable={false} alt="." />
            <span className="position-absolute top-50 start-50 translate-middle text-center ">{note[1]}</span>
            <button className="btn position-absolute start-50 p-3 translate-middle-x"  style={{bottom:-30}} onClick={()=>{setIsFlipped(prev=>(!prev))}} ><img src="../../icons/turn_around.png" alt="turn" width={60}/></button>
          </div>
        </ReactCardFlip>
      </div>
      </DraggableCore>

  )
}


const Jar = ({setJar,jar,jarNameDict,isOpen}) => {
    const divRef = useRef(null);
    useEffect(() => {
      function trackDivCoordinates() {
        if (divRef.current) {
          const rect = divRef.current.getBoundingClientRect();
          // console.log(`Div x: ${rect.x}, y: ${rect.y}`);
          setJar(prev =>({"location":{"x":rect.x,"y":rect.y},"key":prev.key}))
        }
      }
      window.addEventListener('resize', trackDivCoordinates);
      trackDivCoordinates();
      return () => window.removeEventListener('resize', trackDivCoordinates);
    }, [isOpen]);

    return (
    <div className='position-relative d-inline-block p-3 m-3' ref={divRef}>
          <h4 className='text-center'>{jarNameDict[jar.key]}</h4>
          <img src="../../images/jar_cute2.png" alt="jar" width={250}/>
        </div>
    )

}


const JarPage = () => {
  let a = useParams();
  const [notes, setNotes] = useState({});
  const [notesTimer, setNotesTimer] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [JarNext, setJarNext] = useState({});
  const [JarCurrent, setJarCurrent] = useState({});
  const [JarBefore, setJarBefore] = useState({});
  const [jarContentDict, setJarContentDict] = useState({prevLst:{},nextLst:{},currentLst:{}});
  const jarNameDict={"1hours":"1 Hours Jar","3hours":"3 Hours Jars","8hours":"8 Hours Jars","24hours":"24 Hours Jars","done":"Done"};
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  
  const handleNoteChange = (note) => {
    const newNotes = {...jarContentDict.currentLst}
    delete newNotes[note[0]];
    setJarContentDict(prev=>({prevLst:prev.prevLst,nextLst:prev.nextLst,currentLst:newNotes}));  
    return note;
  }

  const saveChanges = async () => {
    localStorage.setItem(a.id,JSON.stringify(jarContentDict.currentLst));
    const lclDbBefore = localStorage.getItem(JarBefore.key);
    const lclDbNext = localStorage.getItem(JarNext.key);
  

    if (lclDbBefore != undefined) {
      const db = JSON.parse(lclDbBefore);
      const newDb = {...db,...jarContentDict.prevLst};
      localStorage.setItem(JarBefore.key,JSON.stringify(newDb));
    } else {
      localStorage.setItem(JarBefore.key,JSON.stringify(jarContentDict.prevLst));
    }

    if (lclDbNext != undefined) {
      const db = JSON.parse(lclDbNext);
      const newDb = {...db,...jarContentDict.nextLst};
      localStorage.setItem(JarNext.key,JSON.stringify(newDb));
    } else {
      localStorage.setItem(JarNext.key,JSON.stringify(jarContentDict.nextLst));
    }
    for (const [word, meaning] of Object.entries(jarContentDict.nextLst)) {
      try {
        // await axios.put(`http://localhost:3001/api/flashcards/${userId}/${JarNext.key}`, {
        //   data: { [word]: meaning }
        // });
        await axios.put("http://localhost:3001/api/flashcards", {
          user_id: userId,
          data: { [word]: meaning },
          jar: JarNext.key,
          lastReviewedAt: new Date().toISOString()
        });
        console.log(`Eklendi: ${word}`);
      } catch (error) {
        console.error(`Eklenemedi: ${word}`, error);
      }
    }
    for (const [word, meaning] of Object.entries(jarContentDict.prevLst)) {
      try {
        await axios.put("http://localhost:3001/api/flashcards", {
          user_id: userId,
          data: { [word]: meaning },
          jar: JarBefore.key,
          lastReviewedAt: new Date().toISOString()
        });
        console.log(`Eklendi: ${word}`);
      } catch (error) {
        console.error(`Eklenemedi: ${word}`, error);
      }
    }
    for (const [word, meaning] of Object.entries(jarContentDict.currentLst)) {
      try {
        await axios.delete("http://localhost:3001/api/flashcards", {
          data: {
            user_id:userId,
            jar: JarBefore.key,
            data: { [word]: meaning }
          }
        });
        console.log(`Silindi: ${word}`);
      } catch (error) {
        console.error(`Silinemedi: ${word}`, error);
      }
    }
    navigate("/flashcards");
  }

  const fetchJarData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/flashcards/${userId}/${a.id}`
      );
      
      const mergedData = res.data.reduce((acc, card) => {
        return { ...acc, ...card.data };
      }, {});
      
      const mergedDataTimer = res.data.reduce((acc, card) => {
        const key = Object.keys(card.data)[0];
        return { ...acc, [key]: card.lastReviewedAt };
      }, {});
      
      setNotes(mergedData);
      setNotesTimer(mergedDataTimer);
    } catch (err) {
      console.error("Seçilen jar verisi alınamadı:", err);
    }
  };

  useEffect(() => {
    setIsOpen(false)
    const jarUrl = a.id;
    setJarCurrent(jarUrl)
    const jarName = jarNameDict[jarUrl];
    if (jarName != undefined) {
      const notes = JSON.parse(localStorage.getItem(jarUrl));
      if (notes) {
        setNotes(notes);
        setJarContentDict({prevLst:{},nextLst:{},currentLst:notes});
      } else {
        setNotes({});
        setJarContentDict({prevLst:{},nextLst:{},currentLst:{}});
      }
      if (jarUrl=="1hours") {
        setJarBefore(prev => ({"location":prev.location,"key":"1hours"}));
        setJarNext(prev => ({"location":prev.location,"key":"3hours"}));
      } else if (jarUrl=="3hours") {
        setJarBefore(prev => ({"location":prev.location,"key":"1hours"}));
        setJarNext(prev => ({"location":prev.location,"key":"8hours"}));
      } else if (jarUrl=="8hours") {
        setJarBefore(prev => ({"location":prev.location,"key":"3hours"}));
        setJarNext(prev => ({"location":prev.location,"key":"24hours"}));
      }else if (jarUrl=="24hours") {
        setJarBefore(prev => ({"location":prev.location,"key":"8hours"}));
        setJarNext(prev => ({"location":prev.location,"key":"done"}));
      }else {
        setJarBefore(prev => ({"location":prev.location,"key":"24hours"}));
        setJarNext(prev => ({"location":prev.location,"key":"done"}));
      }
    } else {
      navigate("/flashcards");
    }
    if (userId && jarName) {
      fetchJarData();
    }
  }, [a.id])


  return (
    <div>
      <div id='jarsBg' className='x'> </div>
      <div className='container-fluid d-flex'>
        {isOpen && (
          Object.entries(notes).map((note, index) =>
              <JarNotes key={index} note={note} JarNext={JarNext} jarCurrent={JarCurrent} JarBefore={JarBefore} setJarContentDict={setJarContentDict} handleNoteChange={handleNoteChange} lastReviewed={notesTimer[note[0]]}/>
          ))
        }
        <div className="vw-100 d-flex justify-content-around position-fixed bottom-0 z-0">

          <Jar setJar={setJarBefore} jar={JarBefore} jarNameDict={jarNameDict} isOpen={isOpen} />        
          <div className={`position-relative d-inline-block p-3 m-3 ${isOpen ? "d-none":""}`}>
            <h4 className='text-center'>Open {jarNameDict[a.id]}</h4>
            <button onClick={() => { setIsOpen(true) }} className='btn btn-primary position-absolute bottom-0 end-0 btn-lg'>Notları Aç</button>
            <img src="../../images/jar_cute2.png" alt="jar" width={250}/>
          </div>
            <div className={`${isOpen ? "":"d-none"} align-self-end`}>
              <button onClick={saveChanges} className="rounded-circle btn p-0 mb-5"><img className='rounded-circle' src="../../images/done.png" alt="done" width={150} /></button>
            </div>
          <Jar setJar={setJarNext} jar={JarNext} jarNameDict={jarNameDict} isOpen={isOpen}/>
        </div>

      </div>
    </div>
  )
}

export default JarPage
