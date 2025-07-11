import { useNavigate, useLocation, useParams } from 'react-router-dom'

export default () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  
  return {
    navigate,
    location,
    params,
    history: {
      push: navigate,
      replace: (path: string) => navigate(path, { replace: true })
    }
  }
}
