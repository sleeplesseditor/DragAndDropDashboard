import LiveTickLine from '@components/Charts/LiveTickLine';
import TwoPane from '@components/Charts/TwoPane';
import BulletChart from '@components/Charts/BulletChart';

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
            case "Live Price Gauge":
                return <BulletChart />;
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