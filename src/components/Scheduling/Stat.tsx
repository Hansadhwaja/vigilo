import React from 'react'

const Stat = ({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon?: React.ReactNode;
}) => (
    <div className="flex items-center gap-2 text-sm">
        {icon && <div className="text-blue-600">{icon}</div>}
        <span className="font-semibold text-gray-900">{value}</span>
        <span className="text-gray-600">{label}</span>
    </div>
);

export default Stat