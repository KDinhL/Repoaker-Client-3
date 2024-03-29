import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import User from "../../assets/images/user.png";
// eslint-disable-next-line
import { urlAllProjects } from "../../utils/api-utils";
import "./MainPage.scss";
// eslint-disable-next-line
import Calendar from "../../components/Calendar/Calendar";
import { urlProjectsByUser } from "../../utils/api-utils"; // Update the import

export default function MainPage() {
    const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const navigate = useNavigate();
    // eslint-disable-next-line
const [error, setError] = useState(false);
    // eslint-disable-next-line
const [displayAllProjects, setDisplayAllProjects] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const loggedInUsername = localStorage.getItem("loggedInUsername");
            console.log("Logged In Username:", loggedInUsername); // Log the username for debugging
    
            const url = urlProjectsByUser();
            const response = await axios.get(url);
            console.log("Fetched projects:", response.data); // Add this line for debugging

            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const handleDisplayAllProjects = () => {
        setDisplayAllProjects(true);
        navigate("/all-report"); // Navigate to the AllReportPage.js
    };

    const toggleAdditionalButtons = () => {
        setShowAdditionalButtons(!showAdditionalButtons);
    };


    const handleDisplayCalendar = () => {
        setDisplayAllProjects(true);
        navigate("/calendar"); // Navigate to the AllReportPage.js
    };

    const handleProjectSelect = (event) => {
        const selectedValue = event.target.value;
        setSelectedProjectId(selectedValue);
        if (selectedValue === "") {
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 3000);
        } else {
            setSelectedProjectId(selectedValue);
        }
    };

    const handleDisplaySingleProjects = () => {
        if (selectedProjectId) {
            navigate(`/single-report/${selectedProjectId}`);
        }
    };

    const selectedProject = projects.find(
        (project) => project.project_id === selectedProjectId
    );
    return (
        <section className="main-page">
            <div className="user-container">
                <img src={User} alt="User Icon" className="user-icon" />
            </div>
            <h1 className="user-name">User Name</h1>
            <section className="button-row">
                <button className="page-button">
                    <Link to="/projects">Projects</Link>
                </button>
                <button className="page-button">
                    <Link to="/tasks">Tasks</Link>
                </button>
                <button className="page-button" onClick={handleDisplayCalendar}>
                    Alerts
                </button>
            </section>
            <button className="report-button" onClick={toggleAdditionalButtons}>
                Report
            </button>
            {showAdditionalButtons && (
                <section className="additional-section">
                    <div className="additional-buttons">
                        <button className="report-button" onClick={handleDisplayAllProjects}>
                            Display All Projects
                        </button>
                        <button className="report-button" onClick={handleDisplaySingleProjects}>
                            Display Single Projects
                        </button>
                    </div>
                    <div className="project-dropdown">
                        <select
                            className="dropdown-select"
                            value={selectedProjectId || ""}
                            onChange={handleProjectSelect}
                        >
                            <option value="" disabled>
                                Select a Project
                            </option>
                            {projects.map((project) => (
                                <option key={project.project_id} value={project.project_id}>
                                    {project.project_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedProject && (
                        <div className="selected-project-box">
                            Selected Project: {selectedProject.project_name}
                        </div>
                    )}
                </section>
            )}

        </section>
    );
}