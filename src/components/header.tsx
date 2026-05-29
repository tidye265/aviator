import React from "react";
import logo from "../assets/images/logo.svg";
import refound from "../assets/images/refund.png";
import "../index.scss";
import Context from "../context";

export default function Header() {
  const { state } = React.useContext(Context);

  const [howto, setHowto] = React.useState<'howto' | 'short' | 'more' | ''>("howto");
  const [, setFireSystem] = React.useState(false);
  
  // ✅ Ma State atsopano a Menu, Chat ndi Toggles monga Aviator enieni
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [soundOn, setSoundOn] = React.useState(true);
  const [musicOn, setMusicOn] = React.useState(false);
  const [animationOn, setAnimationOn] = React.useState(true);

  const Refound = async () => {
    setTimeout(() => {
      window.open("https://www.tidye265.com/#/", "_self");
    }, 1000);
  };

  return (
    <div className="header flex-none items-center" style={{ position: "relative", zIndex: 1000 }}>
      {/* ✅ Sleek Connecting State (Black Grey Background + Small Connecting Text) */}
      {(!state?.userInfo || state?.loading) && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#141414",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          borderRadius: "inherit"
        }}>
          <div style={{ color: "#aeaeae", fontSize: "11px", letterSpacing: "1px", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ display: "inline-block", width: "6px", height: "6px", backgroundColor: "#e51c24", borderRadius: "50%", animation: "pulse 1.2s infinite" }}></span>
            Connecting...
          </div>
        </div>
      )}

      <div className="header-container">
        <div className="logo-container">
          <img src={logo} alt="logo" className="logo" />
        </div>
        
        <div className="second-block" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {state?.userInfo?.userType && (
            <div className="center" onClick={Refound}>
              REBACK&nbsp;
              <button className="refound">
                <img width={23} src={refound} alt="refound" />
              </button>
            </div>
          )}
          
          <button className="howto" onClick={() => setHowto("short")}>
            <div className="help-logo"></div>
            <div className="help-msg">How to play ?</div>
          </button>
          
          {/* ✅ Balance Layout Yapamwamba (Exactly Aviator: No Coin, Pill-shape, clear view) */}
          <div className="d-flex">
            <div className="balance" style={{ 
              backgroundColor: "#2c3e50", 
              border: "2px solid #4a5c6d", 
              borderRadius: "20px", 
              padding: "4px 14px", 
              display: "flex", 
              alignItems: "center",
              justifyContent: "center"
            }}>
              <span className="amount" style={{ color: "#28a745", fontWeight: "bold", fontSize: "14px" }}>
                {Number(state?.userInfo?.balance || 0).toFixed(2)}
              </span>
              <span className="currency" style={{ color: "#ffffff", fontSize: "11px", fontWeight: "600", marginLeft: "4px" }}>
                MWK
              </span>
            </div>
          </div>

          {/* ✅ Chat Room Button */}
          <button 
            onClick={() => setChatOpen(!chatOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill={chatOpen ? "#e51c24" : "#aeaeae"} transition="all 0.2s">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
            </svg>
          </button>

          {/* ✅ Hamburger Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={menuOpen ? "#e51c24" : "#ffffff"}>
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ✅ Floating Hamburger Dropdown Menu (Aviator Style Settings) */}
      {menuOpen && (
        <div style={{
          position: "absolute",
          top: "50px",
          right: "10px",
          backgroundColor: "#1b1c1e",
          border: "1px solid #2c2d30",
          borderRadius: "8px",
          width: "230px",
          boxShadow: "0px 8px 24px rgba(0,0,0,0.6)",
          zIndex: 3000,
          padding: "6px 0",
          fontFamily: "sans-serif"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", color: "#aeaeae", borderBottom: "1px solid #2c2d30", fontSize: "12px" }}>
            <span>Sound</span>
            <input type="checkbox" checked={soundOn} onChange={() => setSoundOn(!soundOn)} style={{ cursor: "pointer" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", color: "#aeaeae", borderBottom: "1px solid #2c2d30", fontSize: "12px" }}>
            <span>Music</span>
            <input type="checkbox" checked={musicOn} onChange={() => setMusicOn(!musicOn)} style={{ cursor: "pointer" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", color: "#aeaeae", borderBottom: "1px solid #2c2d30", fontSize: "12px" }}>
            <span>Animation</span>
            <input type="checkbox" checked={animationOn} onChange={() => setAnimationOn(!animationOn)} style={{ cursor: "pointer" }} />
          </div>
          <div onClick={() => { setHowto("more"); setMenuOpen(false); }} style={{ padding: "12px 16px", color: "#ffffff", fontSize: "13px", cursor: "pointer", borderBottom: "1px solid #2c2d30" }}>
            📜 Game Rules
          </div>
          <div style={{ padding: "12px 16px", color: "#ffffff", fontSize: "13px", cursor: "pointer", borderBottom: "1px solid #2c2d30" }}>
            🥇 Free Bets
          </div>
          <div style={{ padding: "12px 16px", color: "#ffffff", fontSize: "13px", cursor: "pointer" }}>
            🛡️ Provably Fair Settings
          </div>
        </div>
      )}

      {/* ✅ Floating Chat Drawer overlay placeholder */}
      {chatOpen && (
        <div style={{
          position: "absolute",
          top: "50px",
          right: "50px",
          backgroundColor: "#141516",
          border: "1px solid #2c2d30",
          borderRadius: "8px",
          width: "280px",
          height: "350px",
          boxShadow: "0px 8px 24px rgba(0,0,0,0.7)",
          zIndex: 2999,
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ padding: "10px", borderBottom: "1px solid #2c2d30", color: "#fff", fontSize: "13px", fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
            <span>💬 Chat Room</span>
            <span style={{ cursor: "pointer", color: "#aeaeae" }} onClick={() => setChatOpen(false)}>×</span>
          </div>
          <div style={{ flex: 1, padding: "10px", overflowY: "auto", color: "#9c9c9c", fontSize: "12px" }}>
            Welcome to the Live Chat Room!
          </div>
          <div style={{ padding: "8px", borderTop: "1px solid #2c2d30" }}>
            <input type="text" placeholder="Send a message..." style={{ width: "100%", background: "#1f2022", border: "none", padding: "6px 10px", borderRadius: "4px", color: "#fff", fontSize: "12px" }} />
          </div>
        </div>
      )}

      {/* ✅ Model ya 'How to Play' (Short Rules) */}
      {howto === "short" && (
        <div className="modal">
          <div className="back" onClick={() => setHowto("howto")}></div>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header modal-bg text-uppercase">
                <span>How to Play?</span>
                <button onClick={() => setHowto('')} className="close modal-close">
                  <span>×</span>
                </button>
              </div>
              <div className="modal-body m-body-bg">
                <div className="youtube">
                  <div className="embed-responsive">
                    <iframe title="tutorial" className="embed-responsive-item"/>
                  </div>
                </div>
                <div className="step">
                  <div className="bullet">01</div>
                  <p>Make a bet, or even two at same time and wait for the round to start.<br /></p>
                </div>
                <div className="step">
                  <div className="bullet bullet-2">02</div>
                  <p>Look after the luck plane, Your win is bet multiply by a coefficient of lucky plane. Cash out before plane flies away and money is yours! <br /></p>
                </div>
                <div className="step">
                  <div className="bullet bullet-3">03</div>
                  <p>Cash out before plane flies away and money is yours!<br /></p>
                </div>
              </div>
              <div className="modal-footer m-f-bg">
                <button onClick={() => setHowto("more")}>detailed rules</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Model ya 'Detailed Rules' */}
      {howto === "more" && (
        <div className="modal">
          <div className="back" onClick={() => setHowto("howto")}></div>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header ">
                <span className="text-uppercase">Game rules</span>
                <button onClick={() => setHowto("howto")} className="close">
                  <span>×</span>
                </button>
              </div>
              <div className="modal-body p-1r">
                <p className="text-gray">
                  Aviator is a new generation of iGaming entertainment. You can win many times more, in seconds! Aviator is built on a provably fair system, which is currently the only real guarantee of honesty in the gambling industry.
                </p>
                <button className="under-a" onClick={() => setFireSystem(true)}> Read more about provably fair system </button>
                <h6 className="title-2"> How to play </h6>
                <div className="youtube w-99">
                  <div className="embed-responsive">
                    <iframe title="tutorial" className="embed-responsive-item" src="https://www.youtube.com/embed/PZejs3XDCSY?playsinline=1" />
                  </div>
                </div>
                <h6 className="pt-5"> Aviator is as easy to play as 1-2-3: </h6>
                <div className="steps-container">
                  <div className="step-item">
                    <h3>01</h3>
                    <div className="step-bg-img"></div>
                    <div className="step-text pt-2">
                      <span>bet</span> before take-off
                    </div>
                  </div>
                  <div className="step-item">
                    <h3>02</h3>
                    <div className="step-bg-img-2"></div>
                    <div className="step-text">
                      <span>Watch</span> as your Lucky Plane takes off and your winnings increase.
                    </div>
                  </div>
                  <div className="step-item">
                    <h3>03</h3>
                    <div className="step-bg-img-3"></div>
                    <div className="step-text">
                      <span>Cash out</span> before the plane disappears and wins X times more!
                    </div>
                  </div>
                </div>
                <p className="text-grey mt-20"> But remember, if you did not have time to Cash Out before the Lucky Plane flies away, your bet will be lost. Aviator is pure excitement! Risk and win. It’s all in your hands! </p>
                <div className="rules-list">
                  <div className="rules-list-title"> More details</div>
                  <ul className="list-group">
                    <li className="list-group-item">The win multiplier starts at 1x and grows more and more as the Lucky Plane takes off.</li>
                    <li className="list-group-item">Your winnings are calculated at the multiplier at which you made a Cash Out, multiplied by your bet.</li>
                    <li className="list-group-item">Before the start of each round, our provably fair random number generator generates the multiplier at which the Lucky Plane will fly away.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
