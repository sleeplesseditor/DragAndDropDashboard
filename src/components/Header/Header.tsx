import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@modules/redux/store';
import { selectExchange, type Exchange } from '@modules/selection/slice';
import './Header.scss';

const Header = () => {
    const dispatch = useDispatch<AppDispatch>();
    const activeExchange = useSelector((state: RootState) => state.selection.exchange);

    const handleExchangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedExchange = event.target.value as Exchange;
        dispatch(selectExchange({ exchange: selectedExchange }));
    };

    return (
        <div className="header">
            <div className="header__dropdown">
                    <label>Exchange: </label>
                    <select value={activeExchange} onChange={handleExchangeChange}>
                        <option value="US Stocks">US Stocks</option>
                        <option value="Forex">Forex</option>
                    </select>
                </div>
                <span className="header__title">FINNHUB DASHBOARD</span>
            <span></span>
        </div>
    )
};

export default Header;