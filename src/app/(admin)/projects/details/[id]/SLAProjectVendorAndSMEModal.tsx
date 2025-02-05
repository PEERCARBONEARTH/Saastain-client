import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { useSession } from "next-auth/react";
import React, { useMemo } from "react";
import useSWR from "swr";
import MyDocusealBuilder from "@/components/my-docuseal/MyDocusealBuilder";

const SLAProjectVendorAndSMEModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const { data: session } = useSession();

	const account = useMemo(() => {
		if (session?.user) return session?.user;

		return null;
	}, [session]);

	const { data: token } = useSWR<string>(account && isOpen ? [IApiEndpoint.GET_DOCUSEAL_TOKEN, { documentName: "SLA-Vendor-SME", email: account?.email }] : null, swrFetcher, { keepPreviousData: true });

	return (
		<>
			<Button color="primary" size="sm" onPress={onOpen}>
				Add
			</Button>
			<Modal isOpen={isOpen} size="4xl" onOpenChange={onOpenChange} scrollBehavior="outside" >
				<ModalContent className="font-nunito saastain" >
					{(onClose) => (
						<>
							<ModalHeader>Generate SLA</ModalHeader>
							<ModalBody>
								{token && <MyDocusealBuilder token={token} />}
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button color="primary" onPress={onClose}>
									Action
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SLAProjectVendorAndSMEModal;
