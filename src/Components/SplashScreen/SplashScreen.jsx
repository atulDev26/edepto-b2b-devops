import React, { useEffect } from 'react'
import { TOKEN } from '../../api/localStorageKeys'
import { autoLogin } from '../../utils/autoLogin'
import { useNavigate } from 'react-router-dom'
import { Controls, Player } from '@lottiefiles/react-lottie-player'

const SplashScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (TOKEN()) {
                autoLogin(() => navigate("/dashboard", { replace: true }))
            } else {
                navigate("/login", { replace: true })
            }
        }, 3000);

        return () => {
            clearTimeout(timeout)
        }
    }, [])


    return (
        <div className='h-screen flex justify-center items-center bg-white-color'>
            <Player src={process.env.PUBLIC_URL + "/Assets/animation/logo_lotties.json"} background="rgba(0, 0, 0, 0)" speed="1.4" autoplay style={{
                height: 280,
            }}>
                <Controls visible={false} />
            </Player>
        </div>

    )
}

export default SplashScreen