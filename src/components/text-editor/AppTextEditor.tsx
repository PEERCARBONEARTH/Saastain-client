"use client";
import "react-quill/dist/quill.snow.css";
import { Control, Controller, FieldError } from "react-hook-form";
import ReactQuill from "react-quill";

interface AppTextEditorProps {
	name?: string;
	label: string;
	value?: string;
	setValue?: (value: string) => void;
	onChange?: (value: string) => void;
	error?: FieldError;
	placeholer?: string;
	control?: Control<any>;
}

/**
 * Custom Text Editor made using React
 *
 * @example
 * ```tsx
 * import dynamic from "next/dynamic"
 * import TextEditorSkeletonLoader from '@/components/text-editor/TextEditorSkeletonLoader'
 * import {useMemo} from 'react'
 *
 * const AppTextEditor = useMemo(() => {
 * 	return dynamic(() => import('@/components/text-editor/AppTextEditor'), {
 * 		ssr: false,
 * 		loading: () => <TextEditorSkeletonLoader />
 * 	})
 * }, [])
 * ```
 *
 * @returns
 */
const AppTextEditor = ({ name, label, value, setValue, onChange, error, placeholer = "Write something ...", control }: AppTextEditorProps) => {
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
		<div className="flex flex-col mb-20 mt-4">
			<p className="text-sm mb-2 font-medium">{label}</p>
			{control ? (
				<Controller
					name={name}
					control={control}
					render={({ field: { onChange: onControlledChange, value: changedValue } }) => (
						<>
							<ReactQuill
								theme="snow"
								className="h-[10rem] rounded-xl"
								formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"]}
								placeholder={placeholer}
								modules={modules}
								value={changedValue}
								onChange={(val) => {
									onControlledChange(val);
								}}
							/>
							{error && <p className="text-xs text-danger-500 mt-20">{error?.message}</p>}
						</>
					)}
				/>
			) : (
				<ReactQuill
					theme="snow"
					className="h-[10rem] rounded-xl"
					formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"]}
					placeholder={placeholer}
					modules={modules}
					value={value}
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
