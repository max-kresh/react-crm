import { useEffect, useState } from 'react'
import './../../styles/style.css'
import { FaCheck, FaMinus } from 'react-icons/fa'
import { SpinnerAbsolute } from '../../components/Spinner'

const defaultSelectedColor = 'rgb(107, 107, 248)'
const defaultNonSelectedColor = 'rgb(198, 191, 191)'

export function Stage ({
    stageProps,
    colorSelected = defaultSelectedColor,
    colorDefault = defaultNonSelectedColor,
    onClick,
    styles
}: any) {
    const bgColor = stageProps?.selected ? `${stageProps.color ?? colorSelected}` : `${colorDefault}`
    return (
        <div className='stage-circle' style={{ backgroundColor: `${bgColor}`, ...styles }} onClick={() => onClick(stageProps.title)}>
            {stageProps?.selected && stageProps?.title !== 'CLOSED LOST' && <FaCheck size={40} style={{ fill: 'white' }} />}
            {stageProps?.selected && stageProps?.title === 'CLOSED LOST' && <FaMinus size={40} style={{ fill: 'white' }} />}
        </div>
    )
}

export function StageConnector ({ color, classes, styles }: any) {
    const className = classes ? ['connector', ...classes].join(' ') : 'connector'
    const s = styles ? { ...styles } : 'none'
    return (
        <div className={className} style={styles ?? { ...styles } }>
            <div className='connector-line' style={{ backgroundColor: `${color}` }} />
            <div className='connector-head' style={{ backgroundColor: `${color}` }} />
            <div className='connector-head-clear' />
            <div className='connector-tail-clear' />
        </div>
    )
}

export function OpportunityStages ({ orderedStageList, currentStage, onStageChange, spinner, ...props }: any) {
    const [stageInfo, setStageInfo] = useState(orderedStageList)

    useEffect(() => {
        const stageIndex = orderedStageList.findIndex((stage: any) => stage.title === currentStage)
        const stages = structuredClone(orderedStageList) 
        for (let i = 0; i < stages.length - 2; i++) {
           stages[i].selected = ['CLOSED WON', 'CLOSED LOST'].includes(currentStage) || i <= stageIndex 
        }
        for (let i = stages.length - 2; i < stages.length; i++) {
            stages[i].selected = stages[i].title === currentStage
         }
        setStageInfo(stages)
    }, [currentStage])

    function handleStageClick (newStage: string) {
        if (newStage !== currentStage) {
            onStageChange(newStage)
        }
    }
    const closedLost = stageInfo[stageInfo.length - 1]
    const closedWon = stageInfo[stageInfo.length - 2]
    return (
        <div className='stages-panel'>
            {spinner && <SpinnerAbsolute />}
            {stageInfo.slice(0, stageInfo.length - 2).map((stage: any, index: number) =>
                <>
                    {index !== 0 &&
                        <StageConnector
                            color={stage.selected ? defaultSelectedColor : defaultNonSelectedColor}
                            key={`${stage.title}-${stage.selected || ''}-connector`}
                        />
                    }

                    <Stage
                        key={`${stage.title}-${stage.selected || ''}`}
                        stageProps={stage}
                        onClick={() => handleStageClick(stage.title)}
                        {...props}
                    />
                    <p className='stage-label' style={{ gridColumn: index * 2 + 1 }}>{stage.title.replace('/', ' / ')}</p>
                </>
            )}
            <StageConnector
                color={closedLost.selected ? defaultSelectedColor : defaultNonSelectedColor}
                key={`${closedLost.title}-${closedLost.selected || ''}-connector`}
                classes={['connector-upwards']}
                styles={{ gridRow: 2, gridColumn: 14, placeSelf: 'center start' }}
            />
            <StageConnector
                color={closedWon.selected ? defaultSelectedColor : defaultNonSelectedColor}
                key={`${closedWon.title}-${closedWon.selected || ''}-connector`}
                classes={['connector-downwards']}
                styles={{ gridRow: 2, gridColumn: 14, placeSelf: 'center start' }}
            />
            <div className='closed-stage-cell closed-lost-cell'>
                <p className='stage-label'>{closedLost.title.replace('/', ' / ')}</p>
                <Stage
                    key={`${closedLost.title}-${closedLost.selected || ''}`}
                    stageProps={closedLost}
                    onClick={() => handleStageClick(closedLost.title)}
                    {...props}
                    styles={{ placeSelf: 'center' }}
                />
            </div>
            <div className='closed-stage-cell closed-won-cell'>
                <Stage
                    key={`${closedWon.title}-${closedWon.selected || ''}`}
                    stageProps={closedWon}
                    onClick={() => handleStageClick(closedWon.title)}
                    {...props}
                    styles={{ placeSelf: 'center' }}
                />
                <p className='stage-label'>{closedWon.title.replace('/', ' / ')}</p>
            </div>
        </div>
    )
}
