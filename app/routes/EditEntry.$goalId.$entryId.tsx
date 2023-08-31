import type { LoaderFunction,ActionArgs } from '@remix-run/node';
import { Form, useLoaderData } from "@remix-run/react";
import { json , redirect} from "@remix-run/node"; 

export let loader: LoaderFunction = async ({ params }) => {
  const goalId = params.goalId; // Fetch the goal ID from params
  const entryId = params.entryId; // Fetch the entry ID from params
  const response = await fetch(`http://localhost:8000/api/entries?goalID=${goalId}&entryID=${entryId}`);
  const entry = await response.json();
  return entry;
};

export const action = async ({ request,params }: ActionArgs) => {
  const formData = await request.formData();
  const goalId = params.goalId; // Fetch the goal ID from params
  const entryId = params.entryId; // Fetch the entry ID from params
  const title = formData.get("title");
  const description = formData.get("description");
  const completionDate = new Date(`${formData.get("completionDate")}T00:00:00Z`).toISOString();
  
  console.log(title,description,completionDate)
  const method = request.method;
  console.log(method);
  if (method === 'DELETE') {
    const result = await fetch(`http://localhost:8000/api/entries?goalID=${goalId}&entryID=${entryId}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          id: entryId,
      })
  });
  if (!result.ok) {
    return json({ error: "Something went wrong" }, { status: 500 });
  }
  return redirect(`/goals/${goalId}`);
  } else if (method === 'PUT') {
    const result = await fetch(`http://localhost:8000/api/entries?goalID=${goalId}&entryID=${entryId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: title,
        description: description,
        date: completionDate
    })
    });
   
    if (!result.ok) {
        return json({ error: "Something went wrong" }, { status: 500 });
    }
    console.log(result);
    return redirect(`/goals/${goalId}`);
}
};

export default function EditEntry() {
  const data = useLoaderData<typeof loader>();

  const formattedDate = new Date(data.date).toISOString().split('T')[0];
  console.log(data);

  return (
    <div className="max-w-4xl p-8 bg-white rounded-md shadow-md m-5">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Edit Learning Entry
      </h1>
      <Form
        className="space-y-4"
        method="post"    
      >
        <div>
          <label className="block font-semibold text-gray-600" htmlFor="title">
            Title
          </label>
          <input
            className="w-full border rounded-md px-3 py-2"
            type="text"
            id="title"
            name="title"
            defaultValue={data.title}
            placeholder="Enter title"
            required
          />
        </div>
        <div>
          <label
            className="block font-semibold text-gray-600"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="w-full border rounded-md px-3 py-2"
            id="description"
            name="description"
            defaultValue={data.description}
            rows={4}
            placeholder="Enter description"
            required
          />
        </div>
        <div>
          <label
            className="block font-semibold text-gray-600"
            htmlFor="completionDate"
          >
            Completion Date
          </label>
          <input
            className="w-full border rounded-md px-3 py-2"
            type="date"
            id="completionDate"
            name="completionDate"
            defaultValue={formattedDate} // Use the appropriate field for the date
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
            type="submit"
            formMethod="delete"
          >
            Delete
          </button>

          <button
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
            type="submit"
            formMethod="put"
          >
            Update
          </button>
        </div>
      </Form>
    </div>
  );
}
