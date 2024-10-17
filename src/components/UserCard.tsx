import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

export const UserCard = () => {
  const user = useContext(AuthContext);
  const [firstName, lastName] = user?.displayName?.split(" ") ?? ["", ""];

  return (
    <div className="rounded-3xl  overflow-hidden  h-[12rem] text-white p-4 flex flex-col  transition-all">
      <div className="font-light mb-2">Welcome back,</div>
      <div className="flex items-center gap-1">
        <img
          src={user?.photoURL ?? ""}
          className="w-8 h-8 rounded-full inline-block mr-2"
          alt="user"
        />
        <div className="text-3xl font-semibold">{firstName}</div>
      </div>
      <div className="text-3xl">{lastName}</div>
    </div>
  );
};
