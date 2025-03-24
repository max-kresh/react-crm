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
    const bgColor = stageProps?.selected ? `${colorSelected}` : `${colorDefault}`
    return (
        <div className='stage-container'>
            <div className='stage-circle' style={{ backgroundColor: `${bgColor}` }} onClick={() => onClick(stageProps.title)}>
                {stageProps?.selected && <FaCheck size={40} style={{ fill: 'white' }} />}
            </div>
            <p className='stage-label'>{stageProps?.title.replace('/', ' / ')}</p>
        </div>

    )
}

export function StageConnector ({ color }: any) {
    return (
        <div className='connector'>
            <div className='connector-line' style={{ backgroundColor: `${color}` }} />
            <div className='connector-line-head' style={{ backgroundColor: `${color}` }} />
            <div className='connector-head-clear' />
            <div className='connector-tail-clear' />
        </div>
    )
}

export function OpportunityStages ({ orderedStageList, currentStage, ...props }: any) {
    const [stageInfo, setStageInfo] = useState(orderedStageList)

    useEffect(() => {
        const stageIndex = orderedStageList.findIndex((stage: any) => stage.title === currentStage)
        const stages = structuredClone(orderedStageList) 
        for (var i = 0; i < stages.length; i++) {
           stages[i].selected = i <= stageIndex 
        }
        setStageInfo(stages)
    }, [currentStage])

    function handleStageClick (title: string) {
        const stageIndex = stageInfo.findIndex((stage: any) => stage.title === title)      
        setStageInfo((prev: any) => {
            const newState = structuredClone(prev)
            for (var i = 0; i < newState.length; i++) {
                newState[i].selected = i <= stageIndex 
            }
            return newState
        })  
    }
    return (
        <div className='stages-panel'>
            {stageInfo.slice(0, stageInfo.length - 1).map((stage: any, index: number) => { 
                return (<>
                    <Stage 
                        key={`${stage.title}-${stage.selected || ''}`}
                        stageProps={stage} 
                        onClick={handleStageClick}
                        {...props} 
                    />
                    <StageConnector 
                        color={stage.selected ? defaultSelectedColor : defaultNonSelectedColor} 
                        key={`${stage.title}-${stage.selected || ''}-connector`}
                    />
                </>) 
                }              
            )}
            <Stage stageProps={orderedStageList[orderedStageList.length - 1]} {...props} />
        </div>
    )
}
