/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { UnityContext } from "react-unity-webgl";
import { useLocation } from "react-router";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { config } from "./config";

export interface BettedUserType {
  name: string;
  betAmount: number;
  cashOut: number;
  cashouted: boolean;
  target: number;
  img: string;
  bot?: boolean;
}

export interface UserType {
  balance: number;
  userType: boolean;
  img: string;
  userName: string;
  f: {
    auto: boolean;
    betted: boolean;
    cashouted: boolean;
    betAmount: number;
    cashAmount: number;
    target: number;
  };
  s: {
    auto: boolean;
    betted: boolean;
    cashouted: boolean;
    betAmount: number;
    cashAmount: number;
    target: number;
  };
}

export interface PlayerType {
  auto: boolean;
  betted: boolean;
  cashouted: boolean;
  betAmount: number;
  cashAmount: number;
  target: number;
}

interface GameStatusType {
  currentNum: number;
  currentSecondNum: number;
  GameState: string;
  time: number;
}

interface GameBetLimit {
  maxBet: number;
  minBet: number;
}

declare interface GameHistory {
  _id: number;
  name: string;
  betAmount: number;
  cashoutAt: number;
  cashouted: boolean;
  date: number;
}

interface UserStatusType {
  fbetState: boolean;
  fbetted: boolean;
  sbetState: boolean;
  sbetted: boolean;
}

interface ContextDataType {
  myBets: GameHistory[];
  width: number;
  userInfo: UserType;
  fautoCashoutState: boolean;
  fautoCound: number;
  finState: boolean;
  fdeState: boolean;
  fsingle: boolean;
  fincrease: number;
  fdecrease: number;
  fsingleAmount: number;
  fdefaultBetAmount: number;
  sautoCashoutState: boolean;
  sautoCound: number;
  sincrease: number;
  sdecrease: number;
  ssingleAmount: number;
  sinState: boolean;
  sdeState: boolean;
  ssingle: boolean;
  sdefaultBetAmount: number;
  myUnityContext: UnityContext;
}

interface ContextType extends GameBetLimit, UserStatusType, GameStatusType {
  state: ContextDataType;
  unityState: boolean;
  unityLoading: boolean;
  currentProgress: number;
  bettedUsers: BettedUserType[];
  previousHand: BettedUserType[];
  history: number[];
  rechargeState: boolean;
  myUnityContext: UnityContext;
  currentTarget: number;
  setCurrentTarget(attrs: Partial<number>);
  update(attrs: Partial<ContextDataType>);
  getMyBets();
  updateUserBetState(attrs: Partial<UserStatusType>);
}

const unityContext = new UnityContext({
  loaderUrl: "unity/AirCrash.loader.js",
  dataUrl: "unity/AirCrash.data.unityweb",
  frameworkUrl: "unity/AirCrash.framework.js.unityweb",
  codeUrl: "unity/AirCrash.wasm.unityweb",
});

const init_state = {
  myBets: [],
  width: 1500,
  userInfo: {
    balance: 0,
    userType: false,
    img: "",
    userName: "",
    f: {
      auto: false,
      betted: false,
      cashouted: false,
      cashAmount: 0,
      betAmount: 20,
      target: 2,
    },
    s: {
      auto: false,
      betted: false,
      cashouted: false,
      cashAmount: 0,
      betAmount: 20,
      target: 2,
    },
  },
  fautoCashoutState: false,
  fautoCound: 0,
  finState: false,
  fdeState: false,
  fsingle: false,
  fincrease: 0,
  fdecrease: 0,
  fsingleAmount: 0,
  fdefaultBetAmount: 20,
  sautoCashoutState: false,
  sautoCound: 0,
  sincrease: 0,
  sdecrease: 0,
  ssingleAmount: 0,
  sinState: false,
  sdeState: false,
  ssingle: false,
  sdefaultBetAmount: 20,
  myUnityContext: unityContext,
} as ContextDataType;

const Context = React.createContext<ContextType>(null!);

