-- LOGIN HISTORY
CREATE TABLE LOGINHIS (
    pkey VARCHAR(256) NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP,
    PRIMARY KEY (pkey, login_time)
);

-- STO MASTER
CREATE TABLE MASTER_STO (
    symbol VARCHAR(7) PRIMARY KEY,               -- STO SYMBOL
    quantity NUMERIC NOT NULL,                   -- STO total quantity
    listdate VARCHAR(8),                         -- YYYYMMDD
    regdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 잔고 테이블
CREATE TABLE BALANCE (
    pkey VARCHAR(256) NOT NULL,
    symbol VARCHAR(7) NOT NULL,
    amount NUMERIC,
    PRIMARY KEY (pkey, symbol)
);

-- 주문 테이블
CREATE TABLE ORDER_STO (
    orderid SERIAL PRIMARY KEY,
    pkey VARCHAR(256) NOT NULL,
    symbol VARCHAR(7) NOT NULL,
    ordertype VARCHAR(1) NOT NULL, -- 1:buy, 2:sell, 3:modify, 4:cancel
    price NUMERIC NOT NULL,
    order_qty INT NOT NULL,
    contract_qty INT DEFAULT 0,
    ordertime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ORDER_IDX1 ON ORDER_STO(pkey, symbol);
CREATE INDEX ORDER_IDX2 ON ORDER_STO(ordertime);
CREATE INDEX ORDER_IDX3 ON ORDER_STO(symbol, price);

--정정,취소 테이블
CREATE TABLE ORDERCHANGE_STO (
    orderid SERIAL PRIMARY KEY,
    pkey VARCHAR(256) NOT NULL,
    symbol VARCHAR(7) NOT NULL,
    ordertype VARCHAR(1) NOT NULL, -- 1:buy, 2:sell, 3:modify, 4:cancel
    price NUMERIC NOT NULL,
    order_qty INT NOT NULL,
    contract_qty INT DEFAULT 0,
    org_ord_id NUMERIC NOT NULL,
    ordertime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ORDER_IDX1 ON ORDER_STO(pkey, symbol);
CREATE INDEX ORDER_IDX2 ON ORDER_STO(ordertime);
CREATE INDEX ORDER_IDX3 ON ORDER_STO(symbol, price);

-- 체결 테이블
CREATE TABLE CONTRACT_STO (
    contractid SERIAL PRIMARY KEY,
    symbol VARCHAR(7) NOT NULL,
    price NUMERIC NOT NULL,
    quantity INT NOT NULL,
    buy_pkey VARCHAR(256) NOT NULL,
    sell_pkey VARCHAR(256) NOT NULL,
    contracttime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX CONTRACT_IDX1 CONTARCT_STO(symbol, buy_pkey);
CREATE INDEX CONTRACT_IDX2 CONTARCT_STO(symbol, sell_pkey);
CREATE INDEX CONTRACT_IDX3 CONTARCT_STO(buy_pkey, sell_pkey);
CREATE INDEX CONTRACT_IDX4 CONTARCT_STO(buy_pkey, symbol);
CREATE INDEX CONTRACT_IDX5 CONTARCT_STO(sell_pkey, symbol);

-- 호가 테이블
CREATE TABLE HOGA_STO (
    symbol VARCHAR(7) NOT NULL,
    hoga_type VARCHAR(1) NOT NULL, -- 1:buy, 2:sell
    price NUMERIC NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (symbol, price)   
);
CREATE INDEX HOGA_IDX1 ON HOGA_STO(symbol, price);