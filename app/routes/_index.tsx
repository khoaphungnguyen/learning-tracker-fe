import { useRouteLoaderData } from "@remix-run/react";


export default function Index() {
  const data = useRouteLoaderData("root");

  return (
   <div>
    {data.length > 0 
    ?
    <div className="text-xl font-semibold text-center m-10">
    You have <span className="text-blue-600">{data.length}</span> goals
    </div>
    :"You have no goals! Please add one"}
   </div>
  );
}
