interface FormProps {
	message: string;
	handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const Form: React.FC<FormProps> = ({
	message,
	handleChange,
	handleSubmit,
}) => {
	return (
		<form className="flex gap-2" onSubmit={handleSubmit}>
			<input
				type="text"
				value={message}
				placeholder="Your message..."
				maxLength={100}
				onChange={handleChange}
				className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-neutral-900 focus:outline-none"
			/>
			<button className="p-2 rounded-md border-2 border-zinc-800 focus:outline-none">
				Submit
			</button>
		</form>
	);
};
