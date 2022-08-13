import { signIn, signOut, useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';
import type { NextPage } from 'next';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Form } from '../components/Form';

const Home: NextPage = () => {
	const [message, setMessage] = useState('');
	const { data: session, status } = useSession();

	const ctx = trpc.useContext();

	const { mutate } = trpc.useMutation('guestbook.postMessage', {
		onSuccess: () => {
			ctx.invalidateQueries(['guestbook.getAllMessages']);
		},

		// ALternative method of refetching data on message add using onMutate and onSettled
		// onMutate: () => {
		// 	ctx.cancelQuery(['guestbook.getAllMessages']);

		// 	let optimisticUpdate = ctx.getQueryData(['guestbook.getAllMessages']);

		// 	if (optimisticUpdate) {
		// 		ctx.setQueryData(['guestbook.getAllMessages'], optimisticUpdate);
		// 	}
		// },

		// onSettled: () => {
		// 	ctx.invalidateQueries(['guestbook.getAllMessages']);
		// },
	});

	if (status === 'loading') {
		return <main className="flex flex-col items-center pt-4">Loading...</main>;
	}

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();

		mutate({
			name: session?.user?.name as string,
			message,
		});

		setMessage('');
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
		setMessage(event.target.value);

	return (
		<main className="flex flex-col items-center">
			<h1 className="text-3xl pt-4">Guestbook</h1>
			<div className="pt-10">
				{session ? (
					<div className="">
						<p className="text-neutral-400">Hi {session.user?.name}!</p>
						<button onClick={() => signOut()}>Logout</button>

						<div className="pt-6">
							<Form
								handleSubmit={handleSubmit}
								message={message}
								handleChange={handleChange}
							/>
						</div>

						<div className="pt-10">
							<Messages />
						</div>
					</div>
				) : (
					<div className="">
						<button onClick={() => signIn('discord')}>
							Login with Discord
						</button>
						<div className="pt-10">
							<Messages />
						</div>
					</div>
				)}
			</div>
			{process.env.NODE_ENV !== 'production' && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
		</main>
	);
};

const Messages = () => {
	const { data: messages, isLoading } = trpc.useQuery([
		'guestbook.getAllMessages',
	]);
	console.log(messages);

	if (isLoading) {
		return <div>Fetching messages...</div>;
	}

	return (
		<div className="flex flex-col gap-4">
			{messages?.map((msg, index) => (
				<div key={index}>
					<p>{msg.message}</p>
					<span>- {msg.name}</span>
				</div>
			))}
		</div>
	);
};

export default Home;
