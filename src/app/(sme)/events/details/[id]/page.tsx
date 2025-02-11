import React from "react";
import EventDetails from "./EventDetails";

const page = async (props: { params: Promise<{ id: string }> }) => {
	const params = await props.params;

	return <EventDetails id={params.id} />;
};

export default page;
