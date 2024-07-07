import { useCallback, useMemo, useRef, useState } from "react";
import ReacQuill from "react-quill";

const QuillEditor = () => {
	const [value, setValue] = useState<string | undefined>(undefined);

	const quillRef = useRef<ReacQuill | null>(null);

	function handler() {
		console.log(value);
	}

	const imageHandler = useCallback(() => {
		// Create an input element of type 'file'
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.click();

		// When a file is selected
		input.onchange = () => {
			const file = input.files[0];
			const reader = new FileReader();

			// Read the selected file as a data URL
			reader.onload = () => {
				const imageUrl = reader.result;
				const quillEditor = quillRef.current.getEditor();

				// Get the current selection range and insert the image at that index
				const range = quillEditor.getSelection(true);
				quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
			};

			reader.readAsDataURL(file);
		};
	}, []);

	const modules = useMemo(
		() => ({
			toolbar: {
				container: [
					[{ header: [2, 3, 4, false] }],
					["bold", "italic", "underline", "blockquote"],
					[{ color: [] }],
					[{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
					["link", "image"],
					["clean"],
				],
				handlers: {
					image: imageHandler,
				},
			},
			clipboard: {
				matchVisual: true,
			},
		}),
		[imageHandler]
	);

	const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "color", "clean"];

	return (
		<div>
            {/* @ts-ignore */}
			<ReacQuill ref={(el) => (quillRef.current = el)} className="mt-4 h-[500px]" theme="snow" value={value} onChange={(val) => setValue(val)} />
		</div>
	);
};

export default QuillEditor;
