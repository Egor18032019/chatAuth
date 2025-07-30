import React, { useContext, useState, useCallback } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { TABS_SUPER_VISION_JOURNALS } from '../../utils/const';
import AuthorSupervisionJournal from './AuthorSupervisionJournal'
const SupervisionJournal = ({ chatId }) => {
    const [activeTab, setActiveTab] = useState(TABS_SUPER_VISION_JOURNALS.Title);
    const tabContent = {
        [TABS_SUPER_VISION_JOURNALS.Title]: (<div className="chat">
            <AuthorSupervisionJournal chatId={chatId} />
        </div>),
        [TABS_SUPER_VISION_JOURNALS.Object]: (
            <div className="chat">
                <h1>Лист обьекта</h1>
            </div>
        ),
        [TABS_SUPER_VISION_JOURNALS.Specialists]: (
            <div className="chat">
                <h1>Специалисты</h1>
            </div>
        ),
        [TABS_SUPER_VISION_JOURNALS.Registration]: (
            <div className="chat">
                <h1>Регистрационный лист</h1>
            </div>
        ),
        [TABS_SUPER_VISION_JOURNALS.Accounting]: (
            <div className="chat">
                <h1>Учетный лист</h1>
            </div>
        ),

    };

    return (

        <div className="tabs-container">
            <div className="tabs">
                {Object.values(TABS_SUPER_VISION_JOURNALS).map(tab => (
                    <div
                        key={tab}
                        className={`tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            <div className="tab-content">{tabContent[activeTab]}</div>
        </div>
    )
}
export default SupervisionJournal