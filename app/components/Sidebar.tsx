import { NavLink, useRouteLoaderData} from '@remix-run/react';
export default function Sidebar() {
  const data = useRouteLoaderData("root");
  return (
    <nav className="bg-gray-800 text-white h-screen w-64 p-4">
      <ul className="space-y-2">
        {data.map((goal: any) => (
          <li key={goal.id}>
            <NavLink to={`/goals/${goal.id}`} className="block py-2 px-4 rounded hover:bg-gray-700">
              {goal.title}
            </NavLink>
          </li>
        ))}
          <li>
            <NavLink to="/NewGoal" className="block  text-center py-2 px-4 border bg-blue-500  rounded rounded-xl hover:bg-blue-700">
              Add a new Goal
            </NavLink>
          </li>
      </ul>
    </nav>
  );
}