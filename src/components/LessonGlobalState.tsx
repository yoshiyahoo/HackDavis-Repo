import React, { useState } from "react"
import Sidebar from "./Sidebar";

function LessonGlobalState() {
  const [lessons, setLessons] = useState([]);
  
  return (
    <div>
      <Sidebar message={lessons}/>
    </div>
  )
}

export default LessonGlobalState;
