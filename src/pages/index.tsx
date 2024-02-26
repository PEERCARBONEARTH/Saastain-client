import React, { useEffect } from "react";
import Router from "next/router";

const index = () => {
	useEffect(() => {
		Router.push("/dashboard");
	});
	return <div />;
};

export default index;
