import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = ({request}) => {
    return json({}, 200)
}