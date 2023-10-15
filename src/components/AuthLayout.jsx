import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkTokenValid } from '../utils/auth'

export default function Protected({ children, authentication = true }) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)

    const authStatus = checkTokenValid();
    // console.log('session data=',authStatus)

    useEffect(() => {
        // console.log('Test navigate based on auth')

        if (authentication && authStatus !== authentication) {
            // console.log('navigate to login')
            navigate("/login")
        } else if (!authentication && authStatus !== authentication) {
            // console.log('navigate to home')
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])

    return loader ? <h1> Loading... </h1> : <> {children} </>
}
