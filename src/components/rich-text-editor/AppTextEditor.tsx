"use client";
import "react-quill/dist/quill.snow.css";
import { Control, Controller, FieldError } from "react-hook-form";
import { LegacyRef } from "react";
import dynamic from "next/dynamic";
import TextEditorSkeletonLoader from "./TextEditorSkeleton";
import ReactQuill, { ReactQuillProps } from "react-quill";

const ReactQuillEditor = dynamic(
	async () => {
		const { default: RQ } = await import("react-quill");

		const Component = ({ forwardedRef, ...props }: { forwardedRef: LegacyRef<ReactQuill> } & ReactQuillProps) => <RQ ref={forwardedRef} {...props} />;

		Component.diplayName = "ReactQuillEditor";

		return Component;
	},
	{
		ssr: false,
		loading: () => <TextEditorSkeletonLoader />,
	}
);

interface AppTextEditorProps {
	name?: string;
	label: string;
	value?: string;
	setValue?: (value: string) => void;
	onChange?: (value: string) => void;
	error?: FieldError;
	placeholer?: string;
	control?: Control<any>;
	editorRef?: LegacyRef<ReactQuill>;
}

/**
 * Custom Text Editor made using React
 *
 * @example
 * ```tsx
 * import AppTextEditor from "@/components/rich-text-editor/AppTextEditor";
 * 
 * <AppTextEditor label="Content" value={content} setValue={setContent} />
 *
 * ```
 *
 * @returns
 */
const AppTextEditor = ({ name, label, value, setValue, onChange, error, placeholer = "Write something ...", control, editorRef }: AppTextEditorProps) => {
	const modules = {
		toolbar: [
			[
				{
					header: "1",
				},
				{
					header: "2",
				},
				{
					font: [],
				},
			],
			[
				{
					size: [],
				},
			],
			["bold", "italic", "underline", "strike", "blockquote"],
			[
				{
					list: "ordered",
				},
				{
					list: "bullet",
				},
				{
					indent: "-1",
				},
				{
					indent: "+1",
				},
			],
			["link", "image"],
			["clean"],
		],
		clipboard: {
			// toggle to add extra line break when pasting html
			matchVisual: false,
		},
	};
	return (
		<div className="flex flex-col mb-10 mt-4">
			<p className="text-sm mb-2 font-medium">{label}</p>
			{control ? (
				<Controller
					name={name}
					control={control}
					render={({ field }) => (
						<>
							<ReactQuillEditor
								{...field}
								theme="snow"
								className="min-h-[10rem] rounded-xl"
								formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"]}
								placeholder={placeholer}
								modules={modules}
								onChange={(val) => {
									field.onChange(val);
								}}
								forwardedRef={editorRef}
							/>
							{error && <p className="text-xs text-danger-500 mt-20">{error?.message}</p>}
						</>
					)}
				/>
			) : (
				<ReactQuillEditor
					theme="snow"
					className="h-[10rem] rounded-xl"
					formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"]}
					placeholder={placeholer}
					modules={modules}
					value={value}
					forwardedRef={editorRef}
					onChange={(val) => {
						setValue && setValue(val);
						onChange && onChange(val);
					}}
				/>
			)}
		</div>
	);
};

export default AppTextEditor;
