import { capitalizeWords } from '../../utils/UtilFunctions'

import './../../styles/style1.css'
import { CustomTab } from '../../styles/CssStyled'
import { useState } from 'react'
import { Avatar } from '@mui/material'
import FormateTime from '../../components/FormateTime'
import { FaEdit, FaMinus, FaSearchPlus, FaTrashAlt } from 'react-icons/fa'

const STAGES = [
    { name: 'QUALIFICATION', color: 'yellow' },
    { name: 'NEEDS ANALYSIS', color: 'orange' },
    { name: 'VALUE PROPOSITION', color: 'purple' },
    { name: 'ID.DECISION MAKERS', color: '#68c074bc' },
    { name: 'PERCEPTION ANALYSIS', color: 'rgb(78, 130, 138)' },
    { name: 'PROPOSAL/PRICE QUOTE', color: 'rgb(70, 69, 39)' },
    { name: 'NEGOTIATION/REVIEW', color: 'rgb(233, 92, 207)' },
    { name: 'CLOSED WON', color: 'green' },
    { name: 'CLOSED LOST', color: 'red' },
    { name: 'NOT STAGED', color: 'gray' }
]

const DUMMY_TAGS = ['VIP', 'High Profit', 'Fast Process']
const DUMMY_OPPORTUNITIES = Array.from({ length: 15 }, (_, index) =>
({
    title: `Some Long Titled Opportunity with Company ${index}`,
    tags: [DUMMY_TAGS[index % 2], DUMMY_TAGS[index % 3]]
}))

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
            <div className='opportunity-card-header'>{opportunity.name}
                <div className='header-badge' style={{ backgroundColor: badgeColor }}/>
                <div className='opportunity-tag-panel'>
                    {opportunity.tags.map((tag: any) => <p className='opportunity-tag'>
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
                                    alt={opportunity?.created_by.user_details?.email}
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
                                    <p style={{ margin: '3px', padding: 0 }} key={`assigned-to-${user.user_details?.email || ''}`}>{user.user_details?.email || ''}</p>)}
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

/*
{
  "name": "Deal to be deleted",
  "account": "c554fa35-2afd-4952-b699-6e66de572256",
  "stage": "QUALIFICATION",
  "currency": "AED",
  "amount": "9191066.5",
  "lead_source": "NONE",
  "probability": 100,
  "closed_on": "2025-03-27",
  "description": "No Description",
  "is_active": true,
  "org": "1f2c6fd5-9d28-4fd9-911c-79fc6e453161",
  "lead": "9bbdd357-cdcd-4560-894a-c6c09a333dfe"
}
*/
