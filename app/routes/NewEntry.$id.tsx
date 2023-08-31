import { Form, Link , useParams} from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { json, redirect, } from "@remix-run/node"; 

export const action = async ({ request,params }: ActionArgs) => {
  const formData = await request.formData();
  // Extract additional parameters from formData
  const goalId = params.id; // Fetch the goal ID from params
  const title = formData.get("title");
  const description = formData.get("description");
  const result = await fetch(`http://localhost:8000/api/entries/add?goalID=${goalId}`, {
    method: 'POST',
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
  return redirect("/goals/"+goalId);
};

export default function NewEntry() {
  const {id} = useParams();
  return (
    <div className="max-w-4xl p-8 bg-white rounded-md shadow-md m-5">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Add Learning Entry</h1>
      <Form className="space-y-4" method="post">
        <div>
          <label className="block font-semibold text-gray-600" htmlFor="title">
            Title
          </label>
          <input
            className="w-full border rounded-md px-3 py-2"
            type="text"
            name="title"
            placeholder="Enter title"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-600" htmlFor="description">
            Description
          </label>
          <textarea
            className="w-full border rounded-md px-3 py-2"
            name="description"
            rows={4}
            placeholder="Enter description"
            required
          />
        </div>
        <div className="flex justify-between">
          <Link
            to={`/goals/${id}`}
            className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
          >
            Cancel
          </Link>
          <button
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
            type="submit"
          >
            Add Entry
          </button>
        </div>
      </Form>
    </div>
  );
}