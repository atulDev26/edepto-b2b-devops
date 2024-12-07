import { Controls, Player } from '@lottiefiles/react-lottie-player'
import React from 'react'

const NotFound = () => {
    return (
        <>
            <Player src={process.env.PUBLIC_URL + "/Assets/animation/404.json"} background="rgba(0, 0, 0, 0)" speed="1" loop autoplay style={{ height: 380 }}>
                <Controls visible={false} />
            </Player>
        </>

    )
}

export default NotFound