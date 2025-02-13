'use client'
import EventDetails from "./EventDetails";

const page = (props: { params: { id: string } }) => {
	const params = props.params;

	return <EventDetails id={''} />;
};

export default page;
