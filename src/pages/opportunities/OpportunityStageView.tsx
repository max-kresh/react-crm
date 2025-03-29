import { capitalizeWords } from '../../utils/UtilFunctions'

import './../../styles/style1.css'
import { useState } from 'react'
import { Avatar } from '@mui/material'
import FormateTime from '../../components/FormateTime'
import { FaEdit, FaSearchPlus, FaTrashAlt } from 'react-icons/fa'

const STAGES = [
    { name: 'QUALIFICATION', color: '#FFD700' }, // Gold - Initial interest stage
    { name: 'NEEDS ANALYSIS', color: '#FF8C00' }, // Dark Orange - Understanding needs
    { name: 'VALUE PROPOSITION', color: '#8A2BE2' }, // Blue Violet - Presenting value
    { name: 'ID.DECISION MAKERS', color: '#4682B4' }, // Steel Blue - Identifying key people
    { name: 'PERCEPTION ANALYSIS', color: '#20B2AA' }, // Light Sea Green - Gauging perception
    { name: 'PROPOSAL/PRICE QUOTE', color: '#556B2F' }, // Dark Olive Green - Formal proposal
    { name: 'NEGOTIATION/REVIEW', color: '#DC143C' }, // Crimson - Intense discussions
    { name: 'CLOSED WON', color: '#228B22' }, // Forest Green - Success
    { name: 'CLOSED LOST', color: '#8B0000' }, // Dark Red - Lost deal
    { name: 'NOT STAGED', color: '#808080' } // Gray - No stage assigned
]

const DUMMY_TAGS = ['VIP', 'High Profit', 'Fast Process']

function StageCardHeader ({ title, isActive, onTabClick }: any) {
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

function OpportunityCard ({ opportunity, opportunityStageHistory }: any) {
    const badgeColor = STAGES.find((stage: any) => stage.name === opportunity.stage)?.color
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
                        {!opportunity?.assigned_to?.length && <td>---</td>}
                        {opportunity?.assigned_to.length && 
                        <td>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', justifyItems: 'start', margin: '0', padding: '0' }}>
                                {opportunity.assigned_to.map((user: any) => 
                                    <p style={{ margin: '3px', padding: 0 }} key={`assigned-to-${user?.user_details?.email || ''}`}>{user?.user_details?.email || ''}</p>)}
                            </div>
                        </td>}
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

export default function OpportunityStageView ({ opportunities, stages = STAGES }: any) {
    console.log('opportunities', opportunities)
    const [selectedTab, setSelectedTab] = useState<string>(STAGES[1].name)

    function handleChangeTab (newTab: string) {
        setSelectedTab(newTab)
    }
    return (
        <div className='stages-container'>
            {stages.map((stage: any) =>
                <StageCardHeader
                    key={`${stage.name}-header`}
                    title={stage.name}
                    onTabClick={handleChangeTab}
                    isActive={stage.name === selectedTab}
                />
            )}
            <div className='cards-container'>
                {opportunities?.map((o: any, index: number) =>
                    <OpportunityCard opportunity={o} key={index} className='opportunity-card' />
                )}
            </div>
        </div>
    )
}

