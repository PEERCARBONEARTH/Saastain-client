import { cn } from "@nextui-org/react";
import { ChangeEvent, FC, useState } from "react";
import { Control, Controller, FieldError } from "react-hook-form";

interface IProps {
	labelText: string;
	control: Control<any>;
	error: FieldError;
	name: string;
	accept?: string;
}

const FileInput: FC<IProps> = ({ labelText, control, error, name, accept }) => {
	const [selectedFileName, setSelectedFileName] = useState<string>("No File Selected");
	const onFileChange = (e: ChangeEvent<HTMLInputElement>, onChange: Function) => {
		const file = e.target.files?.[0];

		const reader = new FileReader();

		if (file) {
			reader.readAsDataURL(file);

			reader.onloadend = () => {
				onChange(reader.result);
				setSelectedFileName(file.name);
			};
		}
	};

	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { value, onChange, ...field } }) => (
				<>
					<label className={cn(`block mb-1 text-sm font-medium`, error ? "text-danger" : "text-primary")} htmlFor="user_avatar">
						{labelText}
					</label>
					<input
						className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:border-none file:px-2 file:py-3 file:bg-[#CFA16C] file:text-white placeholder:text-muted-foreground"
						aria-describedby="user_avatar_help"
						id="user_avatar"
						type="file"
						style={{ textAlign: "right" }}
						accept={accept}
						onChange={(e) => onFileChange(e, onChange)}
						{...field}
					/>
					{error && (
						<div className="mt-1">
							<p className="text-danger text-xs">{error.message}</p>
						</div>
					)}
				</>
			)}
		/>
	);
};

export default FileInput;
