import { capitalizeWords } from '../../utils/UtilFunctions'

import './../../styles/style1.css'
import { Avatar } from '@mui/material'
import FormateTime from '../../components/FormateTime'
import { FaEdit, FaSearchPlus, FaTrashAlt } from 'react-icons/fa'

function StageViewTab ({ title, isActive, onTabClick }: any) {
    const cardTitle = capitalizeWords(title.toLowerCase().replace('/', ' / '))
    return (
        <div
            className={`stage-tab${isActive ? ' stage-tab-selected' : ''}`}
            onClick={() => onTabClick(title)}
        >
            {cardTitle}
        </div>
    )
}

function OpportunityCard ({ opportunity, opportunityStageHistory, badgeColor }: any) {
    return (
        <div className='opportunity-card'>
            <div className='opportunity-card-header'>
                <p className='opportunity-name'>{opportunity.name}</p>
                <div className='header-badge' style={{ backgroundColor: badgeColor }}/>
                <div className='opportunity-tag-panel'>
                    {opportunity.tags.map((tag: any, index: number) => <p key={`${tag.name}-${index}`} className='opportunity-tag'>
                        {tag.name}
                    </p>)}
                </div>
            </div>
            <table className='card-table'>
                <tbody>
                    <tr>
                        <th>Created by</th>
                        <td>
                            <div className='created-by-stack'>
                                <Avatar
                                    src={opportunity?.created_by?.profile_pic}
                                    alt={opportunity?.created_by?.user_details?.email}
                                    sx={{ marginRight: '5px' }}
                                />
                                <p>
                                    {opportunity?.created_by?.email ||
                                        'admin@example.com'} {FormateTime(opportunity?.created_at)}
                                </p>
                            </div>
                        </td>
                    </tr>
                    <hr />
                    <tr>
                        <th>Potential Revenue</th>
                        <td className='revenue-amount'>{opportunity?.amount || '---'} {opportunity?.currency || ''}</td>
                    </tr>
                    <hr />
                    <tr>
                        <th>Likelihood of Winning</th>
                        <td>{opportunity?.probability || '?'}%</td>
                    </tr>
                    <hr />
                    <tr>
                        <th>Assigned To</th> 
                        {opportunity?.assigned_to?.length === 0 ? <td>Not Assigned</td>
                        : opportunity?.assigned_to?.length &&
                            <td>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', justifyItems: 'start', margin: '0', padding: '0' }}>
                                    {opportunity.assigned_to.map((user: any) =>
                                        <p style={{ margin: '3px', padding: '0' }} key={`assigned-to-${user?.user_details?.email || ''}`}>
                                            {user?.user_details?.email || ''}
                                        </p>)}
                                </div>
                            </td>
                        }
                    </tr>
                </tbody>
            </table>
            <div className='card-toolbar-container'>
                <p title='Edit'><FaEdit /></p>
                <p title='See the details'><FaSearchPlus /></p>
                <p title='Delete'><FaTrashAlt /></p>
            </div>
        </div>
    )
}

export default function OpportunityStageView ({ opportunities, selectedTab, onTabChange, opportunityStages }: any) {
    const selectedStage = opportunityStages.filter((stage: any) => stage.name === selectedTab)
    const badgeColor = selectedStage.length ? selectedStage[0].color : 'black'
    return (
        <div className='stages-container'>
            {opportunityStages.map((stage: any) =>
                <StageViewTab
                    key={`${stage.name}-header`}
                    title={stage.name}
                    onTabClick={onTabChange}
                    isActive={stage.name === selectedTab}
                />
            )}
            <div className='cards-container'>
                {opportunities.length > 0 
                    ? opportunities?.map((opportunity: any, index: number) =>
                    <OpportunityCard opportunity={opportunity} key={index} className='opportunity-card' badgeColor={badgeColor} />
                )
                : <div className='no-opportunities'>
                No opportunities found for stage {selectedTab}
                </div>
            }
            </div>
        </div>
    )
}
