import { useLocation } from 'react-router-dom'
import { ContactForm } from './ContactForm'

function EditContacts () {
  const { state } = useLocation()

  return (
    <ContactForm state={state} httpReqMethod='PUT'/>
  )
} 

export default EditContacts
