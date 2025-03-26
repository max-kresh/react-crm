import { useLocation } from 'react-router-dom'
import { OpportunityForm } from './OpportunityForm'
import { HTTP_METHODS } from '../../utils/Constants'

export function EditOpportunity () {
    const { state } = useLocation()
    return (
        <OpportunityForm state={state} httpReqMethod={HTTP_METHODS.PUT}/>
    )
}
