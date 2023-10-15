import { useNavigate } from "react-router-dom"

function NotFound() {
    console.log('navigate to Error')
    const navigate = useNavigate()
    const navigateHome = () => {
        navigate('/')
        // console.log('redirect log')
    }

  return (
    <>
      <h1>Oops!</h1>
      <p>404 page not exist.</p>
      <button onClick={() => navigateHome()}>Go back to Home</button>
    </>
  );
}

export default NotFound