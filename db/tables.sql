-- STO MASTER
CREATE TABLE STO_MASTER (
    symbol VARCHAR(7) PRIMARY KEY,
    quantity NUMERIC NOT NULL,
    listdate VARCHAR(8) -- YYYYMMDD,
    regdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
)
-- 잔고 테이블
CREATE TABLE BALANCE (
    pkey VARCHAR(256) NOT NULL,
    symbol VARCHAR(7) NOT NULL,
    amount NUMERIC,
    PRIMARY KEY (pkey, code)
);

-- 주문 테이블
CREATE TABLE ORDER (
    orderid SERIAL PRIMARY KEY,
    pkey VARCHAR(256) NOT NULL,
    symbol VARCHAR(7) NOT NULL,
    ordertype VARCHAR(1) NOT NULL, -- 1:buy, 2:sell, 3:modify, 4:cancel
    price NUMERIC NOT NULL,
    quantity INT NOT NULL,
    ordertime TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
);
CREATE INDEX ORDER_IDX1 ON ORDER(pkey, symbol);
CREATE INDEX ORDER_IDX2 ON ORDER(ordertime);
CREATE INDEX ORDER_IDX3 ON ORDER(symbol, price);

-- 체결 테이블
CREATE TABLE CONTRACT (
    contractid SERIAL PRIMARY KEY,
    symbol VARCHAR(7) NOT NULL,
    price NUMERIC NOT NULL,
    quantity INT NOT NULL,
    buy_pkey VARCHAR(256) NOT NULL,
    sell_pkey VARCHAR(256) NOT NULL,
    contracttime TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
);