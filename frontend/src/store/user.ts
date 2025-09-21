import { create } from "zustand";
import { Move } from 'chess.js';

type User = {
    _id?: string,
    username: string,
    email: string,
    password: string,
}

type UserStore = {
    currentUser: User | null;
    setUser: (currentUser: User) => void;
    createUser: (newUser: User) => Promise<{ success: boolean; message: string }>;
    loginUser: ({email, password}:{email: string, password: string}) => Promise<{ success: boolean, message: string }>;
    logoutUser: () => Promise<{ success: boolean; message: string }>;
    joinGame: (roomId: string) => Promise<{ success: boolean; message: string }>;
    createGame: (roomId: string) => Promise<{ success: boolean; message: string }>;
    movePiece: (move: Move, roomId: string) => Promise<{ success: boolean, message: string, data: Move | null}>;
}

export const useUserStore = create<UserStore>((set) => ({
    currentUser: null,

    setUser: (user: User) => set({ currentUser: user }),

    createUser: async (newUser) => {
        if (!newUser.username || !newUser.email || !newUser.password) {
            return { success: false, message:"Please fill in all fields."}
        }

        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(newUser)
            });

            const data = await res.json();

            if (!res.ok) {
                return {success: false,  message: data.message || "Failed to create user"}; 
            }

            set(({currentUser: data.data}))
            console.log(data.data);
            return {success: true, message: "User created successfully"}

        } catch (error) {
            console.log(error)
            return {success: false, message: "Failed to create a user"}
        }
    },

    loginUser: async ({email, password}) => {
        if (!email || !password) {
            return {success: false, message: "Please fill in all fields."}
        }

        try {
            const res = await fetch("/api/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            });
            console.log("afterFetch");

            const data = await res.json();
            if(!res.ok) {
                return { success: false, message: data.message || "Failed to login user" };
            }
            set({ currentUser: data.data});
            return { success: true, message: `User logged in successfully` };

        } catch (error) {
            console.log(error);
            return {success: false, message: "Failed to login a user"};
        }
    },

    logoutUser: async () => {
        console.log("logoutUser called");
        
        try {
            const res = await fetch("/api/logout", {
                method: "POST", 
                credentials: "include",
            });
            console.log("afterFetch");

            const data = await res.json();
             if(!res.ok) {
                return { success: false, message: data.message + "Failed to logout user" };
            }

            set({ currentUser: null});
            console.log("User logged out successfully");
            return { success: true, message: "User logged out successfully" };
        } catch (error) {
            console.log(error);
            return {success: false, message: "Failed to logout a user"};
        }
    }, 
    
    joinGame: async (roomId) => {
        console.log("joinGame called with roomId:", roomId);
        const state = useUserStore.getState();
        const joiningPlayer = state.currentUser;


        if (!roomId) {
            console.log("No room ID provided");
            return { success: false, message:"Please provide a room ID."}
        }
        if (!joiningPlayer) {
            console.log("No user is currently logged in");
            return { success: false, message: "No user is currently logged in."}
        }

        try {
            const res: Response = await fetch("/api/games/join", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({ roomId, joiningPlayer: joiningPlayer._id }),
            });

            const data = await res.json();
            if (!res.ok) {
                return { success: false, message: data.message || "server Failed to join game" };
            }

            return { success: true, message: data.message || "Joined game successfully" };
        } catch (error) {
            console.log(error);
            return { success: false, message: "Failed to join game: " };
        }

    }, 
    
    createGame: async (roomId) => {
        console.log("createGame called with roomId:", roomId);
        const state = useUserStore.getState();
        const hostPlayer = state.currentUser;

        if (!roomId) {
            console.log("No room ID provided");
            return { success: false, message:"Please provide a room ID."}
        }

        if (!hostPlayer) {
          console.log("No user is currently logged in");
          return { success: false, message: "No user is currently logged in." };
        }

        try {
            const res: Response = await fetch('/api/games/create', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ roomId, hostPlayer: hostPlayer._id })
                }
            );

            const data = await res.json();
            if (!res.ok) {
                return { success: false, message: data.message || "server Failed to create game" };
            }

            return { success: true, message: data.message || "Created game successfully" };
        } catch (error) {
            console.log("error", error);
            return { success: false, message: "Failed to create game: " };
        }
    },

    movePiece: async (move, roomId) => {
        console.log("moving Piece");
        if (!move) {
            return { success: false, message: "No move provided", data: null }
        }

        try {
            const res: Response = await fetch('/api/games/updateMoves', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ move, roomId })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return {
                  success: false,
                  message: "Server: failed to make move: " + data.message,
                  data: null,
                };
            }

            return { success: true, message: "Successfully made a move: " + data.message, data: data.data }
        } catch (error) {
            return { success: false, message: "Server: failed to make move: " + error, data: null}
        }
    }
}))
