import React from 'react';

const WrapperBlock = ({children}) => {
    return (
        <div className="w-100v h-100v f-center-row">
            {children}
        </div>
    );
};

export default WrapperBlock;