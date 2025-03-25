import { useEffect, useState } from 'react'
import './../styles/style.css'
import { FaCheck, FaMinus } from 'react-icons/fa'

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

export function OpportunityStages ({ orderedStageList, currentStage, onStageChange, ...props }: any) {
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

    return (
        <div className='stages-panel'>
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
                color={stageInfo[stageInfo.length - 1].selected ? defaultSelectedColor : defaultNonSelectedColor}
                key={`${stageInfo[stageInfo.length - 1].title}-${stageInfo[stageInfo.length - 1].selected || ''}-connector`}
                classes={['connector-upwards']}
                styles={{ gridRow: 2, gridColumn: 14, placeSelf: 'center start' }}
            />
            <StageConnector
                color={stageInfo[stageInfo.length - 2].selected ? defaultSelectedColor : defaultNonSelectedColor}
                key={`${stageInfo[stageInfo.length - 2].title}-${stageInfo[stageInfo.length - 2].selected || ''}-connector`}
                classes={['connector-downwards']}
                styles={{ gridRow: 2, gridColumn: 14, placeSelf: 'center start' }}
            />
            <div className='closed-stage-cell closed-lost-cell'>
                <p className='stage-label'>{stageInfo[stageInfo.length - 1].title.replace('/', ' / ')}</p>
                <Stage
                    key={`${stageInfo[stageInfo.length - 1].title}-${stageInfo[stageInfo.length - 1].selected || ''}`}
                    stageProps={stageInfo[stageInfo.length - 1]}
                    onClick={() => handleStageClick(stageInfo[stageInfo.length - 1].title)}
                    {...props}
                    styles={{ placeSelf: 'center' }}
                />
            </div>
            <div className='closed-stage-cell closed-won-cell'>
                <Stage
                    key={`${stageInfo[stageInfo.length - 2].title}-${stageInfo[stageInfo.length - 2].selected || ''}`}
                    stageProps={stageInfo[stageInfo.length - 2]}
                    onClick={() => handleStageClick(stageInfo[stageInfo.length - 2].title)}
                    {...props}
                    styles={{ placeSelf: 'center' }}
                />
                <p className='stage-label'>{stageInfo[stageInfo.length - 2].title.replace('/', ' / ')}</p>
            </div>
        </div>
    )
}
