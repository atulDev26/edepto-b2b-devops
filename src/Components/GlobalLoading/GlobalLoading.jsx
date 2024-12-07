import { Controls, Player } from '@lottiefiles/react-lottie-player'
import React from 'react'

const GlobalLoading = () => {
  return (
    <div role="dialog" aria-modal="true" className="fade image-modal modal show text-center" id="global-loading"
      style={{ display: "none", backgroundColor: "rgba(200,200,200,0.5)", zIndex: 1000000 }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <Player src={process.env.PUBLIC_URL + "/Assets/animation/cap.json"} background="rgba(0, 0, 0, 0)" speed="1" loop autoplay style={{ height: 250 }}>
          <Controls visible={false} />
        </Player>
      </div>
    </div>
  )
}

export default GlobalLoading