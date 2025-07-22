import React, { useEffect, useState } from "react";
import { giveMeMainProjects } from "../../services/api"
function ProjectSelect({ onSelect }) {
    const [projects, setProjects] = useState([]);
    const [selected, setSelected] = useState("");

    useEffect(() => {
        // Получение списка проектов с сервера
        const fetchProjects = async () => {
            try {
                const response = await giveMeMainProjects();

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
        <div>
            <label htmlFor="project-select">Выберите проект: </label>
            <select id="project-select" value={selected} onChange={handleChange}>
                <option value="">-- Выберите --</option>
                {projects.map((project) => (
                    <option key={project.id} value={project.name}>
                        {project.id} от {project.createDate}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ProjectSelect;
