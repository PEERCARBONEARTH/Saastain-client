import { FC } from "react";

interface IProps {
	labelText: string;
}

const FileInput: FC<IProps> = ({ labelText }) => {
	return (
		<div>
			<label className="block mb-2 text-sm font-medium text-primary" htmlFor="user_avatar">
				{labelText}
			</label>
			<input
				className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:border-none file:px-2 file:py-3 file:bg-[#CFA16C] file:text-white placeholder:text-muted-foreground"
				aria-describedby="user_avatar_help"
				id="user_avatar"
				type="file"
				style={{ textAlign: "right" }}
			/>
		</div>
	);
};

export default FileInput;
