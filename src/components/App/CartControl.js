    import React, { useState, useCallback, memo } from 'react';

    import { operations } from "../../constants/constants";
    import { debounce } from "../../utils/utils";

    import './App.css';

    const CartControl = ({
      changeProductQuantity,
      products,
      product,
      isBlocked,
      shouldBlockButtons,
      activePid,
      activePidHandler,
      operationTypeHandler,
      operationType
    }) => {
      const { quantity, pid, min, max } = product;

      const [productAmount, setProductAmount] = useState(0);

      const onChangeProductAmountDebounced = useCallback(debounce((pid, productQty, operationType, min, max) => {
        changeProductQuantity(pid, productQty, operationType, min, max);
        setProductAmount(0);
      }, 3000), [products])


      const onClickHandler = (operation) => () => {
        activePidHandler(pid)
        shouldBlockButtons(true)
        setProductAmount(prevAmount => prevAmount + 1);
        onChangeProductAmountDebounced(pid, productAmount + 1, operation, min, max)
        operationTypeHandler(operation)
      }
     

      //Disable button conditions
      const isOperationOnCartInProgressAndPidIsDifferentThanActiveOne = isBlocked && activePid !== pid;

      const increasingProductQuantityInprogress = operationType === operations.ADD;
      const decreasingProductQuantityInprogress = operationType === operations.SUBSTRACT;

      const isMinQuantityReached = quantity === min;
      const isMaxQuantityReached = quantity === max;

      return (
        <div className="cart-control">
          <button onClick={
            onClickHandler(operations.ADD)
          }
            disabled={isMaxQuantityReached || isOperationOnCartInProgressAndPidIsDifferentThanActiveOne || decreasingProductQuantityInprogress}
          >+</button>
          {isBlocked && activePid === pid ? <p>Przetwarzanie...</p> : <p>{`Obecnie masz ${quantity} sztuk produktu`}</p>}
          <button onClick={
            onClickHandler(operations.SUBSTRACT)
          }
            disabled={isMinQuantityReached || isOperationOnCartInProgressAndPidIsDifferentThanActiveOne || increasingProductQuantityInprogress}
          >-</button>
        </div>
      );
    };

    export default memo(CartControl);
    
