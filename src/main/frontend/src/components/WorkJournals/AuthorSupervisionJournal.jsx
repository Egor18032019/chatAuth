import React, { useState, useEffect, useRef, useContext } from 'react';
import { saveAuthorSupervisionJournal, getAuthorSupervisionJournal } from '../../services/api';
import './AuthorSupervisionJournal.css';
import { AuthContext } from '../../providers/AuthProvider';

const AuthorSupervisionJournal = ({ project }) => {
    const { state } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        projectName: "",
        startDate: '',
        endDate: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoad, setIsLoad] = useState(false);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);


    // Загрузка данных при монтировании
    useEffect(() => {
        if (!project) return;
        setFormData({
            projectName: project,
            startDate: '',
            endDate: '',
        });
        const loadJournal = async () => {
            try {
                setIsLoading(true);

                const response = await getAuthorSupervisionJournal(state.token, project);

                if (response.success) {
                    setFormData({
                        projectName: response.data.projectName || '',
                        startDate: response.data.startDate || '',
                        endDate: response.data.endDate || '',
                    });
                    setIsLoad(true)
                    setError(null)
                } else {
                    setError(response.message)

                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadJournal();
    }, [project]);

    // Обработчик изменений
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsSaved(false);
    };

    // Отправка формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.projectName || !formData.startDate) {
            setError('Заполните обязательные поля');
            return;
        }

        console.log(formData)
        setIsLoading(true);
        setError(null);

        try {
            await saveAuthorSupervisionJournal(state.token, project, formData);
            setIsSaved(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!project) {
        return <div>Не указан проект</div>;
    }

    return (
        <div className="journal-container">
            <h1 className="title">ЖУРНАЛ АВТОРСКОГО НАДЗОРА ЗА СТРОИТЕЛЬСТВОМ</h1>

            {error && <div className="error-message">{error}</div>}
            {isSaved && <div className="success-message">Данные успешно сохранены</div>}
            {!isLoad && !isSaved ?
                <form onSubmit={handleSubmit} className="journal-form">
                    {/* Наименование объекта */}
                    <div className="input-group">
                        <label>Наименование объекта строительства</label>
                        <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            placeholder="Введите название объекта"
                            className="input-field"
                            disabled={true}
                            required
                        />
                    </div>

                    {/* Даты */}
                    <div className="date-group">
                        <div className="date-item">
                            <label>Журнал начат</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="date-field"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="date-item">
                            <label>Журнал окончен</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="date-field"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Кнопка сохранения */}
                    {!isSaved && <div className="submit-group">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Сохранение...' : 'Сохранить данные'}
                        </button>
                    </div>}
                </form> : <div className='journal'>
                    <div className="input-group">
                        <span>Наименование объекта строительства: </span>
                        {formData.projectName}
                    </div>
                    <div className="date-group">
                        <div className="date-item">
                            <span>Журнал начат: </span>
                            {formData.startDate}
                        </div>
                        <div className="date-item">
                            <span>Журнал окончен: </span>
                            {formData.endDate}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default AuthorSupervisionJournal;