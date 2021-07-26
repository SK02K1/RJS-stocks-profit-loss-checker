import { useState } from "react";
import "./styles.css";
import useSound from "use-sound";
import lossSoundEffect from "./audio/loss.mp3";
import profitSoundEffect from "./audio/profit.mp3";

let stockPurchasePrice = 0;
let stockQuantity = 0;
let stockCurrentPrice = 0;
let absoluteValueResult = "";
let percentageValueResult = "";
let bgColor = "";
let showOutputContainer = false;

export default function App() {
  const [output, setOutput] = useState("");
  const [playProfitSoundEffect] = useSound(profitSoundEffect);
  const [playLossSoundEffect] = useSound(lossSoundEffect);
  const checkProfitLoss = (purchasePrice, quantity, currentPrice) => {
    const totalPurchasePrice = purchasePrice * quantity;
    const totalCurrentPrice = currentPrice * quantity;
    if (purchasePrice > currentPrice) {
      const absoluteLossValue = parseFloat(
        (totalPurchasePrice - totalCurrentPrice).toFixed(2)
      );
      const percentageLossValue = parseFloat(
        ((100 * absoluteLossValue) / totalPurchasePrice).toFixed(2)
      );
      return [
        false,
        absoluteLossValue,
        percentageLossValue,
        "😞 you've made loss"
      ];
    } else if (currentPrice > purchasePrice) {
      const absoluteProfitValue = parseFloat(
        (totalCurrentPrice - totalPurchasePrice).toFixed(2)
      );
      const percentageProfitValue = parseFloat(
        ((100 * absoluteProfitValue) / totalPurchasePrice).toFixed(2)
      );
      return [
        true,
        absoluteProfitValue,
        percentageProfitValue,
        "🤩 You've made profit"
      ];
    } else {
      return ["", 0, 0, "no profit, no loss"];
    }
  };
  const checkBtnClickHandler = () => {
    if (stockPurchasePrice > 0 && stockQuantity > 0 && stockCurrentPrice > 0) {
      if (
        isNaN(stockPurchasePrice) === false &&
        isNaN(stockQuantity) === false &&
        isNaN(stockCurrentPrice) === false &&
        Number.isInteger(stockQuantity)
      ) {
        const [
          result,
          absoluteValue,
          percentageValue,
          message
        ] = checkProfitLoss(
          stockPurchasePrice,
          stockQuantity,
          stockCurrentPrice
        );

        showOutputContainer = false;
        setOutput("calculating...");
        setTimeout(() => {
          if (result === false) {
            if (percentageValue > 50) {
              bgColor = "#FF0000";
            } else {
              bgColor = "#E6611B";
            }
            playLossSoundEffect();
          } else if (result === true) {
            bgColor = "#85E453";
            playProfitSoundEffect();
          } else {
            bgColor = "";
          }
          absoluteValueResult = `Absolute value : ${absoluteValue}rs`;
          percentageValueResult = `Percentage value : ${percentageValue}%`;
          showOutputContainer = true;
          setOutput(message);
        }, 800);
      } else {
        bgColor = "";
        showOutputContainer = false;
        setOutput("");
      }
    } else {
      bgColor = "";
      showOutputContainer = false;
      setOutput("");
    }
  };

  const resetBtnClickHandler = () => {
    stockPurchasePrice = 0;
    stockQuantity = 0;
    stockCurrentPrice = 0;
    showOutputContainer = false;
    bgColor = "";
    setOutput("");
  };
  return (
    <div
      style={
        bgColor === ""
          ? { backgroundColor: "#8685ef" }
          : { backgroundColor: bgColor }
      }
      className="App"
    >
      <h1>Check profit or loss on your stocks</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="stock-purchase-price">
          Purchase price
          <input
            onChange={(e) => (stockPurchasePrice = parseFloat(e.target.value))}
            type="number"
            min="1"
            step="any"
            id="stock-purchase-price"
            name="stock-purchase-price"
            placeholder="Enter purchase price "
            required
          />
        </label>
        <label htmlFor="stock-quantity">
          Quantity
          <input
            onChange={(e) => (stockQuantity = parseFloat(e.target.value, 10))}
            type="number"
            min="1"
            id="stock-quantity"
            name="stock-quantity"
            placeholder="Enter quantity"
            required
          />
        </label>
        <label htmlFor="stock-current-price">
          Current price
          <input
            onChange={(e) => (stockCurrentPrice = parseFloat(e.target.value))}
            type="number"
            min="1"
            step="any"
            id="stock-current-price"
            name="stock-current-price"
            placeholder="Enter current price of stocks"
            required
          />
        </label>
        <button onClick={checkBtnClickHandler} type="submit">
          Check
        </button>
        <button onClick={resetBtnClickHandler} type="reset">
          Reset
        </button>
      </form>
      <p className="message">{output}</p>
      <div
        style={
          showOutputContainer === false
            ? { display: "none" }
            : { display: "block" }
        }
        className="output-container"
      >
        <p>{absoluteValueResult}</p>
        <p>{percentageValueResult}</p>
      </div>
    </div>
  );
}
