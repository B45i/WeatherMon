import { UserCard } from "../components/UserCard";

export const Dashboard = () => {
  return (
    <div className="grow w-full h-full relative auto-rows-[12rem] grid grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-4">
      <UserCard />
    </div>
  );
};
