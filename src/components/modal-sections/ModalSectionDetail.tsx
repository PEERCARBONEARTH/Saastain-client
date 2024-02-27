const ModalSectionDetail = ({ label, value }: { label: string; value: string | number }) => {
    return (
        <div className="px-4 py-5">
            <div className="grid grid-cols-2">
                <h3 className="text-gray-400 text-sm">{label}</h3>
                <h3>{value}</h3>
            </div>
        </div>
    );
};

export default ModalSectionDetail;