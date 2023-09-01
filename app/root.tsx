//import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction ,LoaderFunction} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import  Layout  from "./components/Layout";


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export let loader: LoaderFunction = async () => {
  const data = await fetch("http://localhost:8000/api/goals");
  return data.json();
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
        <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
