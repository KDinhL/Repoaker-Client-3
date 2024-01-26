import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// eslint-disable-next-line
import { urlProjectsByUser, urlProjectTasks, urlAllProjects } from "../../utils/api-utils";
import "./ProjectList.scss";
import DeleteProject from "../DeleteProject/DeleteProject";
import "../DeleteProject/DeleteProject.scss";
import EditProject from "../EditPoject/EditProject";
import Modal from "react-modal";
import AddTask from "../../components/AddTask/AddTask";


export default function ProjectList({ onProjectClick }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // const url = urlProjectsByUser();
      // const response = await axios.get(url);
      const loggedInUsername = localStorage.getItem("loggedInUsername");

      let response;

      if (loggedInUsername === "admin") {
        response = await axios.get(urlAllProjects());
      } else {
        response = await axios.get(urlProjectsByUser());
      }

      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleProjectDelete = () => {
    fetchProjects();
  };
  const handleProjectEdit = () => {
    fetchProjects();
  };

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
    setTasks([]); // Reset tasks when closing the modal
  };

  const handleTaskAdded = async (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);

    // Refresh the task list by fetching tasks again
    if (selectedProject) {
      try {
        const response = await axios.get(urlAllProjects());
        const updatedProjects = response.data;
        setProjects(updatedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
  };


  return (
    <div className="PL">
      <h2>Project List</h2>
      <table className="PL__project-table">
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Project Description</th>
            <th>Tasks ID</th>
            <th>Tasks Description</th>
            <th>Start Date</th>
            <th>Deadline</th>
            <th>Remaining Days</th>
            <th>Project Percentage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.project_id}>
              <td>
                <Link to={`/projects/${project.project_id}`}>
                  {project.project_name}
                </Link>
              </td>
              <td>{project.project_description}</td>
              {/* <td>
                {project.tasks_name.map((taskName) => (
                  <span key={taskName}>{taskName}, </span>
                ))}
              </td> */}
              <td>
                {project.tasks_name.length === 0 ? (
                  <button
                    className="add-task-button"
                    onClick={() => handleOpenModal(project)}
                  >
                    Add Task
                  </button>
                ) : (
                  project.tasks_name.map((taskName) => (
                    <span key={taskName}>{taskName}, </span>
                  ))
                )}
              </td>
              <td>
                {project.tasks_description.map((taskDesc) => (
                  <span key={taskDesc}>{taskDesc}, </span>
                ))}
              </td>
              <td>{project.start_date}</td>
              <td>{project.deadline}</td>
              <td>
                {project.remaining_days < 0 ? "Over Due" : project.remaining_days}
              </td>
              <td>
                {isNaN(Number(project.project_status_percentage))
                  ? project.project_status_percentage
                  : `${project.project_status_percentage}%`}
              </td>
              {/* <td>
                {project.tasks_name.length === 0 && (
                  <button
                    className="add-task-button"
                    onClick={() => handleOpenModal(project)}
                  >
                    Add Task
                  </button>
                )}
                <DeleteProject
                  projectId={project.project_id}
                  onDelete={handleProjectDelete}
                />
                <EditProject
                  projectId={project.project_id}
                  onEdit={handleProjectEdit}
                />
              </td> */}
              <td>
                <DeleteProject
                  projectId={project.project_id}
                  onDelete={handleProjectDelete}
                />
                <EditProject
                  projectId={project.project_id}
                  onEdit={handleProjectEdit}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Add Task Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <AddTask
          closeModal={handleCloseModal}
          project_id={selectedProject ? selectedProject.project_id : ""}
          task_project_name={selectedProject ? selectedProject.project_name : ""}
          project_start_date={selectedProject ? selectedProject.project_start_date : ""}
          project_deadline={selectedProject ? selectedProject.project_deadline : ""}
          onTaskAdded={handleTaskAdded}
        />
      </Modal>
    </div>

  );
}