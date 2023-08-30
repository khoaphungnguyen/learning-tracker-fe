import { useRouteLoaderData } from "@remix-run/react";


export default function Index() {
  const data = useRouteLoaderData("root");

  return (
   <div>
    {data.length > 0 ?" You have goals" : "You have no goals! Please add one"}
   </div>
  );
}
