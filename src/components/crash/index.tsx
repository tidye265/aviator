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
    
    // ✅ Gradients Yatsopano Ikhale Kuseli (Background Glow)
    let glowBackground = "none";
    if (GameState !== "GAMEEND" && GameState !== "BET") {
        if (target >= 10.00 || isHighMultiplier) {
            // Pink Glow (10.00x+)
            glowBackground = "radial-gradient(circle, rgba(199, 21, 133, 0.45) 0%, transparent 60%)";
        } else if (target >= 2.00) {
            // Purple Glow (2.00x - 9.99x)
            glowBackground = "radial-gradient(circle, rgba(142, 36, 170, 0.45) 0%, transparent 60%)";
        } else {
            // Blue Glow (1.00x - 1.99x)
            glowBackground = "radial-gradient(circle, rgba(33, 150, 243, 0.45) 0%, transparent 60%)";
        }
    }

    return (
        <div className="crash-container" ref={containerRef} style={{ position: "relative", overflow: "hidden" }}>
            
            {/* ✅ Gradient Ikhale panokha ndipo ibwere pansi (Kuseli kwa Ndege) */}
            <div className="background-glow" style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                background: glowBackground,
                transition: "background 0.5s ease-in-out",
                zIndex: 0,
                pointerEvents: "none"
            }}></div>

            {/* ✅ Ndege Ikhale pamwamba pa gradient (zIndex: 1) */}
            <div className="canvas" style={{ position: "relative", zIndex: 1 }}>
                {canvasReady && <Unity unityContext={myUnityContext} matchWebGLToCanvasSize={true} />}
            </div>
            
            {/* ✅ Text iwoneke bwino mkatikati */}
            <div className="crash-text-container" style={{ 
                position: "absolute", 
                top: 0, left: 0, right: 0, bottom: 0, 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                zIndex: 2, 
                pointerEvents: "none" 
            }}>
                {GameState === "BET" ? (
                    <div className="crashtext wait font-9" style={{ pointerEvents: "auto" }}>
                        <div className="rotate">
                            <img width={100} height={100} src={propeller} alt="propellar"></img>
                        </div>
                        <div className="waiting-font" style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "10px" }}>WAITING FOR NEXT ROUND</div>
                        <div className="waiting">
                            <div style={{ width: `${Math.max(0, (6000 - waiting)) * 100 / 6000}%` }}></div>
                        </div>
                    </div>
                ) : (
                    <div className={`crashtext ${GameState === "GAMEEND" ? "red" : ""}`} style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        {/* ✅ FLEW AWAY ndi White! */}
                        {GameState === "GAMEEND" && (
                            <div className="flew-away" style={{ 
                                fontSize: "clamp(1.8rem, 4vw, 3rem)", 
                                fontWeight: "900", 
                                color: "#ffffff", // White ndendende
                                fontFamily: "'Arial Black', Impact, sans-serif",
                                textTransform: "uppercase",
                                marginBottom: "0px",
                                textShadow: "0px 4px 10px rgba(0,0,0,0.5)"
                            }}>
                                FLEW AWAY!
                            </div>
                        )}
                        
                        {/* ✅ Manambala ndi Red pa Game End, White popanda Game End. (Ndipo ndi Onenepa) */}
                        <div style={{ 
                            color: GameState === "GAMEEND" ? "#e71d36" : "#ffffff", // Red yowoneka bwino monga mchithunzi pa GAMEEND
                            fontWeight: "900", 
                            fontSize: "clamp(4.5rem, 15vw, 120px)", // Onenepa ndipo okwanira bwino, osati atali
                            lineHeight: "1.1",
                            fontFamily: "'Arial Black', 'Helvetica Black', Impact, system-ui, sans-serif", // Font yonenepa ngati original
                            textShadow: "0px 6px 20px rgba(0,0,0,0.6)", // Shadow kuti manambala aimirire
                            display: "flex",
                            alignItems: "baseline",
                            justifyContent: "center"
                        }}>
                            {displayMultiplier} 
                            <span style={{ 
                                fontSize: "0.50em", // 'x' kukhala yochepa
                                marginLeft: "8px", 
                                fontWeight: "900" 
                            }}>x</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
