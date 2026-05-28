// index.tsx (WebGLStarter component)
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import "./crash.scss";
import Unity from "react-unity-webgl";
import propeller from "../../assets/images/propeller.png";
import Context from "../../context";

export default function WebGLStarter() {
    const { GameState, currentNum, time, myUnityContext, unityState } = React.useContext(Context);
    const [canvasReady, setCanvasReady] = React.useState(false);

    // FIX: Remove all local setInterval math calculations (They conflict with server)

    React.useEffect(() => {
        // Simple delay for canvas rendering
        const id = requestAnimationFrame(() => setCanvasReady(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <div className="crash-container">
            <div className="canvas">
                {canvasReady && unityState && <Unity unityContext={myUnityContext} matchWebGLToCanvasSize={true} />}
            </div>
            
            <div className="crash-text-container">
                {GameState === "BET" ? (
                    <div className="crashtext wait">
                        <div className="rotate"><img width={100} src={propeller} alt="propellar"></img></div>
                        <div className="waiting-font">WAITING FOR NEXT ROUND</div>
                        {/* Progress Bar fixed to use timeRemaining from server */}
                        <div className="waiting">
                            <div style={{ width: `${(time / 10000) * 100}%` }}></div>
                        </div>
                    </div>
                ) : (
                    <div className={`crashtext ${GameState === "GAMEEND" ? "red" : ""}`}>
                        {GameState === "GAMEEND" && <div className="flew-away">FLEW AWAY!</div>}
                        {/* Display the value directly from Server */}
                        <div>{currentNum.toFixed(2)} <span className="font-[900]">x</span></div>
                    </div>
                )}
            </div>
        </div>
    );
};
