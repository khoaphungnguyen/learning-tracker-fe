import { useLoaderData, Link ,useParams} from "@remix-run/react";
import type { LoaderFunction } from '@remix-run/node';


export let loader: LoaderFunction = async ({ params }) => {
  const goalID = params.id; // Fetch the entry ID from params
  const data = await fetch(`http://localhost:8000/api/entries?goalID=${goalID}`);
  return data.json();
};

export default function Goals() {
  const data = useLoaderData<typeof loader>();
  const {id} = useParams();
  console.log(data);
  return (
  <div className="max-w-fit mx-auto p-5">
    <div className="flex justify-between justify-items-end items-center space-x-10 mb-8">
      <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Learning Entries✨</h1>
      <Link
        to={`/NewEntry/${id}`}
        className="bg-indigo-500 text-white rounded-md px-3 py-1 hover:bg-indigo-600"
      >
        New Entry
      </Link>
    </div>
    {data === null ? (
      <p className="text-center">No entries yet</p>
    ) : (
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((entry: any) => (
          <li key={entry.id} className="border p-4 rounded-md shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{entry.title}</h2>
              <Link
                to={`/EditEntry/${id}/${entry.id}`}
                className="bg-blue-500 text-white rounded-md px-3 py-1 hover:bg-blue-600 transition duration-300"
              >
                Edit
              </Link>
            </div>
            <p className="text-gray-600">
          <span className="font-semibold">Info:</span> {entry.description}
        </p>
            <p className="text-gray-600">
              <span className="font-semibold">Due Date:</span>{" "}
              {new Date(entry.date).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <div className="flex justify-between items-center mt-3">
              <p className="text-gray-600">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`text-sm ${
                    entry.status ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {entry.status ? "Done" : "Not Done"}
                </span>
              </p>
              <button className="bg-green-500 text-white text-sm rounded-md px-3 py-1 hover:bg-green-600 transition duration-300">
                Mark as Done
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>);
}