import AppInput from "@/components/forms/AppInput";
import AppTextArea from "@/components/forms/AppTextArea";
import AppTextEditor from "@/components/rich-text-editor/AppTextEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import { useState, KeyboardEvent, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MdAdd } from "react-icons/md";
import ReactQuill from "react-quill";
import { z } from "zod";

const formatTagText = (text: string): string => {
	return text
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "_") // replace spaces with _
		.replace(/[^a-z0-9_]/g, "_") // replace remaining non-alphanumeric chars with _
		.replace(/_+/g, "_") // collapse multiple _ into single _
		.replace(/^_|_$/g, ""); // remove leading/trailing _
};

const formSchema = z.object({
	title: z.string().min(1, "Title is required"),
	subject: z.string().min(1, "Subject is required"),
	description: z.string(),
	content: z.string().min(10, "Please enter content of about 10 characters"),
});

const NewEmailTemplateModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [tagItem, setTagItem] = useState<string>("");
	const [tags, setTags] = useState<string[]>([]);
	const contentRef = useRef<ReactQuill>(null);

	const formMethods = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			subject: "",
			description: "",
			content: "",
		},
	});

	// handle tag input
	const handleTagInput = (e: KeyboardEvent<HTMLElement>) => {
		const { value } = e.target as HTMLInputElement;
		// set tag item
		// insert tag on enter
		// check if the key pressed is enter
		if (e.code === "Enter") {
			if (value === "") {
				return;
			}
			let tagText = formatTagText(value);
			// check if the tag already exists
			if (tags.includes(`{${tagText}}`)) {
				return;
			}
			// check if the tag is empty

			// check if the array is empty
			if (tags?.length === 0 || tags === undefined || tags === null) {
				// add the tag
				setTags([`{${tagText}}`]);
				// clear the tag input
				setTagItem("");
				return;
			}
			setTags((prev) => [...prev, `{${tagText}}`]);
			// clear the tag input
			setTagItem("");
		}
	};

	const handleRemoveTag = (tag: string) => {
		// check if its the last tag
		if (tags.length === 1) {
			// empty the tags array
			setTags([]);
		}
		setTags((prev) => prev.filter((t) => t !== tag));
		// remove also in the content
		if (contentRef.current) {
			const editor = contentRef.current.editor;
			const currentContent = editor.getText();
			const newContent = currentContent.replaceAll(tag, "");
			editor.setText(newContent);
		}
	};

	const handleInsertTagToContent = (tag: string) => {
		if (contentRef.current) {
			const { selection } = contentRef.current;
			let position = selection ? selection.index : 0;
			contentRef.current.editor.insertText(position, tag, "silent");
		}
	};

	const {
		formState: { errors: formErrors },
		control,
		handleSubmit,
		reset,
	} = formMethods;

	const onSubmit = handleSubmit(async (data) => {});

	return (
		<>
			<Button onPress={onOpen} color="primary">
				New Email Template
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl" scrollBehavior={"outside"}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<FormProvider {...formMethods}>
							<form onSubmit={onSubmit}>
								<ModalHeader>New Email Template</ModalHeader>
								<ModalBody>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										<AppInput label={"Title"} placeholder="e.g. Invite New Company" labelPlacement="inside" name="title" control={control} error={formErrors.title} />
										<AppInput label={"Subject"} placeholder="Subject" labelPlacement="inside" name="subject" control={control} error={formErrors.subject} />
									</div>
									<Spacer y={1} />
									<AppTextArea label={"Description (Optional)"} placeholder="Type something ..." labelPlacement="inside" name="description" control={control} error={formErrors.description} />
									<Spacer y={1} />
									<div className="flex items-center gap-3 md:gap-0">
										<AppInput
											label={"Tag"}
											placeholder="e.g. name"
											helperText="Press enter to add tag"
											value={tagItem}
											setValue={setTagItem}
											onKeyDown={(e: KeyboardEvent<HTMLElement>) => handleTagInput(e)}
										/>
										<Button
											isIconOnly
											color="primary"
											className="md:hidden rounded-full"
											type="button"
											onClick={() => {
												if (tagItem === "") {
													return;
												}
												// if it contains empty spaces, replace with _
												let tagText = formatTagText(tagItem);
												// check if the tag already exists
												if (tags.includes(`{${tagText}}`)) {
													return;
												}

												// check if the array is empty
												if (tags?.length === 0 || tags === undefined || tags === null) {
													// add the tag
													setTags([`{${tagText}}`]);
													// clear the tag input
													setTagItem("");
													return;
												}
												setTags((prev) => [...prev, `{${tagItem}}`]);
												// clear the tag input
												setTagItem("");
											}}>
											<MdAdd className="w-4 h-4" />
										</Button>
									</div>
									<div className="flex items-center gap-1">
										{tags.map((tag) => (
											<Chip color="primary" key={tag} variant="flat" onClose={() => handleRemoveTag(tag)}>
												<p className="text-xs">{tag}</p>
											</Chip>
										))}
									</div>
									<Spacer y={1} />
									<AppTextEditor label="Content" name="content" control={control} error={formErrors.content} editorRef={contentRef} />
									<div className="flex items-center gap-1">
										{tags.map((tag) => (
											<Chip color="primary" key={tag} variant="flat" endContent={<MdAdd />} onClose={() => handleInsertTagToContent(tag)}>
												<p className="text-xs">{tag}</p>
											</Chip>
										))}
									</div>
								</ModalBody>
								<ModalFooter>
									<Button color="warning" type="button" onPress={onClose}>
										Cancel
									</Button>
									<Button color="primary" type="submit">
										Save
									</Button>
								</ModalFooter>
							</form>
						</FormProvider>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default NewEmailTemplateModal;
