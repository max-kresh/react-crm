import { useLocation } from 'react-router-dom'
import { ContactForm } from './ContactForm'

function EditContacts () {
  const { state } = useLocation()
  console.log('stateeeee ', state)
  return (
    <ContactForm state={state} httpReqMethod='PUT'/>
  )
} 

export default EditContacts
