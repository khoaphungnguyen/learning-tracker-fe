import type { LoaderFunction,ActionArgs } from '@remix-run/node';
import { Form, useLoaderData } from "@remix-run/react";
import { json , redirect} from "@remix-run/node"; 

export let loader: LoaderFunction = async ({ params }) => {
  const goalId = params.goalId; // Fetch the goal ID from params
  const entryId = params.entryId; // Fetch the entry ID from params
  const response = await fetch(`http://localhost:8000/api/entries?goal-id=${goalId}&entry-id=${entryId}`);
  const entry = await response.json();
  return entry;
};

export const action = async ({ request,params }: ActionArgs) => {
  
  const formData = await request.formData();
  const goalId = params.goalId; // Fetch the goal ID from params
  const entryId = params.entryId; // Fetch the entry ID from params
  const title = formData.get("title");
  const description = formData.get("description");
  const method = request.method;
  console.log(method);
  if (method === 'DELETE') {
    const result = await fetch(`http://localhost:8000/api/entries?goal-id=${goalId}&entry-id=${entryId}`, {
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
  console.log(result); 
  return redirect(`/goals/${goalId}`);
  } else if (method === 'PUT') {
    console.log("PUT");
    const result = await fetch(`http://localhost:8000/api/entries?goal-id=${goalId}&entry-id=${entryId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: title,
        description: description,
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
    
    return (
        <div className='max-w-md mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>Edit Learning Entry #{data.id}</h1>
            <Form className='space-y-4'  >
            <div>
          <label className="block font-semibold" htmlFor="title">
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
          <label className="block font-semibold" htmlFor="description">
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
            <div className='flex items-center justify-between'>
            <button
            className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
            type="submit" 
            formMethod='delete'
            >
            Delete
            </button>

            <button
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
            type="submit" 
            formMethod='put'
            >
            Update
            </button>
            </div>
            </Form>
        </div>
    )
}