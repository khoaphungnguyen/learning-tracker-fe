import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";

export const loader = async () => {
  const data = await fetch("http://localhost:8000/api/entries");
  return data.json();
};

export default function Index() {

  const data = useLoaderData<typeof loader>();


  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold mb-4">Learning Entries</h1>
      <Link to="/NewEntry" className="bg-blue-500 text-white rounded-md px-3 py-1 hover:bg-blue-600">
        New Entry
      </Link>
    </div>
   
      <ul  className="space-y-2">
        {data.map((entry: any) => 
        (
          <li key={entry.id} className="border p-2 rounded-md">
            <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold"> {entry.title}</h2>
            <Link to={`/EditEntry?id=${entry.id}`}  className="bg-green-500 text-white rounded-md px-2 py-1 hover:bg-green-600">
              Edit
            </Link>
            </div>
         
            <p>{entry.description}</p>
            <p
              className={`text-sm ${
                entry.status ? 'text-blue-700' : 'text-red-700'
              }`}
            >
              Status: {entry.status ? 'True' : 'False'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
