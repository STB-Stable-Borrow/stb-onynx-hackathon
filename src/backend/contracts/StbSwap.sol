// SPDX-License-Identifier: MIT
pragma solidity >=0.5.11 < 0.9.0;

import {ISTC} from "./Stc.sol";

contract STBSWAP {
    address private _owner;

    address public xdcTokenContract;

    address [] private listedTokens;

    mapping (address => string) private _tokenSymbols;

    uint256 public maxFee;

    uint256 public stbSwapPerc;

    struct Pool{
        uint256 poolId;
        address poolOwner;
        uint256 totalFee;
        address token1;
        address token2;
        uint256 token1Liq;
        uint256 token2Liq;
        uint256 token1Vol;
        uint256 token2Vol;
        uint256 totalToken1Share;
        uint256 totalToken2Share;
    }

    Pool [] public pools;

    mapping(uint256 => mapping(address => uint256 [])) private _sharesPerPool;

    mapping(uint256 => mapping(address => uint256 [])) private _profitPerPool;

    mapping(uint256 => address []) private _liquidityProvs;

    mapping (address => bool) private _isAuthorized;

    event PoolCreation(address creator, address indexed token1, address indexed token2, uint256 time);
    event Welcoming(address indexed from, address indexed to, uint indexed time);
    event Blacklisting(address indexed from, address indexed to, uint indexed time);
    event TokenSwap(address account, address indexed tokenFrom, address indexed tokenTo, uint256 indexed amountIn, uint256 amountOut);


    constructor(address stcContract, address _xdctokenContract, string memory stcSymbol, string memory xdcSymbol, uint256 _maxFee, uint256 stbPerc) {
        maxFee = _maxFee;
        stbSwapPerc = stbPerc;
        _owner = msg.sender;
        xdcTokenContract = _xdctokenContract;
        listedTokens.push(stcContract);
        listedTokens.push(_xdctokenContract);
        _tokenSymbols[stcContract] = stcSymbol;
        _tokenSymbols[_xdctokenContract] = xdcSymbol;
        _isAuthorized[msg.sender] = true;
    }

    modifier validatePool(uint256 poolId) {
        require(poolId > 0 && poolId <= pools.length, "STB-SWAP_ERR7: Pool does not exist");
        _;
    }

    modifier validateAddress(address account) {
        require(account != address(0), "STB-SWAP_ERR8: Invalid address passed");
        _;
    }

    modifier isOwner() {
        require(msg.sender == _owner, "STB-SWAP_ERR9: Only contract admin can call this function");
        _;
    }

    modifier authorized() {
        require(_isAuthorized[msg.sender] == true, "STB-SWAP_ERR9: Only authorized users can call this function");
        _;
    }

    modifier validateAmounts(uint256 amount1, uint256 amount2) {
        require(amount1 > 0 && amount2 > 0, "STB-SWAP_ERR10: amount cannot be zero");
        _;
    }

    modifier validateFee(uint256 fee) {
        require(fee > 0 && fee <= maxFee, "STB-SWAP_ERR11: fee must be greater than zero and lesser than max fee");
        _;
    }

    modifier validateProv(uint256 poolId, address account) {
        require(_sharesPerPool[poolId][account][0] > 0 || _sharesPerPool[poolId][account][1] > 0, "STB-SWAP_ERR13: only pool providers with share more than 0 can call this function");
        _;
    }

    modifier validateLiqBalance(uint256 poolId, address account, uint256 amount1, uint256 amount2) {
        require(_sharesPerPool[poolId][account][0] >= amount1 && _sharesPerPool[poolId][account][1] >= amount2, "STB-SWAP_ERR14:Insufficient liquidity balance");
        _;
    }

    //-----READ FUNCTIONS-------
    function getPool(uint256 poolId) public view returns(Pool memory) {
        return pools[poolId - 1];
    }

    //gets price of atoken from pool(price returned must be divided by 100000 to get actual 
    function tokenPriceFromPool(uint256 poolId, address tokenId) public view returns(uint256) {
        Pool memory pool = pools[poolId - 1];
        if(pool.token1 == tokenId) {
            uint256 token2Liq;
            token2Liq = pool.token2Liq;
            return (token2Liq * 100000) / pool.token1Liq;
        }else{
            if(pool.token2 == tokenId) {
                uint256 token2Liq = pool.token1Liq;
               uint256 token1Liq = pool.token2Liq;
               return (token2Liq * 100000) / token1Liq;
            }else{
                revert("STB-SWAP_ERR3: token passed does not exist in pool");
            }
        }
    }


    function isAProvider(uint256 poolId, address account) external view returns(bool) {
        bool prov = false;
        for(uint i = 0; i < _liquidityProvs[poolId].length; i++) {
            if(_liquidityProvs[poolId][i] == account) {
                prov = true;
            }
        }
        return prov;
    }

    function getShare(uint poolId, address account) external validatePool(poolId) view returns(uint256 [] memory) {
        return _sharesPerPool[poolId][account];
    }

    function getProfit(uint poolId, address account) external validatePool(poolId) view returns(uint256 [] memory) {
        return _profitPerPool[poolId][account];
    }

    function liquidityProviders(uint poolId) external validatePool(poolId) view returns(address [] memory) {
        return _liquidityProvs[poolId];
    }

    function owner() external view returns(address) {
        return _owner;
    }

    function isAuthorized(address account) external  view returns(bool) {
        return _isAuthorized[account];
    }

    function getAllPools() external  view returns(Pool [] memory) {
        return pools;
    }

    function getAllListedTokens() external  view returns(address [] memory) {
        return listedTokens;
    }

    function getAmountOutFromSwap(uint256 poolId, address token, uint256 amount) external  view returns(uint256) {
        Pool memory pool = getPool(poolId);
        uint256 totalCharges = amount * (pool.totalFee/ 100);
        uint256 amountAfterFee = amount - (totalCharges / 1000000000000000000);
        uint256 const = (pool.token1Liq * pool.token2Liq);
        uint256 newLiq;
        if(pool.token1 == token) {
            newLiq = const / (amountAfterFee + pool.token1Liq);
             uint256 amountOut = pool.token2Liq - newLiq;
             return amountOut;
        }else{
            if(pool.token2 == token) {
                newLiq = const / (amountAfterFee + pool.token2Liq);
                uint256 amountOut = pool.token1Liq - newLiq;
                return amountOut;
            }else{
                revert("STB-SWAP_ERR3: token passed does not exist in pool");
            }
        }
    }

    //-----WRITE FUNCTIONS-------   
    
    function _createPool (uint256 id, address token1, address token2, uint256 fee, uint256 liq1, uint256 liq2, uint256 vol1, uint256 vol2) internal {
        pools.push(Pool(id, msg.sender, fee, token1, token2, liq1, liq2, vol1, vol2, 1000000000000000000, 1000000000000000000));
        emit PoolCreation(msg.sender, token1,  token2, block.timestamp);
    }

    function createPool (address token1, address token2, uint256 token1Amt, uint256 token2Amt, uint256 fee) external authorized() validateAmounts(token1Amt, token2Amt) validateFee(fee) payable returns(bool) {
        require(keccak256(abi.encodePacked(_tokenSymbols[token1])) != keccak256(abi.encodePacked("")) && 
         keccak256(abi.encodePacked(_tokenSymbols[token2])) != keccak256(abi.encodePacked("")), "STB-SWAP_ERR12: token selected is not listed");
        require(token1 != token2, "STB-SWAP_ERR17: tokens cannot be the same");
        if(keccak256(abi.encodePacked(_tokenSymbols[token1])) == keccak256(abi.encodePacked(_tokenSymbols[xdcTokenContract]))) {
            require(msg.value == token1Amt, "STB-SWAP_ERR1: attached deposit and XDC amount passed is not the same");
            ISTC token2Contract = ISTC(token2);
            token2Contract.transferFrom(msg.sender, address(this), token2Amt);
        }else {
            if(keccak256(abi.encodePacked(_tokenSymbols[token2])) == keccak256(abi.encodePacked(_tokenSymbols[xdcTokenContract]))) {
                require(msg.value == token2Amt, "STB-SWAP_ERR1: attached deposit and XDC amount passed is not the same");
            }else{
                require(msg.value == 0, "STB-SWAP_ERR2: attached deposit must be zero");
                ISTC token2Contract = ISTC(token2);
                token2Contract.transferFrom(msg.sender, address(this), token2Amt);
            }
            ISTC token1Contract = ISTC(token1);
            token1Contract.transferFrom(msg.sender, address(this), token1Amt);
        }
        uint256 id = pools.length + 1;
        _createPool(id, token1, token2, fee, token1Amt, token2Amt, token1Amt, token2Amt);
        _liquidityProvs[id] = [msg.sender];
        _sharesPerPool[id][msg.sender] = [1000000000000000000, 1000000000000000000];
        _profitPerPool[id][msg.sender] = [0, 0];
        _profitPerPool[id][address(this)] = [0, 0];
        return true;
    }
    
    function _isNotProvider(uint256 poolId, address account) internal view returns(bool) {
        bool isNew = true;
        for(uint i = 0; i < _liquidityProvs[poolId].length; i++) {
            if(_liquidityProvs[poolId][i] == account) {
                isNew = false;
            }
        }
        return isNew;
    }

    function addLiquidity(uint256 poolId, uint256 token1Amt, uint256 token2Amt, uint256 maxTol) external validatePool(poolId) validateAmounts(token1Amt, token2Amt) payable returns(bool) {
        Pool memory pool = pools[poolId - 1];
        ISTC token1Contract = ISTC(pool.token1);
        ISTC token2Contract = ISTC(pool.token2);
        if(keccak256(abi.encodePacked(_tokenSymbols[pool.token1])) == keccak256(abi.encodePacked(_tokenSymbols[xdcTokenContract]))) {
            require(msg.value == token1Amt, "STB-SWAP_ERR1: attached deposit and XDC amount passed is not the same");
            uint256 token1Price = tokenPriceFromPool(poolId, pool.token1);
            uint256 _token2Amt;
            if( token1Price/ 100000 > 0) {
                _token2Amt = (token1Price / 100000) * token1Amt;
            }else{
                _token2Amt = (token1Price * token1Amt) / 100000;
            }
            require(_token2Amt > 0, "STB_-SWAP_ERR3: token price from pool is 0");
            require(_token2Amt <= maxTol, "STB_-SWAP_ERR4: token amount due to pool is greater than max amount set from slippage");
            token2Contract.transferFrom(msg.sender, address(this), _token2Amt);
            pools[poolId - 1].token1Liq = pool.token1Liq + token1Amt;
            pools[poolId - 1].token2Liq = pool.token2Liq +_token2Amt;
            pools[poolId - 1].token1Vol = pool.token1Vol + token1Amt;
            pools[poolId - 1].token2Vol = pool.token2Vol +_token2Amt;
            if(_isNotProvider(poolId, msg.sender)) {
                _liquidityProvs[poolId].push(msg.sender);
            }
            if(pool.totalToken1Share > 0 ||  pool.totalToken2Share > 0) {
                if(pool.totalToken1Share > 0 &&  pool.totalToken2Share > 0) {
                    _sharesPerPool[poolId][msg.sender][0] +=  (token1Amt * pool.totalToken1Share)  / pool.token1Liq;
                    _sharesPerPool[poolId][msg.sender][1] +=  (_token2Amt * pool.totalToken2Share) / pool.token2Liq;
                    pools[poolId - 1].totalToken1Share += (token1Amt * pool.totalToken1Share)  / pool.token1Liq;
                    pools[poolId - 1].totalToken2Share += (_token2Amt * pool.totalToken2Share) / pool.token2Liq;
                }else{
                    revert("STB-SWAP_ERR18: unexpected error with pool shares");
                }

            }else{
                _sharesPerPool[poolId][msg.sender][0] +=  1000000000000000000;
                _sharesPerPool[poolId][msg.sender][1] +=  1000000000000000000;
                pools[poolId - 1].totalToken1Share += 1000000000000000000;
                pools[poolId - 1].totalToken2Share += 1000000000000000000; 
            } 
        }else {
            if(keccak256(abi.encodePacked(_tokenSymbols[pool.token2])) == keccak256(abi.encodePacked(_tokenSymbols[xdcTokenContract]))) {
                require(msg.value == token2Amt, "STB-SWAP_ERR1: attached deposit and XDC amount passed is not the same");
                uint256 token2Price = tokenPriceFromPool(poolId, pool.token2);
                uint256 _token1Amt;
                if((token2Price / 100000) > 0) {
                    _token1Amt = (token2Price / 100000) * token2Amt;
                }else{
                    _token1Amt = (token2Price * token2Amt) / 100000;
                }
                require(_token1Amt > 0, "STB_-SWAP_ERR3: token price from pool is 0");
                require(_token1Amt <= maxTol, "STB_-SWAP_ERR4: token amount due to pool is greater than max amount set from slippage");
                token1Contract.transferFrom(msg.sender, address(this), _token1Amt);
                pools[poolId - 1].token1Liq = pool.token1Liq + _token1Amt;
                pools[poolId - 1].token2Liq = pool.token2Liq + token2Amt;
                pools[poolId - 1].token1Vol = pool.token1Vol + _token1Amt;
                pools[poolId - 1].token2Vol = pool.token2Vol + token2Amt;
                if(_isNotProvider(poolId, msg.sender)) {
                    _liquidityProvs[poolId].push(msg.sender);
                }
                if(pool.totalToken1Share > 0 ||  pool.totalToken2Share > 0) {
                    if(pool.totalToken1Share > 0 &&  pool.totalToken2Share > 0) {
                        _sharesPerPool[poolId][msg.sender][0] +=  (_token1Amt * pool.totalToken1Share)  / pool.token1Liq;
                        _sharesPerPool[poolId][msg.sender][1] +=  (token2Amt * pool.totalToken2Share) / pool.token2Liq;
                        pools[poolId - 1].totalToken1Share +=  (_token1Amt * pool.totalToken1Share)  / pool.token1Liq;
                        pools[poolId - 1].totalToken2Share += (token2Amt * pool.totalToken2Share) / pool.token2Liq;
                    }else{
                        revert("STB-SWAP_ERR18: unexpected error with pool shares");
                    }
                }else{
                    _sharesPerPool[poolId][msg.sender][0] +=  1000000000000000000;
                    _sharesPerPool[poolId][msg.sender][1] +=  1000000000000000000;
                    pools[poolId - 1].totalToken1Share += 1000000000000000000;
                    pools[poolId - 1].totalToken2Share += 1000000000000000000; 
                } 
                
            }else{
                require(msg.value == 0, "STB-SWAP_ERR2: attached deposit must be zero");
                uint256 token1Price = tokenPriceFromPool(poolId, pool.token1);
                uint256 _token2Amt;
                if((token1Price / 100000) > 0) {
                   _token2Amt = (token1Price / 100000)  * token1Amt;
                }else{
                   _token2Amt = (token1Price * token1Amt) / 100000;
                }
                require(_token2Amt > 0, "STB_-SWAP_ERR3: token price from pool is 0");
                require(_token2Amt <= maxTol, "STB_-SWAP_ERR4: token amount due to pool is greater than max amount set from slippage");
                token1Contract.transferFrom(msg.sender, address(this), token1Amt);
                token2Contract.transferFrom(msg.sender, address(this), _token2Amt);
                pools[poolId - 1].token1Liq = pool.token1Liq + token1Amt;
                pools[poolId - 1].token2Liq = pool.token2Liq +_token2Amt;
                pools[poolId - 1].token1Vol = pool.token1Vol + token1Amt;
                pools[poolId - 1].token2Vol = pool.token2Vol +_token2Amt;
                if(_isNotProvider(poolId, msg.sender)) {
                    _liquidityProvs[poolId].push(msg.sender);
                }
                if(pool.totalToken1Share > 0 ||  pool.totalToken2Share > 0) {
                    if(pool.totalToken1Share > 0 &&  pool.totalToken2Share > 0) {
                        _sharesPerPool[poolId][msg.sender][0] +=  (token1Amt * pool.totalToken1Share)  / pool.token1Liq;
                        _sharesPerPool[poolId][msg.sender][1] +=  (_token2Amt * pool.totalToken2Share) / pool.token2Liq;
                        pools[poolId - 1].totalToken1Share +=  (token1Amt * pool.totalToken1Share)  / pool.token1Liq;
                        pools[poolId - 1].totalToken2Share += (_token2Amt * pool.totalToken2Share) / pool.token2Liq;
                    }else{
                        revert("STB-SWAP_ERR18: unexpected error with pool shares");
                    }
                }else{
                    _sharesPerPool[poolId][msg.sender][0] +=  1000000000000000000;
                    _sharesPerPool[poolId][msg.sender][1] +=  1000000000000000000;
                    pools[poolId - 1].totalToken1Share += 1000000000000000000;
                    pools[poolId - 1].totalToken2Share += 1000000000000000000; 
                } 
            }
        }
        return true;
    }


    function shareAmountOut(uint256 poolId, address token, uint256 amount) public view returns(uint256) {
        Pool memory pool = pools[poolId - 1];
        address _token;
        uint256 tokenTotalLiq;
        uint totalTokenProf;
        if(pool.token1 == token || pool.token2 == token) {
            if(pool.token1 == token) {
                _token = pool.token1;
                tokenTotalLiq = pool.token1Liq;
                totalTokenProf = pool.totalToken1Share;
            }else{
                _token = pool.token2;
                tokenTotalLiq = pool.token2Liq;
                totalTokenProf = pool.totalToken2Share;
            }
        }else{
            revert("STB-SWAP_ERR3: token passed does not exist in pool");
        }
        if(tokenTotalLiq > 0) {
            uint256 amoutProfitRt = amount * 100000 / totalTokenProf;
            return (amoutProfitRt * tokenTotalLiq) / 100000;
        }else{
            return amount;
        }
        
    }


    function _handleRemoveLiq(uint256 poolId, uint256 token1Amt, uint256 token2Amt, uint256 token1AmtOut, uint256 token2AmtOut) internal {
        Pool memory pool = pools[poolId - 1];
        ISTC token1Contract = ISTC(pool.token1);
        ISTC token2Contract = ISTC(pool.token2);
        pools[poolId -1].token1Liq = pool.token1Liq - token1AmtOut;
        pools[poolId -1].token2Liq = pool.token2Liq - token2AmtOut;
        _sharesPerPool[poolId][msg.sender][0] -= token1Amt;
        _sharesPerPool[poolId][msg.sender][1] -= token2Amt;
        pools[poolId -1].totalToken1Share = pool.totalToken1Share - token1Amt;
        pools[poolId -1].totalToken2Share = pool.totalToken2Share - token2Amt;
        if(keccak256(abi.encodePacked(_tokenSymbols[pool.token1])) == keccak256(abi.encodePacked(_tokenSymbols[xdcTokenContract]))) {
            address payable receiver = payable(msg.sender);
            receiver.transfer(token1AmtOut);
            token2Contract.transfer(msg.sender, token2AmtOut);
        }
        if(keccak256(abi.encodePacked(_tokenSymbols[pool.token2])) == keccak256(abi.encodePacked(_tokenSymbols[xdcTokenContract]))) {
            address payable receiver = payable(msg.sender);
            receiver.transfer(token2AmtOut);
            token1Contract.transfer(msg.sender, token1AmtOut);
        }
        if(keccak256(abi.encodePacked(_tokenSymbols[pool.token1])) != keccak256(abi.encodePacked(_tokenSymbols[xdcTokenContract])) && keccak256(abi.encodePacked(_tokenSymbols[pool.token2])) != keccak256(abi.encodePacked(_tokenSymbols[xdcTokenContract]))) {
            token1Contract.transfer(msg.sender, token1AmtOut);
            token2Contract.transfer(msg.sender, token2AmtOut);
        }
    }

    function _removeLiquidity(uint256 poolId, uint256 token1Amt, uint256 token2Amt, uint256 minTol1, uint256 minTol2) internal {
        Pool memory pool = pools[poolId - 1];
        uint256 token1AmtOut = shareAmountOut(poolId, pool.token1, token1Amt);
        uint256 _token2ShareOut = shareAmountOut(poolId, pool.token2, token2Amt);
        uint token1price = tokenPriceFromPool(poolId, pool.token1);
        uint256 token2AmtOut;
        if((token1price / 100000) > 0) {
            token2AmtOut = (token1price/ 100000) * token1AmtOut;
        }else{
            token2AmtOut = (token1price * token1AmtOut) / 100000;
        }
        require(_token2ShareOut == token2AmtOut, "STB-SWAP_ERR19: Uexpected error due to token2 amout passed"); 
        require(token2AmtOut >= minTol2, "STB-SWAP_ERR4: token amount due to pool is lesser than minimum amount from slippage");
        require(token1AmtOut >= minTol1, "STB-SWAP_ERR4: token amount due to pool is lesser than minimum amount from slippage");
        _handleRemoveLiq(poolId, token1Amt, token2Amt, token1AmtOut, token2AmtOut);
        
    }

    function removeLiquidity(uint256 poolId, uint256 token1Amt, uint256 token2Amt, uint256 minTol1, uint256 minTol2) external validatePool(poolId) validateAmounts(token1Amt, token2Amt) validateProv(poolId, msg.sender) validateLiqBalance(poolId, msg.sender, token1Amt, token2Amt) returns(bool) {
       _removeLiquidity(poolId, token1Amt, token2Amt, minTol1, minTol2);
        return true;
    }

    function _handleProvsProf(uint256 poolId, uint256 totalTokenShare, uint256 totalCharges, bool inOrder) internal {
        uint256 stbSwapProfit = ((stbSwapPerc / 100) * (totalCharges / 1000000000000000000)) / 1000000000000000000;
        if(inOrder) {
            _profitPerPool[poolId][address(this)][0] += stbSwapProfit;
        }else{
            _profitPerPool[poolId][address(this)][1] += stbSwapProfit;
        }
        uint256 totalPrvsProfit = (totalCharges/ 1000000000000000000) - stbSwapProfit;
        for(uint i = 0; i < _liquidityProvs[poolId].length; i++) {
            if(inOrder) {
                uint256 profit = (totalPrvsProfit * _sharesPerPool[poolId][_liquidityProvs[poolId][i]][0]) / totalTokenShare;
                _profitPerPool[poolId][_liquidityProvs[poolId][i]][0] += profit;
            }else{
                uint256 profit = (totalPrvsProfit * _sharesPerPool[poolId][_liquidityProvs[poolId][i]][1]) / totalTokenShare;
                 _profitPerPool[poolId][_liquidityProvs[poolId][i]][1] += profit;
            }
             
        }
    }

    function _trandferTokenFrom(address token, address account, uint256 amount) internal {
        ISTC token2Contract = ISTC(token);
        token2Contract.transferFrom(account, address(this), amount);
    }

    function swap(uint256 poolId, address tokenFrom, address tokenTo, uint256 amount, uint256 minTol) external validatePool(poolId) payable returns(bool) {
        require(tokenFrom != tokenTo, "STB-SWAP_ERR17: tokens cannot be the same");
        require(amount > 0, "STB-SWAP_ERR15: amount cannot be zero(0)");
        Pool memory pool = pools[poolId - 1];
        require(pool.token1 == tokenFrom || pool.token2 == tokenFrom, "STB-SWAP_ERR5: Token passed does not exists in pool");
        require(pool.token1 == tokenTo || pool.token2 == tokenTo, "STB-SWAP_ERR5: Token passed does not exists in pool");
        if(pool.token1 == xdcTokenContract || pool.token2 == xdcTokenContract) {
            if(pool.token1 == xdcTokenContract) {
                if(tokenFrom == xdcTokenContract) {
                    require(msg.value == amount, "STB-SWAP_ERR1: attached deposit and XDC amount passed is not the same");
                    uint256 totalCharges = amount * (pool.totalFee/ 100);
                    uint256 amountAfterFee = amount - (totalCharges / 1000000000000000000);
                    uint256 const = (pool.token1Liq * pool.token2Liq);
                    uint newLiq = const / (amountAfterFee + pool.token1Liq);
                    require(pool.token2Liq > newLiq, "STB-SWAP_ERR6: Insufficient Liquidity");
                    uint256 amountOut = pool.token2Liq - newLiq;
                    require(amountOut >= minTol, "STB-SWAP_ERR4: token amount due to pool is lesser than minimum amount from slippage");
                    pools[poolId - 1].token1Liq = pool.token1Liq + amountAfterFee;
                    pools[poolId - 1].token2Liq = newLiq;
                    pools[poolId - 1].token1Vol = pool.token1Vol + amountAfterFee;
                    pools[poolId - 1].token2Vol = pool.token2Vol + amountOut;
                    ISTC token2Contract = ISTC(pool.token2);
                    token2Contract.transfer(msg.sender, amountOut);
                    _handleProvsProf(poolId, pool.totalToken1Share, totalCharges, true);
                    emit TokenSwap(msg.sender, tokenFrom, tokenTo, amountAfterFee, amountOut);
                }else{
                    require(msg.value == 0, "STB-SWAP_ERR2: attached deposit must be zero");
                    _trandferTokenFrom(pool.token2, msg.sender, amount);
                    uint256 totalCharges = amount * (pool.totalFee / 100);
                    uint256 amountAfterFee = amount - (totalCharges / 1000000000000000000);
                    uint256 const = (pool.token2Liq * pool.token1Liq);
                    uint newLiq = const / (amountAfterFee +  pool.token2Liq);
                    require(pool.token1Liq > newLiq, "STB-SWAP_ERR6: Insufficient Liquidity");
                    uint256 amountOut = pool.token1Liq - newLiq;
                    require(amountOut >= minTol, "STB-SWAP_ERR4: token amount due to pool is lesser than minimum amount from slippage");
                    pools[poolId - 1].token2Liq = pool.token2Liq + amountAfterFee;
                    pools[poolId - 1].token1Liq = newLiq;
                    pools[poolId - 1].token2Vol = pool.token2Vol + amountAfterFee;
                    pools[poolId - 1].token1Vol = pool.token1Vol + amountOut;
                    address payable receiver = payable(msg.sender);
                    receiver.transfer(amountOut);
                    _handleProvsProf(poolId, pool.totalToken2Share, totalCharges, false);
                    emit TokenSwap(msg.sender, tokenFrom, tokenTo, amountAfterFee, amountOut);
                }
            }else{
                if(tokenFrom == xdcTokenContract) {
                    require(msg.value == amount, "STB-SWAP_ERR1: attached deposit and XDC amount passed is not the same");
                    uint256 totalCharges = amount * (pool.totalFee / 100);
                    uint256 amountAfterFee = amount - (totalCharges / 1000000000000000000);
                    uint256 const = (pool.token2Liq *pool.token1Liq);
                    uint newLiq = const / (amountAfterFee + pool.token2Liq);
                    require(pool.token1Liq > newLiq, "STB-SWAP_ERR6: Insufficient Liquidity");
                    uint256 amountOut = pool.token1Liq - newLiq;
                    require(amountOut >= minTol, "STB-SWAP_ERR4: token amount due to pool is lesser than minimum amount from slippage");
                    pools[poolId - 1].token2Liq = pool.token2Liq + amountAfterFee;
                    pools[poolId - 1].token1Liq = newLiq;
                    pools[poolId - 1].token2Vol = pool.token2Vol + amountAfterFee;
                    pools[poolId - 1].token1Vol = pool.token1Vol + amountOut;
                    ISTC token1Contract = ISTC(pool.token1);
                    token1Contract.transfer(msg.sender, amountOut);
                    _handleProvsProf(poolId, pool.totalToken2Share, totalCharges, false);
                    emit TokenSwap(msg.sender, tokenFrom, tokenTo, amountAfterFee, amountOut);
                
                }else{
                require(msg.value == 0, "STB-SWAP_ERR2: attached deposit must be zero");
                    _trandferTokenFrom(pool.token1, msg.sender, amount);
                    uint256 totalCharges = amount * (pool.totalFee/ 100);
                    uint256 amountAfterFee = amount - (totalCharges / 1000000000000000000);
                    uint256 const = (pool.token1Liq  * pool.token2Liq);
                    uint newLiq = const / (amountAfterFee + pool.token1Liq);
                    require(pool.token2Liq > newLiq, "STB-SWAP_ERR6: Insufficient Liquidity");
                    uint256 amountOut = pool.token2Liq - newLiq;
                    require(amountOut >= minTol, "STB-SWAP_ERR4: token amount due to pool is lesser than minimum amount from slippage");
                    pools[poolId - 1].token1Liq = pool.token1Liq + amountAfterFee;
                    pools[poolId - 1].token2Liq = newLiq;
                    pools[poolId - 1].token1Vol = pool.token1Vol + amountAfterFee;
                    pools[poolId - 1].token2Vol = pool.token2Vol + amountOut;
                    address payable receiver = payable(msg.sender);
                    receiver.transfer(amountOut);
                    _handleProvsProf(poolId, pool.totalToken1Share, totalCharges, true);
                    emit TokenSwap(msg.sender, tokenFrom, tokenTo, amountAfterFee, amountOut);
                }
            }
        }else{
            require(msg.value == 0, "STB-SWAP_ERR2: attached deposit must be zero");
            if(tokenFrom == pool.token1 ) {
                _trandferTokenFrom(pool.token1, msg.sender, amount);
                uint256 totalCharges = amount * (pool.totalFee/ 100);
                uint256 amountAfterFee = amount - (totalCharges / 1000000000000000000);
                uint256 const = (pool.token1Liq  * pool.token2Liq);
                uint newLiq = const / (amountAfterFee + pool.token1Liq);
                require(pool.token2Liq > newLiq, "STB-SWAP_ERR6: Insufficient Liquidity");
                uint256 amountOut = pool.token2Liq - newLiq;
                require(amountOut >= minTol, "STB-SWAP_ERR4: token amount due to pool is lesser than minimum amount from slippage");
                pools[poolId - 1].token1Liq = pool.token1Liq + amountAfterFee;
                pools[poolId - 1].token2Liq = newLiq;
                pools[poolId - 1].token1Vol = pool.token1Vol + amountAfterFee;
                pools[poolId - 1].token2Vol = pool.token2Vol + amountOut;
                ISTC token2Contract = ISTC(pool.token2);
                token2Contract.transfer(msg.sender, amountOut);
                _handleProvsProf(poolId, pool.totalToken1Share, totalCharges, true);
                emit TokenSwap(msg.sender, tokenFrom, tokenTo, amountAfterFee, amountOut);
            }else{
                _trandferTokenFrom(pool.token2, msg.sender, amount);
                uint256 totalCharges = amount * (pool.totalFee/ 100);
                uint256 amountAfterFee = amount - (totalCharges / 1000000000000000000);
                uint256 const = (pool.token2Liq  * pool.token1Liq);
                uint newLiq = const / (amountAfterFee + pool.token2Liq);
                require(pool.token1Liq > newLiq, "STB-SWAP_ERR6: Insufficient Liquidity");
                uint256 amountOut = pool.token1Liq - newLiq;
                require(amountOut >= minTol, "STB-SWAP_ERR4: token amount due to pool is lesser than minimum amount from slippage");
                pools[poolId - 1].token2Liq = pool.token2Liq + amountAfterFee;
                pools[poolId - 1].token1Liq = newLiq;
                pools[poolId - 1].token2Vol = pool.token2Vol + amountAfterFee;
                pools[poolId - 1].token1Vol = pool.token1Vol + amountOut;
                ISTC token1Contract = ISTC(pool.token1);
                token1Contract.transfer(msg.sender, amountOut);
                _handleProvsProf(poolId, pool.totalToken2Share, totalCharges, false);
                emit TokenSwap(msg.sender, tokenFrom, tokenTo, amountAfterFee, amountOut);
            }
        }
        return true;
    }

    function listToken(address token, string memory tokenSymbol) external validateAddress(token) isOwner() returns(bool) {
        require(keccak256(abi.encodePacked(_tokenSymbols[token])) == keccak256(abi.encodePacked("")), "STB-SWAP_ERR20: token selected is already listed");
        _tokenSymbols[token] = tokenSymbol;
        listedTokens.push(token);
        emit Welcoming(address(this), token, block.timestamp);
        return true;
    }

    function delistToken(address token) external validateAddress(token) isOwner() returns(bool) {
       require(keccak256(abi.encodePacked(_tokenSymbols[token])) != keccak256(abi.encodePacked("")), "STB-SWAP_ERR12: token selected is not listed");
        delete _tokenSymbols[token];
        uint256 index;
        for(uint i = 0; i < listedTokens.length; i++) {
           if(listedTokens[i] == token) {
               index = i;
           }
        }
        for (uint i = index; i < listedTokens.length - 1; i++) {
                listedTokens[i] = listedTokens[i + 1];
            }
        listedTokens.pop();
        emit Blacklisting(address(this), token, block.timestamp);
        return true;
    }

    function updateMaxFee(uint256 newMax) external isOwner() {
        require(newMax > 0, "STB-SWAP_ERR10: amount cannot be zero");
        maxFee = newMax;
    }

    function updateStbSwapPerc(uint256 newPerc) external isOwner() {
        require(newPerc > 0, "STB-SWAP_ERR10: amount cannot be zero");
        stbSwapPerc = newPerc;
    }

    function authorize(address account) external isOwner() validateAddress(account){
        _isAuthorized[account] = true;
    }

    function unauthorize(address account) external isOwner() {
        require(account != _owner, "STB-SWAP_ERR16: can unathorize contract owner");
        delete _isAuthorized[account];
    } 

   

}