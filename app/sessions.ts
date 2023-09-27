import {createCookieSessionStorage, redirect } from "@remix-run/node";

type SessionData = {
  credentials: {
    token: string;
    user: {
      Audience: string;
      Fullname: string;
    };
  };
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",

      httpOnly: true,
      sameSite: "lax",
      maxAge: 60*60*24,
      secrets: [process.env.SESSION_SECRET as string],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };

export async function requireUserSession(request: Request) {
    // get the session
    const cookie = request.headers.get("cookie");
    const session = await getSession(cookie);
  
    // check if session has the credentials
    if (!session.has("credentials")) {
      console.log(session.get("credentials"));
  
      // if there is no user session, redirect to login
      throw redirect("/");
    }
  
    return session;
  }