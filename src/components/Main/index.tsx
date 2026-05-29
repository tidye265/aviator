/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import "./crash.scss";
import Unity from "react-unity-webgl";
import propeller from "../../assets/images/propeller.png"
import Context from "../../context";

let currentFlag = 0;

export default function WebGLStarter() {
    const { GameState, currentNum, time, unityState, myUnityContext, setCurrentTarget } = React.useContext(Context)
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
        let myInterval;
        if (GameState === "PLAYING") {
            setFlag(2);
            const getCurrentTime = () => {
                let elapsedMs = Date.now() - time;
                // STRICT MATH SYNC: Fomula yofanana ndendende ndi ya backend!
                let calculatedNum = Math.max(1.00, Math.exp(0.00006 * elapsedMs));
                
                if (calculatedNum > 2 && currentFlag === 2) setFlag(3);
                else if (calculatedNum > 10 && currentFlag === 3) setFlag(4);
                
                setTarget(calculatedNum);
                setCurrentTarget(calculatedNum);
            }
            myInterval = setInterval(getCurrentTime, 20);
            
        } else if (GameState === "GAMEEND") {
            setFlag(5);
            // LOCK THE EXACT CRASH POINT FROM BACKEND (Popanda kupunguza -0.01)
            setCurrentTarget(currentNum);
            setTarget(currentNum);
            
        } else if (GameState === "BET") {
            setFlag(1);
            setTarget(1);
            setCurrentTarget(1);

            myInterval = setInterval(() => {
                // Kuwerengera nthawi yolondola yomwe yadutsa (Syncs directly with backend)
                let elapsedMs = Date.now() - time;
                setWaiting(elapsedMs);
            }, 20);
        }
        return () => clearInterval(myInterval);
    }, [GameState, unityState, time, currentNum])

    React.useEffect(() => {
        myUnityContext?.send("GameManager", "RequestToken", JSON.stringify({
            gameState: flag
        }));
        currentFlag = flag;
    }, [flag, myUnityContext]);

    // Onetsetsani kuti nambala yomwe ikuwoneka ndi yogwirizana 100% 
    const displayMultiplier = Number(target).toFixed(2);

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
                            {/* PROGRESS BAR FIXED: Ikugwiritsa ntchito 6000ms */}
                            <div style={{ width: `${Math.max(0, (6000 - waiting)) * 100 / 6000}%` }}></div>
                        </div>
                    </div>
                ) : (
                    <div className={`crashtext ${GameState === "GAMEEND" && "red"}`}>
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
