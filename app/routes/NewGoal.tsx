import { Form,Link } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node"; 


export const action = async ({ request }: ActionArgs) => {
  // Extract additional parameters from formData
  const formData = await request.formData();
  const title = formData.get("title");
  const startDate = new Date(`${formData.get("startDate")}T00:00:00Z`).toISOString();
  const endDate = new Date(`${formData.get("enddate")}T00:00:00Z`).toISOString();
  const result = await fetch("http://localhost:8000/api/goals/add", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: title,
        startdate: startDate,
        enddate: endDate
    })
});
if (!result.ok) {
    return json({ error: "Something went wrong" }, { status: 500 });
}
const data = await result.json();
  return redirect(`/goals/${data}`);
};

export default function NewGoal() {
  return (
    <div className="max-w-4xl p-10 bg-white rounded-md shadow-md m-5">
      <h1 className="text-2xl md:text-3xl text-slate-800 font-bold mb-3">Add New Goal</h1>
      <Form className="space-y-4" method="post">
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
        <div>
          <label className="block font-semibold" htmlFor="startDate">
            Start Date:
          </label>
          <input
            className="w-full border rounded-md px-3 py-2"
            type="date"
            name="startDate"
            required
          />
        </div>
        <div>
          <label className="block font-semibold" htmlFor="completionDate">
            Completion Date:
          </label>
          <input
            className="w-full border rounded-md px-3 py-2"
            type="date"
            name="enddate"
            required
          />
        </div>
        <div className="flex justify-between">
          <Link
            to="/"
            className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
          >
            Cancel
          </Link>
          <button
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
            type="submit"
          >
            Add Goal
          </button>
        </div>
      </Form>
    </div>
  );
}