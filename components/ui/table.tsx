const Table = ({ children }: { children: React.ReactNode }) => {
    return <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg rounded-xl">{children}</table>;
};

const TableHeader = ({ children }: { children: React.ReactNode }) => {
    return <thead className="bg-gray-100 border-b border-gray-300">{children}</thead>;
};

const TableRow = ({ children }: { children: React.ReactNode }) => {
    return <tr className="border-b border-gray-200 hover:bg-gray-50">{children}</tr>;
};

const TableHead = ({ children }: { children: React.ReactNode }) => {
    return <th className="text-left p-3 font-semibold text-gray-700">{children}</th>;
};

const TableBody = ({ children }: { children: React.ReactNode }) => {
    return <tbody>{children}</tbody>;
};

const TableCell = ({ children }: { children: React.ReactNode }) => {
    return <td className="p-3 text-gray-600">{children}</td>;
};

export { Table, TableHeader, TableRow, TableHead, TableBody, TableCell };
