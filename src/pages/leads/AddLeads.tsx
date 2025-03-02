import { useLocation } from 'react-router-dom'
import { LeadForm } from './LeadForm'

export function AddLeads () {
  const { state } = useLocation()
  return (
    <LeadForm state={state} method='POST'/>
  )
}
