import { Form } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node"; 


export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  // Extract additional parameters from formData
  const title = formData.get("title");

  const result = await fetch("http://localhost:8000/api/goal/add", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: title,
    })
});

if (!result.ok) {
    return json({ error: "Something went wrong" }, { status: 500 });
}
  const response = await result.json();
  return redirect(`/goals/${response}`);
};

export default function NewGoal() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Goal</h1>
      <Form className="space-y-4"  method="post" >
        <div>
          <label className="block font-semibold" htmlFor="title">
            Your Goal:
          </label>
          <input
            className="w-full border rounded-md px-3 py-2"
            type="text"
            name="title"
            placeholder="Enter goal"
            required
          />
        </div>
        <button
          className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
          type="submit"
        >
          Add Goal
        </button>
      </Form>
    </div>
  );
}
