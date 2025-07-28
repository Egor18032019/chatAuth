const GeneralJournal = ({ chatId }) => (
    <div className="journal-content">
        <div className="journal-header">
            <h2>Общий журнал работ - Объект #{chatId}</h2>
        </div>
        {/* Контент общего журнала работ */}
        <div className="entries-list">
            <div className="entry">
                <div className="entry-header">
                    <span className="entry-author">Петров П.П. (Подрядчик)</span>
                    <span className="entry-date">15.05.2023 14:30</span>
                </div>
                <div className="entry-content">
                    Выполнена укладка асфальта на участке 100 м². Использован материал: асфальтобетон тип Б марки II.
                </div>
            </div>
        </div>
        <div className="new-entry-form">
            <h3>Новая запись в Общий журнал работ:</h3>
            <textarea
                className="entry-textarea"
                placeholder="Опишите выполненную работу или оставьте комментарий..."
            ></textarea>
            <div className="entry-actions">
                <button className="attach-button">Прикрепить файл</button>
                <button className="submit-button">Отправить</button>
            </div>
        </div>
    </div>
);
export default GeneralJournal