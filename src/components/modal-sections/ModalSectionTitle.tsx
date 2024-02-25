const ModalSectionTitle = ({ title }: { title: string }) => {
	return (
		<div className="bg-gray-100 px-4 py-3">
			<h3 className="font-bold text-sm">{title}</h3>
		</div>
	);
};

export default ModalSectionTitle;
