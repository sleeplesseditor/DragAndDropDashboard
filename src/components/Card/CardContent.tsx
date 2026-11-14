import * as React from 'react';
import LiveTickLine from '@components/Charts/LiveTickLine';
import TwoPane from '@components/Charts/TwoPane';

interface CardContentProps {
    chartType: string;
    values?: any;
}

const CardContent = (props: CardContentProps) => {
    const contentSelector = (chartType: string) => {
        switch (chartType) {
            case "Live Price Update":
                return <LiveTickLine />;
            case "Synchronised Price and Volume Chart":
                return <TwoPane />;
            case "C":
                return <div>Content for C</div>;
            default:
                return <div>Default Content</div>;
        }
    }

    return (
        <div className="card-content__container">
            {contentSelector(props.chartType)}
        </div>
    )
}

export default CardContent;