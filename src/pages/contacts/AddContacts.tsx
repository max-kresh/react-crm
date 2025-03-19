import { useLocation } from 'react-router-dom'
import { ContactForm } from './ContactForm'

function AddContacts () {
  const { state } = useLocation()
  return (
    <ContactForm state={state} httpReqMethod='POST'/>
  )
} 

export default AddContacts
