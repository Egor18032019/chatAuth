import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    useContext,
    memo
} from 'react';
import './InputControlJournal.css';
import { giveMeMainJournalEntry } from "../../services/api"
import { AuthContext } from "../../providers/AuthProvider"
// ---------- Компонент строки ----------
const TableRow = memo(({ entry, onUpload }) => (
    <tr key={entry.id}>
        <td>{entry.id}</td>
        <td>{entry.deliveryDate}</td>
        <td>{entry.materialName}</td>
        <td>{entry.quantity}</td>
        <td>{entry.supplier}</td>
        <td>{entry.document}</td>
        <td>{entry.inspectionResult}</td>
        <td>{entry.labControlDecision}</td>
        <td>{entry.labControlResult}</td>
        <td className="act-cell">
            {entry.actLink ? (
                <a href={entry.actLink} target="_blank" rel="noopener noreferrer" className="act-link">
                    Просмотреть акт
                </a>
            ) : (
                <button onClick={() => onUpload(entry.id)} className="upload-button">
                    Загрузить акт
                </button>
            )}
        </td>
        <td>{entry.inspector}</td>
    </tr>
));



const InputControlJournal = ({ chatId }) => {
    const { state, dispatch } = useContext(AuthContext)
    const [entries, setEntries] = useState([
    ]);



    useEffect(() => {
        if (!chatId) return;

        let ignore = false;
        giveMeMainJournalEntry(state.token, chatId)
            .then(res => {
                !ignore && setEntries(res.data.journalEntries)
            }
            )
            .catch(
                setError('Не удалось загрузить журнал')
            );
        return () => (ignore = true);
    }, [chatId]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEntry, setNewEntry] = useState({
        deliveryDate: '',
        materialName: '',
        quantity: '',
        supplier: '',
        document: '',
        inspectionResult: '',
        labControlDecision: '',
        labControlResult: '',
        inspector: '',
        actFile: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleUploadClick = () => {
        // Создаем скрытый input для выбора файла
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.doc,.docx,.jpg,.png';
        input.onchange = (e) => handleFileChange(e);
        input.click();
    };
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewEntry({
            deliveryDate: '',
            materialName: '',
            quantity: '',
            supplier: '',
            document: '',
            inspectionResult: '',
            labControlDecision: '',
            labControlResult: '',
            inspector: '',
            actFile: null
        });
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.name.split('.').pop().toLowerCase();
            if (!['pdf', 'doc', 'docx', 'jpg', 'png'].includes(fileType)) {
                setError('Пожалуйста, выберите файл в формате PDF, DOC, JPG или PNG');
                return;
            }
            setNewEntry(prev => ({ ...prev, actFile: file }));
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        if (isLoading) return;
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {

            const formData = new FormData();

            // Добавляем файл, если он есть
            if (newEntry.actFile) {
                formData.append('file', newEntry.actFile);
            }

            // Добавляем остальные данные
            const entryData = {
                ...newEntry,
                projectName: chatId,
                // Удаляем actFile из данных, так как он уже в formData
                actFile: undefined
            };
            formData.append('data', JSON.stringify(entryData));

            // Отправляем данные на сервер
            const response = await fetch('/api/journal-entries', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${state.token}`
                    // Content-Type не указываем, браузер сам установит с boundary
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            const result = await response.json();

            // Обновляем локальное состояние
            setEntries([...entries, {
                ...result,
                id: result.id
            }]);

            closeModal();
        } catch (err) {
            console.error('Ошибка при отправке данных:', err);
            setError(err.message || 'Произошла ошибка при отправке данных');
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="journal-container">
            <h1 className="journal-title">Журнал входного контроля материалов</h1>
            <div className="journal-subtitle">(наименование строительного объекта)</div>

            <div className="table-wrapper">
                <table className="journal-table">
                    <thead>
                        <tr>
                            <th className="col-num">№ п/п</th>
                            <th className="col-date">Дата доставки</th>
                            <th className="col-name">Наименование материалов</th>
                            <th className="col-qty">Кол-во</th>
                            <th className="col-supplier">Поставщик</th>
                            <th className="col-doc">Документ изготовителя</th>
                            <th className="col-result">Результат проверки</th>
                            <th className="col-lab-decision">Лабораторный контроль</th>
                            <th className="col-lab-result">Результат контроля</th>
                            <th className="col-act">Акт</th>
                            <th className="col-sign">Подпись</th>
                        </tr>
                        <tr>
                            <th>1</th>
                            <th>2</th>
                            <th>3</th>
                            <th>4</th>
                            <th>5</th>
                            <th>6</th>
                            <th>7</th>
                            <th>8</th>
                            <th>9</th>
                            <th>10</th>
                            <th>11</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry) => (
                            <TableRow entry={entry} onUpload={handleUploadClick} />

                        ))}
                    </tbody>
                </table>
            </div>

            <button onClick={openModal} className="add-button">
                Добавить строку
            </button>
            {/* Модальное окно для добавления новой строки */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>

                        <div className="modal-content">
                            <h2>Добавить новую запись</h2>
                            <form key={isModalOpen} onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Дата доставки:</label>
                                    <input
                                        type="date"
                                        name="deliveryDate"
                                        value={newEntry.deliveryDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Наименование материалов:</label>
                                    <input
                                        type="text"
                                        name="materialName"
                                        value={newEntry.materialName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Количество:</label>
                                    <input
                                        type="text"
                                        name="quantity"
                                        value={newEntry.quantity}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Поставщик:</label>
                                    <input
                                        type="text"
                                        name="supplier"
                                        value={newEntry.supplier}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Документ изготовителя:</label>
                                    <input
                                        type="text"
                                        name="document"
                                        value={newEntry.document}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Результат проверки:</label>
                                    <select
                                        name="inspectionResult"
                                        value={newEntry.inspectionResult}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Выберите результат</option>
                                        <option value="Соответствует">Соответствует</option>
                                        <option value="Не соответствует">Не соответствует</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Лабораторный контроль:</label>
                                    <select
                                        name="labControlDecision"
                                        value={newEntry.labControlDecision}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Выберите решение</option>
                                        <option value="Требуется">Требуется</option>
                                        <option value="Не требуется">Не требуется</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Результат контроля:</label>
                                    <input
                                        type="text"
                                        name="labControlResult"
                                        value={newEntry.labControlResult}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Подпись:</label>
                                    <input
                                        type="text"
                                        name="inspector"
                                        value={newEntry.inspector}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Акт:</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.jpg,.png"
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="cancel-button"
                                        disabled={isLoading}
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        type="submit"
                                        className="submit-button"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Отправка...' : 'Добавить'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default InputControlJournal;