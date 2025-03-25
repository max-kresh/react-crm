// authurl
export const SERVER = process.env.REACT_APP_API_BASE_URL
export const SERVER_HOST = new URL(SERVER as string).origin
export const LoginUrl = 'auth/login'
export const RegisterUrl = 'auth/register'
export const ForgotPasswordUrl = 'auth/forgot-password'
export const ActivateUserUrl = 'auth/activate-user'

export const AuthUrl = 'auth/google'
export const AuthEmailUrl = 'auth/email'
// org
export const OrgUrl = 'org'
// export const OrgUrl = 'auth/create-org'
// company

export const CompanyUrl = 'leads/company'
export const CompaniesUrl = 'leads/companies'
// Lead
export const LeadUrl = 'leads'
// Contact
export const ContactUrl = 'contacts'
// Opportunity
export const OpportunityUrl = 'opportunities'
// ACCOUNTS
export const AccountsUrl = 'accounts'
// CASES
export const CasesUrl = 'cases'
// USERS
export const UsersUrl = 'users'
export const UserUrl = 'user'
// PROFILE
export const ProfileUrl = 'profile'
// SETTING
export const AppSettingsUrl = 'app-settings'
// TASKS
export const TasksUrl = 'tasks'
