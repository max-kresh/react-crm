import { capitalizeWords } from '../../utils/UtilFunctions'

import './../../styles/style1.css'
import { Avatar } from '@mui/material'
import FormateTime from '../../components/FormateTime'
import { FaEdit, FaSearchPlus, FaTrashAlt } from 'react-icons/fa'
import { SpinnerAbsolute } from '../../components/Spinner'
import { useEffect, useRef } from 'react'

function titlePretty (title: string) {
    return capitalizeWords(title.toLowerCase().replace('/', ' / '))
}

function StageViewTab ({ title, isActive, onTabClick }: any) {
    return (
        <div
            className={`stage-tab${isActive ? ' stage-tab-selected' : ''}`}
            onClick={() => onTabClick(title)}
        >
            {capitalizeWords(title)}
        </div>
    )
}

function OpportunityCard ({ opportunity, badgeColor, onAction, refProp }: any) {
    useEffect(() => {
        refProp?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, [refProp])
    
    return (
        <div className='opportunity-card' ref={refProp}>
            <div className='opportunity-card-header'>
                <p className='opportunity-name'>{opportunity.name}</p>
                <div 
                    className='header-badge' 
                    style={{ backgroundColor: badgeColor }}
                    title={`Stage: ${titlePretty(opportunity?.stage || '')}`}
                />
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
                <p title='Edit' onClick={() => onAction('edit', opportunity)}><FaEdit /></p>
                <p title='See the details' onClick={() => onAction('details', opportunity)}><FaSearchPlus /></p>
                <p title='Delete' onClick={() => onAction('delete', opportunity)}><FaTrashAlt /></p>
            </div>
        </div>
    )
}

export default function OpportunityStageView ({ 
    opportunities, 
    selectedTab, 
    onTabChange, 
    onAction, 
    opportunityStages,
    spinner,
    scrollToId
}: any) {
    const selectedStage = opportunityStages.filter((stage: any) => stage.name === selectedTab)
    const badgeColor = selectedStage.length ? selectedStage[0].color : 'black'
    const cardRef = useRef<HTMLDivElement>(null)
    return (
        <div className='stages-container'>
            {spinner && <SpinnerAbsolute />}
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
                    <OpportunityCard 
                        opportunity={opportunity} 
                        key={index} 
                        onAction={onAction}
                        className='opportunity-card' 
                        badgeColor={badgeColor} 
                        refProp={opportunity.id === scrollToId ? cardRef : null}
                    />
                )
                : <div className='no-opportunities'>
                No opportunities found for stage {selectedTab}
                </div>
            }
            </div>
        </div>
    )
}
