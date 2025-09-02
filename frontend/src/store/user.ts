import { create } from "zustand";

type User = {
    username: string,
    email: string,
    password: string
}

type UserStore = {
    currentUser: User | null;
    setUser: (currentUser: User) => void;
    createUser: (newUser: User) => Promise<{ success: boolean; message: string }>;
    loginUser: ({email, password}:{email: string, password: string}) => Promise<{ success: boolean, message: string }>;
    logoutUser: () => Promise<{ success: boolean; message: string }>;
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
    }
}))

// import { create } from "zustand";

// type User = {
//   username: string;
//   email: string;
//   password: string;
// };

// type UserStore = {
//   users: User[];
//   setUser: (users: User[]) => void;
//   createUser: (newUser: User) => Promise<{ success: boolean; message: string }>;
//   loginUser: ({
//     email,
//     password,
//   }: {
//     email: string;
//     password: string;
//   }) => Promise<{ success: boolean; message: string }>;
// };

// export const useUserStore = create<UserStore>((set) => ({
//   users: [],

//   setUser: (users: User[]) => set({ users }),

//   createUser: async (newUser) => {
//     if (!newUser.username || !newUser.email || !newUser.password) {
//       return { success: false, message: "Please fill in all fields." };
//     }

//     try {
//       const res = await fetch("/api/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newUser),
//       });

//       const data = await res.json();

//       set((state) => ({ users: [...state.users, data.data] }));
//       return { success: true, message: "User created successfully" };
//     } catch (error) {
//       console.log(error);
//       return { success: false, message: "Failed to create a user" };
//     }
//   },

//   loginUser: async ({ email, password }) => {
//     if (!email || !password) {
//       return { success: false, message: "Please fill in all fields." };
//     }

//     try {
//       const res = await fetch("/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       set({ users: data.data });
//       return {
//         success: true,
//         message: `${data.data.username} logged in successfully`,
//       };
//     } catch (error) {
//       console.log(error);
//       return { success: false, message: "Failed to login user" };
//     }
//   },
// }));