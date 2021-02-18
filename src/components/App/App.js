  import React, { useEffect, useState } from 'react';

  import CartControl from "./CartControl";
  import { operations } from "../../constants/constants";

  import "./App.css";

  const App = () => {

    const [products, setProducts] = useState([]);
    const [isBlocked, setIsBlocked] = useState(false);
    const [activePid, setActivePid] = useState(false);
    const [operationType, setOperationType] = useState(null);

    useEffect(() => {
      getProductListToCart();
    }, []);

    const getProductListToCart = () => {
      fetch('/api/cart').then((res) => res.json()).then(res => {
        const productsListWithMinimumQuantity = res.map(product => ({ ...product, quantity: product.min }));
        setProducts(productsListWithMinimumQuantity)
      });
    }

    const shouldBlockButtons = (status) => setIsBlocked(status);

    const activePidHandler = (pid) => setActivePid(pid);

    const operationTypeHandler = (type) => setOperationType(type);

    const changeProductQuantity = (pid, quantity, operationType, min, max) => {

      const actualProductQuantity = products.find(product => product.pid === pid).quantity;

      const dataToSend = {
        pid,
        quantity
      };

      fetch('/api/product/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      }).then((res) => res.json()).then(res => {

        const isError = res.isError;
        const isQuantityExceeded = actualProductQuantity + quantity > max;

        setProducts(products.map(product => {
          if (product.pid === pid) {
            if (isError || isQuantityExceeded) {
              shouldBlockButtons(false);
              setOperationType(null);

              return {
                ...product,
                quantity: min
              }
            };

            shouldBlockButtons(false);
            setOperationType(null);

            return {
              ...product,
              quantity: operationType === operations.ADD ? product.quantity + quantity : product.quantity - quantity
            };
          };
          return product;
        }));
      })
        .catch((error) => console.log(error));
    };

    const totalCalculated = products.map(product => product.quantity * product.price).reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    return (
      <div className="container">
        <h3>Lista produktów</h3>
        {!products.length && <p>Ładuję produkty...</p>}
        <ul>
          {
            products.map((product) => <li className="row" key={product.pid}>
              <span className="row__product-info">{`${product.name}, cena: ${product.price} zł`}</span>
              <CartControl
                quantity={product.quantity}
                pid={product.pid}
                changeProductQuantity={changeProductQuantity}
                products={products} product={product}
                isBlocked={isBlocked}
                shouldBlockButtons={shouldBlockButtons}
                activePidHandler={activePidHandler}
                activePid={activePid}
                operationTypeHandler={operationTypeHandler}
                operationType={operationType}
              />
            </li>)
          }
        </ul>
        <p>{`Suma zamówienia: ${totalCalculated.toFixed(2)} zł`}</p>
      </div>
    );
  };

  export {
    App
  };
