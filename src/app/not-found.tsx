import Link from "next/link";
export default function NotFound() { return <main className="mz-notfound"><div><span>404</span><h1>Oops! Page not found.</h1><p>Looks like you took a wrong turn.</p><Link href="/" className="mz-button">Back to Mediazy</Link></div><div className="notfound-orbit">✦</div></main>; }
