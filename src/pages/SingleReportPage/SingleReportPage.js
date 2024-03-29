import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProjectDetails from "../../components/ProjectDetails/ProjectDetails";
import { urlProjectById, urlProjectTasks } from "../../utils/api-utils";
import "./SingleReportPage.scss";

export default function SingleReportPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchProjectAndTasks();
 // eslint-disable-next-line
}, [projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      const projectResponse = await axios.get(urlProjectById(projectId));
      setProject(projectResponse.data);

      const tasksResponse = await axios.get(urlProjectTasks(projectId));
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error("Error fetching project and tasks:", error);
    }
  };
  console.log("Tasks:", tasks);

  return (
    <div className="single-report-page">
      {project && <ProjectDetails projectId={projectId} />}
      <div className="task-list">
        <h2>Task List</h2>
        <table className="task-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Task Description</th>
              <th>Start Date</th>
              <th>Deadline</th>
              <th>Remaining Days</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.task_description}</td>
                <td>{task.task_start_date}</td>
                <td>{task.task_deadline}</td>
                <td>
                  {task.remaining_days < 0 ? (
                    <span>Over Due</span>
                  ) : (
                    <span>{task.remaining_days}</span>
                  )}
                </td>
                <td>{task.task_status_percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        {tasks.map((task) => (
          <div key={task.id} className="task-details">
            <h2>Task Details</h2>
            <div className="task-details-row">
              <h3>Task Name</h3>
              <input type="text" value={task.task_name} readOnly />
            </div>
            <div className="task-details-row">
              <h3>Task N.O</h3>
              <input type="text" value={task.id || ""} readOnly />
            </div>
            <div className="task-details-row">
              <h3>Status</h3>
              <input
                type="text"
                value={`${task.task_status_percentage}%`}
                readOnly
              />
            </div>
            
            <div className="task-details-row">
              <h3>Description</h3>
              <textarea value={task.task_description} readOnly />
            </div>
            <div className="task-details-row">
              <h3>Start Date</h3>
              <input type="text" value={task.task_start_date} readOnly />
            </div>
            <div className="task-details-row">
              <h3>Deadline</h3>
              <input type="text" value={task.task_deadline} readOnly />
            </div>
            <div className="task-details-row">
              <h3>Problems</h3>
              <textarea value={task.task_problem} readOnly />
            </div>
            <div className="task-details-row">
              <h3>Solutions</h3>
              <textarea value={task.task_solution} readOnly />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}