import { LoaderFunction } from '@remix-run/node';
import { Form, useLoaderData } from "@remix-run/react";


export let loader: LoaderFunction = async ({ params }) => {
  const entryId = params.id; // Fetch the entry ID from params

  const response = await fetch(`http://localhost:8000/api/entries?id=${entryId}`);
  const entry = await response.json();
  return entry;
};


export default function EditEntry() {
    const data = useLoaderData<typeof loader>();
    return (
        <div className='max-w-md mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>Edit Learning Entry</h1>
            <Form className='space-y-4' method='post'>
            <div>
          <label className="block font-semibold" htmlFor="title">
            Title
          </label>
          <input
            className="w-full border rounded-md px-3 py-2"
            type="text"
            id="title"
            name="title"
            value={data.title}
            placeholder={"Enter title"}
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
            value={data.description}
            rows={4}
            placeholder="Enter description"
            required
          />
            </div>
            <button
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
            type="submit"
            >
            Update Entry
            </button>
            </Form>
        </div>
    )
}