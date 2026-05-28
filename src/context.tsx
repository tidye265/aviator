/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from "react";
import { UnityContext } from "react-unity-webgl";
import { useLocation } from "react-router";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { config } from "./config";

/* =========================
   TYPES
========================= */

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

interface ContextType
  extends GameBetLimit,
    UserStatusType,
    GameStatusType {
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

  setCurrentTarget(attrs: Partial<number>): void;

  update(attrs: Partial<ContextDataType>): void;

  getMyBets(): void;

  updateUserBetState(attrs: Partial<UserStatusType>): void;
}

/* =========================
   UNITY
========================= */

const unityContext = new UnityContext({
  loaderUrl: "unity/AirCrash.loader.js",
  dataUrl: "unity/AirCrash.data.unityweb",
  frameworkUrl: "unity/AirCrash.framework.js.unityweb",
  codeUrl: "unity/AirCrash.wasm.unityweb",
});

/* =========================
   INITIAL STATE
========================= */

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

/* =========================
   CONTEXT
========================= */

const Context = React.createContext<ContextType>(null!);

/* =========================
   SOCKET
========================= */

const socket = io(
  "https://moskonx-tidye-shooter-game-server.hf.space",
  {
    transports: ["websocket"],

    secure: true,

    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  }
);

/* =========================
   CASHOUT
========================= */

export const callCashOut = (
  at: number,
  index: "f" | "s"
) => {
  socket.emit("cashOut", {
    type: index,
    endTarget: at,
  });
};

/* =========================
   GLOBAL MEMORY
========================= */

let newState: ContextDataType;
let newBetState: UserStatusType;

/* =========================
   PROVIDER
========================= */

