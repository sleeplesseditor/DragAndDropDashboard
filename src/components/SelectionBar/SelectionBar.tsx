import * as React from "react";
import useDragAndDrop from "@helpers/useDragAndDrop";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from '@modules/redux/store';
import { selectStockSymbol } from "@modules/selection/slice";
import forexSymbols from "@helpers/forexSymbols.json";
import usStockSymbols from "@helpers/stockSymbols.json";
import './SelectionBar.scss';
import LivePriceUpdate from "@components/SelectionBar/imgs/LivePriceUpdate.png";

// import {AutoCompleteSearch} from '@components/AutoCompleteSearch/AutoCompleteSearch';
import Select, { type SingleValue } from 'react-select';

type SymbolOption = {
  value: string;
  label: string;
};

export type CardType = "Live Price Update" | "B" | "C";

type SelectionBarProps = {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onDrop: (type: CardType, clientX: number, clientY: number) => void;
selectionBarRef: React.RefObject<HTMLElement | null>;
  usedTypes: ReadonlySet<CardType>;
};

const previewImageSelection = (type: CardType) => {
  switch (type) {
    case "Live Price Update":
      return LivePriceUpdate;
    case "B":
      return ""; // Replace with the path to the image for type B
    case "C":
      return ""; // Replace with the path to the image for type C
    default:
      return ""; // Default image or empty string if no image is available
  }
}

function PaletteCard({
  disabled,
  onDrop,
type,
}: {
  disabled: boolean;
  onDrop: SelectionBarProps["onDrop"];
type: CardType;
}) {
  const { triggerRef, nodeRef, isDragging, reset } = useDragAndDrop({
    disabled,
    onDragEnd: (event) => {
      // The hook also calls onDragEnd for pointercancel; don't place on a cancelled drag.
      if (event.type !== "pointercancel") {
        onDrop(type, event.clientX, event.clientY);
      }
      reset();
    },
  });

  return (
    <div
        className={`selection-bar__palette-card${disabled ? "--disabled" : ""}`}
        ref={nodeRef}
    >
      <div className="selection-bar__palette-card-content" ref={triggerRef}>
        {type}
        {type === "Live Price Update" && <img src={previewImageSelection(type)} alt="" />}
      </div>
    </div>
  );
}

const cardTypes: CardType[] = ["Live Price Update", "B", "C"];

const SelectionBar = ({ selectionBarRef, usedTypes, onDrop }: SelectionBarProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const activeExchange = useSelector((state: RootState) => state.selection.exchange);
  const activeSymbol = useSelector((state: RootState) => state.selection.symbol);

  const handleStockSymbolChange = (option: SingleValue<SymbolOption>) => {
    if (option) {
      dispatch(selectStockSymbol({ symbol: option.value }));
    }
  };

  const exchangeOptionsArr = React.useMemo(() => activeExchange === "US Stocks" ? usStockSymbols : forexSymbols, [activeExchange]);

  return (
    <aside
        className="selection-bar__container"
        ref={selectionBarRef}
    >
      <div>
        {/* <select onChange={handleStockSymbolChange}>
          {exchangeOptionsArr.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select> */}
        {/* <AutoCompleteSearch 
          onChange={handleStockSymbolChange}
          options={exchangeOptionsArr}
        /> */}
        <Select
          options={exchangeOptionsArr}
          value={exchangeOptionsArr.find(({ value }) => value === activeSymbol) ?? null}
          onChange={handleStockSymbolChange}
        />
      </div>
      {cardTypes.map((type) => (
        <PaletteCard        
          disabled={usedTypes.has(type)}
          key={type}
          onDrop={onDrop}
          type={type}
        />
      ))}
    </aside>
  );
}

export default SelectionBar;