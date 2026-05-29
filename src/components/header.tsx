import React from "react";
import logo from "../assets/images/logo.svg";
import refound from "../assets/images/refund.png";
import "../index.scss";
import Context from "../context";

export default function Header() {
  const { state } = React.useContext(Context);

  const [howto, setHowto] = React.useState<'howto' | 'short' | 'more' | ''>("howto");
  const [, setFireSystem] = React.useState(false);

  // ✅ New States for Hamburger Menu
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [sound, setSound] = React.useState(false);
  const [music, setMusic] = React.useState(false);
  const [animation, setAnimation] = React.useState(true);

  const Refound = async () => {
      setTimeout(() => {
        window.open("https://www.tidye265.com/#/", "_self");
      }, 1000)
  }

  // Toggle Switch Component for the Menu
  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <div 
      onClick={onChange}
      style={{
        width: '40px', height: '22px', borderRadius: '15px',
        background: checked ? '#28a745' : '#444',
        position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
      }}>
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%',
        background: '#ccc', position: 'absolute', top: '2px',
        left: checked ? '20px' : '2px', transition: 'left 0.3s'
      }} />
    </div>
  );

  return (
    <div className="header flex-none items-center" style={{ position: "relative" }}>
      <div className="header-container">
        <div className="logo-container">
          <img src={logo} alt="logo" className="logo"></img>
        </div>
        <div className="second-block" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {state.userInfo.userType &&
            <div className="center" onClick={Refound}>
            REBACK&nbsp;
            <button className="refound">
              <img width={23} src={refound} alt="refound"></img>
            </button>
          </div>
          }
          
          <button className="howto" onClick={() => setHowto("short")}>
            <div className="help-logo"></div>
            <div className="help-msg">How to play ?</div>
          </button>

          {/* ✅ UPDATED BALANCE & ICONS (EXACTLY AVIATOR) */}
          <div className="d-flex" style={{ alignItems: 'center', gap: '15px' }}>
            
            {/* Balance - No Coin, Green numbers, Grey MWK */}
            <div className="balance" style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <span className="amount" style={{ color: '#28a745', fontSize: '1.1rem' }}>
                {Number(state.userInfo.balance).toFixed(2)}
              </span>
              <span className="currency" style={{ color: '#9e9e9e', fontSize: '0.9rem', marginLeft: '4px' }}>MWK</span>
            </div>

            {/* Hamburger Menu & Chat Icons */}
            <div className="header-icons" style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#9e9e9e' }}>
              {/* Hamburger Menu Icon */}
              <div style={{ cursor: 'pointer', padding: '5px' }} onClick={() => setMenuOpen(!menuOpen)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </div>
              
              {/* Chat Icon */}
              <div style={{ cursor: 'pointer', padding: '5px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ✅ NEW HAMBURGER MENU DROPDOWN (EXACTLY LIKE SCREENSHOT) */}
      {menuOpen && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} onClick={() => setMenuOpen(false)}></div>
          <div className="hamburger-dropdown" style={{
            position: 'absolute', top: '65px', right: '10px', width: '300px',
            backgroundColor: '#1e1e1e', borderRadius: '12px', boxShadow: '0 8px 25px rgba(0,0,0,0.8)',
            zIndex: 999, display: 'flex', flexDirection: 'column', color: '#d1d1d1', border: '1px solid #333',
            fontFamily: "sans-serif"
          }}>
            {/* Header / Avatar Section */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '15px', borderBottom: '1px solid #2e2e2e' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#444', overflow: 'hidden', marginRight: '12px' }}>
                 <img src={state.userInfo.img || "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky"} alt="avatar" style={{width:'100%', height:'100%', objectFit: 'cover'}}/>
              </div>
              <div style={{ flex: 1 }}>
                 <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>{state.userInfo.userName || "265999XXX815"}</div>
              </div>
              <button style={{ background: 'transparent', border: '1px solid #555', color: '#bbb', borderRadius: '20px', padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer' }}>Change Avatar</button>
            </div>
            
            {/* Toggles Section */}
            <div style={{ padding: '10px 0', borderBottom: '1px solid #2e2e2e' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                     <span style={{ fontSize: '1.2rem' }}>🔈</span> <span>Sound</span>
                  </div>
                  <ToggleSwitch checked={sound} onChange={() => setSound(!sound)} />
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                     <span style={{ fontSize: '1.2rem' }}>🎵</span> <span>Music</span>
                  </div>
                  <ToggleSwitch checked={music} onChange={() => setMusic(!music)} />
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                     <span style={{ fontSize: '1.2rem' }}>🌿</span> <span>Animation</span>
                  </div>
                  <ToggleSwitch checked={animation} onChange={() => setAnimation(!animation)} />
               </div>
            </div>

            {/* Links Section */}
            <div style={{ padding: '10px 0' }}>
               <div style={{ padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '1.2rem' }}>⭐</span> <span>Free Bets</span>
               </div>
               <div style={{ padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🕒</span> <span>My Bet History</span>
               </div>
               <div style={{ padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '1.2rem' }}>💵</span> <span>Game Limits</span>
               </div>
               <div style={{ padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }} onClick={() => { setHowto("short"); setMenuOpen(false); }}>
                  <span style={{ fontSize: '1.2rem' }}>❓</span> <span>How To Play</span>
               </div>
               <div style={{ padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }} onClick={() => { setHowto("more"); setMenuOpen(false); }}>
                  <span style={{ fontSize: '1.2rem' }}>📜</span> <span>Game Rules</span>
               </div>
               <div style={{ padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🛡️</span> <span>Provably Fair Settings</span>
               </div>
            </div>
          </div>
        </>
      )}

      {/* ✅ 100% ORIGINAL MODALS (UNCHANGED) */}
      {howto === "short" && <div className="modal">
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
                <p>Look after the luck plane, Your win is bet multiply by a coefficient of lucky plane Cash out  before plane files away and money is yours! <br /></p>
              </div>
              <div className="step">
                <div className="bullet bullet-3">03</div>
                <p>Cash out before plane files away and money is yours!<br /></p>
              </div>
            </div>
            <div className="modal-footer m-f-bg">
              <button onClick={() => setHowto("more")}>detailed rules</button>
            </div>
          </div>
        </div>
      </div>}

      {howto === "more" && <div className="modal">
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
                    <span>bet</span>   before take-off
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
                    <span>Cash out</span>  before the plane disappears and wins X times more!
                  </div>
                </div>
              </div>
              <p className="text-grey mt-20"> But remember, if you did not have time to Cash Out before the Lucky Plane flies away, your bet will be lost. Aviator is pure excitement! Risk and win. It’s all in your hands! </p>
              <div className="rules-list">
                <div className="rules-list-title"> More details</div>
                <ul className="list-group">
                  <li className="list-group-item">The win multiplier starts at 1x and grows more and more as the Lucky Plane takes off.</li>
                  <li className="list-group-item">Your winnings are calculated at the multiplier at which you made a Cash Out, multiplied by your bet.</li>
                  <li className="list-group-item">Before the start of each round, our provably fair random number generator generates the multiplier at which the Lucky Plane will fly away. You can check the honesty of this generation by clicking on <span className="icon-fair"></span> icon, opposite the result, in the History tab</li>
                </ul>
              </div>
              <h6> GAME FUNCTIONS </h6>
              <div className="rules-list pt-2">
                <div className="rules-list-title"> Bet & Cash Out </div>
                <ul className="list-group">
                  <li className="list-group-item"> Select an amount and press the “Bet” button to make a bet. </li>
                  <li className="list-group-item"> You can make two bets simultaneously, by adding a second bet panel. To add a second bet panel, press the plus icon, which is located on the top right corner of the first bet panel. </li>
                  <li className="list-group-item"> Press the “Cash Out” button to cash out your winnings. Your win is your bet multiplied by the Cash Out multiplier. </li>
                  <li className="list-group-item"> Your bet is lost, if you didn’t cash out before the plane flies away. </li>
                </ul>
              </div>
              <div className="rules-list pt-2">
                <div className="rules-list-title"> Auto Play & Auto Cash Out </div>
                <ul className="list-group">
                  <li className="list-group-item"> Auto Play is activated from the “Auto” tab on the Bet Panel, by pressing the “Auto Play” button. </li>
                  <li className="list-group-item"> In the Auto Play Panel, the “Stop if cash decreases by” option stops Auto Play, if the balance is decreased by the selected amount. </li>
                  <li className="list-group-item"> In the Auto Play Panel, the “Stop if cash increases by” option stops Auto Play, if the balance is increased by the selected amount. </li>
                  <li className="list-group-item"> In the Auto Play Panel, the “Stop if single win exceeds” option stops Auto Play, if a single win exceeds the selected amount. </li>
                  <li className="list-group-item"> Auto Cash Out is available from the “Auto” tab on the Bet panel. After activation, your bet will be automatically cashed out when it reaches the multiplier entered </li>
                </ul>
              </div>
              <div className="rules-list pt-2">
                <div className="rules-list-title"> Live Bets & Statistics </div>
                <ul className="list-group">
                  <li className="list-group-item"> On the left side of the game interface (or under the Bet Panel on mobile), is located the Live Bets panel. Here you can see all bets that are being made in the current round. </li>
                  <li className="list-group-item"> In the “My Bets” panel you can see all of your bets and Cash Out information. </li>
                  <li className="list-group-item"> In the “Top” panel, game statistics are located. You can browse wins by amount, or Cash Out multiplier, and see the biggest round multipliers. </li>
                </ul>
              </div>
              <div className="rules-list pt-2">
                <div className="rules-list-title"> Free bets </div>
                <ul className="list-group">
                  <li className="list-group-item">{" You can check the status of Free Bets, from the Game Menu > Free Bets. Free Bets are awarded by the operator, or by the Rain Feature. "}</li>
                </ul>
              </div>
              <div className="rules-list pt-2">
                <div className="rules-list-title"> Randomisation </div>
                <ul className="list-group">
                  <li className="list-group-item"> The multiplier for each round is generated by a “Provably Fair” algorithm and is completely transparent, and 100% fair. <button className="under-a" onClick={() => setFireSystem(true)}> Read more about provably fair system </button> </li>
                  <li className="list-group-item"> {"You can check and modify the Provably Fair settings from the Game menu > Provably Fair settings."} </li>
                  <li className="list-group-item"> You can check the fairness of each round by pressing <span className="icon-fair"></span> icon, opposite the results in the “My Bets” or inside “Top” tabs. </li>
                </ul>
              </div>
              <div className="rules-list pt-2">
                <div className="rules-list-title"> Return to Player </div>
                <ul className="list-group">
                  <li className="list-group-item"> The overall theoretical return to player is 97%. This means that on average, for every 100 rounds, every 3 rounds end with the Lucky Plane flying away at the very beginning of the round. </li>
                </ul>
              </div>
              <div className="rules-list pt-2">
                <div className="rules-list-title"> Other </div>
                <ul className="list-group">
                  <li className="list-group-item"> If the internet connection is interrupted when the bet is active, the game will auto cash out with the current multiplier, and the winning amount will be added to your balance. </li>
                  <li className="list-group-item"> In the event of a malfunction of the gaming hardware/software, all affected game bets and payouts are rendered void and all affected bets are refunded. </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}
