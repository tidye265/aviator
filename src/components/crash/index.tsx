/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import "./crash.scss";
import Unity from "react-unity-webgl";
import propeller from "../../assets/images/propeller.png"
import Context from "../../context";

let currentFlag = 0;

export default function WebGLStarter() {
    // ✅ Tapopa isHighMultiplier
    const { GameState, currentNum, time, unityState, myUnityContext, setCurrentTarget, isHighMultiplier } = React.useContext(Context)
    const [target, setTarget] = React.useState(1);
    const [waiting, setWaiting] = React.useState(0);
    const [flag, setFlag] = React.useState(1);
    const [canvasReady, setCanvasReady] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        let rafId: number;
        const id = requestAnimationFrame(() => {
            rafId = requestAnimationFrame(() => {
                setCanvasReady(true);
            });
        });
        return () => {
            cancelAnimationFrame(id);
            if (rafId !== undefined) cancelAnimationFrame(rafId);
        };
    }, []);

    React.useEffect(() => {
        let animationFrameId: number; // ✅ Change setInterval to requestAnimationFrame
        
        if (GameState === "PLAYING") {
            setFlag(2);
            const getCurrentTime = () => {
                let elapsedMs = Date.now() - time;
                // STRICT MATH SYNC: Smooth frame by frame
                let calculatedNum = Math.max(1.00, Math.exp(0.00006 * elapsedMs));
                
                if (calculatedNum > 2 && currentFlag === 2) setFlag(3);
                else if (calculatedNum > 10 && currentFlag === 3) setFlag(4);
                
                setTarget(calculatedNum);
                setCurrentTarget(calculatedNum);
                
                // Keep calling for next frame
                animationFrameId = requestAnimationFrame(getCurrentTime);
            }
            animationFrameId = requestAnimationFrame(getCurrentTime);
            
        } else if (GameState === "GAMEEND") {
            setFlag(5);
            // LOCK THE EXACT CRASH POINT FROM BACKEND
            setCurrentTarget(currentNum);
            setTarget(currentNum);
            
        } else if (GameState === "BET") {
            setFlag(1);
            setTarget(1);
            setCurrentTarget(1);

            const updateWaiting = () => {
                let elapsedMs = Date.now() - time;
                setWaiting(elapsedMs);
                animationFrameId = requestAnimationFrame(updateWaiting);
            }
            animationFrameId = requestAnimationFrame(updateWaiting);
        }
        
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [GameState, unityState, time, currentNum])

    React.useEffect(() => {
        myUnityContext?.send("GameManager", "RequestToken", JSON.stringify({
            gameState: flag
        }));
        currentFlag = flag;
    }, [flag, myUnityContext]);

    const displayMultiplier = Number(target).toFixed(2);
    
    // ✅ Logic Yatsopano ya Aviator Colors
    let colorStyle = {};
    if (GameState !== "GAMEEND") {
        if (isHighMultiplier || target >= 10.00) {
            colorStyle = { color: "#c017b4", textShadow: "0 0 10px rgba(192, 23, 180, 0.5)" }; // Aviator Pink / Magenta
        } else if (target >= 2.00) {
            colorStyle = { color: "#8a2be2" }; // Purple
        } else {
            colorStyle = { color: "#3498db" }; // Normal Blue
        }
    }

    return (
        <div className="crash-container" ref={containerRef}>
            <div className="canvas">
                {canvasReady && <Unity unityContext={myUnityContext} matchWebGLToCanvasSize={true} />}
            </div>
            <div className="crash-text-container">
                {GameState === "BET" ? (
                    <div className={`crashtext wait font-9`} >
                        <div className="rotate">
                            <img width={100} height={100} src={propeller} alt="propellar"></img>
                        </div>
                        <div className="waiting-font">WAITING FOR NEXT ROUND</div>
                        <div className="waiting">
                            <div style={{ width: `${Math.max(0, (6000 - waiting)) * 100 / 6000}%` }}></div>
                        </div>
                    </div>
                ) : (
                    // ✅ Map class amasintha malingana ndi event ya isHighMultiplier
                    <div className={`crashtext ${GameState === "GAMEEND" ? "red" : ""}`} style={colorStyle}>
                        {GameState === "GAMEEND" && <div className="flew-away">FLEW AWAY!</div>}
                        <div>
                            {displayMultiplier} <span className="font-[900]">x</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
