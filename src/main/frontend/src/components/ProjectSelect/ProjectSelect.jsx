import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider"

import { giveMeMainProjects } from "../../services/api"
import './ProjectSelect.css';
function ProjectSelect({ onSelect }) {
    const [projects, setProjects] = useState([]);
    const [selected, setSelected] = useState("");
    const { state, dispatch } = useContext(AuthContext)

    useEffect(() => {
        // Получение списка проектов с сервера
        const fetchProjects = async () => {
            try {
                const response = await giveMeMainProjects(state.token);

                const data = response.data;
                setProjects(data);
            } catch (error) {
                console.error("Ошибка:", error);
            }
        };

        fetchProjects();
    }, []);

    const handleChange = (e) => {
        const projectId = e.target.value;
        setSelected(projectId);
        if (onSelect) {
            onSelect(projectId);
        }
    };

    return (
        <div className="projects">
            <label htmlFor="project-select">Выберите проект: </label>
            <select id="project-select" value={selected} onChange={handleChange}>
                <option value="">-- Выберите --</option>
                {projects.map((project) => (
                    <option key={project.id} value={project.name}>
                        {project.name} от {project.createDate} c   {project.id}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ProjectSelect;
