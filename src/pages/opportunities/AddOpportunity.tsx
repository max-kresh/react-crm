import { useLocation } from 'react-router-dom'
import { OpportunityForm } from './OpportunityForm'
import { stat } from 'fs'
import { HTTP_METHODS } from '../../utils/Constants'

export function AddOpportunity () {
  const { state } = useLocation()

  return (
    <OpportunityForm state={ state } httpReqMethod={HTTP_METHODS.POST} />
  )
}
