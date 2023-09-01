import type { LoaderFunction,ActionArgs } from '@remix-run/node';
import { Form, useLoaderData, Link, useParams } from "@remix-run/react";
import { json , redirect} from "@remix-run/node"; 
import { useState } from "react";
import {toast} from 'react-hot-toast';


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
  const method = request.method;
  const timeNow = new Date();
  const files = formData.get("files");
 
  console.log(method)
  if (method === 'POST') {
    const formData = new FormData();
    formData.append('files', files);
    const response = await fetch("http://localhost:8000/api/upload", {
    method: "POST",
    body: formData})
    //console.log(response)
    if (response.ok) {
    toast.success("Entry updated successfully");
    } else {
    toast.error("An error occurred");
    }
    return null;
    return null;
  } else if (method === 'DELETE') {
    
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
        date: timeNow,
    })
    });
   
    if (!result.ok) {
        return json({ error: "Something went wrong" }, { status: 500 });
    }
    return redirect(`/goals/${goalId}`);
}
};

export default function EditEntry() {
  const data = useLoaderData<typeof loader>();
  // Add a new piece of state for the confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {goalId} = useParams()
  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleSave = async () => {
    const formData = new FormData();
    formData.append('files', selectedFile);
    console.log(selectedFile)
    const response = await fetch("http://localhost:8000/api/upload", {
    method: "POST",
    body: formData})
    //console.log(response)
    if (response.ok) {
    toast.success("Entry updated successfully");
    } else {
    toast.error("An error occurred");
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-md shadow-md p-6">
        <div className="mb-6 flex items-center">
          <Link to={`/goals/${goalId}`} className="text-blue-500 hover:underline flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.293 5.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L14.586 11H4a1 1 0 0 1 0-2h10.586l-2.293-2.293a1 1 0 0 1 0-1.414z"
              />
            </svg>
            Back to All Entries
          </Link>
        </div>
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Edit Learning Entry</h1>
        <Form className="space-y-4" method="post">
      {/* Entry Details */}
      {/* Title */}
      <div>
        <label htmlFor="title" className="block font-semibold text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={data.title}
          //onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
          placeholder="Enter title"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block font-semibold text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={data.description}
          rows={5}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
          placeholder="Enter description"
          required
        />
      </div>
      {/* Attachments */}
      <div className="mb-4" >
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Attachments</h2>
        <div className='flex  justify-between items-center '>
        <input
          type="file"
          id="files"
          name="files"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
          accept=".pdf,.doc,.docx,.txt,image/*,.zip,.rar"
        />
        <button
        type="submit"
        formMethod="post"
        className={`bg-green-500 text-white rounded-md px-4 py-2 ${!selectedFile 
        ? 'opacity-50 cursor-not-allowed' 
        : 'hover:bg-green-600 transition duration-300'}`}     
          onClick={handleSave}
        disabled={!selectedFile}
         >
        Save
      </button>
        </div>
       
      </div>


      {/* Buttons */}
      <div className="flex justify-end ">
        <button
          className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition duration-300"
          type="button"
          onClick={() => setShowConfirmation(true)} // Open the confirmation modal
        >
          Delete
        </button>
        <button
          className="bg-blue-500 text-white rounded-md px-4 py-2 ml-3 hover:bg-blue-600 transition duration-300"
          type="submit"
          formMethod="put"
          onClick={() => toast.success('Updated Successfully')}
        >
          Update
        </button>
      </div>
      {/* Confirmation Modal */}
  {showConfirmation && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  
      <div className="bg-white p-6 rounded-md shadow-md">
        <p className="mb-4">Are you sure you want to delete this entry?</p>
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white rounded-md px-3 py-1 hover:bg-red-600"
            onClick={() => setShowConfirmation(false)} // Close the modal
          >
            Cancel
          </button>
          <button
          className="bg-blue-500 text-white rounded-md px-3 py-1 ml-3 hover:bg-blue-600"
          type="submit"
          formMethod="delete"
          onClick={() => toast.success('Delete Successfully')}
        >Confirm</button>
        </div>
      </div>
    </div>
  )}
    </Form>
  </div>
</div>
  );
}
