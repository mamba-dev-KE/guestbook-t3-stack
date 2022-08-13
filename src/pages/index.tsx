import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	return (
		<main>
			<h1>Guestbook</h1>
			{session ? (
				<div className="">
					<p>hi {session.user?.name}</p>
					<button onClick={() => signOut()}>Logout</button>
				</div>
			) : (
				<div className="">
					<button onClick={() => signIn("discord")}>Login with Discord</button>
				</div>
			)}
		</main>
	);
};

export default Home;
