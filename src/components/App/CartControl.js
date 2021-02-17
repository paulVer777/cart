import React, { useState, useCallback } from 'react';

import { operations } from "../../constants/constants";
import { debounce } from "../../utils/utils";

import './App.css';

const CartControl = ({ changeProductQuantity, products, product, isBlocked }) => {

  const { quantity, pid, min, max } = product;

  const [productAmount, setProductAmount] = useState(0);

  const onChangeProductAmountDebounced = useCallback(debounce((pid, productQty, operationType, min) => {
    changeProductQuantity(pid, productQty, operationType, min);
    setProductAmount(0);
  }, 3000), [products])

  return (
    <div className="cart-control">
      <button onClick={
        () => {
          setProductAmount(prevAmount => prevAmount + 1);
          onChangeProductAmountDebounced(pid, productAmount + 1, operations.ADD, min)
        }
      }
        disabled={quantity === max || isBlocked}
      >+</button>
      <p>{`Obecnie masz ${quantity} sztuk produktu`}</p>
      <button onClick={() => {
        setProductAmount(prevAmount => prevAmount + 1);
        onChangeProductAmountDebounced(pid, productAmount + 1, operations.SUBSTRACT, min)
      }
      }
        disabled={quantity === min || isBlocked}>-</button>
    </div>
  );
};

export {
  CartControl
};
