import * as React from 'react';
import LiveTickLine from '@components/Charts/LiveTickLine';

interface CardContentProps {
    chartType: string;
    values?: any;
}

const CardContent = (props: CardContentProps) => {
    console.log('PROPS', props)

    const contentSelector = (chartType: string) => {
        switch (chartType) {
            case "Live Price Update":
                return <LiveTickLine />;
            case "B":
                return <div>Content for B</div>;
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