export const Provider = ({ children }: any) => {
  const token = new URLSearchParams(
    useLocation().search
  ).get("cert");

  const [state, setState] =
    React.useState<ContextDataType>(init_state);

  newState = state;

  /* =========================
     UNITY STATE
  ========================= */

  const [unity, setUnity] = React.useState({
    unityState: false,
    unityLoading: false,
    currentProgress: 0,
  });

  /* =========================
     GAME STATE
  ========================= */

  const [gameState, setGameState] =
    React.useState<GameStatusType>({
      currentNum: 1.0,
      currentSecondNum: 0,
      GameState: "BET",
      time: 0,
    });

  const [bettedUsers, setBettedUsers] =
    React.useState<BettedUserType[]>([]);

  const [previousHand, setPreviousHand] =
    React.useState<BettedUserType[]>([]);

  const [history, setHistory] =
    React.useState<number[]>([]);

  const [rechargeState, setRechargeState] =
    React.useState(false);

  const [currentTarget, setCurrentTarget] =
    React.useState(0);

  /* =========================
     USER BET STATE
  ========================= */

  const [userBetState, setUserBetState] =
    React.useState<UserStatusType>({
      fbetState: false,
      fbetted: false,

      sbetState: false,
      sbetted: false,
    });

  newBetState = userBetState;

  /* =========================
     UPDATE FUNCTIONS
  ========================= */

  const update = (
    attrs: Partial<ContextDataType>
  ) => {
    setState((prev) => ({
      ...prev,
      ...attrs,
    }));
  };

  const updateUserBetState = (
    attrs: Partial<UserStatusType>
  ) => {
    setUserBetState((prev) => ({
      ...prev,
      ...attrs,
    }));
  };

  /* =========================
     BET LIMITS
  ========================= */

  const [betLimit, setBetLimit] =
    React.useState<GameBetLimit>({
      maxBet: 2000,
      minBet: 1,
    });

  /* =========================
     UNITY EVENTS
  ========================= */

  useEffect(() => {
    unityContext.on("progress", (progression) => {
      const progress = progression * 100;

      setUnity({
        currentProgress: progress,

        unityLoading: progression === 1,

        unityState: progression === 1,
      });
    });

    unityContext.on("loaded", () => {
      console.log("Unity Loaded Successfully");

      setUnity({
        currentProgress: 100,
        unityLoading: true,
        unityState: true,
      });
    });

    return () => {
      unityContext.removeAllEventListeners();
    };
  }, []);

  /* =========================
     SOCKET EVENTS
  ========================= */

  useEffect(() => {
    /* CONNECT */

    socket.on("connect", () => {
      console.log("Socket Connected");

      socket.emit("enterRoom", {
        token,
      });
    });

    /* GAME STATE */

    socket.on(
      "gameState",
      (incomingState: GameStatusType) => {
        setGameState({
          ...incomingState,
        });

        /* UNITY LIVE SYNC */

        try {
          unityContext.send(
            "GameController",
            "SetCurrentNum",
            Number(
              incomingState.currentNum
            ).toFixed(2)
          );

          unityContext.send(
            "GameController",
            "SetGameStatus",
            String(incomingState.GameState)
          );

          unityContext.send(
            "GameController",
            "SetTimer",
            String(incomingState.time)
          );
        } catch (e) {
          console.error(
            "Unity Bridge Error:",
            e
          );
        }
      }
    );

    /* BETTED USERS */

    socket.on(
      "bettedUserInfo",
      (users: BettedUserType[]) => {
        setBettedUsers(users);
      }
    );

    /* MY BET STATE */

    socket.on("myBetState", (user: UserType) => {
      setUserBetState((prev) => ({
        ...prev,

        fbetState: false,
        fbetted: user.f.betted,

        sbetState: false,
        sbetted: user.s.betted,
      }));
    });

    /* USER INFO */

    socket.on("myInfo", (user: UserType) => {
      setState((prev) => ({
        ...prev,

        userInfo: {
          ...prev.userInfo,

          balance: user.balance,
          userType: user.userType,
          userName: user.userName,
          img: user.img,

          f: {
            ...user.f,
          },

          s: {
            ...user.s,
          },
        },
      }));
    });

    /* HISTORY */

    socket.on("history", (historyList: number[]) => {
      setHistory([...historyList]);
    });

    /* PREVIOUS HAND */

    socket.on(
      "previousHand",
      (previousHandData: BettedUserType[]) => {
        setPreviousHand([
          ...previousHandData,
        ]);
      }
    );

    /* FINISH GAME */

    socket.on("finishGame", (user: UserType) => {
      setState((prev) => ({
        ...prev,

        userInfo: {
          ...user,

          f: {
            ...user.f,
            auto: prev.userInfo.f.auto,
            betAmount:
              prev.userInfo.f.betAmount,
          },

          s: {
            ...user.s,
            auto: prev.userInfo.s.auto,
            betAmount:
              prev.userInfo.s.betAmount,
          },
        },
      }));

      setUserBetState((prev) => ({
        ...prev,

        fbetted: false,
        sbetted: false,
      }));
    });

    /* BET LIMITS */

    socket.on(
      "getBetLimits",
      (betAmounts: {
        max: number;
        min: number;
      }) => {
        setBetLimit({
          maxBet: betAmounts.max,
          minBet: betAmounts.min,
        });
      }
    );

    /* RECHARGE */

    socket.on("recharge", () => {
      setRechargeState(true);
    });

    /* ERROR */

    socket.on("error", (data) => {
      setUserBetState((prev: any) => ({
        ...prev,
        [`${data.index}betted`]: false,
      }));

      toast.error(data.message);
    });

    /* SUCCESS */

    socket.on("success", (data) => {
      toast.success(data);
    });

    /* DISCONNECT */

    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
    });

    /* CLEANUP */

    return () => {
      socket.off("connect");
      socket.off("gameState");
      socket.off("bettedUserInfo");
      socket.off("myBetState");
      socket.off("myInfo");
      socket.off("history");
      socket.off("previousHand");
      socket.off("finishGame");
      socket.off("getBetLimits");
      socket.off("recharge");
      socket.off("error");
      socket.off("success");
      socket.off("disconnect");
    };
  }, []);

  /* =========================
     AUTO / MANUAL BET LOGIC
  ========================= */

  useEffect(() => {
    const attrs = {
      ...state,
    };

    const betStatus = {
      ...userBetState,
    };

    if (gameState.GameState === "BET") {
      /* FIRST BET */

      if (betStatus.fbetState) {
        const data = {
          betAmount:
            state.userInfo.f.betAmount,

          target: state.userInfo.f.target,

          type: "f",

          auto: state.userInfo.f.auto,
        };

        if (
          attrs.userInfo.balance -
            state.userInfo.f.betAmount <
          0
        ) {
          toast.error(
            "Your balance is not enough"
          );

          betStatus.fbetState = false;
          betStatus.fbetted = false;

          setUserBetState({
            ...betStatus,
          });

          return;
        }

        attrs.userInfo.balance -=
          state.userInfo.f.betAmount;

        socket.emit("playBet", data);

        betStatus.fbetState = false;
        betStatus.fbetted = true;

        setUserBetState({
          ...betStatus,
        });
      }

      /* SECOND BET */

      if (betStatus.sbetState) {
        const data = {
          betAmount:
            state.userInfo.s.betAmount,

          target: state.userInfo.s.target,

          type: "s",

          auto: state.userInfo.s.auto,
        };

        if (
          attrs.userInfo.balance -
            state.userInfo.s.betAmount <
          0
        ) {
          toast.error(
            "Your balance is not enough"
          );

          betStatus.sbetState = false;
          betStatus.sbetted = false;

          setUserBetState({
            ...betStatus,
          });

          return;
        }

        attrs.userInfo.balance -=
          state.userInfo.s.betAmount;

        socket.emit("playBet", data);

        betStatus.sbetState = false;
        betStatus.sbetted = true;

        setUserBetState({
          ...betStatus,
        });
      }
    }
  }, [
    gameState.GameState,

    userBetState.fbetState,
    userBetState.sbetState,
  ]);

  /* =========================
     GET MY BETS
  ========================= */

  const getMyBets = async () => {
    try {
      const response = await fetch(
        `${config.api}/my-info`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: state.userInfo.userName,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.status) {
          update({
            myBets:
              data.data as GameHistory[],
          });
        }
      }
    } catch (error) {
      console.log("getMyBets", error);
    }
  };

  useEffect(() => {
    if (gameState.GameState === "BET") {
      getMyBets();
    }
  }, [gameState.GameState]);

  /* =========================
     PROVIDER
  ========================= */

  return (
    <Context.Provider
      value={{
        state,

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
