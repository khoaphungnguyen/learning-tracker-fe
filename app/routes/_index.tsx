import { LoaderArgs, V2_MetaFunction, json, redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import Api from "../../api";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { getSession, commitSession } from "../sessions";
import { useEffect, useState } from "react";
import jwtDecode from 'jwt-decode';


export const meta: V2_MetaFunction = () => {
  return [{ title: "Login" }];
};

// Define a type for the decoded token
interface DecodedToken {
  Audience: string;
}

export async function loader({ request }: LoaderArgs) {
  // get the session
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);

  // if the user is logged in, redirect them to the dashboard
  if (session.has("credentials")) {
    return redirect("/dashboard");
  } else {
    return json({ message: "Please login" });
  }
}

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const body = await request.formData();
  const email = body.get("email");
  const password = body.get("password");
  const payload = {
    email,
    password,
  };

  const api = new Api();
  try {
    const response = await api.loginUser(payload);
    const token = response.data.token;
    const decodedToken = jwtDecode(token) as DecodedToken;

    const sessionPayload = {
      token: token,
      user: {
        Audience: decodedToken.Audience,  
      },
    };
    session.set("credentials", sessionPayload);
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error: any) {
    console.log(error);
    return json({ error: error.message }, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  
}

export default function Index() {
  const navigation = useNavigation();
  const actionData = useActionData();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (actionData && actionData.error) {
      setError(actionData.error);
    }
  }, [actionData]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
    
    <h2 className="text-2xl font-semibold mb-6 text-center">Welcome to Learning Tracker</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <Form method="post" className="flex flex-col space-y-4"> 
            <div className="relative"> 
                <input type="text" placeholder="Email" name="email" className="p-2 border rounded pl-8 w-full"/>
                <span className="absolute left-2 top-2.5">👤</span>
            </div>
            <div className="relative"> 
                <input type="password" placeholder="Password" name="password" className="p-2 border rounded pl-8 w-full"/>
                <span className="absolute left-2 top-2.5">🔒</span>
            </div>
            <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 w-full">
                {navigation.state === "submitting" ? "Loading..." : "Login"}
            </button>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-600 self-end">Forgot Password?</a>
        </Form>
    </div>
</div>

  );
}
