import { Form } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node"; 


export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  // Extract additional parameters from formData
  const title = formData.get("title");
  const description = formData.get("description");


  const result = await fetch("http://localhost:8000/api/entries/add", {
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
  
  return redirect("/");
  //return json({ title, description })
};

export default function NewEntry() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Learning Entry</h1>
      <Form className="space-y-4"  method="post" >
        <div>
          <label className="block font-semibold" htmlFor="title">
            Title
          </label>
          <input
            className="w-full border rounded-md px-3 py-2"
            type="text"
            name="title"
            placeholder="Enter title"
          />
        </div>
        <div>
          <label className="block font-semibold" htmlFor="description">
            Description
          </label>
          <textarea
            className="w-full border rounded-md px-3 py-2"
            name="description"
            rows={4}
            placeholder="Enter description"
          />
        </div>
        <button
          className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
          type="submit"
        >
          Add Entry
        </button>
      </Form>
    </div>
  );
}
