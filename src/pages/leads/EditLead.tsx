import { useLocation } from 'react-router-dom'
import { LeadForm } from './LeadForm'

export function EditLead () {
  const { state } = useLocation()
  return (
    <LeadForm state={state} method='PUT' />
  )
}
