import { useLocation } from 'react-router-dom'
import { LeadForm } from './LeadForm'
import { HTTP_METHODS } from '../../utils/Constants'

export function EditLead () {
  const { state } = useLocation()
  return (
    <LeadForm state={state} method={ HTTP_METHODS.PUT } />
  )
}
