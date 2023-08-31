import { NavLink, useParams, useRouteLoaderData} from '@remix-run/react';

export default function Sidebar() {
  const data = useRouteLoaderData("root");
  const { id } = useParams();

  // Check if id is defined before converting to an integer
  let idInt: number | null = null;
  if (id !== undefined) {
    idInt = parseInt(id, 10);
  }

  return (
    <nav className="bg-gray-800 text-white  h-screen flex flex-col">
      <div className="flex flex-col flex-grow overflow-y-auto">
        <ul className="space-y-2 m-2">
          {data.map((goal: any) => (
            <li key={goal.id}>
              <NavLink
                to={`/goals/${goal.id}`}
                className={`block py-3 px-4 rounded-lg hover:bg-gray-700 ${
                  goal.id === idInt ? "bg-blue-500" : "bg-gray-800"
                }`}
              >
                <div
                  className={`text-center ${
                    goal.id === idInt ? "text-white" : "text-gray-300"
                  }`}
                >
                  {goal.title}
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto my-3 mx-2">
        <NavLink
          to="/NewGoal"
          className="block text-center py-2 px-4 border bg-blue-500 rounded rounded-xl hover:bg-blue-700"
        >
          <span className="text-xl">+</span> Add a new Goal
        </NavLink>
      </div>
    </nav>
  );
}