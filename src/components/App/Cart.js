import React, { useEffect, useState, useCallback } from 'react';
import './App.css';

import { operations } from "../../constants/constants";
import { debounce} from "../../utils/utils";

const CartControler = ({ cartProducts, changeProductQuantity, decrement }) => {

  const [productAmount, setProductAmount] = useState(0);
  const [currentPid, setCurrentPid] = useState("");

  useEffect(() => {
    console.log(productAmount);
    console.log(currentPid);
  }, [productAmount, currentPid])


  const onChangeProductAmountDebounced = useCallback(debounce((pid, productQty, operationType) => {
    changeProductQuantity(pid, productQty, operationType);
    setProductAmount(0);
  }, 3000), [cartProducts])

  return (
    <div className="">
      <h3>Koszyk</h3>
      {
        cartProducts.map((product) => <li className="row" key={product.pid}>
          <p className="row__product-info">{`${product.name}, cena: ${product.price} zł`}</p>
          <button onClick={
            () => {
              setProductAmount(prevAmount => prevAmount + 1);
              onChangeProductAmountDebounced(product.pid, productAmount + 1, operations.ADD, product.min)
            }
          }

          disabled >+</button>
          <span>{`Obecnie masz ${product.quantity} sztuk produktu`}</span>
          <button onClick={() => {
            setProductAmount(prevAmount => prevAmount + 1);
            onChangeProductAmountDebounced(product.pid, productAmount + 1, operations.SUBSTRACT, product.min)
          }
          }
         disabled >-</button>
        </li>)
      }
    </div>
  );
};

export {
  CartControler
};
