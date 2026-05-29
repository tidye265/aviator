/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import logo from "../assets/images/logo.svg";
import refound from "../assets/images/refund.png";
import "../index.scss";
import Context from "../context";

export default function Header() {
  const { state } = React.useContext(Context);

  const [howto, setHowto] = React.useState<'howto' | 'short' | 'more' | ''>("howto");
  const [, setFireSystem] = React.useState(false);
  
  // ✅ Ma State a Hamburger Menu ndi Chat Room
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [soundOn, setSoundOn] = React.useState(true);
  const [musicOn, setMusicOn] = React.useState(true);

  const Refound = async () => {
    setTimeout(() => {
      window.open("https://www.tidye265.com/#/", "_self");
    }, 1000);
  };

  return (
    <div className="header flex-none items-center" style={{ background: "#1b1c1d", borderBottom: "2px solid #2c2d30", padding: "10px 15px", position: "relative", zIndex: 100 }}>
      <div className="header-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        
        {/* ✅ LOGO SIDE */}
        <div className="logo-container" style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="logo" className="logo" style={{ height: "30px" }} />
        </div>

        {/* ✅ RIGHT CONTROLS SIDE */}
        <div className="second-block" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          
          {state.userInfo.userType && (
            <div className="center" onClick={Refound} style={{ cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", fontSize: "12px", fontWeight: "bold" }}>
              REBACK&nbsp;
              <button className="refound" style={{ background: "none", border: "none" }}>
                <img width={23} src={refound} alt="refound" />
              </button>
            </div>
          )}

          {/* ✅ HOW TO PLAY BADGE */}
          <button className="howto" onClick={() => setHowto("short")} style={{ background: "#e27900", border: "none", borderRadius: "15px", color: "#fff", padding: "4px 12px", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
            <div className="help-logo" style={{ width: "14px", height: "14px", borderRadius: "50%", border: "1.5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>?</div>
            <div className="help-msg">How to play ?</div>
          </button>

          {/* ✅ EXACT AVIATOR BALANCE (NO COIN - GREEN TEXT PILL) */}
          <div className="d-flex">
            <div className="balance" style={{ background: "rgba(0, 0, 0, 0.4)", border: "1px solid #4e5054", borderRadius: "20px", padding: "4px 14px", display: "flex", alignItems: "center" }}>
              <span className="amount" style={{ color: "#28a745", fontWeight: "900", fontFamily: "'Poppins', sans-serif", fontSize: "14px" }}>
                {Number(state.userInfo.balance).toFixed(2)}
              </span>
              <span className="currency" style={{ color: "#aeaeae", fontSize: "11px", fontWeight: "bold" }}>&nbsp;MWK</span>
            </div>
          </div>

          {/* ✅ CHAT ROOM TOGGLE BUTTON */}
          <button 
            className={`chat-toggle ${chatOpen ? "active" : ""}`} 
            onClick={() => setChatOpen(!chatOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill={chatOpen ? "#28a745" : "#aeaeae"} xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.2L4 17.2V4H20V16Z"/>
            </svg>
          </button>

          {/* ✅ HAMBURGER MENU BUTTON */}
          <button 
            className="hamburger-menu-btn" 
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: "4px", padding: "6px" }}
          >
            <span style={{ width: "22px", height: "2.5px", background: menuOpen ? "#e27900" : "#aeaeae", borderRadius: "2px", transition: "0.3s" }}></span>
            <span style={{ width: "22px", height: "2.5px", background: menuOpen ? "#e27900" : "#aeaeae", borderRadius: "2px", transition: "0.3s" }}></span>
            <span style={{ width: "22px", height: "2.5px", background: menuOpen ? "#e27900" : "#aeaeae", borderRadius: "2px", transition: "0.3s" }}></span>
          </button>

        </div>
      </div>

      {/* ✅ HAMBURGER DROPDOWN MENU (Exactly ngati pa Aviator) */}
      {menuOpen && (
        <div className="aviator-menu-dropdown" style={{ position: "absolute", top: "55px", right: "15px", background: "#1b1c1d", border: "1px solid #2c2d30", borderRadius: "8px", width: "220px", boxShadow: "0px 8px 16px rgba(0,0,0,0.6)", padding: "5px 0", animation: "fadeIn 0.2s ease-out" }}>
          
          <div className="menu-item" onClick={() => setSoundOn(!soundOn)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", color: "#fff", fontSize: "13px", cursor: "pointer", borderBottom: "1px solid #232426" }}>
            <span>Sound</span>
            <span style={{ color: soundOn ? "#28a745" : "#c60119", fontWeight: "bold" }}>{soundOn ? "ON" : "OFF"}</span>
          </div>

          <div className="menu-item" onClick={() => setMusicOn(!musicOn)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", color: "#fff", fontSize: "13px", cursor: "pointer", borderBottom: "1px solid #232426" }}>
            <span>Music</span>
            <span style={{ color: musicOn ? "#28a745" : "#c60119", fontWeight: "bold" }}>{musicOn ? "ON" : "OFF"}</span>
          </div>

          <div className="menu-item" style={{ padding: "12px 16px", color: "#fff", fontSize: "13px", cursor: "pointer", borderBottom: "1px solid #232426" }}>
            <span>Free Bets</span>
          </div>

          <div className="menu-item" onClick={() => setFireSystem(true)} style={{ padding: "12px 16px", color: "#fff", fontSize: "13px", cursor: "pointer", borderBottom: "1px solid #232426" }}>
            <span>Provably Fair settings</span>
          </div>

          <div className="menu-item" onClick={() => { setHowto("more"); setMenuOpen(false); }} style={{ padding: "12px 16px", color: "#fff", fontSize: "13px", cursor: "pointer" }}>
            <span>Game Rules</span>
          </div>

        </div>
      )}

      {/* ✅ HOW TO PLAY SHORT MODAL */}
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

      {/* ✅ DETAILED GAME RULES MODAL */}
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
                {/* [Zina mbali za rules zomwe muli nazo m'mbuyomu zasungidwa bwino mu file yanu] */}
                <p className="text-grey mt-20"> But remember, if you did not have time to Cash Out before the Lucky Plane flies away, your bet will be lost. Aviator is pure excitement! Risk and win. It’s all in your hands! </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
