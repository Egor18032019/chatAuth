import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import './WorkJournals.css';
import InputControlJournal from "./InputControlJournal"
import GeneralJournal from "./GeneralJournal"
import SupervisionJournal from "./SupervisionJournal"
import ActsHiddenWorksJournal from "./ActsHiddenWorksJournal"




const WorkJournals = ({ chatId }) => {
    const { state } = useContext(AuthContext);
    const [activeJournal, setActiveJournal] = useState('general');
    const [activeType, setActiveType] = useState('Общий журнал работ');

    const journalTypes = [
        { id: 'general', name: 'Общий журнал работ' },
        { id: 'input-control', name: 'Журнал входного контроля' },
        { id: 'author-supervision', name: 'Журнал авторского надзора' },
        { id: 'hidden-works', name: 'Акты скрытых работ' }
    ];

    const handleJournalChange = (journalId, journalName) => {
        setActiveJournal(journalId);
        setActiveType(journalName);
    };

    const renderJournalContent = () => {
        switch (activeJournal) {
            case 'input-control':
                return <InputControlJournal chatId={chatId} />;
            case 'author-supervision':
                return <SupervisionJournal project={chatId} />;
            case 'hidden-works':
                return <ActsHiddenWorksJournal chatId={chatId} />;
            default:
                return <GeneralJournal chatId={chatId} />;
        }
    };

    return (
        <div className="work-journals-container">
            <aside className="sidebar">
                <h3 className="sidebar-title">Типы журналов</h3>
                <ul className="journal-types">
                    {journalTypes.map((type) => (
                        <li
                            key={type.id}
                            className={`journal-type ${activeJournal === type.id ? 'active' : ''}`}
                            onClick={() => handleJournalChange(type.id, type.name)}
                        >
                            {type.name}
                        </li>
                    ))}
                </ul>
            </aside>

            {renderJournalContent()}


        </div>
    );
};

export default WorkJournals;