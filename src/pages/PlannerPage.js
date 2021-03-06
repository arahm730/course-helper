import React, { useState, useRef } from "react";
import CourseDropDown from "../components/CourseDropDown";
import Navigation from "../components/Navigation";
import PlannerTable from "../components/PlannerTable";
import "./PlannerPage.css";
import data from "../data/course_year_aggregate.json";

import "bootstrap/dist/css/bootstrap.css";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import AlertBox from "../components/AlertBox";


const Planner = () => {
  const [displayedSemester, setDisplayedSemester] = useState("Fall");
  const handleSemesterChange = (event) => {
    console.log(event.target.value);
    setDisplayedSemester(event.target.value);
  };

  const [clickedCourse, setClickedCourse] = useState("161");

  const fiveYearData = data.filter(
    (entry) => 2018 <= parseInt(entry.year) && parseInt(entry.year) <= 2022
  );
  const difficulties = fiveYearData
    .filter((element) => element.course.id === clickedCourse)
    .map((obj) => parseFloat(obj.aggregate.mean));

  const [array, setArray] = useState([]);
  const [fallArray, setFallArray] = useState([]);
  const [winterArray, setWinterArray] = useState([]);
  const [springArray, setSpringArray] = useState([]);
  const [summerArray, setSummerArray] = useState([]);
  

  const [lastAddedArray, setLastAddedArray] = useState([])

  const handleAddClick = () => {
    let entry = {
      semester: displayedSemester,
      course: clickedCourse,
      difficulty: difficulties[0],
    };

    let specificEntry = {
      course: clickedCourse,
      difficulty: difficulties[0],
    };

    setArray((array) => [...array, entry]);
    if (displayedSemester === "Fall") {
      setFallArray((fallArray) => [...fallArray, specificEntry]);
      setLastAddedArray(fallArray);
    } else if (displayedSemester === "Winter") {
      setWinterArray((winterArray) => [...winterArray, specificEntry]);
      setLastAddedArray(winterArray);
    } else if (displayedSemester === "Spring") {
      setSpringArray((springArray) => [...springArray, specificEntry]);
      setLastAddedArray(springArray);
    } else if (displayedSemester === "Summer") {
      setSummerArray((summerArray) => [...summerArray, specificEntry]);
      setLastAddedArray(summerArray);
    }
  };

  const handleUndoClick = () => {
    let lastAddition = array.pop();
    if (lastAddition === undefined) return;
    if (lastAddition.semester === "Fall") {
      setFallArray((fallArray) => [
        ...fallArray.slice(0, fallArray.length - 1),
      ]);
    } else if (lastAddition.semester === "Winter") {
      setWinterArray((winterArray) => [
        ...winterArray.slice(0, winterArray.length - 1),
      ]);
    } else if (lastAddition.semester === "Spring") {
      setSpringArray((springArray) => [
        ...springArray.slice(0, springArray.length - 1),
      ]);
    } else if (lastAddition.semester === "Summer") {
      setSummerArray((summerArray) => [
        ...summerArray.slice(0, summerArray.length - 1),
      ]);
    }
  };

  return (
    <div>
      <Navigation />
      <h1>Plan out the most effective schedule for you!</h1>

      <div className="selections">
        <div id="first" className="child-div">
          <label htmlFor="semester">Choose a semester:</label>
          <select value={displayedSemester} onChange={handleSemesterChange}>
            <option value="Fall">Fall</option>
            <option value="Winter">Winter</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
          </select>
        </div>
        <div className="child-div">
          <CourseDropDown setClickedCourse={setClickedCourse} />
        </div>
        <Button
          variant="success"
          id="add-button"
          type="button"
          onClick={handleAddClick}
        >
          Add
        </Button>
        <OverlayTrigger
          delay={{ hide: 450, show: 300 }}
          overlay={(props) => (
            <Tooltip {...props}>Added the wrong class? Just undo!</Tooltip>
          )}
          placement="top"
        >
          <Button
            variant="danger"
            id="undo-button"
            type="button"
            onClick={handleUndoClick}
          >
            Undo
          </Button>
        </OverlayTrigger>
      </div>
      {lastAddedArray.length > 3 && (
        <div>
          <AlertBox lastAddedArray={lastAddedArray} />
        </div>
      )}

      <div className="tables">
        <div className="semester-table">
          <h2>Fall</h2> <PlannerTable array={fallArray} />
        </div>
        <div className="semester-table">
          <h2>Winter</h2> <PlannerTable array={winterArray} />
        </div>
        <div className="semester-table">
          <h2>Spring</h2> <PlannerTable array={springArray} />
        </div>
        <div className="semester-table">
          <h2>Summer</h2> <PlannerTable array={summerArray} />
        </div>
      </div>
    </div>
  );
};

export default Planner;
