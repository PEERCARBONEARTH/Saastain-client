import AppInput from "@/components/forms/AppInput";
import AppTextArea from "@/components/forms/AppTextArea";
import AppTextEditor from "@/components/rich-text-editor/AppTextEditor";
import useTemplateUtils from "@/hooks/useTemplateUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { IEmailTemplate } from "@/types/Template";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit3 } from "react-icons/fi";
import { MdAdd } from "react-icons/md";
import ReactQuill from "react-quill-new";
import useSWR from "swr";
import { z } from "zod";

const formSchema = z.object({
	title: z.string().min(1, "Title is required"),
	subject: z.string().min(1, "Subject is required"),
	description: z.string(),
	content: z.string().min(10, "Please enter content of about 10 characters"),
});

const formatTagText = (text: string): string => {
	return text
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "_")
		.replace(/[^a-z0-9_]/g, "_")
		.replace(/_+/g, "_")
		.replace(/^_|_$/g, "");
};

interface IProps {
	selectedTemplateId: string;
	mutate?: VoidFunction;
}

const EditEmailTemplateModal = ({ selectedTemplateId, mutate }: IProps) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [tagItem, setTagItem] = useState<string>("");
	const [tags, setTags] = useState<string[]>([]);
	const contentRef = useRef<ReactQuill>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const { updateEmailTemplate } = useTemplateUtils();

	const formMethods = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			subject: "",
			description: "",
			content: "",
		},
	});

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
		setValue,
	} = formMethods;

	const onSubmit = handleSubmit(async (data) => {
		const info = {
			title: data.title,
			description: data.description,
			subject: data.subject,
			content: data.content,
			tags,
			templateId: selectedTemplateId,
		};

		setLoading(true);

		try {
			const resp = await updateEmailTemplate(info);

			if (resp?.status === "success") {
				toast.success("Template updated successfully");
				reset();
				mutate && mutate?.();
				onClose();
			} else {
				toast.error("Unable to update the template at the moment");
			}
		} catch (err) {
			toast.error("Unable to save the template at the moment");
		} finally {
			setLoading(false);
		}
	});

	const { data: templateInfo } = useSWR<IEmailTemplate>(!selectedTemplateId && !isOpen ? null : [`${IApiEndpoint.GET_EMAIL_TEMPLATE_INFO}/${selectedTemplateId}`], swrFetcher, {
		keepPreviousData: true,
	});

	useEffect(() => {
		if (isOpen && templateInfo) {
			setValue("title", templateInfo.title);
			setTags(templateInfo.tags);
			setValue("description", templateInfo?.description);
			setValue("subject", templateInfo?.subject);
		}
	}, [isOpen, templateInfo, contentRef.current]);

	useEffect(() => {
		if (contentRef?.current && templateInfo) {
			const editor = contentRef.current.editor;
			editor.clipboard.dangerouslyPasteHTML(templateInfo.content);
		}
	}, [contentRef.current, templateInfo]);

	return (
		<>
			<Button isIconOnly color="primary" variant="light" onPress={onOpen}>
				<FiEdit3 className="w-5 h-5" />
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl" scrollBehavior={"outside"}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<FormProvider {...formMethods}>
							<form onSubmit={onSubmit}>
								<ModalHeader>Edit Email Template</ModalHeader>
								<ModalBody>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										<AppInput label={"Title"} placeholder="e.g. Invite New Company" labelPlacement="inside" name="title" control={control} error={formErrors.title} />
										<AppInput label={"Subject"} placeholder="Subject" labelPlacement="inside" name="subject" control={control} error={formErrors.subject} />
									</div>
									<Spacer y={1} />
									<AppTextArea label={"Description (Optional)"} placeholder="Type something ..." labelPlacement="inside" name="description" control={control} error={formErrors.description} />
									<Spacer y={1} />
									<div className="flex items-end gap-3">
										<AppInput
											label={"Tag"}
											placeholder="e.g. name"
											// helperText="Press enter to add tag"
											value={tagItem}
											setValue={setTagItem}
											// onKeyDown={(e: KeyboardEvent<HTMLElement>) => handleTagInput(e)}
										/>
										<Button
											isIconOnly
											color="primary"
											className="rounded-full"
                                            isDisabled={!tagItem}
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
									<Button color="primary" type="submit" isDisabled={loading} isLoading={loading}>
										Update
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

export default EditEmailTemplateModal;
