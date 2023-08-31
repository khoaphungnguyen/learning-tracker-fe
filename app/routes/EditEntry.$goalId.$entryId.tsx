import type { LoaderFunction,ActionArgs } from '@remix-run/node';
import { Form, useLoaderData } from "@remix-run/react";
import { json , redirect} from "@remix-run/node"; 
import { useState,useEffect } from "react";

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
  // Add a new piece of state for the confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  //const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [toastMessage, setToastMessage] = useState('');

  // Function to handle deleting the entry
  const handleDelete = async() => {
    // Perform the deletion action here
    // ...

    // Close the confirmation modal
    setShowConfirmation(false);
    try {
      await new Promise((resolve, reject) => setTimeout(reject, 1000));
      setToastMessage('An error occurred while deleting the entry.');
    } catch (error) {
      console.error(error);
      setToastMessage('An error occurred while deleting the entry.');
    }
  };

  const handleUpdate = async () => {
    // Simulate a successful update
    // Replace this with your actual update logic
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setToastMessage('Entry updated successfully!');
    } catch (error) {
      console.error(error);
      setToastMessage('An error occurred while updating the entry.');
    }
  };
  useEffect(() => {
    // Clear toast message after 3 seconds
    const timeout = setTimeout(() => {
      setToastMessage('');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [toastMessage]);

  // const handleUpdateFeedback = async () => {
  //   // ... Your update logic ...

  //   try {
  //     // Simulate a successful update
  //     // Replace this with your actual update logic
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //     setFeedback({ type: 'success', message: 'Entry updated successfully!' });
  //   } catch (error) {
  //     console.error(error);
  //     setFeedback({ type: 'error', message: 'An error occurred while updating the entry.' });
  //   }
  // };


  // const handleDeleteFeedback = async () => {
  //   // ... Your delete logic ...

  //   try {
  //     // Simulate an error during deletion
  //     // Replace this with your actual delete logic
  //     await new Promise((resolve, reject) => setTimeout(reject, 1000));
  //     setFeedback({ type: 'error', message: 'An error occurred while deleting the entry.' });
  //   } catch (error) {
  //     console.error(error);
  //     setFeedback({ type: 'error', message: 'An error occurred while deleting the entry.' });
  //   }
  // };
  


  return (
    <div className="flex items-start justify-start min-h-screen bg-gray-100 p-6">
  <div className="max-w-md w-full bg-white rounded-md shadow-md p-6">
    <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit Learning Entry</h1>
    <div className="absolute bottom-4 right-4">
          {toastMessage && (
            <div className="bg-red-500 text-white rounded-md px-4 py-2 mb-4">
              {toastMessage}
            </div>
          )}
        </div>
    <Form className="space-y-4" method="post">
      {/* Entry Details */}
      <p className="text-gray-600">
        <span className="font-semibold">Created:</span>{" "}
        {new Date(data.createdAt).toLocaleString("en-US")}
      </p>
      <p className="text-gray-600">
        <span className="font-semibold">Last Updated:</span>{" "}
        {new Date(data.date).toLocaleString("en-US")}
      </p>
      <p className="text-gray-600">
        <span className="font-semibold">Status:</span>{" "}
        <span className={`text-sm ${data.status === "completed" ? "text-green-600" : "text-red-600"}`}>
          {data.status === "completed" ? "Completed" : "Not Completed"}
        </span>
      </p>
    
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

      {/* Buttons */}
      <div className="flex justify-end">
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
          onClick={() => handleUpdate()}
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
            //onClick={handleDeleteFeedback}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white rounded-md px-3 py-1 ml-3 hover:bg-blue-600"
            onClick={handleDelete} // Perform the deletion action
            //onClick={handleUpdateFeedback}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )}
    </Form>
  </div>
</div>

  );
}
