import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import './WorkJournals.css';
const WorkJournals = ({ chatId }) => {
    const { state } = useContext(AuthContext);
    return (
        <div className="work-journals-container">
            <aside className="sidebar">
                <h3 className="sidebar-title">Типы журналов</h3>
                <ul className="journal-types">
                    <li className="journal-type active">Общий журнал работ</li>
                    <li className="journal-type">Журнал входного контроля</li>
                    <li className="journal-type">Журнал авторского надзора</li>
                    <li className="journal-type">Акты скрытых работ</li>
                </ul>
            </aside>

            <div className="journal-content">
                <div className="journal-header">
                    <h2>Общий журнал работ - Объект #{chatId}</h2>
                </div>

                <div className="entries-list">
                    <div className="entry">
                        <div className="entry-header">
                            <span className="entry-author">Петров П.П. (Подрядчик)</span>
                            <span className="entry-date">15.05.2023 14:30</span>
                        </div>
                        <div className="entry-content">
                            Выполнена укладка асфальта на участке 100 м². Использован материал: асфальтобетон тип Б марки II.
                        </div>
                        <div className="entry-attachments">
                            <div className="attachment">Фото 1</div>
                            <div className="attachment">Фото 2</div>
                            <div className="attachment">Акт №123</div>
                        </div>
                    </div>
                </div>

                <div className="new-entry-form">
                    <h3>Новая запись в журнале:</h3>
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
        </div>
    );
};

export default WorkJournals;