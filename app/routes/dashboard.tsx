import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { commitSession, getSession, requireUserSession } from "~/sessions";
import Api from "../../api";

export async function loader({ request }: LoaderArgs) {
  try {
    await requireUserSession(request);
    const api = new Api();
    await api.setToken(request);
    const response = await api.getGoals();
    return { data: response.data };
  } catch (error) {
    // Assuming requireUserSession throws an error when no session is found
    if (error.message === 'NoSessionFound') {
      return { error: 'User not logged in' };
    }
    return { error: error.message };
  }
}
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative w-full py-3 mx-auto px-4 sm:px-8">
        
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 w-full">
          <h1 className="text-3xl font-bold mb-4">Learning Tracker Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-semibold mb-3">Progress Overview:</h2>
              <div className="bg-gray-200 rounded-full h-4 mb-3">
                <div className="bg-blue-500 rounded-full h-4 w-2/3"></div>
              </div>
              <h2 className="text-xl font-semibold mb-3">Study Streak:</h2>
              <p className="mb-3">5 Days in a Row!</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Recent Activities:</h2>
              <ul className="list-disc list-inside mb-3">
                <li>Completed JavaScript Basics</li>
                <li>Started React Hooks</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Goals:</h2>
              <ul className="list-decimal list-inside mb-3">
                <li>Finish React course by end of the month</li>
                <li>Practice coding challenges 3x a week</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Recommendations:</h2>
              <ul className="list-disc list-inside mb-3">
                <li>Try TypeScript for better type safety</li>
                <li>Join a coding community for peer reviews</li>
              </ul>
            </div>
          </div>

          <div className="mt-10">
            <Link to="/courses" className="text-blue-500 hover:underline">View All Courses</Link>
          </div>
        </div>
      </div>
    </div>
  );
}