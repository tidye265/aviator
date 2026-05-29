/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import "./crash.scss";
import Unity from "react-unity-webgl";
import propeller from "../../assets/images/propeller.png";
import Context from "../../context";

let currentFlag = 0;

export default function WebGLStarter() {
    // ✅ Tapopa isHighMultiplier
    const { GameState, currentNum, time, unityState, myUnityContext, setCurrentTarget, isHighMultiplier } = React.useContext(Context);
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
        let animationFrameId: number;
        
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
    }, [GameState, unityState, time, currentNum]);

    React.useEffect(() => {
        myUnityContext?.send("GameManager", "RequestToken", JSON.stringify({
            gameState: flag
        }));
        currentFlag = flag;
    }, [flag, myUnityContext]);

    const displayMultiplier = Number(target).toFixed(2);
    
    // ✅ Logic Yatsopano ya Aviator Colors (100% Replica)
    let backgroundGlowStyle: React.CSSProperties = {
        transition: "background 0.5s ease-in-out",
        borderRadius: "50%",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    };

    if (GameState !== "GAMEEND") {
        if (target >= 10.00 || isHighMultiplier) {
            // Pink Glow (10.00x+)
            backgroundGlowStyle.background = "radial-gradient(ellipse at center, rgba(199, 21, 133, 0.7) 0%, rgba(0, 0, 0, 0) 65%)";
        } else if (target >= 2.00) {
            // Purple Glow (2.00x - 9.99x)
            backgroundGlowStyle.background = "radial-gradient(ellipse at center, rgba(142, 36, 170, 0.7) 0%, rgba(0, 0, 0, 0) 65%)";
        } else {
            // Blue Glow (1.00x - 1.99x)
            backgroundGlowStyle.background = "radial-gradient(ellipse at center, rgba(33, 150, 243, 0.7) 0%, rgba(0, 0, 0, 0) 65%)";
        }
    }

    return (
        <div className="crash-container" ref={containerRef}>
            <div className="canvas">
                {canvasReady && <Unity unityContext={myUnityContext} matchWebGLToCanvasSize={true} />}
            </div>
            
            <div className="crash-text-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                {GameState === "BET" ? (
                    <div className="crashtext wait font-9">
                        <div className="rotate">
                            <img width={100} height={100} src={propeller} alt="propellar"></img>
                        </div>
                        <div className="waiting-font" style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "10px" }}>WAITING FOR NEXT ROUND</div>
                        <div className="waiting">
                            <div style={{ width: `${Math.max(0, (6000 - waiting)) * 100 / 6000}%` }}></div>
                        </div>
                    </div>
                ) : (
                    // ✅ Background imasintha pano ndipo Numbers ndi akulu 100% ngati original Aviator
                    <div className={`crashtext ${GameState === "GAMEEND" ? "red" : ""}`} style={backgroundGlowStyle}>
                        {GameState === "GAMEEND" && (
                            <div className="flew-away" style={{ 
                                fontSize: "clamp(2rem, 5vw, 4rem)", 
                                fontWeight: "800", 
                                color: "#ff4d4d", 
                                textTransform: "uppercase",
                                marginBottom: "-10px"
                            }}>
                                FLEW AWAY!
                            </div>
                        )}
                        <div style={{ 
                            color: GameState === "GAMEEND" ? "#ff4d4d" : "#ffffff", // Red pama game end, White panthawi ina yonse
                            fontWeight: "900", 
                            fontSize: "clamp(5rem, 15vw, 150px)", // Kukulitsa font size kuti ikhale yeniyeni (Massive text)
                            lineHeight: "1.2",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            textShadow: "0px 10px 30px rgba(0,0,0,0.6)", // Shadow kuti nambala iwoneke bwino mkatikati mwa glow
                            display: "flex",
                            alignItems: "baseline",
                            justifyContent: "center"
                        }}>
                            {displayMultiplier} 
                            <span style={{ 
                                fontSize: "0.55em", // 'x' ndiyochepa poyerekeza ndi manambala
                                marginLeft: "8px", 
                                fontWeight: "700" 
                            }}>x</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
