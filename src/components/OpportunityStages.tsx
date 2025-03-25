import { useEffect, useState } from 'react'
import './../styles/style.css'
import { FaCheck } from 'react-icons/fa'

const defaultSelectedColor = 'rgb(107, 107, 248)'
const defaultNonSelectedColor = 'rgb(198, 191, 191)'

export function Stage ({
    stageProps,
    colorSelected = defaultSelectedColor,
    colorDefault = defaultNonSelectedColor,
    onClick
}: any) {
    const bgColor = stageProps?.selected ? `${stageProps.color ?? colorSelected}` : `${colorDefault}`
    return (
        <div className='stage-container'>
            <div className='stage-circle' style={{ backgroundColor: `${bgColor}` }} onClick={() => onClick(stageProps.title)}>
                {stageProps?.selected && <FaCheck size={40} style={{ fill: 'white' }} />}
            </div>
            <p className='stage-label'>{stageProps?.title.replace('/', ' / ')}</p>
        </div>

    )
}

export function StageConnector ({ color, classes }: any) {
    const className = classes ? ['connector', ...classes].join(' ') : 'connector'
    return (
        <div className={className}>
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
        for (var i = 0; i < stages.length; i++) {
           stages[i].selected = i <= stageIndex 
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
                <div className='connector-panel'>
                    <StageConnector 
                        color={stage.selected ? defaultSelectedColor : defaultNonSelectedColor} 
                        key={`${stage.title}-${stage.selected || ''}-connector`}
                    />
                </div>
                }
                
                <Stage 
                    key={`${stage.title}-${stage.selected || ''}`}
                    stageProps={stage} 
                    onClick={() => handleStageClick(stage.title)}
                    {...props} 
                />
            </> 
            )}
            <div className='connector-tilted-stack'>
                <div className='connector-panel'>
                    <StageConnector 
                        color={stageInfo[stageInfo.length - 1].selected ? defaultSelectedColor : defaultNonSelectedColor} 
                        key={`${stageInfo[stageInfo.length - 1].title}-${stageInfo[stageInfo.length - 1].selected || ''}-connector`}
                        classes={['connector-upwards']}
                    />
                </div>
                <div className='connector-panel'>
                    <StageConnector 
                        color={stageInfo[stageInfo.length - 2].selected ? defaultSelectedColor : defaultNonSelectedColor} 
                        key={`${stageInfo[stageInfo.length - 2].title}-${stageInfo[stageInfo.length - 2].selected || ''}-connector`}
                        classes={['connector-downwards']}
                    />
                </div>
            </div>
            <div className='close-stage-panel'>
                <Stage 
                    key={`${stageInfo[stageInfo.length - 1].title}-${stageInfo[stageInfo.length - 1].selected || ''}`}
                    stageProps={stageInfo[stageInfo.length - 1]} 
                    onClick={() => handleStageClick(stageInfo[stageInfo.length - 1].title)}
                    {...props} 
                />

                <Stage 
                    key={`${stageInfo[stageInfo.length - 2].title}-${stageInfo[stageInfo.length - 2].selected || ''}`}
                    stageProps={stageInfo[stageInfo.length - 2]} 
                    onClick={() => handleStageClick(stageInfo[stageInfo.length - 2].title)}
                    {...props} 
                />
            </div>
            
        </div>
    )
}