// KULUMIKIZANA NDI HUGGING FACE SPACE ENGINE YANU YATSOPANO
const socket = io("https://moskonx-tidye-shooter-game-server.hf.space", {
  transports: ["websocket", "polling"],
  secure: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

// SERVER-SIDE CASHOUT CALL (SENIOR SECURITY UPDATE)
export const callCashOut = (at: number, index: "f" | "s") => {
  // Server yatsopano sidalira "endTarget" ya client, imatenga multiplier ya pa server yeniyeni
  socket.emit("cashOut"); 
};

let fIncreaseAmount = 0;
let fDecreaseAmount = 0;
let sIncreaseAmount = 0;
let sDecreaseAmount = 0;

let newState;
let newBetState;

export const Provider = ({ children }: any) => {
  const token = new URLSearchParams(useLocation().search).get("cert");
  const [state, setState] = React.useState<ContextDataType>(init_state);

  newState = state;
  const [unity, setUnity] = React.useState({
    unityState: false,
    unityLoading: false,
    currentProgress: 0,
  });

  const [gameState, setGameState] = React.useState({
    currentNum: 1.00,
    currentSecondNum: 10,
    GameState: "BET", // "BET" | "START" | "CRASHED"
    time: 10,
  });

  const [bettedUsers, setBettedUsers] = React.useState<BettedUserType[]>([]);
  const [previousHand, setPreviousHand] = React.useState<BettedUserType[]>([]);
  const [history, setHistory] = React.useState<number[]>([]);
  const [rechargeState, setRechargeState] = React.useState(false);
  const [currentTarget, setCurrentTarget] = React.useState(0);

  const [userBetState, setUserBetState] = React.useState<UserStatusType>({
    fbetState: false,
    fbetted: false,
    sbetState: false,
    sbetted: false,
  });

  newBetState = userBetState;

  const update = (attrs: Partial<ContextDataType>) => {
    setState({ ...state, ...attrs });
  };

  const updateUserBetState = (attrs: Partial<UserStatusType>) => {
    setUserBetState({ ...userBetState, ...attrs });
  };

  const [betLimit, setBetLimit] = React.useState<GameBetLimit>({
    maxBet: 2000,
    minBet: 1,
  });

  // UNITY CONNECTION INTERFACE
  React.useEffect(function () {
    unityContext.on("GameController", function (message) {
      if (message === "Ready") {
        setUnity({
          currentProgress: 100,
          unityLoading: true,
          unityState: true,
        });
      }
    });
    unityContext.on("progress", (progression) => {
      const currentProgress = progression * 100;
      if (progression === 1) {
        setUnity({ currentProgress, unityLoading: true, unityState: true });
      } else {
        setUnity({ currentProgress, unityLoading: false, unityState: false });
      }
    });
    return () => unityContext.removeAllEventListeners();
  }, []);

  // WEBSOCKET BROADCAST TRANSLATOR (BRIDGE LOGIC)
  React.useEffect(() => {
    socket.on("connect", () => {
      // Kutumiza verification data yomwe Crash Backend yatsopano ikufuna
      socket.emit("playerVerified", {
        user_id: token || "guest_" + Math.floor(Math.random() * 1000),
        username: state.userInfo.userName || "AviatorPlayer"
      });
      console.log("🚀 Mulumikizano wa Live Crash Socket Wapangika!");
    });

    // Kumasulira game ticking algorithm kupita ku Unity structure
    socket.on("gameTick", (data: { status: string; multiplier: number; time_remaining_sec: number }) => {
      let mappedGameState = "BET";
      if (data.status === "ACTIVE") mappedGameState = "START";     // Plane is flying
      if (data.status === "CRASHED") mappedGameState = "CRASHED";   // Plane exploded

      setGameState({
        currentNum: data.multiplier,
        currentSecondNum: data.time_remaining_sec,
        GameState: mappedGameState,
        time: data.time_remaining_sec
      });
    });

    // Kulandila kusintha kwa ma Phases (Waiting -> Flying -> Crashed)
    socket.on("phaseChanged", (data: any) => {
      if (data.status === "CRASHED") {
        // Kuwonjezera multiplier yomwe yaphulikayo mu mtndandanda wa ma history pamwamba
        setHistory((prev) => [data.crash_point, ...prev.slice(0, 15)]);
        
        // Kutseka ma bet indicators onse azimitsidwe
        setUserBetState({
          fbetState: false,
          fbetted: false,
          sbetState: false,
          sbetted: false,
        });
      }
    });

    // Kulandila ma Live Bets a anthu ena onse omwe akusewera nawo
    socket.on("liveBetsUpdate", (bets: any[]) => {
      const mappedUsers: BettedUserType[] = bets.map((b) => ({
        name: b.username,
        betAmount: b.betAmount,
        cashOut: b.cashOutMultiplier,
        cashouted: b.cashedOut,
        target: b.cashOutMultiplier,
        img: ""
      }));
      setBettedUsers(mappedUsers);
    });

    // Munthu akatenga ndalama zake pakati pakuuluka (Cashout confirmation broadcast)
    socket.on("playerCashedOut", (data: { username: string; multiplier: number; winAmount: number }) => {
      toast.success(`${data.username} cashed out at ${data.multiplier}x!`);
    });

    socket.on("cashOutConfirmed", (data: { multiplier: number; winAmount: number }) => {
      toast.success(`Successfully Cashed Out! Won: MWK ${data.winAmount}`);
    });

    socket.on("actionError", (data: { message: string }) => {
      toast.error(data.message);
    });

    socket.on("entryStatus", (data: any) => {
      console.log("Server verification status:", data.message);
    });

    return () => {
      socket.off("connect");
      socket.off("gameTick");
      socket.off("phaseChanged");
      socket.off("liveBetsUpdate");
      socket.off("playerCashedOut");
      socket.off("cashOutConfirmed");
      socket.off("actionError");
      socket.off("entryStatus");
    };
  }, [token, state.userInfo.userName]);

  // BET SUBMISSION TRIGGER (RUNS WHEN GAME STATE IS "BET" / WAITING)
  React.useEffect(() => {
    let attrs = state;
    let betStatus = userBetState;

    if (gameState.GameState === "BET") {
      // SLOT PARAMETER 1 (F)
      if (betStatus.fbetState) {
        if (attrs.userInfo.balance - state.userInfo.f.betAmount < 0) {
          toast.error("Your balance is not enough");
          betStatus.fbetState = false;
          betStatus.fbetted = false;
          setUserBetState({ ...betStatus });
          return;
        }

        attrs.userInfo.balance -= state.userInfo.f.betAmount;
        socket.emit("placeBet", { amount: state.userInfo.f.betAmount });
        
        betStatus.fbetState = false;
        betStatus.fbetted = true;
        setUserBetState({ ...betStatus });
      }

      // SLOT PARAMETER 2 (S)
      if (betStatus.sbetState) {
        if (attrs.userInfo.balance - state.userInfo.s.betAmount < 0) {
          toast.error("Your balance is not enough");
          betStatus.sbetState = false;
          betStatus.sbetted = false;
          setUserBetState({ ...betStatus });
          return;
        }

        attrs.userInfo.balance -= state.userInfo.s.betAmount;
        socket.emit("placeBet", { amount: state.userInfo.s.betAmount });
        
        betStatus.sbetState = false;
        betStatus.sbetted = true;
        setUserBetState({ ...betStatus });
      }
    }
  }, [gameState.GameState, userBetState.fbetState, userBetState.sbetState]);

  // DATA BACKUP FETCH FROM APIS
  const getMyBets = async () => {
    try {
      const response = await fetch(`${config.api}/my-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: state.userInfo.userName }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status) {
          update({ myBets: data.data as GameHistory[] });
        }
      }
    } catch (error) {
      console.log("Error getting local bets history:", error);
    }
  };

  useEffect(() => {
    if (gameState.GameState === "BET") getMyBets();
  }, [gameState.GameState]);

  return (
    <Context.Provider
      value={{
        state: state,
        ...betLimit,
        ...userBetState,
        ...unity,
        ...gameState,
        currentTarget,
        rechargeState,
        myUnityContext: unityContext,
        bettedUsers: [...bettedUsers],
        previousHand: [...previousHand],
        history: [...history],
        setCurrentTarget,
        update,
        getMyBets,
        updateUserBetState,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
