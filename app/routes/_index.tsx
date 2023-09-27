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
  Fullname: string;
  // ... other fields ...
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
  const username = body.get("username");
  const password = body.get("password");
  const payload = {
    username,
    password,
  };

  console.log(typeof username);

  const api = new Api();
  try {
    const response = await api.loginUser(payload);
    const token = response.data.token;
    const decodedToken = jwtDecode(token) as DecodedToken;
    console.log(decodedToken);
    const sessionPayload = {
      token: token,
      user: {
        Audience: decodedToken.Audience,  
        Fullname: decodedToken.Fullname,
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
    <div>
      {/*   */}
      <h2>Login</h2>
      <Form method="post" className="flex flex-col">
        <h2>{error}</h2>
        <input type="text" placeholder="Username" name="username" />
        <input type="password" placeholder="Password" name="password" />
        <button type="submit">
          {navigation.state === "submitting" ? "Loading..." : "Login"}
        </button>
      </Form>
    </div>
  );
}
