import { createContext, useState } from "react"

export const LessonsContext = createContext([])
export const SetLessonsContext = createContext(() => {})

export const LessonsProvider = ({ children }) => {
  const [lessons, setLessons] = useState([{ title: "initial lesson" }]) 

};
