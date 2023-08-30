import { useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunction } from '@remix-run/node';


export let loader: LoaderFunction = async ({ params }) => {
  const entryId = params.id; // Fetch the entry ID from params
  const data = await fetch(`http://localhost:8000/api/goal?id=${entryId}`);
  return data.json();
};

export default function Goals() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="max-w-lg mx-auto p-4  ">
      <div className="flex justify-between items-center space-x-10" >
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      <Link to={`/NewEntry/${data.id}`} className="bg-blue-500 text-white rounded-md px-3 py-1 hover:bg-blue-600">
        New Entry
      </Link>
    </div>
  {data.learningEntry === null ? (
  <p className="text-center">No entries yet</p>
) : data.learningEntry.length === 0 ? (
  <p className="text-center">No entries yet</p>
) : data.learningEntry.length === 0 ? <p className="text-center">No entries yet</p> : 
      <ul  className="space-y-2">
        {data.learningEntry.map((entry: any) => 
        (
          <li key={entry.id} className="border p-2 rounded-md">
            <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold"> {entry.title}</h2>
         
            <Link to={`/EditEntry/${data.id}/${entry.id}`}  className="bg-green-500 text-white rounded-md px-2 py-1 hover:bg-green-600">
              Edit
            </Link>     
            </div>
            
            <p>{entry.description}</p>
            <p>Status: <span
              className={`text-sm ${
                entry.status ? 'text-blue-700' : 'text-yellow-400'
              }`}>
              {entry.status ? "Done": 'Not Done'}
            </span></p>
          </li>
        ))}
      </ul>} 
    </div>
  );
}
